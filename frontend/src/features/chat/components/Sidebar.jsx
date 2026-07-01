import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hook/useAuth.js";
import { useNavigate } from "react-router";
import { setLoading } from "../chatSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../auth/authSlice.js";

// ─── Shared animation styles injected once ───────────────────────────────────
const ANIM_STYLE = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pandaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,200,150,0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(0,200,150,0); }
}
`;

// ─── Custom Unique SVG Logo Component for LUMIS ─────────────────────────────
const BrandLogoSvg = () => (
<svg viewBox="0 0 100 100" className="w-14 h-14 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sigTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00C896" />
      <stop offset="100%" stopColor="#002d22" />
    </linearGradient>
  </defs>
  
  {/* <!-- Quad-Symmetrical Matrix Blades -->
  <!-- Top Blade --> */}
  <path d="M50,15 L62,35 L50,42 L38,35 Z" fill="url(#sigTeal)" />
  
  {/* <!-- Right Blade --> */}
  <path d="M85,50 L65,62 L58,50 L65,38 Z" fill="url(#sigTeal)" opacity="0.9" />
  
  {/* <!-- Bottom Blade --> */}
  <path d="M50,85 L38,65 L50,58 L62,65 Z" fill="#00C896" />
  
  {/* <!-- Left Blade --> */}
  <path d="M15,50 L35,38 L42,50 L35,62 Z" fill="url(#sigTeal)" opacity="0.7" />

  {/* <!-- Ultra Sharp Core Alignment Rings --> */}
  <circle cx="50" cy="50" r="16" stroke="#00C896" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" />
  
  {/* Contrast Ring preventing drop on dark or light canvas */}
  <circle cx="50" cy="50" r="5" fill="#111827" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  {/* Pure Premium Neon Light Source */}
  <circle cx="50" cy="50" r="3.5" fill="#00ffc4" />
</svg>


);

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChatListItem = ({ title, active, onOpen, onDelete }) => (
  <button
    onClick={onOpen}
    className={`group w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors min-w-0
      ${
        active
          ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      }`}
  >
    <span className="flex-1 min-w-0 truncate">{title}</span>
    <svg
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="w-4 h-4 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-red-400 transition-opacity"
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

// ─── Profile Modal ────────────────────────────────────────────────────────────
const ProfileModal = ({ user, onClose }) => {
  const [username, setUsername] = useState(user?.username || "");

  const dispatch = useDispatch()

  const {handleUpdateProfile} = useAuth()

  async function handleSave() {

    setLoading(true)
    try{
      const response = await handleUpdateProfile(username)
      console.log(response)
      dispatch(setUser(response.user))
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
      onClose()
    }

}

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary, #1a1f2e)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, padding: 28, width: 380, maxWidth: "92vw",
          boxShadow: "0 28px 64px rgba(0,0,0,0.65)",
          animation: "fadeSlideUp 0.18s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #00C896, #00a07a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000", fontWeight: 700, fontSize: 15,
            }}>
              {(user?.username || "U").charAt(0).toUpperCase()}
            </div>
            <span style={{ color: "var(--text-primary, #e2e8f0)", fontWeight: 700, fontSize: 17 }}>Profile</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "var(--text-secondary, #94a3b8)",
              width: 30, height: 30, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Username field */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "var(--text-secondary, #94a3b8)", fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 9,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary, #e2e8f0)", fontSize: 14,
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#00C896"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Email field (read-only) */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", color: "var(--text-secondary, #94a3b8)", fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Email <span style={{ color: "#475569", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(read-only)</span>
          </label>
          <input
            type="email"
            value={user?.email || "user@pandaai.com"}
            readOnly
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 9,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-secondary, #64748b)", fontSize: 14,
              outline: "none", cursor: "not-allowed", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: "11px", borderRadius: 10,
            background: "linear-gradient(135deg, #00C896, #00a07a)",
            border: "none", color: "#000", fontWeight: 700,
            fontSize: 14, cursor: "pointer", transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.85"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─── Help Modal ───────────────────────────────────────────────────────────────
const HelpModal = ({ onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "var(--bg-secondary, #1a1f2e)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: "36px 32px", width: 400, maxWidth: "92vw",
        textAlign: "center",
        boxShadow: "0 28px 64px rgba(0,0,0,0.65)",
        animation: "fadeSlideUp 0.18s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, color: "var(--text-secondary, #94a3b8)",
          width: 30, height: 30, cursor: "pointer", fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(0,200,150,0.1)",
        border: "1px solid rgba(0,200,150,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: 24,
      }}>
        🛠️
      </div>

      <h2 style={{ color: "var(--text-primary, #e2e8f0)", fontSize: 20, fontWeight: 700, marginBottom: 10, marginTop: 0 }}>
        Help & Support
      </h2>

      <p style={{ color: "var(--text-secondary, #94a3b8)", fontSize: 14, lineHeight: 1.75, marginBottom: 6 }}>
        We're actively building a comprehensive help center for PandaAI — covering guides, tutorials, and live support.
      </p>
      <p style={{ color: "#475569", fontSize: 13, marginBottom: 24 }}>
        This feature will be available very soon. We appreciate your patience as we work to make it great.
      </p>

      <div style={{
        padding: "10px 16px", borderRadius: 10,
        background: "rgba(0,200,150,0.07)",
        border: "1px solid rgba(0,200,150,0.18)",
        color: "#00C896", fontSize: 13, marginBottom: 24,
      }}>
        ✦ &nbsp;Coming soon — stay tuned
      </div>

      <button
        onClick={onClose}
        style={{
          width: "100%", padding: "10px", borderRadius: 10,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-secondary, #94a3b8)", fontSize: 14,
          cursor: "pointer", transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.09)"}
        onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
      >
        Got it
      </button>
    </div>
  </div>
);

// ─── Account Popup Menu ───────────────────────────────────────────────────────
const AccountMenu = ({ user, onClose, onProfileClick, onHelpClick, onLogout }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: "Profile",
      onClick: onProfileClick,
      danger: false,
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Help",
      onClick: onHelpClick,
      danger: false,
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute", bottom: "calc(100% + 8px)", left: 8, right: 8,
        background: "var(--bg-secondary, #1a1f2e)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 14, padding: 6, zIndex: 999,
        boxShadow: "0 -12px 40px rgba(0,0,0,0.55)",
        animation: "fadeSlideUp 0.15s ease",
      }}
    >
      {/* User info chip at top */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px 10px", marginBottom: 2,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #00C896, #00a07a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#000", fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>
          {(user?.username || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ color: "var(--text-primary, #e2e8f0)", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
            {user?.username || "User"}
          </div>
          <div style={{ color: "#475569", fontSize: 11 }}>{user?.email || ""}</div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: "4px 0" }}>
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => { item.onClick(); onClose(); }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "8px 10px", borderRadius: 8,
              background: "transparent", border: "none",
              color: "var(--text-secondary, #cbd5e1)",
              fontSize: 13, cursor: "pointer", textAlign: "left",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "var(--text-primary, #e2e8f0)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary, #cbd5e1)";
            }}
          >
            <span style={{ opacity: 0.75 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Divider + logout */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "2px 4px 4px" }} />
      <button
        type="button"
        onClick={() => { onLogout(); onClose(); }}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "8px 10px", borderRadius: 8,
          background: "transparent", border: "none",
          color: "#f87171", fontSize: 13, cursor: "pointer", textAlign: "left",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log out
      </button>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = ({
  open,
  setOpen,
  chats,
  currentChatId,
  onOpenChat,
  onDeleteChat,
  onRefresh,
  user,
}) => {
  const initial = (user?.username || "U").trim().charAt(0).toUpperCase();
  const { handleNewChat } = useChat();
  const {handleLogout} = useAuth()
  const navigate = useNavigate();

  const [showMenu, setShowMenu]       = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp]       = useState(false);

  const handleLogoutBtn = async () => {
    try {
      if(user){
        const response = await handleLogout()
        console.log("Logging out…")
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Inject animations once */}
      <style>{ANIM_STYLE}</style>

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40 flex flex-col
          bg-[var(--bg-secondary)] border-r border-[var(--border)]
          transition-all duration-300 w-72
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center h-16 px-3 shrink-0 justify-between">
          {open ? (
            <>
              <div className="flex items-center flex-1 overflow-hidden">
                <BrandLogoSvg />
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

        {/* ── New Chat ── */}
        <div className="p-3 shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--accent)] text-black font-medium text-sm hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {open && <span>New Chat</span>}
          </button>
        </div>

        {/* ── Chat history ── */}
        {open && (
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">Chats</span>
              <button
                onClick={onRefresh}
                className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                aria-label="Refresh chats"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

        {/* ── Account footer ── */}
        {user ? (
          <div className="border-t border-[var(--border)] p-2 shrink-0" style={{ position: "relative" }}>
          {showMenu && open && user && (
            <AccountMenu
              user={user}
              onClose={() => setShowMenu(false)}
              onProfileClick={() => setShowProfile(true)}
              onHelpClick={() => setShowHelp(true)}
              onLogout={handleLogoutBtn}
            />
          )}

          <button
            onClick={() => open && setShowMenu((v) => !v)}
            className={`w-full flex items-center gap-2 rounded-lg transition-colors ${
              open ? "px-2 py-2 hover:bg-[var(--bg-hover)]" : "justify-center py-1.5"
            } ${showMenu ? "bg-[var(--bg-hover)]" : ""}`}
          >
            <div
              className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-black text-sm font-semibold shrink-0"
              style={showMenu ? { animation: "pandaPulse 1.5s infinite" } : {}}
            >
              {initial}
            </div>
            {open && (
              <>
                <span className="flex-1 text-left text-sm font-medium truncate">{user?.username}</span>
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-200"
                  style={{ transform: showMenu ? "rotate(180deg)" : "rotate(0deg)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
    ) : (
  <div className="border-t border-[var(--border)] p-2 shrink-0">
    {open ? (
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="w-full m-auto flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--accent)] text-black text-sm font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all"
      >
        Login
      </button>
    ) : (
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="w-full flex items-center justify-center py-1.5 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--accent)] transition-colors"
        aria-label="Sign in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
      </button>
    )}
  </div>
)}
      </aside>

      {/* ── Modals ── */}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showHelp    && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default Sidebar;