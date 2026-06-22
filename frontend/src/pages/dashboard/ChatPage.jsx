import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV, CLIENT_NAV } from "../../constants/navItems";
import "../../styles/chat.css";

/* ─── Mock Conversations ─────────────────────────────── */
const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    name: "Rahul Verma",
    role: "Client",
    initials: "RV",
    color: "#1A9FE0",
    online: true,
    project: "E-Commerce Platform Redesign",
    lastMessage: "Looks great! Can we schedule a quick call tomorrow?",
    lastTime: "10:42 AM",
    unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Hey, how's the progress on the checkout flow?", time: "09:15 AM", read: true },
      { id: "m2", from: "me",   text: "Going well! I've completed the cart component and started on the payment step.", time: "09:28 AM", read: true },
      { id: "m3", from: "them", text: "Awesome. Are you using Razorpay or Stripe for the payment integration?", time: "09:35 AM", read: true },
      { id: "m4", from: "me",   text: "Razorpay as discussed. I'll have a working prototype ready by EOD today.", time: "09:40 AM", read: true },
      { id: "m5", from: "them", text: "Perfect. Also can you make sure mobile responsiveness is done for this sprint?", time: "10:05 AM", read: true },
      { id: "m6", from: "me",   text: "Yes, already building it mobile-first. Breakpoints at 480px and 768px.", time: "10:18 AM", read: true },
      { id: "m7", from: "them", text: "Looks great! Can we schedule a quick call tomorrow?", time: "10:42 AM", read: false },
      { id: "m8", from: "them", text: "Around 11 AM works for me.", time: "10:43 AM", read: false },
    ],
  },
  {
    id: "c2",
    name: "Sneha Patel",
    role: "Client",
    initials: "SP",
    color: "#64FFDA",
    online: false,
    lastSeen: "2h ago",
    project: "Mobile Banking App",
    lastMessage: "Please share the Figma file when ready.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Hi! Just checking in on the onboarding screens.", time: "Yesterday, 3:00 PM", read: true },
      { id: "m2", from: "me",   text: "I've completed 4 of the 6 onboarding screens. Working on the KYC step now.", time: "Yesterday, 3:15 PM", read: true },
      { id: "m3", from: "them", text: "Great progress! The animations look smooth in the prototype.", time: "Yesterday, 3:22 PM", read: true },
      { id: "m4", from: "them", text: "Please share the Figma file when ready.", time: "Yesterday, 3:45 PM", read: true },
    ],
  },
  {
    id: "c3",
    name: "Vikram Nair",
    role: "Client",
    initials: "VN",
    color: "#FDC449",
    online: true,
    project: "SaaS Analytics Dashboard",
    lastMessage: "The bar chart looks off on Firefox.",
    lastTime: "Monday",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "Hey, I found a bug in the chart widget.", time: "Monday, 11:00 AM", read: true },
      { id: "m2", from: "me",   text: "Can you share a screenshot?", time: "Monday, 11:05 AM", read: true },
      { id: "m3", from: "them", text: "The bar chart looks off on Firefox.", time: "Monday, 11:10 AM", read: false },
    ],
  },
  {
    id: "c4",
    name: "Meera Joshi",
    role: "Client",
    initials: "MJ",
    color: "#FF5370",
    online: false,
    lastSeen: "3d ago",
    project: "Portfolio Website",
    lastMessage: "Project completed! Thank you so much.",
    lastTime: "Last week",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "The website is live and looking amazing!", time: "Last week", read: true },
      { id: "m2", from: "me",   text: "Great to hear! Let me know if you need any tweaks.", time: "Last week", read: true },
      { id: "m3", from: "them", text: "Project completed! Thank you so much.", time: "Last week", read: true },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────── */
const ME = { name: "Lohith Sai Ram", initials: "LS", color: "#1A9FE0" };

function groupMessagesByDate(messages) {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const day = msg.time.includes("Yesterday") ? "Yesterday"
      : msg.time.includes("Monday")    ? "Monday"
      : msg.time.includes("Last week") ? "Last Week"
      : "Today";
    if (day !== lastDate) { groups.push({ type: "date", label: day }); lastDate = day; }
    groups.push({ type: "message", ...msg });
  });
  return groups;
}

/* ─── ConversationItem ───────────────────────────────── */
function ConversationItem({ conv, active, onClick }) {
  return (
    <div className={`ch-conv-item${active ? " active" : ""}${conv.unread > 0 ? " unread" : ""}`}
      onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className="ch-conv-avatar-wrap">
        <div className="ch-conv-avatar" style={{ background: conv.color }}>{conv.initials}</div>
        {conv.online && <span className="ch-online-dot" />}
      </div>
      <div className="ch-conv-info">
        <div className="ch-conv-top">
          <span className="ch-conv-name">{conv.name}</span>
          <span className="ch-conv-time">{conv.lastTime}</span>
        </div>
        <div className="ch-conv-bottom">
          <span className="ch-conv-last">{conv.lastMessage}</span>
          {conv.unread > 0 && <span className="ch-unread-badge">{conv.unread}</span>}
        </div>
        <span className="ch-conv-project">{conv.project}</span>
      </div>
    </div>
  );
}

