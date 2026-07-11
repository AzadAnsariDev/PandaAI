import React, { useState } from "react";
import FreePlanBadge from "./FreePlanBadge";
import PlansModal from "./PlansModal";
import { useNavigate } from "react-router";
import CompareButton from "../../compare/components/compareButton";


const focusOptions = ["Auto", "Web", "Academic", "Writing"];

const Topbar = ({ isDark, setIsDark, onMenuClick }) => {
  const [focusOpen, setFocusOpen] = useState(false);
  const [focus, setFocus] = useState(focusOptions[0]);
  
  const [showPlans, setShowPlans] = useState(false);

  const navigate = useNavigate()

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-[var(--bg-primary)] border-b border-[var(--border)]/40 shrink-0 relative">
      
      {/* 1. LEFT CONTAINER: Sidebar toggle & Logo */}
      <div className="flex items-center gap-3  justify-start min-w-0">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] shrink-0"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* LUMIS Text Header */}
        <div className="flex items-center select-none truncate">
          <span className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-[#475569] via-[#00C896] to-[#004a37] dark:from-[#bab7b7] dark:via-[#00C896] dark:to-[#004a37] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,200,150,0.2)]">
            LUMIS
          </span>
        </div>
      </div>

      {/* 2. CENTER CONTAINER: Perfectly centered Badge layer */}
      <div className="flex items-center justify-center shrink-0">
        <FreePlanBadge onClick={() => setShowPlans(true)} />
        {showPlans && <PlansModal onClose={() => setShowPlans(false)} />}
      </div>

       <CompareButton  onClick={() => navigate("/compare")} />

      {/* 3. RIGHT CONTAINER: Action Utilities */}
      <div className="flex items-center gap-2  justify-end">
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
      </div>

    </header>
  );
};

export default Topbar;