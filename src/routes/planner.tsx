import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { AiOutput } from "@/components/AiOutput";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream } from "@/hooks/useAiStream";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workday AI" },
      {
        name: "description",
        content:
          "Prioritize your task list and get a realistic schedule with focus blocks and rationale.",
      },
      { property: "og:title", content: "AI Task Planner | Workday AI" },
      {
        property: "og:description",
        content: "Priorities, effort estimates and a time-blocked schedule for your day.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [period, setPeriod] = useState("Today");
  const [capacity, setCapacity] = useState("6 focused hours");
  const [goals, setGoals] = useState("");
  const [tasks, setTasks] = useState("");
  const { output, isLoading, error, run } = useAiStream("planner");

  return (
    <AppLayout
      title="AI Task Planner"
      description="Prioritization and scheduling built around your real capacity."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Planning inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Planning period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Today", "Tomorrow", "This week", "Next two weeks"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Available capacity</Label>
                <Input
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals & constraints</Label>
              <Input
                id="goals"
                placeholder="Ship the pricing page; no meetings before 11:00"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasks">Task list (one per line)</Label>
              <Textarea
                id="tasks"
                rows={12}
                placeholder={
                  "Finish client proposal (due tomorrow)\nReview PRs\nPrep board slides\nExpense report"
                }
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={isLoading || !tasks.trim()}
              onClick={() => run({ period, capacity, goals, tasks })}
            >
              <Sparkles className="size-4" />
              {isLoading ? "Planning…" : "Build my plan"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Prioritized plan"
          output={output}
          isLoading={isLoading}
          error={error}
          emptyHint="Add your tasks to get priorities, effort estimates and a time-blocked schedule."
        />
      </div>
    </AppLayout>
  );
}
