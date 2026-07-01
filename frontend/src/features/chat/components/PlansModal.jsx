import React from "react";

// Plans coming-soon modal. onClose wires to your showPlans state setter.
const PlansModal = ({ onClose }) => (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Card — stops click bubbling to backdrop */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--accent)] via-teal-300 to-[var(--accent)] opacity-80" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-7 pb-8 pt-7 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] leading-snug">
              Premium Plans — Coming Soon
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
              We're crafting something worth waiting for. Our plans will unlock higher limits, 
              priority access, and powerful features built around how you actually work.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[var(--border)]" />

          {/* Message */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Until then, you're on the{" "}
            <span className="text-[var(--accent)] font-semibold">Free Plan</span> — full access,
            no limits, no credit card. We truly respect your patience and trust in PandaAI.
          </p>

          {/* Stay tuned pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-hover)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] animate-ping opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Stay tuned — an announcement is on the way
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-black font-semibold text-sm hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all"
          >
            Got it, keep exploring
          </button>
        </div>
      </div>
    </div>
  </>
);

export default PlansModal;