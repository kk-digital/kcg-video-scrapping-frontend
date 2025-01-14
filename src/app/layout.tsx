import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer } from "react-toastify";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KCG",
  description: "KCG INGRESS VIDEO PROCESSING VIEW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col overflow-y-auto bg-gray-300 text-gray-900`}
      >
        {children}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />
      </body>
    </html>
  );
}
