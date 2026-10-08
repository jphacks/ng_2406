import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { FeedbackItem } from "./diary";

// extract-actions が返した内容だけを save-diary で保存できるように HMAC 署名する。
// DIARY_SIGNING_SECRET が未設定なら GEMINI_API_KEY から鍵を派生させる。
function signingKey(): Buffer {
  const secret = process.env.DIARY_SIGNING_SECRET || process.env.GEMINI_API_KEY;
  if (!secret) {
    throw new Error("DIARY_SIGNING_SECRET か GEMINI_API_KEY を設定してください");
  }
  return createHash("sha256").update(`diary-signature:${secret}`).digest();
}

type DiaryPayload = {
  diaryUrl: string;
  schedule: string;
  character: number;
  feedbacks: FeedbackItem[];
};

function canonicalize({ diaryUrl, schedule, character, feedbacks }: DiaryPayload): string {
  return JSON.stringify([
    diaryUrl,
    schedule,
    character,
    feedbacks.map((f) => [f.idx, f.action, f.face, f.feedback]),
  ]);
}

export function signDiary(payload: DiaryPayload): string {
  return createHmac("sha256", signingKey()).update(canonicalize(payload)).digest("hex");
}

export function verifyDiary(payload: DiaryPayload, signature: string): boolean {
  const expected = Buffer.from(signDiary(payload), "hex");
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
