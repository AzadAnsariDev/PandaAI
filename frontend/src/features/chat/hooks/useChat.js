import { useDispatch, useSelector } from "react-redux";
import {
  deleteChat,
  getChats,
  getMessages,
  sendMessageStream,
} from "../services/chat.api";
import { initializeServerConnection } from "../services/chat.socket";
import {
  setCurrentChatId,
  createNewChat,
  addNewMessage,
  setChat,
  addMessage,
  appendToLastMessage,
  clearDraft
} from "../chatSlice";
import { useNavigate } from "react-router";

export function useChat() {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.chats.currentChatId);
  const navigate = useNavigate();

  function createTypewriter(
    dispatch,
    getChatId,
    msPerTick = 20,
    charsPerTick = 2,
  ) {
    let queue = "";
    let running = false;

    function tick() {
      if (queue.length === 0) {
        running = false;
        return;
      }
      const chunk = queue.slice(0, charsPerTick);
      queue = queue.slice(charsPerTick);
      dispatch(appendToLastMessage({ chatId: getChatId(), content: chunk }));
      setTimeout(tick, msPerTick);
    }

    return {
      push(text) {
        queue += text;
        if (!running) {
          running = true;
          tick();
        }
      },
    };
  }

  async function handleSendMessage(message, chatId, model, imageFile) {
    let activeChat = chatId;
    dispatch(
      addNewMessage({ 
        chatId: activeChat,
        content: message,
        role: "user" ,
        image : imageFile ? URL.createObjectURL(imageFile) : null
    }),
    );
    dispatch(
      addNewMessage({
        chatId: activeChat,
        content: "",
        role: "assistant",
        model: model,
      }),
    );

    const typewriter = createTypewriter(dispatch, () => activeChat, 20, 2);

    try {
      await sendMessageStream(
        message,
        chatId,
        model,
        imageFile,
        (token) => typewriter.push(token),
        (chat) => {
          dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
          dispatch(setCurrentChatId(chat._id));
          activeChat = chat._id;
        },
      );
    } catch (err) {
      if (err.status === 401) {
        navigate("/register");
        return;
      }
      console.error("Send message failed:", err);
    }
  }
  async function handleGetChats() {
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChat(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: new Date().toISOString(),
          };
          return acc;
        }, {}),
      ),
    );
  }

  async function handleOpenChat(chatId) {
    const data = await getMessages(chatId);
    const { messages } = data;

    const formattedMessages = messages.map((msg) => ({
      content: msg.content,
      role: msg.role,
    }));

    dispatch(addMessage({ chatId, messages }));

    dispatch(setCurrentChatId(chatId));
  }

  async function handleDeleteChat(chatId) {
    const response = await deleteChat(chatId);
    await handleGetChats();

    if (currentChatId === chatId) {
      dispatch(setCurrentChatId(null));
      dispatch(clearDraft());
    }

    return response;
  }

  async function handleNewChat(chatId, title) {
    dispatch(setCurrentChatId(null));
    dispatch(clearDraft());
  }
  return {
    initializeServerConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleNewChat,
  };
}
