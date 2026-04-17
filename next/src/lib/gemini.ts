import { GoogleGenAI } from "@google/genai";
import { characters } from "./characters";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-3.1-flash-lite-preview";

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
- 行動が見つからない場合は空配列 [] を返してください
- **必ず以下のJSON形式のみを出力してください。説明文や装飾は不要です。**

## 出力形式
\`\`\`json
[
  { "action": "行動名", "face": 0, "feedback": "フィードバック文" },
  { "action": "行動名", "face": 1, "feedback": "フィードバック文" }
]
\`\`\``;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const text = response.text ?? "";

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) continue;

      const parsed: ActionFeedback[] = JSON.parse(jsonMatch[0]);

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
      console.error(`Gemini解析に失敗しました (試行 ${i + 1}): ${e}`);
    }
  }

  return null;
}
