import React from "react";
import ModelSelector from "./ModelSelector";
import { useState } from "react";

const InputBar = ({
  register,
  onSubmit,
  selectedModel,
  setSelectedModel,
  setImageFile,
  setImagePreview,
  imagePreview,
}) => {
  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-[var(--bg-primary)] px-4 py-4 shrink-0">
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-3 focus-within:border-[var(--accent)] transition-colors"
      >
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full">
            <div className="relative w-fit">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-xl object-cover border border-[var(--border)]"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/80 text-white hover:bg-black transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center gap-2 w-full">
          <label
            htmlFor="image-upload"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Attach file"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
              />
            </svg>
          </label>

          <input
            {...register("message")}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />

          <ModelSelector
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
          />

          {/* Voice input */}
          <button
            type="button"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Voice input"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <button
            type="submit"
            className="p-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </form>

      <p className="text-center text-[10px] text-[var(--text-secondary)] mt-2">
        PandaAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default InputBar;