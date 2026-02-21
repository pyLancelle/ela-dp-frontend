"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PanelRightOpen, PanelRightClose, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useRightPanel } from "@/providers/right-panel-provider";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: "assistant", text: "Bonjour ! Comment puis-je vous aider ?" },
];

// ── Trigger button (placé dans le header) ──────────────────────────────────
export function RightPanelTrigger() {
  const { isOpen, toggle } = useRightPanel();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-xl p-2 transition-colors duration-150",
        "liquid-glass-filter",
        isOpen
          ? "text-foreground/80"
          : "text-foreground/40 hover:text-foreground/70"
      )}
      title={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
    >
      {isOpen ? (
        <PanelRightClose className="h-4 w-4" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
    </button>
  );
}

// ── Panneau chat ───────────────────────────────────────────────────────────
export function RightPanel() {
  const { isOpen } = useRightPanel();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text },
    ]);
    setInput("");
    // Placeholder réponse
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: "Fonctionnalité à venir…" },
      ]);
    }, 600);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="right-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          className="flex-shrink-0 h-screen flex flex-col overflow-hidden liquid-glass-right-panel"
        >
          {/* Header du panel */}
          <div className="flex h-14 items-center gap-2.5 px-5 flex-shrink-0 border-b border-white/10">
            <BlurFade delay={0.04} duration={0.28}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl liquid-glass-filter">
                  <Bot className="h-3.5 w-3.5 text-foreground/60" />
                </div>
                <span className="text-sm font-semibold text-foreground/80 tracking-tight">
                  Assistant
                </span>
              </div>
            </BlurFade>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <BlurFade key={msg.id} delay={i === 0 ? 0.08 : 0} duration={0.25}>
                <div
                  className={cn(
                    "flex items-end gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg liquid-glass-filter">
                    {msg.role === "assistant" ? (
                      <Bot className="h-3 w-3 text-foreground/50" />
                    ) : (
                      <User className="h-3 w-3 text-foreground/50" />
                    )}
                  </div>

                  {/* Bulle */}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "liquid-glass-card text-foreground/80 rounded-bl-sm"
                        : "liquid-glass-nav-active text-foreground/90 rounded-br-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              </BlurFade>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-4 pb-4 pt-2">
            <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2 liquid-glass-filter">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Écrire un message…"
                className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-foreground/30 outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "flex items-center justify-center rounded-xl p-1.5 transition-colors duration-150",
                  input.trim()
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-foreground/20 cursor-default"
                )}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
