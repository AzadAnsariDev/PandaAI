import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prompt: "",
  isLoading: false,
  responses: {
    llama: { text: "", status: "idle" },   // idle | streaming | done | error
    gemini: { text: "", status: "idle" },
    mistral: { text: "", status: "idle" },
  },
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    startCompare: (state, action) => {
      state.prompt = action.payload;
      state.isLoading = true;
      state.responses = {
        llama: { text: "", status: "streaming" },
        gemini: { text: "", status: "streaming" },
        mistral: { text: "", status: "streaming" },
      };
    },
    appendChunk: (state, action) => {
      const { model, content } = action.payload;
      if (state.responses[model]) {
        state.responses[model].text += content;
      }
    },
    setModelStatus: (state, action) => {
      const { model, status, error } = action.payload;
      if (state.responses[model]) {
        state.responses[model].status = status;
        if (error) state.responses[model].error = error;
      }
    },
    finishCompare: (state) => {
      state.isLoading = false;
    },
    resetCompare: () => initialState,
  },
});

export const { startCompare, appendChunk, setModelStatus, finishCompare, resetCompare } =
  compareSlice.actions;
export default compareSlice.reducer;