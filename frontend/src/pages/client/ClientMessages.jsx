// ============================================================
// SkillAsAService — ClientMessages.jsx
// Route: /client/messages
// Unified messaging hub: Private (1-on-1) + Group Chat tabs.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import ClientLayout from './ClientLayout';

// ─── Seed Data ───────────────────────────────────────────────

const AVATAR_COLORS = ['#1A9FE0','#FDC449','#64FFDA','#FF5370','#9B59B6','#2ECC71','#E74C3C','#32DCFD'];

const INIT_DM_CONTACTS = [
  { id: 1, name: 'Arjun Sharma',  role: 'Full Stack Dev',  avatar: 'AS', color: '#1A9FE0', online: true,  unread: 3, lastMsg: 'Sure! I\'ll have the update ready by tomorrow.', lastTime: '10:17 AM' },
  { id: 2, name: 'Priya Menon',   role: 'UI/UX Designer',  avatar: 'PM', color: '#32DCFD', online: true,  unread: 0, lastMsg: 'The mockups are ready for review 🎨',            lastTime: '9:45 AM'  },
  { id: 3, name: 'Rohan Gupta',   role: 'DevOps Engineer', avatar: 'RG', color: '#FDC449', online: false, unread: 1, lastMsg: 'Pipeline is running. I\'ll share the logs.',      lastTime: 'Yesterday' },
  { id: 4, name: 'Divya Nair',    role: 'Content Writer',  avatar: 'DN', color: '#64FFDA', online: false, unread: 0, lastMsg: 'Blog drafts are in Google Drive.',                lastTime: 'Mon'       },
];

const INIT_DM_MESSAGES = {
  1: [
    { id: 1, sender: 'Arjun Sharma',  avatar: 'AS', color: '#1A9FE0', text: 'Hi! Dashboard layout is complete. Shall I push it to staging?', time: '10:05 AM', self: false },
    { id: 2, sender: 'You',           avatar: 'CL', color: '#1A9FE0', text: 'Yes please! Also can you check the mobile responsiveness?',        time: '10:10 AM', self: true  },
    { id: 3, sender: 'Arjun Sharma',  avatar: 'AS', color: '#1A9FE0', text: 'Sure! I\'ll have the update ready by tomorrow.',                  time: '10:17 AM', self: false },
  ],
  2: [
    { id: 1, sender: 'Priya Menon',   avatar: 'PM', color: '#32DCFD', text: 'I\'ve finished the UI mockups for the homepage.',                  time: '9:30 AM',  self: false },
    { id: 2, sender: 'You',           avatar: 'CL', color: '#1A9FE0', text: 'They look great! Can you also do the checkout flow?',               time: '9:40 AM',  self: true  },
    { id: 3, sender: 'Priya Menon',   avatar: 'PM', color: '#32DCFD', text: 'The mockups are ready for review 🎨',                              time: '9:45 AM',  self: false },
  ],
  3: [
    { id: 1, sender: 'Rohan Gupta',   avatar: 'RG', color: '#FDC449', text: 'CI/CD pipeline is configured on GitHub Actions.',                  time: 'Yesterday', self: false },
    { id: 2, sender: 'You',           avatar: 'CL', color: '#1A9FE0', text: 'Perfect! When will the Docker containers be ready?',               time: 'Yesterday', self: true  },
    { id: 3, sender: 'Rohan Gupta',   avatar: 'RG', color: '#FDC449', text: 'Pipeline is running. I\'ll share the logs.',                      time: 'Yesterday', self: false },
  ],
  4: [
    { id: 1, sender: 'Divya Nair',    avatar: 'DN', color: '#64FFDA', text: 'Blog drafts are in Google Drive.',                                  time: 'Mon',       self: false },
  ],
};

const INIT_GROUPS = [
  { id: 'g1', name: 'E-Commerce Project',   project: 'E-Commerce Redesign', avatar: 'E', color: '#1A9FE0', unread: 2, online: 3 },
  { id: 'g2', name: 'Mobile App Team',      project: 'Mobile App UI',       avatar: 'M', color: '#32DCFD', unread: 0, online: 2 },
  { id: 'g3', name: 'DevOps Coordination',  project: 'CI/CD Pipeline',      avatar: 'D', color: '#FDC449', unread: 1, online: 1 },
];

