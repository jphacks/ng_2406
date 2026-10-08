import { NextRequest } from "next/server";
import { saveDiaryResult } from "@/lib/gas";
import {
  FeedbackItem,
  isValidCharacter,
  isValidDiaryUrl,
  MAX_ACTIONS,
  MAX_SCHEDULE_LENGTH,
} from "@/lib/diary";
import { rejectForeignRequest } from "@/lib/request";
import { verifyDiary } from "@/lib/signature";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isFeedbackItem(value: unknown): value is FeedbackItem {
  if (!value || typeof value !== "object") return false;
  const f = value as Record<string, unknown>;
  return (
    typeof f.action === "string" &&
    typeof f.feedback === "string" &&
    typeof f.face === "number" &&
    typeof f.idx === "number"
  );
}

export async function POST(request: NextRequest) {
  const rejected = rejectForeignRequest(request);
  if (rejected) return rejected;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "不正なリクエスト" }, { status: 400 });
  }

  const { diary_url, schedule, character, feedbacks, signature } = body ?? {};

  if (
    !isValidDiaryUrl(diary_url) ||
    typeof schedule !== "string" ||
    schedule.length > MAX_SCHEDULE_LENGTH ||
    !isValidCharacter(character) ||
    !diary_url.endsWith(String(character)) ||
    !Array.isArray(feedbacks) ||
    feedbacks.length > MAX_ACTIONS ||
    !feedbacks.every(isFeedbackItem) ||
    typeof signature !== "string"
  ) {
    return Response.json({ message: "パラメータが不正です" }, { status: 400 });
  }

  // extract-actions が返した内容そのままでなければ保存しない（改ざん防止）
  if (!verifyDiary({ diaryUrl: diary_url, schedule, character, feedbacks }, signature)) {
    return Response.json({ message: "署名が不正です" }, { status: 403 });
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await saveDiaryResult(diary_url, schedule, character, feedbacks);
      return Response.json({ ok: true });
    } catch (e) {
      console.error(`GAS保存エラー (試行 ${attempt}/${MAX_RETRIES}):`, e);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  return Response.json({ message: "保存に失敗しました" }, { status: 500 });
}
