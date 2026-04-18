import { getDiaryByUrl } from "@/lib/gas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ diaryUrl: string }> }
) {
  try {
    const { diaryUrl } = await params;
    const diary = await getDiaryByUrl(diaryUrl);

    if (!diary) {
      return Response.json({ message: "日記が見つかりませんでした" }, { status: 400 });
    }

    return Response.json({
      created_at: diary.created_at,
      schedule: diary.schedule,
      character: diary.character,
      actions: diary.actions,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "リクエストが不正です" }, { status: 400 });
  }
}
