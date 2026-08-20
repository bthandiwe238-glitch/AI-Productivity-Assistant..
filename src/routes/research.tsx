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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workday AI" },
      {
        name: "description",
        content:
          "Get structured briefings with insights, considerations, risks and recommended next steps.",
      },
      { property: "og:title", content: "AI Research Assistant | Workday AI" },
      {
        property: "og:description",
        content: "Structured topic briefings with insights, risks and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [depth, setDepth] = useState("Standard briefing");
  const [questions, setQuestions] = useState("");
  const { output, isLoading, error, run } = useAiStream("research");

  return (
    <AppLayout
      title="AI Research Assistant"
      description="Structured insights and summaries for any work topic."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Research brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Adoption of AI copilots in mid-market finance teams"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience / purpose</Label>
                <Input
                  id="audience"
                  placeholder="Exec steering committee"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Quick overview", "Standard briefing", "Deep dive"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Specific questions</Label>
              <Textarea
                id="questions"
                rows={8}
                placeholder={"What are the main adoption blockers?\nWhat does good ROI look like?"}
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={isLoading || !topic.trim()}
              onClick={() => run({ topic, audience, depth, questions })}
            >
              <Sparkles className="size-4" />
              {isLoading ? "Researching…" : "Run research"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Briefing"
          output={output}
          isLoading={isLoading}
          error={error}
          emptyHint="Enter a topic to get a TL;DR, key insights, risks and next steps. Verify time-sensitive facts."
        />
      </div>
    </AppLayout>
  );
}
