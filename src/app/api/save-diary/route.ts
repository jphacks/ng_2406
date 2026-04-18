import { NextRequest } from "next/server";
import { saveDiaryResult } from "@/lib/gas";

type SaveRequest = {
  diary_url: string;
  schedule: string;
  character: number;
  feedbacks: { face: number; action: string; feedback: string; idx: number }[];
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: NextRequest) {
  let body: SaveRequest;
  try {
    body = (await request.json()) as SaveRequest;
  } catch {
    return Response.json({ message: "不正なリクエスト" }, { status: 400 });
  }

  const { diary_url, schedule, character, feedbacks } = body;

  if (
    !diary_url ||
    typeof schedule !== "string" ||
    typeof character !== "number" ||
    !Array.isArray(feedbacks)
  ) {
    return Response.json({ message: "パラメータが不正です" }, { status: 400 });
  }

  const mapped = feedbacks.map((f) => ({
    face: f.face,
    action: f.action,
    action_feedback: f.feedback,
    idx: f.idx,
  }));

  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await saveDiaryResult(diary_url, schedule, character, mapped);
      return Response.json({ ok: true });
    } catch (e) {
      lastError = e;
      console.error(`GAS保存エラー (試行 ${attempt}/${MAX_RETRIES}):`, e);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  return Response.json(
    {
      message: "保存に失敗しました",
      error: String(lastError instanceof Error ? lastError.message : lastError),
    },
    { status: 500 }
  );
}
