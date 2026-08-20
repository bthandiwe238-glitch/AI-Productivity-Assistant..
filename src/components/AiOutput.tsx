import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AiOutput({
  title = "AI output",
  output,
  isLoading,
  error,
  emptyHint,
}: {
  title?: string;
  output: string;
  isLoading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {output && !isLoading && (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!error && !output && isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse text-primary" />
              Drafting with AI…
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {!error && !output && !isLoading && (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        )}

        {output && (
          <div className="prose-output text-sm leading-relaxed text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            {isLoading && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