const INIT_GROUP_MEMBERS = {
  g1: [
    { name: 'You (Client)',  role: 'Client',       online: true,  avatar: 'CL', color: '#1A9FE0' },
    { name: 'Arjun Sharma',  role: 'Full Stack Dev',online: true,  avatar: 'AS', color: '#1A9FE0' },
    { name: 'Priya Menon',   role: 'UI Designer',   online: true,  avatar: 'PM', color: '#32DCFD' },
    { name: 'Rohan Gupta',   role: 'Backend Dev',   online: false, avatar: 'RG', color: '#FDC449' },
  ],
  g2: [
    { name: 'You (Client)',  role: 'Client',       online: true,  avatar: 'CL', color: '#1A9FE0' },
    { name: 'Priya Menon',   role: 'UI Designer',   online: true,  avatar: 'PM', color: '#32DCFD' },
    { name: 'Divya Nair',    role: 'Content',       online: false, avatar: 'DN', color: '#64FFDA' },
  ],
  g3: [
    { name: 'You (Client)',  role: 'Client',       online: true,  avatar: 'CL', color: '#1A9FE0' },
    { name: 'Rohan Gupta',   role: 'DevOps',        online: true,  avatar: 'RG', color: '#FDC449' },
    { name: 'Arjun Sharma',  role: 'Full Stack Dev',online: false, avatar: 'AS', color: '#1A9FE0' },
  ],
};

