import React from "react";
import MessageBubble from "../components/Messagebubble ";

// Sample follow-up chips - replace with real suggestions from your logic
const suggestions = [
  "Explain this in simpler terms",
  "What are the key takeaways?",
  "Give me a real-world example",
];

const ChatWindow = ({ messages }) => {
  const isEmpty = !messages || messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {isEmpty ? (
          <div className="text-center mt-16 md:mt-28">
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
              What's on your mind today?
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Ask anything — I'll find the answer and the sources behind it.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}

            {/* Follow-up suggestions - wire onClick to fill the input via setValue from react-hook-form */}
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;