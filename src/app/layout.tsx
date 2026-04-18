import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const zenMaruGothic = localFont({
  src: "./fonts/ZenMaruGothic-Regular.ttf",
  variable: "--font-zen-maru-gothic",
  display: "swap",
});

const yujiMai = localFont({
  src: "./fonts/YujiMai-Regular.ttf",
  variable: "--font-yuji-mai",
  display: "swap",
});

const reggaeOne = localFont({
  src: "./fonts/ReggaeOne-Regular.ttf",
  variable: "--font-reggae-one",
  display: "swap",
});

const hachiMaruPop = localFont({
  src: "./fonts/HachiMaruPop-Regular.ttf",
  variable: "--font-hachi-maru-pop",
  display: "swap",
});

const zenAntique = localFont({
  src: "./fonts/ZenAntique-Regular.ttf",
  variable: "--font-zen-antique",
  display: "swap",
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
      <body>
        {children}
      </body>
    </html>
  );
}
