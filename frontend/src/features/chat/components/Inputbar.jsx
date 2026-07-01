import React, { useEffect } from "react";
import ModelSelector from "./ModelSelector";
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";



const InputBar = ({
  register,
  onSubmit,
  selectedModel,
  setSelectedModel,
  setImageFile,
  setImagePreview,
  imagePreview,
  setValue,
  isSending,
}) => {
  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
  if (transcript) {
    setValue("message", transcript);
  }
}, [transcript]); 

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };


function handleMic() {
  if (!browserSupportsSpeechRecognition) {
    alert("Chrome use karo");
    return;
  }

  if (listening) {
    SpeechRecognition.stopListening();
    resetTranscript();
  } else {
    resetTranscript();
    SpeechRecognition.startListening({ language: "en-IN" });
  }
}
  return (
    <div className="bg-[var(--bg-primary)] px-2 py-3 sm:px-4 sm:py-4 shrink-0">
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-2.5 sm:gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-2.5 py-2.5 sm:px-3 sm:py-3 focus-within:border-[var(--accent)] transition-colors"
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
        <div className="flex flex-wrap items-center gap-2 w-full">
          <label
            htmlFor="image-upload"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
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
            className="min-w-0 flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] py-1"
          />

          <div className="flex items-center gap-1.5 sm:gap-2 w-full justify-end sm:w-auto">
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />

            <button
              type="button"
              onClick={handleMic}
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                listening
                  ? "text-red-400 bg-red-400/10 animate-pulse"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
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
              disabled={isSending}
              className={`p-2 rounded-lg shrink-0 transition-all ${
                isSending
                  ? "bg-[var(--accent-hover)] opacity-70 cursor-not-allowed"
                  : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95"
              }`}
              aria-label={isSending ? "Sending message" : "Send message"}
            >
              {isSending ? (
                <svg
                  className="w-5 h-5 text-black animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-[10px] text-[var(--text-secondary)] mt-2">
        PandaAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default InputBar;