"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Dumbbell, Activity, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Sport",
    items: [
      {
        title: "Activités",
        href: "/activites",
        icon: Activity,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4 justify-between">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold transition-all",
            isCollapsed && "justify-center"
          )}
        >
          <Dumbbell className="h-6 w-6 flex-shrink-0" />
          {!isCollapsed && <span className="text-lg">ELA DP</span>}
        </Link>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Réduire la sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center p-2 border-b">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Étendre la sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-8">
            {!isCollapsed && (
              <h3 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
