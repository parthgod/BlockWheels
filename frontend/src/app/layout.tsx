import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "@uploadthing/react/styles.css";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BlockWheels",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
          duration={4000}
          richColors
        />
        <Providers>
          <main className="flex flex-col w-full">
            <div className="h-[10vh] overflow-auto w-full shadow-[-2px_-11px_50px_5px_#666666]">
              <Navbar />
            </div>
            <div className="h-[90vh] overflow-auto">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
