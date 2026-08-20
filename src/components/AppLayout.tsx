import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "Assistant Chat", icon: Bot },
] as const;

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="size-4.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-sidebar-foreground">
                Workday AI
              </span>
              <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
            </span>
          </Link>
          <button
            className="text-muted-foreground lg:hidden"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
              }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-sidebar-accent/60" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="border-t border-sidebar-border px-5 py-4 text-xs leading-relaxed text-muted-foreground">
          AI-generated content may require human review.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-start gap-3 px-5 py-4 sm:px-8">
            <button
              className="mt-0.5 text-muted-foreground lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>

        <footer className="px-5 pb-8 sm:px-8">
          <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            Disclaimer: AI-generated content may require human review.
          </p>
        </footer>
      </div>
    </div>
  );
}
