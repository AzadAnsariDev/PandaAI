import React from "react";
import ReactMarkdown from "react-markdown";

const MODEL_LABELS = {
  llama: "Llama 3.3 (Groq)",
  gemini: "Gemini 2.5 Flash",
  mistral: "Mistral Small",
};

const markdownComponents = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>
  ),
  code: ({ inline, children, ...props }) =>
    inline ? (
      <code className="rounded bg-[var(--bg-hover)] px-1 py-0.5 text-sm font-sans" {...props}>
        {children}
      </code>
    ) : (
      <pre className="overflow-x-auto rounded-lg bg-[var(--bg-hover)] p-3 my-2 font-sans text-sm">
        <code {...props}>{children}</code>
      </pre>
    ),
};

const StatusDot = ({ status }) => {
  const colorMap = {
    streaming: "bg-yellow-400 animate-pulse",
    done: "bg-[var(--accent)]",
    error: "bg-red-400",
    idle: "bg-[var(--text-secondary)]",
  };
  return <span className={`w-1.5 h-1.5 rounded-full ${colorMap[status] || colorMap.idle}`} />;
};

const ModelColumn = ({ model, data }) => {
  const { text, status, error } = data;
  const label = MODEL_LABELS[model] || model;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] shrink-0 sticky top-0 bg-[var(--bg-secondary)] z-10">
        <StatusDot status={status} />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
        {status === "streaming" && (
          <span className="text-[10px] text-[var(--text-secondary)] ml-auto">typing…</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {status === "idle" && (
          <p className="text-sm text-[var(--text-secondary)]">Waiting for prompt…</p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-400">
            {error || "Something went wrong with this model."}
          </p>
        )}

        {text ? (
          <div className="font-serif text-[15px] leading-relaxed text-[var(--text-primary)] break-words">
            <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
          </div>
        ) : (
          status === "streaming" && (
            <div className="flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ModelColumn;