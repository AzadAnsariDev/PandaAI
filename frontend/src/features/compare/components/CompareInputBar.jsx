import React from "react";

const CompareInputBar = ({ register, onSubmit, isSending }) => {
  return (
    <div className="bg-[var(--bg-primary)] px-2 py-3 sm:px-4 sm:py-4 shrink-0">
      <form
        onSubmit={onSubmit}
        className="max-w-5xl mx-auto flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 focus-within:border-[var(--accent)] transition-colors"
      >
        <input
          {...register("prompt")}
          placeholder="Ask all 3 models anything..."
          className="min-w-0 flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] py-1"
        />

        <button
          type="submit"
          disabled={isSending}
          className={`p-2 rounded-lg shrink-0 transition-all ${
            isSending
              ? "bg-[var(--accent-hover)] opacity-70 cursor-not-allowed"
              : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95"
          }`}
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>

      <p className="text-center text-[10px] text-[var(--text-secondary)] mt-2">
        Compare Mode — same prompt sent to all 3 models in parallel.
      </p>
    </div>
  );
};

export default CompareInputBar;