import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { MODELS } from "../constant/model.js";

const ModelSelector = ({ selectedModel, onSelect }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const current = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
      >
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full ${current.bg} animate-glow`}
          style={{ "--glow-rgb": current.glow }}
        >
          <current.icon size={11} className="text-white" />
        </span>
        <span className="text-xs font-medium text-[var(--text-primary)]">{current.name}</span>
        <ChevronDown
          size={14}
          className={`text-[var(--text-secondary)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-64 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-xl shadow-black/30 p-1.5 z-50">
          {MODELS.map((model) => {
            const isSelected = model.id === current.id;
            return (
              <button
                key={model.id}
                onClick={() => {
                  onSelect(model.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-left"
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full ${model.bg} ${isSelected ? "animate-glow" : ""}`}
                 style={{ "--glow-rgb": current.glow }}
                >
                  <model.icon size={14} className="text-white" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm text-[var(--text-primary)]">{model.name}</span>
                  <span className="block text-[11px] text-[var(--text-secondary)]">{model.provider}</span>
                </span>
                {isSelected && <Check size={15} className="text-[var(--text-primary)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;