"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Activity, Music, Trophy, Users, PanelLeftClose, PanelLeftOpen, BookHeart, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/magicui/blur-fade";

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
  {
    title: "Bien-etre",
    items: [
      {
        title: "Sommeil",
        href: "/sommeil",
        icon: Moon,
      },
      {
        title: "Journal",
        href: "/journal",
        icon: BookHeart,
      },
    ],
  },
  {
    title: "Musique",
    items: [
      {
        title: "Classements",
        href: "/musique/classements",
        icon: Trophy,
      },
      {
        title: "Artistes",
        href: "/music/artists",
        icon: Users,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsCollapsed(e.matches);
    setIsCollapsed(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 224 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="liquid-glass-sidebar relative flex h-screen flex-col flex-shrink-0 overflow-hidden"
    >
      {/* Home button */}
      <div className="flex-shrink-0 px-3 pt-4 pb-2">
        <BlurFade delay={0} duration={0.35}>
          <Link
            href="/"
            title={isCollapsed ? "Accueil" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors duration-150",
              pathname === "/"
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground/80",
              isCollapsed && "justify-center"
            )}
          >
            {pathname === "/" && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="liquid-glass-nav-active absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            <Home className="relative z-10 h-4 w-4 flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  key="home-label"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16 }}
                  className="relative z-10 whitespace-nowrap font-bold tracking-tight"
                >
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </BlurFade>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        {navSections.map((section, sectionIdx) => (
          <div key={section.title} className="mb-6">
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  key={`section-${section.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <BlurFade delay={sectionIdx * 0.05} duration={0.35}>
                    <p className="mb-1.5 px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                      {section.title}
                    </p>
                  </BlurFade>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <BlurFade
                    key={item.href}
                    delay={sectionIdx * 0.05 + itemIdx * 0.04 + 0.05}
                    duration={0.35}
                  >
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/50 hover:text-foreground/80",
                        isCollapsed && "justify-center"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-pill"
                          className="liquid-glass-nav-active absolute inset-0 rounded-xl"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      <Icon className="relative z-10 h-4 w-4 flex-shrink-0" />
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            key={`label-${item.href}`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.16 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </BlurFade>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle — collé en bas */}
      <div className="flex-shrink-0 px-3 pb-4">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium",
            "text-foreground/40 hover:text-foreground/70 transition-colors duration-150",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 flex-shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence initial={false}>
                <motion.span
                  key="collapse-label"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16 }}
                  className="whitespace-nowrap text-xs"
                >
                  Réduire
                </motion.span>
              </AnimatePresence>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
