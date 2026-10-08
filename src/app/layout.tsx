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

const title = "安心打診おばあ";
const description = "今日の予定を教えて、家族がフィードバックしてくれるアプリ";

export const metadata: Metadata = {
  metadataBase: new URL("https://ng-2406.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/ogp.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/ogp.png"],
  },
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
