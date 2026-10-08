// クライアント・サーバー共通の型と定数

export type FeedbackItem = {
  action: string;
  face: number;
  feedback: string;
  idx: number;
};

// おばあ・おとん・おにぃ・わんこ
export const CHARACTER_COUNT = 4;

export const MAX_SCHEDULE_LENGTH = 1000;
export const MAX_ACTIONS = 10;

// diary_url は「ハイフン無しUUID(32桁) + キャラ番号(1桁)」
export const DIARY_URL_PATTERN = new RegExp(`^[0-9a-f]{32}[0-${CHARACTER_COUNT - 1}]$`);

export function isValidCharacter(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < CHARACTER_COUNT
  );
}

export function isValidDiaryUrl(value: unknown): value is string {
  return typeof value === "string" && DIARY_URL_PATTERN.test(value);
}
