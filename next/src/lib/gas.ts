const GAS_ENDPOINT = process.env.GAS_ENDPOINT!;

type DiaryRow = {
  diary_url: string;
  created_at: string;
  schedule: string;
  character: number;
};

type FeedbackRow = {
  diary_id: number;
  face: number;
  action: string;
  action_feedback: string;
  idx: number;
};

type DiaryWithFeedbacks = DiaryRow & {
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
  character: number,
  diaryUrl: string
): Promise<number> {
  const result = await callGAS<{ diary_id: number }>("createDiary", {
    schedule,
    character,
    diary_url: diaryUrl,
    created_at: new Date().toISOString(),
  });
  return result.diary_id;
}

export async function addFeedback(feedback: FeedbackRow): Promise<void> {
  await callGAS("addFeedback", feedback);
}

export async function getDiaryByUrl(diaryUrl: string): Promise<DiaryWithFeedbacks | null> {
  const result = await callGAS<{ diary: DiaryWithFeedbacks | null }>("getDiary", {
    diary_url: diaryUrl,
  });
  return result.diary;
}
