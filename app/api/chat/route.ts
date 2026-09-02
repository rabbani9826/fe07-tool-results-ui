import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { getWebsiteInfo } from "@/lib/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.6-flash"),

    system: `
You are a helpful website analysis assistant.

When the user provides a website URL or asks for information about a
website, use the getWebsiteInfo tool.

Always use the getWebsiteInfo tool when a website URL is provided.

After receiving the tool result, explain the result briefly and clearly.
Do not output the raw tool JSON to the user.
`,

    messages: await convertToModelMessages(messages),

    tools: {
      getWebsiteInfo,
    },

    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}