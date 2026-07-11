import { streamCompareResponse } from "../services/ai.service.js";

export async function compareModel(req, res) {
  const { messages } = req.body;

  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Transfer-Encoding", "chunked");

  const onToken = (model, content, status, error) => {
    const payload = {
      model,
      ...(content ? { content } : {}),
      ...(status ? { status } : { status: "streaming" }),
      ...(error ? { error } : {}),
    };
    res.write(JSON.stringify(payload) + "\n");
  };

  try {
    await streamCompareResponse(messages, onToken);
  } catch (err) {
    console.error("Compare error:", err.message);
  } finally {
    res.end();
  }
};