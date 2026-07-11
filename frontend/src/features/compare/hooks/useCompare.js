import { useDispatch } from "react-redux";
import {
  startCompare,
  appendChunk,
  setModelStatus,
  finishCompare,
} from "../compareSlice";

export const useCompareChat = () => {
  const dispatch = useDispatch();

  const sendCompareMessage = async (prompt) => {
    dispatch(startCompare(prompt));

    try {
      const res = await fetch("http://localhost:3000/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // NDJSON: har line ek complete JSON object hai
        const lines = buffer.split("\n");
        buffer = lines.pop(); // last incomplete line ko buffer mein rakho

        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line);

          if (parsed.status === "done") {
            dispatch(setModelStatus({ model: parsed.model, status: "done" }));
          } else if (parsed.status === "error") {
            dispatch(
              setModelStatus({
                model: parsed.model,
                status: "error",
                error: parsed.error,
              })
            );
          } else if (parsed.content) {
            dispatch(
              appendChunk({ model: parsed.model, content: parsed.content })
            );
          }
        }
      }
    } catch (err) {
      console.error("Compare stream error:", err);
    } finally {
      dispatch(finishCompare());
    }
  };

  return { sendCompareMessage };
};