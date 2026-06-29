import React from "react";
import ModelSelector from "./ModelSelector";
import { useState } from "react";

const InputBar = ({ register, onSubmit }) => {
   const [selectedModel, setSelectedModel] = useState("gemini");
  return (
    <div className=" bg-[var(--bg-primary)] px-4 py-4 shrink-0">
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 focus-within:border-[var(--accent)] transition-colors"
      >
        {/* Attach file - UI only, wire to your upload logic */}
        <button
          type="button"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
            />
          </svg>
        </button>

        <input
          {...register("message", { required: true })}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />

        <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />


        {/* Voice input - UI only, wire to your speech-to-text logic */}
        <button
          type="button"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Voice input"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        </button>

        <button
          type="submit"
          className="p-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
          aria-label="Send message"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
      <p className="text-center text-[10px] text-[var(--text-secondary)] mt-2">
        PandaAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default InputBar;