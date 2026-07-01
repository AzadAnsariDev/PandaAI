import React, { useState } from "react";

// Drop this anywhere in your Topbar — onClick se PlansModal khulta hai
const FreePlanBadge = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[var(--accent)] text-[var(--accent)] text-[10px] sm:text-xs font-semibold hover:bg-[var(--accent)]/10 active:scale-[0.97] transition-all whitespace-nowrap"
  >
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <span className="hidden sm:inline">Free Plan. Upgrade</span>
    <span className="sm:hidden">Upgrade</span>
  </button>
);

export default FreePlanBadge;