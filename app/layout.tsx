import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ChatProvider } from "@/providers/ChatProvider";
import { ToastProvider, Toaster } from "@/hooks/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Internship Management",
  description: "This is internship management app build by 48 students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ToastProvider>
        <AppProvider>
          <WebSocketProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </WebSocketProvider>
        </AppProvider>
        <Toaster />
      </ToastProvider>
      </body>
    </html>
  );
}
