"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Bot,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Menu,
  MessageCircle,
  Moon,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useMemo, useState } from "react";

type Persona = {
  id: "hitesh" | "piyush";
  name: string;
  subtitle: string;
  accent: string;
  avatar: string;
  greeting: string;
};

type Message = {
  id: number;
  author: "user" | "assistant";
  text: string;
  time: string;
  code?: string;
};

const personas: Persona[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    subtitle: "Friendly • Practical • Fun",
    accent: "from-fuchsia-500 to-violet-500",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%2320152f'/%3E%3Ccircle cx='60' cy='48' r='23' fill='%23f4b49d'/%3E%3Cpath d='M32 112c5-25 20-38 28-38s23 13 28 38' fill='%2322293b'/%3E%3Cpath d='M36 48c1-25 47-30 49 2-11-9-26-13-49-2z' fill='%23121218'/%3E%3Ccircle cx='51' cy='50' r='4' fill='%23111118'/%3E%3Ccircle cx='69' cy='50' r='4' fill='%23111118'/%3E%3Cpath d='M49 66c7 5 16 5 22 0' stroke='%23111118' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Cpath d='M41 55h18M61 55h18' stroke='%23111118' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
    greeting:
      "Hanjii! Kya sikhna chahoge aaj? Web Development, JavaScript, Career ya kuch aur? Batao, shuru karte hain!",
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    subtitle: "Technical • Deep • Practical",
    accent: "from-sky-500 to-indigo-500",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%23131b2d'/%3E%3Ccircle cx='60' cy='50' r='24' fill='%23c98965'/%3E%3Cpath d='M30 112c7-25 22-36 30-36s23 11 30 36' fill='%230f172a'/%3E%3Cpath d='M36 46c2-24 47-27 49 2-14-10-33-11-49-2z' fill='%2311141f'/%3E%3Ccircle cx='51' cy='52' r='4' fill='%23070a12'/%3E%3Ccircle cx='69' cy='52' r='4' fill='%23070a12'/%3E%3Cpath d='M51 67c6 5 13 5 19 0' stroke='%23070a12' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
    greeting:
      "Hey! Ask me about system design, full-stack architecture, databases, deployments, or anything you want to understand deeply.",
  },
];




