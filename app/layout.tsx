import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { RightPanel, RightPanelTrigger } from "@/components/right-panel";
import { RightPanelProvider } from "@/providers/right-panel-provider";
import { PageHeader } from "@/components/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ELA DP - shadcn/ui App",
  description: "Application de gestion sportive avec shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <DotPattern className="fixed inset-0 -z-10" />
        <QueryProvider>
          <RightPanelProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-hidden bg-background flex flex-col min-w-0">
                <header className="flex h-14 items-center justify-between px-6 flex-shrink-0">
                  <PageHeader />
                  <div className="flex items-center gap-2 ml-auto">
                    <ThemeToggle />
                    <RightPanelTrigger />
                  </div>
                </header>
                <div className="flex-1 overflow-y-auto px-2 md:px-6 pt-2 pb-6">
                  {children}
                </div>
              </main>
              <RightPanel />
            </div>
          </RightPanelProvider>
        </QueryProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
