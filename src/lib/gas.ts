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
  if (!res.ok) {
    throw new Error(`GAS returned HTTP ${res.status}: ${res.statusText}`);
  }

  const text = await res.text();

  if (!text.startsWith("{") && !text.startsWith("[")) {
    throw new Error(`GAS returned non-JSON: ${text.substring(0, 200)}`);
  }

  const parsed = JSON.parse(text);
  if (parsed && typeof parsed === "object" && "error" in parsed) {
    throw new Error(`GAS error: ${(parsed as { error: string }).error}`);
  }
  return parsed as T;
}

export async function saveDiaryResult(
  diaryUrl: string,
  schedule: string,
  character: number,
  feedbacks: FeedbackItem[]
): Promise<void> {
  await callGAS("saveDiaryResult", {
    diary_url: diaryUrl,
    schedule,
    character,
    created_at: new Date().toISOString(),
    feedbacks,
  });
}

export async function getDiaryByUrl(diaryUrl: string): Promise<DiaryWithFeedbacks | null> {
  const result = await callGAS<{ diary: DiaryWithFeedbacks | null }>("getDiary", {
    diary_url: diaryUrl,
  });
  return result.diary;
}
