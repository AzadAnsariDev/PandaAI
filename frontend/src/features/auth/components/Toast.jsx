import { useEffect, useState } from "react";

const icons = {
  error: (
    <svg className="w-4.5 h-4.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v3.75m9-1.5a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  ),
  success: (
    <svg className="w-4.5 h-4.5 text-[var(--accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12.75l2.25 2.25L15 8.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const borderColors = {
  error: "border-red-500/40",
  success: "border-[var(--accent)]",
};

// Auto-dismissing toast for auth feedback. Slides down from the top,
// stays for `duration` ms, then fades out and calls onClose.
// Usage: <Toast message={msg} type="success" onClose={() => setMsg(null)} />
const Toast = ({ message, type = "error", onClose, duration = 2800 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);

    const hideTimer = setTimeout(() => setVisible(false), duration - 300);
    const closeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 px-4 w-full max-w-sm ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border ${borderColors[type]} shadow-2xl text-sm text-[var(--text-primary)]`}
      >
        {icons[type]}
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
};

export default Toast;