import type { Metadata } from "next";
import {
  Zen_Maru_Gothic,
  Yuji_Mai,
  Reggae_One,
  Hachi_Maru_Pop,
  Zen_Antique,
} from "next/font/google";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-maru-gothic",
});

const yujiMai = Yuji_Mai({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yuji-mai",
});

const reggaeOne = Reggae_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reggae-one",
});

const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hachi-maru-pop",
});

const zenAntique = Zen_Antique({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-antique",
});

export const metadata: Metadata = {
  title: "安心打診おばあ",
  description: "今日の予定を教えて、家族がフィードバックしてくれるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${zenMaruGothic.variable} ${yujiMai.variable} ${reggaeOne.variable} ${hachiMaruPop.variable} ${zenAntique.variable}`}
    >
      <body style={{ margin: 0, fontFamily: "'Zen Maru Gothic', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
