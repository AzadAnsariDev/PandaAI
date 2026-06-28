import React, { useState } from "react";

const focusOptions = ["Auto", "Web", "Academic", "Writing"];

const Topbar = ({ isDark, setIsDark, onMenuClick }) => {
  const [focusOpen, setFocusOpen] = useState(false);
  const [focus, setFocus] = useState(focusOptions[0]);

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)] shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Model / focus selector - UI only for now, wire selection to your model logic */}
        <div className="relative">
          <button
            onClick={() => setFocusOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors"
          >
            {focus}
            <svg
              className="w-3.5 h-3.5 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {focusOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFocusOpen(false)} />
              <div className="absolute top-full mt-2 left-0 w-40 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-xl overflow-hidden z-50">
                {focusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFocus(opt);
                      setFocusOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] ${
                      opt === focus ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark((v) => !v)}
        className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Topbar;