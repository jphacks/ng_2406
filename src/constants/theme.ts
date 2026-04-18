export const BACKGROUND_COLORS = [
  "#F5F5F5", // おばあ
  "#E6F3FF", // おとん
  "#F0FFE6", // おにぃ（おねえ）
  "#FFE6E6", // わんこ
];

export const CHARACTER_OPTIONS = [
  {
    text: "おばあ",
    color: "#FF8C00",
    hoverColor: "#FFA500",
    src: "/title.png",
    altSrc: "/oba-white.png",
    logoSrc: "/logo.png",
    alt: "おばあ",
    font: "var(--font-yuji-mai), serif",
  },
  {
    text: "おとん",
    color: "#4682B4",
    hoverColor: "#5F9EA0",
    src: "/otn.png",
    altSrc: "/otn-white.png",
    logoSrc: "/otn-logo.png",
    alt: "おとん",
    font: "var(--font-reggae-one), sans-serif",
  },
  {
    text: "おにぃ",
    color: "#228B22",
    hoverColor: "#32CD32",
    src: "/oni.png",
    altSrc: "/oni-white.png",
    logoSrc: "/oni-logo.png",
    alt: "おにぃ",
    font: "var(--font-hachi-maru-pop), sans-serif",
  },
  {
    text: "わんこ",
    color: "#CD5C5C",
    hoverColor: "#F08080",
    src: "/wnk.png",
    altSrc: "/wnk-white.png",
    logoSrc: "/wnk-logo.png",
    alt: "わんこ",
    font: "var(--font-zen-antique), sans-serif",
  },
];

export const FONT_FAMILIES = {
  DEFAULT: "var(--font-zen-maru-gothic), sans-serif",
  OBA: "var(--font-yuji-mai), serif",
  OTN: "var(--font-reggae-one), sans-serif",
  ONI: "var(--font-hachi-maru-pop), sans-serif",
  WNK: "var(--font-zen-antique), sans-serif",
};

export const FACE_COLORS: Record<number, string> = {
  0: "blue",
  1: "orange",
  2: "red",
  3: "black",
};
