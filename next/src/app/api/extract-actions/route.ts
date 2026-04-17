import { NextRequest } from "next/server";
import { analyzeSchedule } from "@/lib/gemini";
import { createDiary, saveDiaryResult } from "@/lib/gas";
import Hashids from "hashids";

const hashids = new Hashids("f84fSgda", 10);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedule, character } = body;

    if (schedule == null) {
      return Response.json({ message: "scheduleが指定されていません" }, { status: 400 });
    }
    if (character == null) {
      return Response.json({ message: "characterが指定されていません" }, { status: 400 });
    }
    if (typeof character !== "number" || character < 0 || character > 3) {
      return Response.json(
        { message: "characterは0から3の整数である必要があります" },
        { status: 400 }
      );
    }

    // Gemini呼び出しとdiary作成を並列実行
    const [results, diaryId] = await Promise.all([
      analyzeSchedule(schedule, character),
      createDiary(schedule, character),
    ]);

    if (!results) {
      return Response.json({ message: "行動が見つかりませんでした" }, { status: 400 });
    }

    const diaryUrl = hashids.encode(diaryId, character);

    // GASへの保存（URL更新 + 全フィードバック）を1回のリクエストで非同期実行
    saveDiaryResult(
      diaryId,
      diaryUrl,
      results.map((r, idx) => ({
        face: r.face,
        action: r.action,
        action_feedback: r.feedback,
        idx,
      }))
    ).catch((e) => console.error("GAS保存エラー:", e));

    return Response.json({
      diary_url: diaryUrl,
      feedbacks: results.map((r, idx) => ({
        action: r.action,
        face: r.face,
        feedback: r.feedback,
        idx,
      })),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "処理が失敗しました" }, { status: 400 });
  }
}
