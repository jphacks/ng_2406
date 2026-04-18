import { GoogleGenAI } from "@google/genai";
import { characters } from "./characters";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash-lite";

export type ActionFeedback = {
  action: string;
  face: number;
  feedback: string;
};

export async function analyzeSchedule(
  schedule: string,
  character: number
): Promise<ActionFeedback[] | null> {
  const char = characters[character];

  const prompt = `あなたは${char.tone}のキャラクターです。

以下のユーザーの予定から行動を抽出し、それぞれの行動に対して「危険度」と「フィードバック」を返してください。

## ユーザーの予定
${schedule}

## 出力ルール
- 予定から具体的な行動を抽出してください
- 各行動に対して以下を判定してください:
  - face: 危険度（0=安全, 1=注意, 2=危険）
  - feedback: ${char.feedbackInstruction}
- 行動が見つからない場合は空配列 [] を返してください`;

  const responseSchema = {
    type: "array",
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

  const MAX_ATTEMPTS = 3;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: responseSchema,
        },
      });
      const text = response.text ?? "";
      if (!text) continue;

      const parsed: ActionFeedback[] = JSON.parse(text);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          action: String(item.action),
          face:
            typeof item.face === "number" && item.face >= 0 && item.face <= 2
              ? item.face
              : 0,
          feedback: String(item.feedback),
        }));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`Gemini解析失敗 (試行 ${i + 1}/${MAX_ATTEMPTS}): ${msg}`);
      if (i < MAX_ATTEMPTS - 1) {
        // 503 は指数バックオフで長めに待つ、その他も軽く待つ
        const is503 = /\b503\b|UNAVAILABLE/i.test(msg);
        const delay = is503 ? 1000 * Math.pow(2, i) : 300 * (i + 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  return null;
}
