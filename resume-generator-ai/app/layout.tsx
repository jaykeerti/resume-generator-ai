import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Generator AI",
  description: "AI-powered resume generator that tailors resumes based on job descriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
