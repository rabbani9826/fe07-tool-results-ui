"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ToolUIPart } from "ai";

type WebsiteInfoToolPart = ToolUIPart<{
  getWebsiteInfo: {
    input: {
      url: string;
    };
    output: {
      success: boolean;
      url: string;
      domain: string;
      title: string;
      description: string;
      status: number;
    };
  };
}>;

export default function Home() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim() || status !== "ready") {
      return;
    }

    sendMessage({
      text: input,
    });

    setInput("");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-lg text-slate-950">
              ⚡
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                AI Tool Results
              </h1>

              <p className="text-sm text-slate-400">
                FE-07 · Structured Tool Output
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Ask the AI to analyze a website. The server-side tool fetches
            website metadata and renders the structured result as a real
            interface component.
          </p>
        </header>

        {/* Main application */}
        <section className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl">
          {/* Section header */}
          <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-semibold">
                Website Analysis
              </h2>

              <p className="text-xs text-slate-500">
                Powered by Gemini + AI SDK
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Tool ready
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-[480px] space-y-5">
            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mb-4 text-5xl">
                    🌐
                  </div>

                  <h2 className="mb-2 text-xl font-semibold">
                    Analyze a website
                  </h2>

                  <p className="mb-6 text-sm leading-6 text-slate-400">
                    Enter a website URL or try the example below.
                  </p>

                  <button
                    onClick={() =>
                      setInput(
                        "Analyze https://example.com and tell me its website information"
                      )
                    }
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-white"
                  >
                    Analyze example.com
                  </button>
                </div>
              </div>
            )}

            {/* Conversation */}
            {messages.map((message) => (
              <div
                key={message.id}
                className="space-y-3"
              >
                {message.parts.map((part, index) => {
                  {/* Text message */}
                  if (part.type === "text") {
                    return (
                      <div
                        key={`${message.id}-text-${index}`}
                        className={
                          message.role === "user"
                            ? "ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-cyan-500 px-4 py-3 text-sm text-slate-950"
                            : "max-w-[80%] rounded-2xl rounded-bl-md bg-slate-800 px-4 py-3 text-sm leading-6 text-slate-200"
                        }
                      >
                        {part.text}
                      </div>
                    );
                  }

                  {/* Website tool */}
                  if (
                    part.type === "tool-getWebsiteInfo"
                  ) {
                    return (
                      <ToolStateCard
                        key={`${message.id}-tool-${index}`}
                        part={
                          part as WebsiteInfoToolPart
                        }
                      />
                    );
                  }

                  return null;
                })}
              </div>
            ))}

            {/* AI thinking */}
            {status === "submitted" && (
              <div className="max-w-[80%] rounded-2xl bg-slate-800 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Preparing tool call
                    </p>

                    <p className="text-xs text-slate-500">
                      The AI is deciding what information it needs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Streaming */}
            {status === "streaming" && (
              <div className="max-w-[80%] rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                  <p className="text-xs text-cyan-300">
                    AI response is streaming...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex gap-3 border-t border-slate-800 pt-5"
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask me to analyze a website..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={
                status !== "ready" ||
                !input.trim()
              }
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "streaming" ||
              status === "submitted"
                ? "Working..."
                : "Send"}
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-5 text-center text-xs text-slate-600">
          FE-07 · Tool Results & Structured Output
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   TOOL LIFECYCLE COMPONENT
   ========================================================= */

function ToolStateCard({
  part,
}: {
  part: WebsiteInfoToolPart;
}) {
  /* =======================================================
     STATE 1 — INPUT STREAMING
     ======================================================= */

  if (part.state === "input-streaming") {
    return (
      <div className="max-w-[90%] rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20">
            🔄
          </div>

          <div>
            <p className="text-sm font-semibold text-amber-300">
              Preparing website lookup
            </p>

            <p className="text-xs text-amber-200/60">
              Tool input is streaming...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     STATE 2 — INPUT AVAILABLE
     ======================================================= */

  if (part.state === "input-available") {
    return (
      <div className="max-w-[90%] rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/20">
            🌐
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-300">
              Fetching website information
            </p>

            <p className="mt-1 text-xs text-blue-200/60">
              {part.input?.url ??
                "Website URL received"}
            </p>
          </div>

          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
        </div>
      </div>
    );
  }

  /* =======================================================
     STATE 3 — OUTPUT AVAILABLE
     ======================================================= */

  if (part.state === "output-available") {
    const result = part.output;

    return (
      <div className="max-w-[90%] overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900">
        {/* Success header */}
        <div className="border-b border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Website analysis complete
              </p>

              <p className="text-xs text-emerald-200/60">
                Structured tool output
              </p>
            </div>
          </div>
        </div>

        {/* Structured result */}
        <div className="space-y-4 p-5">
          {/* Domain */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Domain
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {result?.domain ?? "Unknown"}
            </p>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Page title
            </p>

            <p className="mt-1 text-sm text-slate-200">
              {result?.title ??
                "No title found"}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Description
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {result?.description ??
                "No description found"}
            </p>
          </div>

          {/* URL */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              URL
            </p>

            <p className="mt-1 break-all text-sm text-cyan-300">
              {result?.url ?? "Unknown"}
            </p>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              HTTP {result?.status ?? "—"}
            </span>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Tool successful
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     STATE 4 — OUTPUT ERROR
     ======================================================= */

  if (part.state === "output-error") {
    return (
      <div className="max-w-[90%] rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-400/20 text-red-300">
            !
          </div>

          <div>
            <p className="text-sm font-semibold text-red-300">
              Website lookup failed
            </p>

            <p className="mt-1 text-sm leading-6 text-red-200/70">
              {part.errorText ||
                "The website could not be analyzed. Please check the URL and try again."}
            </p>

            <p className="mt-3 text-xs text-red-200/40">
              The application handled the tool
              failure without crashing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}