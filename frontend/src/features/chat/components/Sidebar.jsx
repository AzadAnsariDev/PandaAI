import React from "react";
import { useChat } from "../hooks/useChat";

const ChatListItem = ({ title, active, onOpen, onDelete }) => (
  <button
    onClick={onOpen}
    className={`group w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm text-left truncate transition-colors
      ${
        active
          ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      }`}
  >
    <span className="truncate">{title}</span>
    <svg
      onClick={(e) => {
        e.stopPropagation(); // don't trigger onOpen when deleting
        onDelete();
      }}
      className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
      />
    </svg>
  </button>
);

const SidebarToggleIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.8" />
    <line x1="9.5" y1="3" x2="9.5" y2="21" strokeWidth="1.8" />
  </svg>
);

// open = sidebar visible (mobile drawer) AND/OR expanded (desktop width)
// user = { name } - pass your real auth/user data in from Dashboard, this is UI-only
const Sidebar = ({
  open,
  setOpen,
  chats,
  currentChatId,
  onOpenChat,
  onDeleteChat,
  onRefresh,
  user = { name: "Guest" },
  onAccountClick = () => {},
}) => {
  const initial = (user?.name || "U").trim().charAt(0).toUpperCase();
  const {handleNewChat } = useChat()

  return (
    <aside
      className={`
        fixed md:relative inset-y-0 left-0 z-40 flex flex-col
        bg-[var(--bg-secondary)] border-r border-[var(--border)]
        transition-all duration-300 w-72
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"}
      `}
    >
      {/* Header: logo + name when expanded, just the toggle when collapsed */}
      <div className="flex items-center h-16 px-3 border-b border-[var(--border)] shrink-0">
        {open ? (
          <>
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-black shrink-0">
                P
              </div>
              <span className="font-semibold text-[15px] truncate">PandaAI</span>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="hidden md:flex p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] shrink-0"
              aria-label="Collapse sidebar"
            >
              <SidebarToggleIcon />
            </button>
          </>
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            className="hidden md:flex mx-auto p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            aria-label="Expand sidebar"
          >
            <SidebarToggleIcon />
          </button>
        )}
      </div>

      {/* New chat - wire onClick to your "start new chat" logic */}
      <div className="p-3 shrink-0">
        <button 
        onClick={()=>{
          handleNewChat()
        }}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--accent)] text-black font-medium text-sm hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {open && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat history - only shown when expanded */}
      {open && (
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
              Chats
            </span>
            <button
              onClick={onRefresh}
              className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              aria-label="Refresh chats"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          {Object.values(chats || {}).map((c) => (
            <ChatListItem
              key={c.id}
              title={c.title}
              active={c.id === currentChatId}
              onOpen={() => onOpenChat(c.id)}
              onDelete={() => onDeleteChat(c.id)}
            />
          ))}
        </div>
      )}
      {!open && <div className="flex-1" />}

      {/* Account footer - hook onAccountClick up to your profile/settings menu later */}
      <div className="border-t border-[var(--border)] p-2 shrink-0">
        <button
          onClick={onAccountClick}
          className={`w-full flex items-center gap-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors ${
            open ? "px-2 py-2" : "justify-center py-1.5"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-black text-sm font-semibold shrink-0">
            {initial}
          </div>
          {open && (
            <>
              <span className="flex-1 text-left text-sm font-medium truncate">{user.name}</span>
              <svg className="w-4 h-4 text-[var(--text-secondary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;