export default function Home() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "assistant",
      text: personas[0].greeting,
      time: "10:30 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState<"demo" | "openai" | "gemini">("openai");
  const [lightMode, setLightMode] = useState(false);

  const assistantMessages = useMemo(
    () => messages.filter((message) => message.author === "assistant").length,
    [messages],
  );

  function switchPersona(persona: Persona) {
    setActivePersona(persona);
    setMessages([
      {
        id: Date.now(),
        author: "assistant",
        text: persona.greeting,
        time: currentTime(),
      },
    ]);
    setSidebarOpen(false);
  }

  async function sendMessage(event?: FormEvent, prompt?: string) {
    event?.preventDefault();
    const text = (prompt ?? input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      author: "user",
      text,
      time: currentTime(),
    };

    setMessages((items) => [...items, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          persona: activePersona.id,
          message: text,
          history: messages.slice(-8).map((item) => ({
            role: item.author === "user" ? "user" : "assistant",
            content: item.text,
          })),
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "The chat request failed.");
      }

      setMessages((items) => [
        ...items,
        {
          id: Date.now() + 1,
          author: "assistant",
          text: data.reply ?? "I could not generate a reply right now.",
          time: currentTime(),
          code: text.toLowerCase().includes("react")
            ? "const component = <PersonaCard active />;"
            : undefined,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "The chat request failed.";

      setMessages((items) => [
        ...items,
        {
          id: Date.now() + 1,
          author: "assistant",
          text: `API error: ${errorMessage}`,
          time: currentTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <main className={lightMode ? "min-h-screen bg-slate-100 text-slate-950" : "min-h-screen text-white"}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1640px] gap-0 p-0 lg:p-3 xl:p-4">
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ x: -28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0 }}
              className={`${sidebarOpen ? "fixed inset-y-0 left-0 z-40 w-[min(88vw,360px)]" : "hidden"} border-white/10 bg-[#050813]/95 p-5 shadow-2xl backdrop-blur-xl lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-[370px] lg:flex-col lg:rounded-l-[26px] lg:border lg:border-r-0`}
            >
              <Sidebar
                activePersona={activePersona}
                assistantMessages={assistantMessages}
                onClose={() => setSidebarOpen(false)}
                onNewChat={() =>
                  setMessages([
                    {
                      id: Date.now(),
                      author: "assistant",
                      text: activePersona.greeting,
                      time: currentTime(),
                    },
                  ])
                }
                onPersonaChange={switchPersona}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <section className={`glass star-grid flex min-h-screen flex-1 flex-col overflow-hidden rounded-none lg:min-h-[calc(100vh-2rem)] lg:rounded-[26px] ${lightMode ? "bg-white/90 text-slate-950" : ""}`}>
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-7">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <button
                aria-label="Open menu"
                className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={21} />
              </button>
              <Avatar persona={activePersona} size="lg" />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold sm:text-2xl">
                  Chat with{" "}
                  <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                    {activePersona.name}
                  </span>
                </h1>
                <p className="truncate text-sm text-slate-300 sm:text-base">
                  Ask anything and get answers in {activePersona.name.split(" ")[0]}&apos;s style.
                </p>
              </div>
            </div>

          </header>

          <div className="soft-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} persona={activePersona} />
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <Avatar persona={activePersona} />
                  <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/8 px-5 py-4">
                    <span className="typing-dot size-3 rounded-full bg-indigo-300" />
                    <span className="typing-dot size-3 rounded-full bg-indigo-300" />
                    <span className="typing-dot size-3 rounded-full bg-indigo-300" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">

              <form
                onSubmit={sendMessage}
                className="flex items-center gap-3 rounded-3xl border border-white/12 bg-white/[0.07] p-3 shadow-2xl shadow-violet-950/20 backdrop-blur-xl"
              >
                <IconButton label="Mood" icon={<MessageCircle size={22} />} />
                <IconButton label="Attach" icon={<Paperclip size={22} />} />
                <input
                  className="min-w-0 flex-1 bg-transparent px-1 text-base text-white outline-none placeholder:text-slate-400"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your message..."
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-700/30 transition hover:brightness-110 sm:size-16"
                  aria-label="Send message"
                  type="submit"
                >
                  <Send className="-mr-1" size={25} />
                </motion.button>
              </form>

              <p className="mt-3 text-center text-xs text-slate-400">
                This AI is not affiliated with Hitesh Choudhary or Piyush Garg.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  activePersona,
  assistantMessages,
  onClose,
  onNewChat,
  onPersonaChange,
}: {
  activePersona: Persona;
  assistantMessages: number;
  onClose: () => void;
  onNewChat: () => void;
  onPersonaChange: (persona: Persona) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-violet-700/30">
            <Bot size={31} />
          </div>
          <div>
            <h2 className="text-2xl font-black">
              Persona <span className="text-violet-400">AI</span>
            </h2>
            <p className="text-sm text-slate-400">Learn from the best</p>
          </div>
        </div>
        <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
          <X />
        </button>
      </div>

      <nav className="space-y-3">
        <button
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-4 text-left font-semibold shadow-lg shadow-violet-950/30"
          onClick={onNewChat}
        >
          <span className="flex items-center gap-3">
            <MessageCircle size={22} />
            New Chat
          </span>
          <Plus size={22} />
        </button>
        <SidebarLink icon={<Clock3 size={21} />} label="Chat History" />
        <SidebarLink icon={<Bookmark size={21} />} label="Bookmarks" />
      </nav>

      <div className="my-7 h-px bg-white/10" />

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Select Persona
      </p>
      <div className="space-y-4">
        {personas.map((persona) => {
          const active = activePersona.id === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-violet-400 bg-violet-500/12 shadow-lg shadow-violet-950/30"
                  : "border-white/10 bg-white/[0.04] hover:border-white/25"
              }`}
            >
              <Avatar persona={persona} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{persona.name}</span>
                <span className="block truncate text-sm text-slate-400">{persona.subtitle}</span>
              </span>
              <span className={`grid size-6 place-items-center rounded-full border ${active ? "border-violet-400 bg-violet-500" : "border-slate-500"}`}>
                {active && <Check size={15} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-5">
        <div className="flex gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-violet-950 text-violet-200">
            <Sparkles />
          </div>
          <div>
            <h3 className="font-bold">Unlock More</h3>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              {assistantMessages} mentor replies generated. More personas are ready to plug in.
            </p>
          </div>
        </div>
        <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-700 to-violet-700 py-3 font-semibold">
          Coming Soon
        </button>
      </div>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-full bg-violet-800 font-bold">U</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Guest User</p>
            <p className="truncate text-sm text-slate-400">Sign in to save your chats</p>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-slate-300 transition hover:bg-white/[0.05] hover:text-white">
      {icon}
      {label}
    </button>
  );
}

function ChatBubble({ message, persona }: { message: Message; persona: Persona }) {
  const isUser = message.author === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <Avatar persona={persona} />}
      <div
        className={`max-w-[86%] rounded-3xl border p-5 shadow-2xl sm:max-w-[620px] ${
          isUser
            ? "border-blue-400/30 bg-gradient-to-br from-blue-700 to-blue-950 text-right"
            : "border-white/10 bg-white/[0.07] backdrop-blur-xl"
        }`}
      >
        <div className={`mb-2 font-bold ${isUser ? "text-blue-100" : "text-violet-400"}`}>
          {isUser ? "You" : persona.name}
        </div>
        <p className="whitespace-pre-line text-base leading-7">{message.text}</p>
        <div className={`mt-3 flex items-center gap-2 text-xs ${isUser ? "justify-end text-blue-100/75" : "text-slate-400"}`}>
          {message.time}
          {isUser && <Check size={14} className="text-sky-300" />}
        </div>
        {message.code && (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/28 text-left">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-300">
              JSX
              <button className="flex items-center gap-2 transition hover:text-white">
                <Copy size={14} />
                Copy code
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-7">
              <code className="code-gradient">{message.code}</code>
            </pre>
          </div>
        )}
      </div>
      {isUser && (
        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10">
          <User size={23} />
        </div>
      )}
    </motion.div>
  );
}

function Avatar({ persona, size = "md" }: { persona: Persona; size?: "md" | "lg" }) {
  return (
    <div className={`rounded-full bg-gradient-to-br ${persona.accent} p-[2px] ${size === "lg" ? "size-16" : "size-14"} shrink-0 shadow-lg shadow-violet-950/30`}>
      <img
        alt=""
        src={persona.avatar}
        className="h-full w-full rounded-full border-2 border-slate-950 object-cover"
      />
    </div>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white sm:size-12"
    >
      {icon}
    </button>
  );
}

function currentTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}
