import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Universe of Memories",
  description: "An intimate, cinematic celebration of someone extraordinary — a living memory space crafted with love.",
  keywords: ["birthday", "memories", "celebration", "love"],
  openGraph: {
    title: "A Universe of Memories",
    description: "Some memories deserve their own universe.",
    type: "website",
  },
};

import CustomCursor from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grain-overlay">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
