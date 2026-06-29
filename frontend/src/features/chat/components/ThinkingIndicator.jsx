const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-secondary)] via-[var(--text-primary)] to-[var(--text-secondary)] bg-[length:200%_100%] animate-shimmer"
      >
        Thinking
      </span>
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.32s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.16s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:0s]" />
      </span>
    </div>
  );
};

export default ThinkingIndicator;