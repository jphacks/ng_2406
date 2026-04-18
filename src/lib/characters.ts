export type Character = {
  tone: string;
  feedbackInstruction: string;
  errorMessage: () => string;
};

const grandMother: Character = {
  tone: "おばあちゃん口調",
  feedbackInstruction: "気をつけた方が良いポイントを60字以内で教えてください。",
  errorMessage: () =>
    "あんた変なことしようとしてるんじゃないでしょうね。ちゃんとした生活しなきゃダメよ。",
};

const father: Character = {
  tone: "親父口調",
  feedbackInstruction: "危険につながりそうなポイントを60字以内で教えてください。",
  errorMessage: () =>
    "おい。変なことしようとしてるんじゃないだろうな。マジメに生きろよ。",
};

const brother: Character = {
  tone: "キザでナルシストな若い男性の口調",
  feedbackInstruction:
    "関連する忘れ物について注意してください。行動に必要な持ち物を例示しながら、忘れ物をしないよう促してください。必ず60文字以内で、文末には☆をつけてください。",
  errorMessage: () => "変な気を起こしちゃダメだぜ☆俺様だけ見てれば良いのさ☆",
};

const dog: Character = {
  tone: "犬（「ワン」と「!」のみで表現する）",
  feedbackInstruction: "危険さに応じて忠告するように「ワン」と「!」のみで30字以内の文字列を返してください。",
  errorMessage: () => "ワン？",
};

export const characters: Character[] = [grandMother, father, brother, dog];