/* ─── Message Bubble ─────────────────────────────────── */
function MessageBubble({ msg }) {
  const isMe = msg.from === "me";
  return (
    <div className={`ch-msg-row${isMe ? " me" : " them"}`}>
      {!isMe && (
        <div className="ch-msg-avatar" style={{ background: "#1A9FE0" }}>
          {/* populated by parent via activeConv */}
        </div>
      )}
      <div className="ch-msg-bubble-wrap">
        <div className={`ch-msg-bubble${isMe ? " ch-msg-me" : " ch-msg-them"}`}>
          <p className="ch-msg-text">{msg.text}</p>
        </div>
        <div className={`ch-msg-meta${isMe ? " meta-right" : ""}`}>
          <span className="ch-msg-time">{msg.time}</span>
          {isMe && (
            <span className="ch-msg-read" title={msg.read ? "Read" : "Delivered"}>
              {msg.read ? (
                <svg width="14" height="10" viewBox="0 0 24 16" fill="none">
                  <polyline points="1 8 6 13 16 3" stroke="#1A9FE0" strokeWidth="2.5" strokeLinecap="round"/>
                  <polyline points="8 8 13 13 23 3" stroke="#1A9FE0" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="10" viewBox="0 0 24 16" fill="none">
                  <polyline points="4 8 9 13 20 3" stroke="#8892B0" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
      {isMe && (
        <div className="ch-msg-avatar ch-msg-avatar-me" style={{ background: ME.color }}>
          {ME.initials}
        </div>
      )}
    </div>
  );
}

/* ─── Main Chat Page ─────────────────────────────────── */
export default function ChatPage() {
  const location = useLocation();
  const isClient = location.pathname.startsWith("/client");
  const navItems = isClient ? CLIENT_NAV : FREELANCER_NAV;

  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId]           = useState("c1");
  const [input, setInput]                 = useState("");
  const [search, setSearch]               = useState("");
  const [isTyping, setIsTyping]           = useState(false);
  const [showInfo, setShowInfo]           = useState(true);
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const typingTimer    = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);
  const grouped    = activeConv ? groupMessagesByDate(activeConv.messages) : [];

  const filtered = conversations.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.project.toLowerCase().includes(search.toLowerCase())
  );

  /* Scroll to bottom on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeConv?.messages.length]);

  /* Mark messages as read when switching conv */
  const handleSelectConv = (id) => {
    setActiveId(id);
    setShowMobileList(false);
    setConversations((prev) => prev.map((c) =>
      c.id === id ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c
    ));
  };

  /* Simulate typing indicator from the other person */
  const simulateTyping = () => {
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 2500);
  };

  /* Send message */
  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeConv) return;
    const newMsg = { id: "m" + Date.now(), from: "me", text, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), read: false };
    setConversations((prev) => prev.map((c) =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: "Just now" }
        : c
    ));
    setInput("");
    inputRef.current?.focus();
    /* Simulate reply after delay */
    setTimeout(() => {
      simulateTyping();
      setTimeout(() => {
        setIsTyping(false);
        const replies = [
          "Got it, thanks for the update!",
          "Sounds good. I'll review and get back to you.",
          "Perfect. Keep up the great work!",
          "Thanks! Let me check and confirm.",
        ];
        const reply = { id: "m" + Date.now(), from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), read: false };
        setConversations((prev) => prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastTime: "Just now" }
            : c
        ));
      }, 2500);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <DashboardLayout navItems={navItems} pageTitle="Messages" pageSubtitle={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "Your conversations"}>
      <div className="ch-page-wrapper">
      <div className="ch-page">

        {/* ══ LEFT — Conversation List ══ */}
        <div className={`ch-sidebar${showMobileList ? " ch-sidebar-visible" : ""}`}>
          {/* Search */}
          <div className="ch-sidebar-head">
            <div className="ch-search-wrap">
              <svg className="ch-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="ch-search" placeholder="Search conversations…" value={search}
                maxLength={80} onChange={(e) => setSearch(e.target.value.slice(0, 80))} />
              {search && (
                <button className="ch-search-clear" onClick={() => setSearch("")}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="ch-conv-list">
            {filtered.length === 0 ? (
              <p className="ch-empty-search">No conversations found.</p>
            ) : (
              filtered.map((c) => (
                <ConversationItem key={c.id} conv={c} active={c.id === activeId}
                  onClick={() => handleSelectConv(c.id)} />
              ))
            )}
          </div>
        </div>

        {/* ══ CENTER — Message Thread ══ */}
        <div className={`ch-thread${!showMobileList ? " ch-thread-visible" : ""}`}>
          {activeConv ? (
            <>
              {/* Thread header */}
              <div className="ch-thread-head">
                <button className="ch-back-btn" onClick={() => setShowMobileList(true)} title="Back to conversations">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div className="ch-thread-head-avatar-wrap">
                  <div className="ch-thread-head-avatar" style={{ background: activeConv.color }}>{activeConv.initials}</div>
                  {activeConv.online && <span className="ch-online-dot ch-online-dot-lg" />}
                </div>
                <div className="ch-thread-head-info">
                  <p className="ch-thread-head-name">{activeConv.name}</p>
                  <p className="ch-thread-head-status">
                    {activeConv.online ? (
                      <span className="ch-online-text">● Online</span>
                    ) : (
                      <span className="ch-offline-text">Last seen {activeConv.lastSeen || "a while ago"}</span>
                    )}
                    <span className="ch-head-dot">·</span>
                    <span className="ch-head-project">{activeConv.project}</span>
                  </p>
                </div>
                <div className="ch-thread-head-actions">
                  <button className={`ch-head-btn${showInfo ? " active" : ""}`} onClick={() => setShowInfo((v) => !v)} title="Contact info">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="ch-messages">
                {grouped.map((item, i) =>
                  item.type === "date" ? (
                    <div key={i} className="ch-date-divider">
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <div key={item.id} className={`ch-msg-row${item.from === "me" ? " me" : " them"}`}>
                      {item.from !== "me" && (
                        <div className="ch-msg-avatar" style={{ background: activeConv.color }}>{activeConv.initials}</div>
                      )}
                      <div className="ch-msg-bubble-wrap">
                        <div className={`ch-msg-bubble${item.from === "me" ? " ch-msg-me" : " ch-msg-them"}`}>
                          <p className="ch-msg-text">{item.text}</p>
                        </div>
                        <div className={`ch-msg-meta${item.from === "me" ? " meta-right" : ""}`}>
                          <span className="ch-msg-time">{item.time}</span>
                          {item.from === "me" && (
                            <span className="ch-msg-read">
                              {item.read ? (
                                <svg width="14" height="9" viewBox="0 0 28 16" fill="none">
                                  <polyline points="1 8 7 14 18 2" stroke="#1A9FE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <polyline points="9 8 15 14 26 2" stroke="#1A9FE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <svg width="14" height="9" viewBox="0 0 20 14" fill="none">
                                  <polyline points="2 7 7 12 18 2" stroke="#8892B0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.from === "me" && (
                        <div className="ch-msg-avatar ch-msg-avatar-me" style={{ background: ME.color }}>{ME.initials}</div>
                      )}
                    </div>
                  )
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="ch-msg-row them">
                    <div className="ch-msg-avatar" style={{ background: activeConv.color }}>{activeConv.initials}</div>
                    <div className="ch-typing-bubble">
                      <span className="ch-typing-dot" />
                      <span className="ch-typing-dot" />
                      <span className="ch-typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="ch-input-area">
                <button className="ch-input-btn" title="Attach file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <div className="ch-input-wrap">
                  <textarea
                    ref={inputRef}
                    className="ch-input"
                    placeholder="Type a message…"
                    rows={1}
                    value={input}
                    maxLength={2000}
                    onChange={(e) => setInput(e.target.value.slice(0, 2000))}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <button className="ch-input-btn" title="Emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </button>
                <button
                  className={`ch-send-btn${input.trim() ? " active" : ""}`}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  title="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="ch-empty-thread">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="ch-empty-title">Select a conversation</p>
              <p className="ch-empty-sub">Choose a contact from the left to start messaging.</p>
            </div>
          )}
        </div>

        {/* ══ RIGHT — Contact Info Panel ══ */}
        {showInfo && activeConv && (
          <div className="ch-info-panel">
            <div className="ch-info-avatar-wrap">
              <div className="ch-info-avatar" style={{ background: activeConv.color }}>{activeConv.initials}</div>
              {activeConv.online && <span className="ch-online-dot ch-online-dot-lg" />}
            </div>
            <p className="ch-info-name">{activeConv.name}</p>
            <p className="ch-info-role">{activeConv.role}</p>
            <span className={`ch-info-status ${activeConv.online ? "online" : "offline"}`}>
              {activeConv.online ? "● Online" : `Last seen ${activeConv.lastSeen || "a while ago"}`}
            </span>

            <div className="ch-info-divider" />

            <div className="ch-info-section">
              <p className="ch-info-section-title">Project</p>
              <div className="ch-info-project-card">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                {activeConv.project}
              </div>
            </div>

            <div className="ch-info-section">
              <p className="ch-info-section-title">Shared Files</p>
              {[
                { name: "Design_System_v2.fig", size: "12.4 MB", type: "fig" },
                { name: "Wireframes_Final.pdf", size: "3.8 MB",  type: "pdf" },
              ].map((f) => (
                <div key={f.name} className="ch-info-file-row">
                  <div className="ch-info-file-icon">{f.type.toUpperCase()}</div>
                  <div className="ch-info-file-info">
                    <p className="ch-info-file-name">{f.name}</p>
                    <p className="ch-info-file-size">{f.size}</p>
                  </div>
                  <button className="ch-info-file-dl" title="Download">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              ))}

              {/* Upload shared file */}
              <label className="ch-info-upload-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Share a file
                <input type="file" style={{ display: "none" }} />
              </label>
            </div>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}