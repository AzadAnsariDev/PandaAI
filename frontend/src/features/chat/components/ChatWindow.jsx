import React from "react";
import MessageBubble from "../components/Messagebubble ";

// Sample follow-up chips - replace with real suggestions from your logic

const ChatWindow = ({ messages }) => {
  const isEmpty = !messages || messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
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

          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;