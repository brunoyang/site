import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloudflare Next.js Demo",
  description: "Learn how to deploy Next.js on Cloudflare Pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
