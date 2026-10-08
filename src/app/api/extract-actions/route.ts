import { NextRequest } from "next/server";
import { analyzeSchedule } from "@/lib/gemini";
import { isValidCharacter, MAX_SCHEDULE_LENGTH } from "@/lib/diary";
import { rejectForeignRequest } from "@/lib/request";
import { signDiary } from "@/lib/signature";

export async function POST(request: NextRequest) {
  const rejected = rejectForeignRequest(request);
  if (rejected) return rejected;

  try {
    const body = await request.json();
    const { schedule, character } = body;

    if (typeof schedule !== "string" || schedule.trim() === "") {
      return Response.json({ message: "scheduleが指定されていません" }, { status: 400 });
    }
    if (schedule.length > MAX_SCHEDULE_LENGTH) {
      return Response.json(
        { message: `scheduleは${MAX_SCHEDULE_LENGTH}文字以内にしてください` },
        { status: 400 }
      );
    }
    if (!isValidCharacter(character)) {
      return Response.json({ message: "characterが不正です" }, { status: 400 });
    }

    const result = await analyzeSchedule(schedule, character);

    if (result.status === "rate_limited") {
      return Response.json({ message: "混み合っています。時間をおいて試してください" }, { status: 429 });
    }
    if (result.status === "failed") {
      return Response.json({ message: "AIの応答に失敗しました" }, { status: 503 });
    }
    if (result.items.length === 0) {
      return Response.json({ message: "行動が見つかりませんでした" }, { status: 400 });
    }

    const uuid = crypto.randomUUID().replaceAll("-", "");
    const diaryUrl = `${uuid}${character}`;
    const feedbacks = result.items.map((r, idx) => ({
      action: r.action,
      face: r.face,
      feedback: r.feedback,
      idx,
    }));

    return Response.json({
      diary_url: diaryUrl,
      feedbacks,
      signature: signDiary({ diaryUrl, schedule, character, feedbacks }),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "処理が失敗しました" }, { status: 500 });
  }
}
