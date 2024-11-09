import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Lumen Billing | Auth",
  description: "Authentication page for Lumen Billing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          gridTemplateRows: "auto 1fr auto",
          display: "grid",
          minHeight: "100vh",

        }}
      >
        <header>
          <nav className="p-5 text-center md:text-left">
            <img src="/lumen.png" alt="Lumen Billing" className="h-10" />
          </nav>
        </header>
        <div className="md:max-w-screen-sm m-auto md:p-10 w-full">
          {children}
        </div>
        <footer className="bg-muted-light text-white rounded-t-2xl max-w-screen-xl w-full mx-auto p-10">
          <div className="text-center">
            <p className="text-sm">Lumen Billing &copy; 2024 All Rights Reserved</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
