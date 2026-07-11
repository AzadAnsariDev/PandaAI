import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModelColumn from "../components/ModelColumn";
import CompareInputBar from "../components/CompareInputBar";
import { useCompareChat } from "../hooks/useCompare.js";
import { useNavigate } from "react-router";



const darkTheme = {
  "--bg-primary": "#14161a",
  "--bg-secondary": "#1b1e22",
  "--bg-hover": "#252a30",
  "--border": "#2a2f36",
  "--text-primary": "#ece9e4",
  "--text-secondary": "#8b8f96",
  "--accent": "#22BFA8",
  "--accent-hover": "#1ba892",
};

const lightTheme = {
  "--bg-primary": "#ffffff",
  "--bg-secondary": "#f6f6f4",
  "--bg-hover": "#ececea",
  "--border": "#e3e3e0",
  "--text-primary": "#1b1c1c",
  "--text-secondary": "#6b6c68",
  "--accent": "#1F9E89",
  "--accent-hover": "#188677",
};

const CompareChat = () => {
  const [isDark, setIsDark] = useState(true); 
  const { register, handleSubmit, reset } = useForm();
  const { sendCompareMessage } = useCompareChat();
  const { responses, isLoading, prompt } = useSelector((state) => state.compare);
  const navigate = useNavigate()

  const onSubmit = (data) => {
    if (!data.prompt?.trim()) return;
    sendCompareMessage(data.prompt);
    reset();
  };

  return (
    <div style={isDark ? darkTheme : lightTheme} className="flex flex-col h-screen w-screen bg-[var(--bg-primary)]">
 
  <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
    <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {prompt && <p className="text-sm text-[var(--text-secondary)]">
        <span className="font-medium text-[var(--text-primary)]">
          You asked:
        </span>{" "}
        {prompt}
      </p>}

      <button
        onClick={() => navigate("/")}
        className="self-start sm:self-auto px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors duration-200"
      >
        ← Back to Home
      </button>
    </div>
  </div>


      {/* 3-column grid */}
      <div className="flex-1 overflow-hidden px-2 py-3 sm:px-4 sm:py-4">
        {!prompt ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[var(--text-secondary)] text-sm">
              Ask something below to compare all 3 models side by side.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(responses).map(([model, data]) => (
              <ModelColumn key={model} model={model} data={data} />
            ))}
          </div>
        )}
      </div>

      <CompareInputBar register={register} onSubmit={handleSubmit(onSubmit)} isSending={isLoading} />
    </div>
  );
};

export default CompareChat;