const INIT_GROUP_MESSAGES = {
  g1: [
    { id: 1, sender: 'Arjun Sharma', avatar: 'AS', color: '#1A9FE0', text: 'Homepage layout pushed to staging ✅',             time: '10:00 AM', self: false },
    { id: 2, sender: 'Priya Menon',  avatar: 'PM', color: '#32DCFD', text: 'Design review done. Looks clean! 🎨',              time: '10:05 AM', self: false },
    { id: 3, sender: 'You (Client)', avatar: 'CL', color: '#1A9FE0', text: 'Great progress team! Let\'s target launch by EOW.', time: '10:12 AM', self: true  },
  ],
  g2: [
    { id: 1, sender: 'Priya Menon',  avatar: 'PM', color: '#32DCFD', text: 'Mobile mockups are ready for your review.',        time: '9:00 AM', self: false },
  ],
  g3: [
    { id: 1, sender: 'Rohan Gupta',  avatar: 'RG', color: '#FDC449', text: 'Pipeline configured. Running first build now.',    time: 'Yesterday', self: false },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────
function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function randomColor(name) { let h = 0; for (let i = 0; i < name.length; i++) h += name.charCodeAt(i); return AVATAR_COLORS[h % AVATAR_COLORS.length]; }
function initials(name = '') { return name.trim().split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?'; }

// ─── Avatar ──────────────────────────────────────────────────
function Avatar({ letter, color, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: color + '28', border: `2px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.34, fontWeight: 700, color }}>{letter}</div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function ClientMessages() {
  const [tab, setTab]             = useState('private'); // 'private' | 'group'

  // DM state
  const [dmContacts, setDmContacts]   = useState(INIT_DM_CONTACTS);
  const [dmMessages, setDmMessages]   = useState(INIT_DM_MESSAGES);
  const [activeDmId, setActiveDmId]   = useState(1);

  // Group state
  const [groups, setGroups]           = useState(INIT_GROUPS);
  const [groupMembers, setGroupMembers] = useState(INIT_GROUP_MEMBERS);
  const [groupMessages, setGroupMessages] = useState(INIT_GROUP_MESSAGES);
  const [activeGroupId, setActiveGroupId] = useState('g1');
  const [showMembers, setShowMembers] = useState(true);

  // Shared
  const [input, setInput]   = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);

  // Modals
  const [modal, setModal]   = useState(null); // 'create-group' | 'add-member'
  const [cgForm, setCgForm] = useState({ name: '', project: '' });
  const [amForm, setAmForm] = useState({ name: '', role: '' });
  const [cgErr, setCgErr]   = useState('');
  const [amErr, setAmErr]   = useState('');

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [dmMessages, groupMessages, activeDmId, activeGroupId]);

  // ── DM handlers ──────────────────────────────────────────
  const switchDm = (id) => {
    setActiveDmId(id);
    setDmContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setInput(''); setTyping(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendDm = () => {
    const text = input.trim(); if (!text) return;
    const msg = { id: Date.now(), sender: 'You', avatar: 'CL', color: '#1A9FE0', text, time: now(), self: true };
    setDmMessages(prev => ({ ...prev, [activeDmId]: [...(prev[activeDmId] || []), msg] }));
    setDmContacts(prev => prev.map(c => c.id === activeDmId ? { ...c, lastMsg: text, lastTime: now() } : c));
    setInput(''); setTyping(false); clearTimeout(typingTimer.current);
    const contact = dmContacts.find(c => c.id === activeDmId);
    if (contact?.online) {
      setTimeout(() => {
        const replies = ['Got it! 👍', 'Sure, on it!', 'Thanks for the update!', 'Will do! 🙌', 'Understood, let me check.'];
        const reply = { id: Date.now() + 1, sender: contact.name, avatar: contact.avatar, color: contact.color, text: replies[Math.floor(Math.random() * replies.length)], time: now(), self: false };
        setDmMessages(prev => ({ ...prev, [activeDmId]: [...(prev[activeDmId] || []), reply] }));
        setDmContacts(prev => prev.map(c => c.id === activeDmId ? { ...c, lastMsg: reply.text, lastTime: now() } : c));
      }, 1400);
    }
  };

  // ── Group handlers ────────────────────────────────────────
  const switchGroup = (id) => {
    setActiveGroupId(id);
    setGroups(prev => prev.map(g => g.id === id ? { ...g, unread: 0 } : g));
    setInput(''); setTyping(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendGroup = () => {
    const text = input.trim(); if (!text) return;
    const msg = { id: Date.now(), sender: 'You (Client)', avatar: 'CL', color: '#1A9FE0', text, time: now(), self: true };
    setGroupMessages(prev => ({ ...prev, [activeGroupId]: [...(prev[activeGroupId] || []), msg] }));
    setInput(''); setTyping(false); clearTimeout(typingTimer.current);
    const mems = (groupMembers[activeGroupId] || []).filter(m => m.name !== 'You (Client)' && m.online);
    if (mems.length) {
      const mem = mems[Math.floor(Math.random() * mems.length)];
      setTimeout(() => {
        const replies = ['Got it! 👍', 'On it!', 'Thanks!', 'Understood 🙌', 'Will update soon.'];
        const reply = { id: Date.now() + 1, sender: mem.name, avatar: mem.avatar, color: mem.color, text: replies[Math.floor(Math.random() * replies.length)], time: now(), self: false };
        setGroupMessages(prev => ({ ...prev, [activeGroupId]: [...(prev[activeGroupId] || []), reply] }));
      }, 1400);
    }
  };

  const handleSend = () => tab === 'private' ? sendDm() : sendGroup();
  const handleKey  = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleInput = (e) => { setInput(e.target.value); setTyping(true); clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setTyping(false), 1500); };

  const handleCreateGroup = () => {
    if (!cgForm.name.trim()) { setCgErr('Group name required.'); return; }
    if (!cgForm.project.trim()) { setCgErr('Project name required.'); return; }
    const id = 'g' + Date.now();
    const color = randomColor(cgForm.name);
    setGroups(prev => [...prev, { id, name: cgForm.name.trim(), project: cgForm.project.trim(), avatar: cgForm.name[0].toUpperCase(), color, unread: 0, online: 1 }]);
    setGroupMembers(prev => ({ ...prev, [id]: [{ name: 'You (Client)', role: 'Client', online: true, avatar: 'CL', color: '#1A9FE0' }] }));
    setGroupMessages(prev => ({ ...prev, [id]: [] }));
    setCgForm({ name: '', project: '' }); setCgErr(''); setModal(null);
    switchGroup(id);
  };

  const handleAddMember = () => {
    if (!amForm.name.trim()) { setAmErr('Name required.'); return; }
    if (!amForm.role.trim()) { setAmErr('Role required.'); return; }
    const curMems = groupMembers[activeGroupId] || [];
    if (curMems.some(m => m.name.toLowerCase() === amForm.name.trim().toLowerCase())) { setAmErr('Already in group.'); return; }
    const color = randomColor(amForm.name);
    setGroupMembers(prev => ({ ...prev, [activeGroupId]: [...curMems, { name: amForm.name.trim(), role: amForm.role.trim(), online: false, avatar: initials(amForm.name), color }] }));
    setAmForm({ name: '', role: '' }); setAmErr(''); setModal(null);
  };

  const removeMember = (idx) => setGroupMembers(prev => ({ ...prev, [activeGroupId]: prev[activeGroupId].filter((_, i) => i !== idx) }));
  const leaveGroup   = () => { if (groups.length <= 1) return; const rest = groups.filter(g => g.id !== activeGroupId); setGroups(rest); switchGroup(rest[0].id); };

  // ── Active data ────────────────────────────────────────────
  const activeDm     = dmContacts.find(c => c.id === activeDmId) || dmContacts[0];
  const activeGroup  = groups.find(g => g.id === activeGroupId) || groups[0];
  const curDmMsgs    = dmMessages[activeDmId] || [];
  const curGroupMsgs = groupMessages[activeGroupId] || [];
  const curMembers   = groupMembers[activeGroupId] || [];

  const filteredDm    = dmContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.project.toLowerCase().includes(search.toLowerCase()));

  const totalDmUnread    = dmContacts.reduce((a, c) => a + c.unread, 0);
  const totalGroupUnread = groups.reduce((a, g) => a + g.unread, 0);

  // ── Shared message list renderer ──────────────────────────
  const MessageList = ({ messages }) => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {messages.length === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', gap: 8, paddingTop: 80 }}>
          <div style={{ fontSize: 40 }}>💬</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>No messages yet</p>
          <p style={{ fontSize: 12, margin: 0 }}>Say hello!</p>
        </div>
      )}
      {messages.map(msg => (
        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.self ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
          {!msg.self && <Avatar letter={msg.avatar} color={msg.color} size={32} />}
          <div style={{ maxWidth: '62%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: msg.self ? 'flex-end' : 'flex-start' }}>
            {!msg.self && <span style={{ fontSize: 11, fontWeight: 600, color: msg.color, paddingLeft: 2 }}>{msg.sender}</span>}
            <div style={{ background: msg.self ? 'var(--gradient-blue)' : 'var(--color-bg-secondary)', color: '#fff', borderRadius: msg.self ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13.5, lineHeight: 1.5, border: msg.self ? 'none' : '1px solid var(--color-border)', wordBreak: 'break-word' }}>{msg.text}</div>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', paddingLeft: 2 }}>{msg.time}</span>
          </div>
          {msg.self && <Avatar letter={msg.avatar} color={msg.color} size={32} />}
        </div>
      ))}
      {typing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 40 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', animation: `cm-bounce 1s ease-in-out ${i*0.18}s infinite` }} />)}
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>typing...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );

  // ── Input bar ─────────────────────────────────────────────
  const InputBar = ({ placeholder }) => (
    <div style={{ padding: '12px 18px', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 12, padding: '8px 12px' }}>
        <label style={{ cursor: 'pointer', fontSize: 17, color: 'var(--color-text-muted)', flexShrink: 0 }}>
          📎<input type="file" style={{ display: 'none' }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const msg = { id: Date.now(), sender: tab === 'private' ? 'You' : 'You (Client)', avatar: 'CL', color: '#1A9FE0', text: `📎 ${file.name}`, time: now(), self: true }; if (tab === 'private') { setDmMessages(prev => ({ ...prev, [activeDmId]: [...(prev[activeDmId]||[]), msg] })); } else { setGroupMessages(prev => ({ ...prev, [activeGroupId]: [...(prev[activeGroupId]||[]), msg] })); } e.target.value = ''; }} />
        </label>
        <input ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKey} placeholder={placeholder} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--color-text)', fontSize: 14, fontFamily: 'var(--font-family)' }} />
        <button onClick={handleSend} disabled={!input.trim()} style={{ background: input.trim() ? 'var(--gradient-blue)' : 'var(--color-bg-hover)', color: input.trim() ? '#fff' : 'var(--color-text-muted)', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all .2s', flexShrink: 0 }}>Send ➤</button>
      </div>
    </div>
  );

  return (
    <ClientLayout pageTitle="Messages" pageSubtitle="Private & group conversations">
      <style>{`
        @keyframes cm-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--color-border);border-radius:4px}
        .cm-tab-btn { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-family); border: 1px solid var(--color-border); transition: all 150ms; }
        .cm-tab-btn.active { background: var(--gradient-blue); border-color: transparent; color: #fff; box-shadow: var(--shadow-btn); }
        .cm-tab-btn:not(.active) { background: var(--color-bg-card); color: var(--color-text-secondary); }
      `}</style>

      <div style={{ height: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className={`cm-tab-btn${tab === 'private' ? ' active' : ''}`} onClick={() => { setTab('private'); setInput(''); setTyping(false); }}>
            💬 Private {totalDmUnread > 0 && <span style={{ marginLeft: 4, background: '#FF5370', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 5px' }}>{totalDmUnread}</span>}
          </button>
          <button className={`cm-tab-btn${tab === 'group' ? ' active' : ''}`} onClick={() => { setTab('group'); setInput(''); setTyping(false); }}>
            👥 Group Chats {totalGroupUnread > 0 && <span style={{ marginLeft: 4, background: '#FF5370', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 5px' }}>{totalGroupUnread}</span>}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ═══ PRIVATE TAB ═══ */}
          {tab === 'private' && (
            <>
              {/* Contact list */}
              <div style={{ width: 270, flexShrink: 0, background: 'var(--color-bg-card)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-text-muted)', pointerEvents: 'none' }}>🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." style={{ width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '7px 10px 7px 28px', color: 'var(--color-text)', fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)' }} />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {filteredDm.map(c => (
                    <div key={c.id} onClick={() => switchDm(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeDmId === c.id ? 'rgba(26,159,224,.10)' : 'transparent', border: activeDmId === c.id ? '1.5px solid rgba(26,159,224,.25)' : '1.5px solid transparent', transition: 'all .15s' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar letter={c.avatar} color={c.color} size={40} />
                        <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: c.online ? '#64FFDA' : '#556080', border: '2px solid var(--color-bg-card)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>{c.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{c.lastTime}</span>
                            {c.unread > 0 && <span style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: 999, fontSize: 9, fontWeight: 700, padding: '1px 5px', flexShrink: 0 }}>{c.unread}</span>}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{c.role} · {c.lastMsg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DM Chat area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar letter={activeDm.avatar} color={activeDm.color} size={38} />
                    <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: activeDm.online ? '#64FFDA' : '#556080', border: '2px solid var(--color-bg-card)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{activeDm.name}</p>
                    <p style={{ fontSize: 11, color: activeDm.online ? '#64FFDA' : 'var(--color-text-muted)', margin: 0 }}>{activeDm.online ? '🟢 Online' : '⚫ Offline'} · {activeDm.role}</p>
                  </div>
                </div>
                <MessageList messages={curDmMsgs} />
                <InputBar placeholder={`Message ${activeDm.name}...`} />
              </div>
            </>
          )}

          {/* ═══ GROUP TAB ═══ */}
          {tab === 'group' && (
            <>
              {/* Group list */}
              <div style={{ width: 270, flexShrink: 0, background: 'var(--color-bg-card)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>Group Chats</span>
                    <button onClick={() => { setCgForm({ name: '', project: '' }); setCgErr(''); setModal('create-group'); }} style={{ background: 'var(--gradient-blue)', border: 'none', color: '#fff', borderRadius: 8, width: 26, height: 26, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-text-muted)', pointerEvents: 'none' }}>🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search groups..." style={{ width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '7px 10px 7px 28px', color: 'var(--color-text)', fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)' }} />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {filteredGroups.map(g => (
                    <div key={g.id} onClick={() => switchGroup(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeGroupId === g.id ? 'rgba(26,159,224,.10)' : 'transparent', border: activeGroupId === g.id ? '1.5px solid rgba(26,159,224,.25)' : '1.5px solid transparent', transition: 'all .15s' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: g.color + '28', border: `2px solid ${g.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: g.color }}>{g.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>{g.name}</span>
                          {g.unread > 0 && <span style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: 999, fontSize: 9, fontWeight: 700, padding: '1px 5px' }}>{g.unread}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>👥 {(groupMembers[g.id]||[]).length} · 🟢 {g.online} online</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group chat area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: activeGroup.color + '28', border: `2px solid ${activeGroup.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: activeGroup.color }}>{activeGroup.avatar}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{activeGroup.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{curMembers.length} members · {activeGroup.online} online · {activeGroup.project}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={leaveGroup} disabled={groups.length <= 1} style={{ background: 'rgba(255,83,112,.10)', color: '#FF5370', border: '1px solid rgba(255,83,112,.2)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: groups.length > 1 ? 'pointer' : 'not-allowed', opacity: groups.length > 1 ? 1 : 0.4, fontFamily: 'var(--font-family)' }}>Leave</button>
                    <button onClick={() => setShowMembers(v => !v)} style={{ background: showMembers ? 'rgba(26,159,224,.12)' : 'var(--color-bg-input)', border: `1px solid ${showMembers ? 'rgba(26,159,224,.3)' : 'var(--color-border)'}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: showMembers ? 'var(--color-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>👥 Members</button>
                  </div>
                </div>
                <MessageList messages={curGroupMsgs} />
                <InputBar placeholder={`Message ${activeGroup.name}...`} />
              </div>

              {/* Members panel */}
              {showMembers && (
                <div style={{ width: 210, flexShrink: 0, background: 'var(--color-bg-card)', borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Members ({curMembers.length})</p>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {curMembers.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, marginBottom: 2, position: 'relative' }}
                        onMouseEnter={e => e.currentTarget.querySelector('.rm-btn') && (e.currentTarget.querySelector('.rm-btn').style.opacity = '1')}
                        onMouseLeave={e => e.currentTarget.querySelector('.rm-btn') && (e.currentTarget.querySelector('.rm-btn').style.opacity = '0')}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <Avatar letter={m.avatar} color={m.color} size={30} />
                          <span style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: m.online ? '#64FFDA' : '#556080', border: '2px solid var(--color-bg-card)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                          <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>{m.role}</p>
                        </div>
                        {m.name !== 'You (Client)' && (
                          <button className="rm-btn" onClick={() => removeMember(i)} style={{ background: 'rgba(255,83,112,.15)', color: '#FF5370', border: 'none', borderRadius: 4, width: 18, height: 18, fontSize: 9, cursor: 'pointer', flexShrink: 0, opacity: 0, transition: 'opacity .15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px', borderTop: '1px solid var(--color-border)' }}>
                    <button onClick={() => { setAmForm({ name: '', role: '' }); setAmErr(''); setModal('add-member'); }} style={{ width: '100%', background: 'rgba(26,159,224,.08)', color: 'var(--color-primary)', border: '1.5px dashed rgba(26,159,224,.3)', borderRadius: 8, padding: '7px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>+ Add Member</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── CREATE GROUP MODAL ── */}
      {modal === 'create-group' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Create Group</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cgErr && <div style={{ background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.3)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-danger)', fontSize: 12 }}>{cgErr}</div>}
              {[{ label: 'Group Name *', key: 'name', ph: 'e.g. E-Commerce Team' }, { label: 'Project *', key: 'project', ph: 'e.g. E-Commerce Redesign' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input value={cgForm[f.key]} onChange={e => { setCgForm(p => ({ ...p, [f.key]: e.target.value })); setCgErr(''); }} placeholder={f.ph} style={{ width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
              <button onClick={() => setModal(null)} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
              <button onClick={handleCreateGroup} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Create Group</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEMBER MODAL ── */}
      {modal === 'add-member' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Add Member</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {amErr && <div style={{ background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.3)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-danger)', fontSize: 12 }}>{amErr}</div>}
              {[{ label: 'Name *', key: 'name', ph: 'e.g. John Doe' }, { label: 'Role *', key: 'role', ph: 'e.g. Designer' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input value={amForm[f.key]} onChange={e => { setAmForm(p => ({ ...p, [f.key]: e.target.value })); setAmErr(''); }} placeholder={f.ph} style={{ width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
              <button onClick={() => setModal(null)} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
              <button onClick={handleAddMember} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
