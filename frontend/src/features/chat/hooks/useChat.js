import { useDispatch, useSelector } from "react-redux";
import {
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
} from "../services/chat.api";
import { initializeServerConnection } from "../services/chat.socket";
import {
  setCurrentChatId,
  createNewChat,
  addNewMessage,
  setChat,
  addMessage,
  replaceTempChat,
} from "../chatSlice";

export function useChat() {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.chats.currentChatId);


  async function handleSendMessage(message, chatId) {
    const data = await sendMessage(message, chatId);
    const { chat, aiMessage } = data;

    let activeChat = chatId;

    if (chat) {
      dispatch(
        replaceTempChat({
          tempChatId: currentChatId,
          chatId: data.chat._id,
          title: data.chat.title,
        }),
      );
      // dispatch(createNewChat({
      //    chatId : chat?._id || chatId,
      //    title : chat?.title
      // }))
      dispatch(setCurrentChatId(chat?._id));
      activeChat = chat._id;
    }

    dispatch(
      addNewMessage({
        chatId: activeChat,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatId: activeChat,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
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
    return response;
  }

  async function handleNewChat(chatId, title) {
    const tempChatId = `temp-${Date.now()}`;

    dispatch(
      createNewChat({
        chatId: tempChatId,
        title: "New Chat",
      }),
    );

    dispatch(setCurrentChatId(tempChatId));
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
