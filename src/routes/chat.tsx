import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream, type ChatTurn } from "@/hooks/useAiStream";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat | Workday AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for writing, planning and communication help.",
      },
      { property: "og:title", content: "AI Assistant Chat | Workday AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday professional work.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Rewrite this update so it sounds more confident",
  "How do I say no to a meeting politely?",
  "Give me an agenda for a 30-minute project kickoff",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const { isLoading, error, run } = useAiStream("chat");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || isLoading) return;
    const history = messages;
    setMessages([...history, { role: "user", content: message }]);
    setInput("");
    setStreaming("");

    const full = await run({ message }, { history, onDelta: setStreaming });
    setStreaming("");
    if (full) {
      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
    }
  };

  return (
    <AppLayout
      title="AI Assistant Chat"
      description="Ask anything about your day-to-day professional work."
    >
      <Card className="flex h-[calc(100vh-16rem)] min-h-100 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && !streaming && (
            <div className="mx-auto max-w-md py-10 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                <Bot className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                How can I help you today?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try one of these to get started.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}

          {streaming && <Bubble role="assistant" content={streaming} />}
          {isLoading && !streaming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="size-4 animate-pulse text-primary" />
              Thinking…
            </div>
          )}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-muted/30 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              placeholder="Message the assistant…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              className="max-h-40 min-h-11 resize-none bg-background"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              disabled={isLoading || !input.trim()}
              onClick={() => send(input)}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            AI-generated content may require human review.
          </p>
        </div>
      </Card>
    </AppLayout>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="size-4" />
        </span>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "prose-output border border-border bg-card text-foreground"
        }`}
      >
        {isUser ? content : <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>}
      </div>
      {isUser && (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <User className="size-4" />
        </span>
      )}
    </div>
  );
}
