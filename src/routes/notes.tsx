import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { AiOutput } from "@/components/AiOutput";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream } from "@/hooks/useAiStream";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workday AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into key points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workday AI" },
      {
        property: "og:description",
        content: "Structured summaries with decisions, actions, owners and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const { output, isLoading, error, run } = useAiStream("notes");

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Key points, decisions, action items and deadlines from raw notes."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Meeting input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  placeholder="Q3 roadmap review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  placeholder="Ayanda, Sipho, Lena"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Raw notes or transcript</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Paste the transcript or your rough bullet notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={isLoading || notes.trim().length < 20}
              onClick={() => run({ title, attendees, notes })}
            >
              <Sparkles className="size-4" />
              {isLoading ? "Summarizing…" : "Summarize meeting"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Structured summary"
          output={output}
          isLoading={isLoading}
          error={error}
          emptyHint="Paste at least a few lines of notes to get a summary, decision log and action table."
        />
      </div>
    </AppLayout>
  );
}
