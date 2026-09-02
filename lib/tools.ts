import { tool } from "ai";
import { z } from "zod";

export const getWebsiteInfo = tool({
  description:
    "Fetch basic information about a website URL, including its title, description, and domain.",

  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The complete website URL, for example https://example.com"),
  }),

  execute: async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 FE07-Tool-Demo",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Website returned HTTP ${response.status}`);
      }

      const html = await response.text();

      const titleMatch = html.match(
        /<title[^>]*>([\s\S]*?)<\/title>/i
      );

      const descriptionMatch = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
      );

      const title = titleMatch?.[1]?.trim() || "No title found";

      const description =
        descriptionMatch?.[1]?.trim() || "No description found";

      const domain = new URL(url).hostname;

      return {
        success: true,
        url,
        domain,
        title,
        description,
        status: response.status,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to fetch website information"
      );
    }
  },
});