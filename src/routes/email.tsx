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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workday AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails tailored to tone, audience and length in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator | Workday AI" },
      {
        property: "og:description",
        content: "Draft polished, on-tone business emails with AI in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Short (under 120 words)");
  const [points, setPoints] = useState("");
  const { output, isLoading, error, run } = useAiStream("email");

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Tone- and audience-aware drafts for any workplace email."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="Follow up on the Q3 proposal and request a decision"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Client", "Manager", "Team", "Executive", "Vendor", "New prospect"].map(
                      (a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Professional",
                      "Friendly",
                      "Concise & direct",
                      "Persuasive",
                      "Apologetic",
                      "Formal",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Short (under 120 words)",
                    "Medium (120-200 words)",
                    "Detailed (200-350 words)",
                  ].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points to include</Label>
              <Textarea
                id="points"
                rows={6}
                placeholder={"- Proposal sent 12 Aug\n- Need sign-off by Friday\n- Offer a call"}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={isLoading || !purpose.trim()}
              onClick={() => run({ purpose, audience, tone, length, points })}
            >
              <Sparkles className="size-4" />
              {isLoading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Draft email"
          output={output}
          isLoading={isLoading}
          error={error}
          emptyHint="Fill in the brief and generate a draft. Subject lines and review notes are included."
        />
      </div>
    </AppLayout>
  );
}
