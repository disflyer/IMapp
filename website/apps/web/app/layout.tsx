import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMAPP",
  description: "IMAPP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body style={{ background: "linear-gradient(rgb(206, 229, 253), rgb(255, 255, 255))" }} className={inter.className}>
        <Providers>
          <main className="xl:w-[1200px] xl:m-auto xl:px-0 lg:px-20 sm:px-5 px-2 2xl:px-30 pb-10">
            {children}
          </main>
        </Providers>
        {/* <footer className="text-center pt-20 text-gray-400">© Create by <a target="__blank" className="underline text-blue-400" href="https://github.com/disflyer">Alan</a></footer> */}
      </body>
    </html>
  );
}
