import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation/navigation";
import { AuthGuard } from "@/guards/auth.guard";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Lumen Billing",
  description: "Lumen Billing System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lumen Billing</title>
        <link rel="icon" href="/icon.png" />
      </head>
      <body
     >
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          enableSystem
          disableTransitionOnChange

        >
          <AuthGuard>
            <Navigation />
            <div className="md:max-w-screen-xl mx-auto py-5 pb-10 w-full px-5 md:px-10 xl:px-0 min-h-[calc(100vh-190px)]">
              {children}
            </div>

            <footer className="border-t bg-neutral-800 dark:bg-transparent dark:rounded-none text-white py-10 max-w-screen-xl dark:max-w-full dark:mx-0  mx-auto w-full  rounded-t-xl">
              <div className="text-center">
                <p className="text-sm">Lumen Billing &copy; 2024 All Rights Reserved</p>
              </div>
            </footer>
          </AuthGuard>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
