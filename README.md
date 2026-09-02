# FE-07 — Tool Results & Structured Output in the UI

A Next.js application demonstrating server-side AI tools and structured
tool-result rendering using the Vercel AI SDK and Google Gemini.

## Project Overview

This project demonstrates how an AI assistant can call a server-side tool,
receive structured data, and render the result as a custom UI component
instead of displaying raw JSON.

The application analyzes a website URL and displays:

- Domain
- Page title
- Description
- URL
- HTTP status
- Tool success/error state

## Tech Stack

- Next.js
- React
- TypeScript
- Vercel AI SDK
- Google Gemini
- Zod
- Tailwind CSS

## Tool Definition

### Tool Name

`getWebsiteInfo`

### File

`lib/tools.ts`

### Purpose

The `getWebsiteInfo` tool fetches basic information from a website URL.

It retrieves:

- Website domain
- HTML page title
- Meta description
- HTTP response status
- Requested URL

## Input Schema

The tool uses Zod for input validation.

```ts
{
  url: z
    .string()
    .url()
    .describe(
      "The complete website URL, for example https://example.com"
    )
}