import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CornerDownLeft,
  Download,
  Scale,
  Sparkles,
  User2,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { sendLawbotMessage } from "../services/lawbotApi";

const Lawbot = () => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const htmlIframeRefs = useRef(new Map());
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to LawBot. I can help you with legal guidance, lawyer discovery, legal draft and case analysis.",
    },
  ]);

  const quickPrompts = useMemo(
    () => [
      "Someone stole my bike, what can I do?",
      "How should I draft a legal notice?",
      "I slapped my neighbor, what legal issues am I in?",
    ],
    [],
  );

  const submitMessage = async (rawText) => {
    const content = rawText.trim();
    if (!content || isSending) {
      return;
    }

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };

    const historyForApi = messages.slice(-1).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const data = await sendLawbotMessage(content, historyForApi);
      const botMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    submitMessage(input);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const splitHtmlSegments = (content = "") => {
    // Only treat responses as embeddable HTML when they look like full documents.
    // This prevents normal assistant text with occasional inline tags from opening a large iframe.
    const htmlTagPattern = /<!doctype html>|<html[\s>]/gi;
    const matches = [...content.matchAll(htmlTagPattern)];

    if (matches.length === 0) {
      return { before: content, html: "", after: "" };
    }

    const firstMatch = matches[0];
    const lastTagPattern = /<[^>]+>/g;
    let lastTagEnd = firstMatch.index ?? 0;
    let lastTagMatch;

    while ((lastTagMatch = lastTagPattern.exec(content)) !== null) {
      if ((lastTagMatch.index ?? 0) >= (firstMatch.index ?? 0)) {
        lastTagEnd = lastTagPattern.lastIndex;
      }
    }

    return {
      before: content.slice(0, firstMatch.index ?? 0),
      html: content.slice(firstMatch.index ?? 0, lastTagEnd),
      after: content.slice(lastTagEnd),
    };
  };

  const buildHtmlDocument = (content) => {
    const trimmedContent = content.trim();

    if (
      /<!doctype html>/i.test(trimmedContent) ||
      /<html[\s>]/i.test(trimmedContent)
    ) {
      return content;
    }

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 24px;
        font-family: Arial, sans-serif;
        color: #1c1917;
        background: #ffffff;
      }

      * {
        box-sizing: border-box;
      }

      img, table, pre, code, iframe {
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>`;
  };

  const downloadHtmlAsPdf = async (messageId, fileName) => {
    const iframe = htmlIframeRefs.current.get(messageId);
    const doc = iframe?.contentDocument;

    if (!doc?.body) {
      return;
    }

    const contentWidth = Math.max(
      doc.documentElement?.scrollWidth ?? 0,
      doc.body?.scrollWidth ?? 0,
      iframe?.clientWidth ?? 0,
    );
    const contentHeight = Math.max(
      doc.documentElement?.scrollHeight ?? 0,
      doc.body?.scrollHeight ?? 0,
      doc.documentElement?.offsetHeight ?? 0,
      doc.body?.offsetHeight ?? 0,
    );

    await html2pdf()
      .set({
        filename: fileName,
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 1,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: contentWidth,
          windowHeight: contentHeight,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: "px",
          format: [Math.max(contentWidth, 1), Math.max(contentHeight, 1)],
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(doc.documentElement)
      .save();
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f8f2e8] px-1 pb-2 pt-24 sm:px-2 lg:px-3">
      <section className="flex h-full w-full flex-col rounded-4xl border border-amber-200/70 bg-amber-50/90 p-2.5 shadow-[0_18px_36px_rgba(120,53,15,0.12)] sm:p-3">
        <div className="mb-2.5 flex items-start justify-between gap-2 border-b border-amber-200/70 pb-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
              <Sparkles size={13} />
              Legal AI Chat
            </p>
            <h1 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
              LawBot Assistant
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Ask your legal question and get guided help instantly.
            </p>
          </div>
          <div className="hidden rounded-xl border border-amber-200/70 bg-[#fff6e8] p-2 text-amber-800 sm:block">
            <Scale size={17} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fff8ed] p-2.5 sm:p-3">
          <div className="h-full space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const htmlSegments = !isUser
                ? splitHtmlSegments(message.content)
                : { before: message.content, html: "", after: "" };
              const hasHtmlSegment =
                !isUser && Boolean(htmlSegments.html.trim());
              const renderedHtml = hasHtmlSegment
                ? buildHtmlDocument(htmlSegments.html)
                : null;

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      hasHtmlSegment
                        ? "min-w-[80vw] max-w-none"
                        : "max-w-[86%] sm:max-w-[78%]"
                    } rounded-2xl border px-3.5 py-3 ${
                      isUser
                        ? "border-amber-300/80 bg-amber-200/65 text-stone-900"
                        : "border-amber-200/80 bg-amber-50 text-stone-800"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-widest text-stone-600">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-amber-200/80 bg-[#fff8ec] p-1">
                          {isUser ? <User2 size={12} /> : <Bot size={12} />}
                        </span>
                        {isUser ? "You" : "LawBot"}
                      </div>

                      {hasHtmlSegment && !isUser && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadHtmlAsPdf(
                              message.id,
                              `lawbot-response-${message.id}.pdf`,
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-[#fff8ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-amber-100"
                        >
                          <Download size={11} />
                          Download PDF
                        </button>
                      )}
                    </div>
                    <div className="text-sm leading-relaxed ">
                      {htmlSegments.before.trim() && (
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {htmlSegments.before}
                        </Markdown>
                      )}

                      {hasHtmlSegment && (
                        <iframe
                          title={`html-preview-${message.id}`}
                          srcDoc={renderedHtml}
                          ref={(node) => {
                            if (node) {
                              htmlIframeRefs.current.set(message.id, node);
                            } else {
                              htmlIframeRefs.current.delete(message.id);
                            }
                          }}
                          onLoad={(event) => {
                            const iframe = event.currentTarget;
                            const doc = iframe.contentDocument;

                            if (!doc) {
                              return;
                            }

                            const documentHeight = Math.max(
                              doc.body?.scrollHeight ?? 0,
                              doc.documentElement?.scrollHeight ?? 0,
                              doc.body?.offsetHeight ?? 0,
                              doc.documentElement?.offsetHeight ?? 0,
                              doc.body?.clientHeight ?? 0,
                              doc.documentElement?.clientHeight ?? 0,
                            );

                            iframe.style.height = `${Math.max(documentHeight, 800)}px`;
                          }}
                          className="my-2 min-h-[80vh] w-full min-w-[80vw] rounded-lg border border-amber-200/80 bg-white"
                        />
                      )}

                      {htmlSegments.after.trim() && (
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {htmlSegments.after}
                        </Markdown>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50 px-3.5 py-3 text-sm text-stone-600">
                  LawBot is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={onFormSubmit} className="mt-2.5">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Describe your legal question..."
              className="w-full rounded-xl border border-amber-200/80 bg-[#fff8ec] px-4 py-3 text-sm text-stone-800 outline-none ring-0 placeholder:text-stone-500 focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-amber-50 shadow-[0_10px_18px_rgba(217,119,6,0.2)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
              <CornerDownLeft size={14} />
            </button>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submitMessage(prompt)}
                disabled={isSending}
                className="shrink-0 rounded-full border border-amber-200/80 bg-[#fff8ec] px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
};

export default Lawbot;
