"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isDark?: boolean;
}

export function MarkdownRenderer({ content, className = "", isDark = false }: MarkdownRendererProps) {
  if (!content) return null;

  // 1. Helper to render inline elements (bold, italic, links, inline code)
  const renderInline = (text: string): React.ReactNode => {
    if (!text) return null;

    const elements: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern matches:
    // 1: [link text](url)
    // 2: **bold**
    // 3: *italic* or _italic_
    // 4: `code`
    const inlineRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;

    while (remaining.length > 0) {
      const match = remaining.match(inlineRegex);
      if (!match) {
        elements.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      const matchIndex = match.index ?? 0;
      if (matchIndex > 0) {
        elements.push(<span key={keyIdx++}>{remaining.substring(0, matchIndex)}</span>);
      }

      const [full, , linkText, linkUrl, boldText, italicText, codeText] = match;

      if (linkText && linkUrl) {
        elements.push(
          <a
            key={keyIdx++}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isDark
                ? "text-amber-300 hover:text-amber-200 font-medium underline underline-offset-2 decoration-amber-500/60"
                : "text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 decoration-amber-400/60 hover:decoration-amber-800 transition-colors"
            }
          >
            {linkText}
          </a>
        );
      } else if (boldText !== undefined) {
        elements.push(
          <strong
            key={keyIdx++}
            className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            {boldText}
          </strong>
        );
      } else if (italicText !== undefined) {
        elements.push(
          <em
            key={keyIdx++}
            className={`italic ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
          >
            {italicText}
          </em>
        );
      } else if (codeText !== undefined) {
        elements.push(
          <code
            key={keyIdx++}
            className={
              isDark
                ? "px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300 border border-neutral-700 font-mono text-[11px]"
                : "px-1.5 py-0.5 rounded bg-neutral-100/90 text-amber-900 border border-neutral-200/60 font-mono text-[11px]"
            }
          >
            {codeText}
          </code>
        );
      }

      remaining = remaining.substring(matchIndex + full.length);
    }

    return elements;
  };

  // 2. Parse text into semantic blocks
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Horizontal Divider
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push(
        <hr
          key={blockKey++}
          className={`my-3.5 border-t ${isDark ? "border-neutral-700" : "border-neutral-200/80"}`}
        />
      );
      i++;
      continue;
    }

    // Heading 4
    if (line.startsWith("#### ")) {
      blocks.push(
        <h4
          key={blockKey++}
          className={`text-xs sm:text-sm font-bold mt-2.5 mb-1 tracking-tight ${
            isDark ? "text-neutral-200" : "text-neutral-800"
          }`}
        >
          {renderInline(line.substring(5).trim())}
        </h4>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={blockKey++}
          className={`text-sm sm:text-base font-bold mt-3.5 mb-1.5 pb-1 border-b flex items-center gap-1.5 tracking-tight ${
            isDark
              ? "text-white border-neutral-700/80"
              : "text-neutral-900 border-neutral-200/60"
          }`}
        >
          {renderInline(line.substring(4).trim())}
        </h3>
      );
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={blockKey++}
          className={`text-base sm:text-lg font-bold mt-4 mb-2 tracking-tight ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {renderInline(line.substring(3).trim())}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 1
    if (line.startsWith("# ")) {
      blocks.push(
        <h1
          key={blockKey++}
          className={`text-lg sm:text-xl font-extrabold mt-4 mb-2 tracking-tight ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {renderInline(line.substring(2).trim())}
        </h1>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].substring(2).trim());
        i++;
      }
      blocks.push(
        <blockquote
          key={blockKey++}
          className={`border-l-3 border-amber-500 pl-3.5 py-2 my-2 text-xs rounded-r-md leading-relaxed ${
            isDark
              ? "bg-amber-950/30 text-amber-200 border-amber-500"
              : "bg-amber-50/70 text-neutral-700 border-amber-600"
          }`}
        >
          {renderInline(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split("|").slice(1, -1).map((c) => c.trim());
        let dataStartIndex = 1;
        // Check if row 1 is divider
        if (/^\|?(\s*:?-+:?\s*\|)+$/.test(tableLines[1])) {
          dataStartIndex = 2;
        }
        const dataRows: string[][] = [];
        for (let r = dataStartIndex; r < tableLines.length; r++) {
          const cells = tableLines[r].split("|").slice(1, -1).map((c) => c.trim());
          dataRows.push(cells);
        }

        blocks.push(
          <div
            key={blockKey++}
            className={`overflow-x-auto my-3 rounded-xl border shadow-3xs ${
              isDark ? "border-neutral-700 bg-neutral-900/90" : "border-neutral-200/90 bg-white"
            }`}
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className={`text-[11px] uppercase tracking-wider font-bold border-b ${
                  isDark
                    ? "bg-neutral-800 text-neutral-200 border-neutral-700"
                    : "bg-neutral-100/90 text-neutral-800 border-neutral-200"
                }`}
              >
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx} className="py-2.5 px-3 whitespace-nowrap">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isDark
                    ? "divide-neutral-800 text-neutral-300"
                    : "divide-neutral-100 text-neutral-700"
                }`}
              >
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      isDark
                        ? rIdx % 2 === 0
                          ? "bg-neutral-900 hover:bg-neutral-800/60 transition-colors"
                          : "bg-neutral-850 hover:bg-neutral-800/60 transition-colors"
                        : rIdx % 2 === 0
                        ? "bg-white hover:bg-amber-50/40 transition-colors"
                        : "bg-neutral-50/50 hover:bg-amber-50/40 transition-colors"
                    }
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 align-top leading-snug">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Unordered List (* or -)
    if (/^[\*\-]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[\*\-]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[\*\-]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul
          key={blockKey++}
          className={`list-disc pl-5 space-y-1.5 my-2 text-xs sm:text-sm ${
            isDark ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List (1. 2.)
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol
          key={blockKey++}
          className={`list-decimal pl-5 space-y-1.5 my-2 text-xs sm:text-sm ${
            isDark ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Standard Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !/^(\-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !lines[i].startsWith("> ") &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
      !/^[\*\-]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push(
        <p
          key={blockKey++}
          className={`my-1.5 leading-relaxed text-xs sm:text-sm ${
            isDark ? "text-neutral-200" : "text-neutral-800"
          }`}
        >
          {renderInline(paraLines.join(" "))}
        </p>
      );
    }
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
}

