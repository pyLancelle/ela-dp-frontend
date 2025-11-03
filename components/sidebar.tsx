"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Dumbbell, Activity, PanelLeftClose, PanelLeft, X } from "lucide-react";
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

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
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

  // Close mobile menu when route changes
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose();
    }
  }, [pathname, onMobileClose]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300",
          // Desktop behavior
          "hidden lg:flex",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile behavior - overlay
          "lg:relative fixed inset-y-0 left-0 z-50",
          isMobileOpen ? "flex" : "hidden lg:flex",
          "w-64" // Always full width on mobile
        )}
      >
        <div className="flex h-16 items-center border-b px-4 justify-between">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 font-semibold transition-all",
              isCollapsed && "lg:justify-center"
            )}
          >
            <Dumbbell className="h-6 w-6 flex-shrink-0" />
            <span className={cn("text-lg", isCollapsed && "lg:hidden")}>
              ELA DP
            </span>
          </Link>

          {/* Desktop collapse button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:block rounded-lg p-2 hover:bg-accent transition-colors",
              isCollapsed && "lg:hidden"
            )}
            aria-label="Réduire la sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop expand button when collapsed */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center p-2 border-b">
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
              <h3
                className={cn(
                  "mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  isCollapsed && "lg:hidden"
                )}
              >
                {section.title}
              </h3>
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
                        isCollapsed && "lg:justify-center"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className={cn(isCollapsed && "lg:hidden")}>
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
