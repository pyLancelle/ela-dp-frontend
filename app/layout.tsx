import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

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
    <html lang="fr">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6">
              <BreadcrumbNav />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
