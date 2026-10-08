import { getDiaryByUrl } from "@/lib/gas";
import { isValidDiaryUrl } from "@/lib/diary";

// 保存済みの日記は変更されないので、CDN に長くキャッシュして GAS 呼び出しを減らす
const CACHE_HIT = "public, max-age=3600, s-maxage=31536000, immutable";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ diaryUrl: string }> }
) {
  try {
    const { diaryUrl } = await params;
    if (!isValidDiaryUrl(diaryUrl)) {
      return Response.json({ message: "日記が見つかりませんでした" }, { status: 404 });
    }

    const diary = await getDiaryByUrl(diaryUrl);

    if (!diary) {
      return Response.json(
        { message: "日記が見つかりませんでした" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return Response.json(
      {
        created_at: diary.created_at,
        schedule: diary.schedule,
        character: diary.character,
        actions: diary.actions,
      },
      { headers: { "Cache-Control": CACHE_HIT } }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "取得に失敗しました" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
