import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { initializeServerConnection } from "../services/chat.socket";
import { useChat } from "../hooks/useChat.js";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/Inputbar.jsx";

// Theme tokens - this is the only place you need to touch to restyle the whole app.
// Everything else reads colors from these CSS variables.
const darkTheme = {
  "--bg-primary": "#14161a",
  "--bg-secondary": "#1b1e22",
  "--bg-hover": "#252a30",
  "--border": "#2a2f36",
  "--text-primary": "#ece9e4",
  "--text-secondary": "#8b8f96",
  "--accent": "#22BFA8",
  "--accent-hover": "#1ba892",
  "--bubble-user": "#22BFA8",
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
  "--bubble-user": "#1F9E89",
};

const Dashboard = () => {
  // ---- UI-only state (safe to extend, doesn't touch app logic) ----
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [isDark, setIsDark] = useState(true);

  // ---- Original app logic, untouched ----
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { message: "" },
  });
  const { handleSendMessage, handleGetChats, handleOpenChat, handleDeleteChat } = useChat();

  const chat = useSelector((state) => state.chats.chat);
  const currentChatId = useSelector((state) => state.chats.currentChatId);

  // Placeholder - swap this for your real user data, e.g.
  const user = useSelector((state) => state.auth.user);
 
  useEffect(() => {
    initializeServerConnection();
    handleGetChats();
  }, []);

  const onSubmit = async (data) => {
    handleSendMessage(data.message, currentChatId);
    reset();
  };

  const messages = chat[currentChatId]?.messages || [];

  return (
    <div
      style={isDark ? darkTheme : lightTheme}
      className="h-screen w-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
    >
      {/* Backdrop for mobile sidebar drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        chats={chat}
        currentChatId={currentChatId}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
        onRefresh={handleGetChats}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar isDark={isDark} setIsDark={setIsDark} onMenuClick={() => setSidebarOpen((v) => !v)} />
        <ChatWindow messages={messages} />
        <InputBar register={register} onSubmit={handleSubmit(onSubmit)} />
      </div>
    </div>
  );
};

export default Dashboard;