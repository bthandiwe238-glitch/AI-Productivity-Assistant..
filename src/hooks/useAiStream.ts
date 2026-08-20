import { useCallback, useRef, useState } from "react";

type Feature = "email" | "notes" | "planner" | "research" | "chat";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export function useAiStream(feature: Feature) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const run = useCallback(
    async (
      fields: Record<string, string>,
      options?: { history?: ChatTurn[]; onDelta?: (full: string) => void },
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);
      setOutput("");

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature, fields, history: options?.history ?? [] }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const message = (await response.text()) || "Something went wrong.";
          setError(message.slice(0, 300));
          return null;
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += value;
          setOutput(full);
          options?.onDelta?.(full);
        }
        return full;
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Could not reach the AI service. Please try again.");
        }
        return null;
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [feature],
  );

  return { output, setOutput, isLoading, error, run, stop };
}
