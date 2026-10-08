import "server-only";
import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { characters } from "./characters";
import { MAX_ACTIONS } from "./diary";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// モデルは環境変数で差し替え可能（モデル廃止時は Vercel の設定変更だけで済む）。
// 無料枠はモデルごとに数えられるので、上限・混雑時は予備モデルに切り替える。
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.1-flash-lite";
const MODELS = [MODEL, FALLBACK_MODEL].filter((m, i, arr) => m && arr.indexOf(m) === i);

const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 15_000;

export type ActionFeedback = {
  action: string;
  face: number;
  feedback: string;
};

export type AnalyzeResult =
  | { status: "ok"; items: ActionFeedback[] }
  | { status: "rate_limited" }
  | { status: "failed" };

function errorStatus(e: unknown): number | null {
  if (e instanceof ApiError) return e.status;
  const msg = e instanceof Error ? e.message : String(e);
  if (/\b429\b|RESOURCE_EXHAUSTED/i.test(msg)) return 429;
  if (/\b503\b|UNAVAILABLE/i.test(msg)) return 503;
  return null;
}

export async function analyzeSchedule(
  schedule: string,
  character: number
): Promise<AnalyzeResult> {
  const char = characters[character];

  const prompt = `あなたは${char.tone}のキャラクターです。

以下のユーザーの予定から行動を抽出し、それぞれの行動に対して「危険度」と「フィードバック」を返してください。

## ユーザーの予定
${schedule}

## 出力ルール
- 予定から具体的な行動を最大${MAX_ACTIONS}件まで抽出してください
- 各行動に対して以下を判定してください:
  - face: 危険度（0=安全, 1=注意, 2=危険）
  - feedback: ${char.feedbackInstruction}
- 行動が見つからない場合は空配列 [] を返してください`;

  const responseSchema = {
    type: "array",
    maxItems: MAX_ACTIONS,
    items: {
      type: "object",
      properties: {
        action: { type: "string" },
        face: { type: "integer", minimum: 0, maximum: 2 },
        feedback: { type: "string" },
      },
      required: ["action", "face", "feedback"],
    },
  };

  let modelIndex = 0;
  let rateLimited = false;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const model = MODELS[modelIndex];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: responseSchema,
          // Gemini 3 系は思考を完全には切れないので、最小にして速度を優先する
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          abortSignal: AbortSignal.timeout(TIMEOUT_MS),
        },
      });
      const text = response.text ?? "";
      if (!text) continue;

      const parsed: ActionFeedback[] = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return {
          status: "ok",
          items: parsed.slice(0, MAX_ACTIONS).map((item) => ({
            action: String(item.action),
            face:
              typeof item.face === "number" && item.face >= 0 && item.face <= 2
                ? item.face
                : 0,
            feedback: String(item.feedback),
          })),
        };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`Gemini解析失敗 (${model}, 試行 ${i + 1}/${MAX_ATTEMPTS}): ${msg}`);

      const status = errorStatus(e);
      rateLimited = status === 429;

      // 上限・混雑・モデル廃止は予備モデルへ即切り替え
      if ((status === 429 || status === 503 || status === 404) && modelIndex < MODELS.length - 1) {
        modelIndex++;
        continue;
      }
      // 無料枠の上限に達している場合はリトライしても無駄なので打ち切る
      if (status === 429) break;

      if (i < MAX_ATTEMPTS - 1) {
        const delay = status === 503 ? 1000 * Math.pow(2, i) : 300 * (i + 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  return { status: rateLimited ? "rate_limited" : "failed" };
}
