import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Clock,
  Mail,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workday AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work with AI: draft emails, summarize meetings, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "Workday AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarize meetings, plan tasks and research faster with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft on-tone emails for clients, managers and teams — with subject lines and review notes.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn raw notes into key points, decisions and an action table with owners and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Prioritize your list and get a realistic, time-blocked schedule that respects your capacity.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings: TL;DR, insights, risks to verify and recommended next steps.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "Assistant Chat",
    body: "A conversational copilot for rewriting, planning and everyday professional questions.",
  },
] as const;

const stats = [
  { icon: Clock, label: "Faster drafting", value: "Minutes → seconds" },
  { icon: Sparkles, label: "Structured prompts", value: "5 tuned workflows" },
  { icon: ShieldCheck, label: "Human in the loop", value: "Review before sending" },
];

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Your AI workspace for email, meetings, planning and research."
    >
      <section className="overflow-hidden rounded-2xl border border-border bg-gradient-hero px-6 py-10 sm:px-10 sm:py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          AI Workplace Productivity Assistant
        </span>
        <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Automate the busywork. Keep the judgement.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Five focused AI workflows built with structured prompt engineering, so every output is
          clear, professional and ready to use.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        >
          Start with an email draft
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 py-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="mt-10 text-sm font-semibold tracking-tight text-foreground">Workflows</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-elevated">
              <CardContent className="py-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h4 className="mt-4 text-sm font-semibold text-foreground">{f.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
