const GAS_ENDPOINT = process.env.GAS_ENDPOINT!;

type FeedbackItem = {
  face: number;
  action: string;
  action_feedback: string;
  idx: number;
};

type DiaryWithFeedbacks = {
  diary_url: string;
  created_at: string;
  schedule: string;
  character: number;
  actions: { face: number; action: string; feedback: string; idx: number }[];
};

async function callGAS<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(GAS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
    redirect: "follow",
  });
  const text = await res.text();

  if (!text.startsWith("{") && !text.startsWith("[")) {
    throw new Error(`GAS returned non-JSON: ${text.substring(0, 200)}`);
  }
  return JSON.parse(text) as T;
}

export async function createDiary(
  schedule: string,
  character: number
): Promise<number> {
  const result = await callGAS<{ diary_id: number }>("createDiary", {
    schedule,
    character,
    diary_url: "",
    created_at: new Date().toISOString(),
  });
  return result.diary_id;
}

export async function saveDiaryResult(
  diaryId: number,
  diaryUrl: string,
  feedbacks: FeedbackItem[]
): Promise<void> {
  await callGAS("saveDiaryResult", {
    diary_id: diaryId,
    diary_url: diaryUrl,
    feedbacks,
  });
}

export async function getDiaryByUrl(diaryUrl: string): Promise<DiaryWithFeedbacks | null> {
  const result = await callGAS<{ diary: DiaryWithFeedbacks | null }>("getDiary", {
    diary_url: diaryUrl,
  });
  return result.diary;
}
