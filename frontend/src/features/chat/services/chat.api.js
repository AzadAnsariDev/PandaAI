import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:3000/api/chats",
    withCredentials :true
})

// chat.api.js
export async function sendMessageStream(message, chatId, model,imageFile, onToken, onMeta) {
   
  const formData = new FormData();
  formData.append("message", message);
  formData.append("chatId", chatId || "");
  formData.append("model", model);
  if (imageFile) formData.append("image", imageFile);

  const response = await fetch("http://localhost:3000/api/chats/message/stream", {
    method: "POST",
    credentials: "include", // equivalent to axios's withCredentials: true
    body: formData
  });

    if (response.status === 401) {
    throw { status: 401, message: "Not authenticated" };
  }
  if (!response.ok) {
    throw { status: response.status, message: "Request failed" };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete last line for next chunk

    for (const line of lines) {
      if (!line.trim()) continue;
      const parsed = JSON.parse(line);
      if (parsed.type === "meta") onMeta(parsed.chat);
      if (parsed.type === "token") onToken(parsed.content);
    }
  }
}

export async function getChats(){
    const response = await api.get("/getChats")
    return response.data
}

export async function getMessages(chatId){
    const response = await api.get(`/${chatId}/message`)
    return response.data
}

export async function  deleteChat(chatId) {
    const response = await api.delete(`/delete/${chatId}`)
    return response
}