import { useNavigate } from "react-router";

const CompareButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="hidden md:flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[10px] sm:text-xs font-semibold hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:scale-[0.97] transition-all whitespace-nowrap"
  >
    <svg
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 3v18M15 3v18M4 8h4m8 0h4M4 16h4m8 0h4"
      />
    </svg>
    <span className="hidden sm:inline">Compare Models</span>
    <span className="sm:hidden">Compare</span>
  </button>
);

export default CompareButton