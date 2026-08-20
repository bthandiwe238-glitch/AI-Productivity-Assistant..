import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { buildSystemPrompt, buildUserPrompt, type Feature } from "@/lib/ai-prompts.server";

const BodySchema = z.object({
  feature: z.enum(["email", "notes", "planner", "research", "chat"]),
  fields: z.record(z.string()).default({}),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .default([]),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return new Response("Invalid request.", { status: 400 });
        }

        const feature = parsed.feature as Feature;
        const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));

        try {
          const result = streamText({
            model: gateway("google/gemini-3.7-flash"),
            system: buildSystemPrompt(feature),
            messages: [
              ...parsed.history,
              { role: "user" as const, content: buildUserPrompt(feature, parsed.fields) },
            ],
            onError: ({ error }) => console.error("AI stream error", error),
          });

          return result.toTextStreamResponse();
        } catch (error) {
          const status = (error as { statusCode?: number })?.statusCode ?? 500;
          const message =
            status === 429
              ? "Rate limit reached. Please try again in a moment."
              : status === 402
                ? "AI credits are exhausted. Please add credits to continue."
                : "The AI service could not complete this request.";
          return new Response(message, { status });
        }
      },
    },
  },
});
