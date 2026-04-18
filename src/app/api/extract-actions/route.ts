import { NextRequest } from "next/server";
import { analyzeSchedule } from "@/lib/gemini";

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

    const results = await analyzeSchedule(schedule, character);

    if (!results) {
      return Response.json({ message: "行動が見つかりませんでした" }, { status: 400 });
    }

    const uuid = crypto.randomUUID().replaceAll("-", "");
    const diaryUrl = `${uuid}${character}`;

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
