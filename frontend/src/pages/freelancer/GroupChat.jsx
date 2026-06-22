import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  });
  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#1A9FE0","#F5A623","#64FFDA","#FF5370","#9B59B6","#2ECC71","#E74C3C","#3498DB"];

const initGroups = [
  { id:1, name:"SkillAsAService Team",  project:"SkillAsAService",    avatar:"S", color:"#1A9FE0", unread:3, online:4 },
  { id:2, name:"E-Commerce Redesign",   project:"E-Commerce Redesign", avatar:"E", color:"#F5A623", unread:0, online:2 },
  { id:3, name:"DevOps Setup Group",    project:"DevOps Setup",        avatar:"D", color:"#64FFDA", unread:1, online:1 },
  { id:4, name:"UI/UX Design Squad",    project:"Design Sprint",       avatar:"U", color:"#FF5370", unread:0, online:3 },
];

const initMembers = {
  1:[
    { name:"Lohith S.",       role:"Frontend Dev", online:true,  avatar:"L", color:"#1A9FE0" },
    { name:"Praveen G.",      role:"Frontend Dev", online:true,  avatar:"P", color:"#64FFDA" },
    { name:"Rohan K.",        role:"Backend Dev",  online:true,  avatar:"R", color:"#F5A623" },
    { name:"Project Manager", role:"PM",           online:false, avatar:"M", color:"#FF5370" },
    { name:"Client A",        role:"Client",       online:true,  avatar:"C", color:"#9B59B6" },
  ],
  2:[
    { name:"Client A",   role:"Client",       online:true,  avatar:"C", color:"#FF5370" },
    { name:"Praveen G.", role:"Frontend Dev", online:true,  avatar:"P", color:"#64FFDA" },
    { name:"Designer X", role:"UI Designer",  online:false, avatar:"D", color:"#F5A623" },
  ],
  3:[
    { name:"Rohan K.",    role:"Backend Dev",  online:true,  avatar:"R", color:"#F5A623" },
    { name:"Lohith S.",   role:"Frontend Dev", online:false, avatar:"L", color:"#1A9FE0" },
    { name:"Praveen G.",  role:"Frontend Dev", online:true,  avatar:"P", color:"#64FFDA" },
    { name:"DevOps Lead", role:"DevOps",       online:false, avatar:"O", color:"#2ECC71" },
  ],
  4:[
    { name:"Praveen G.",   role:"Frontend Dev", online:true,  avatar:"P", color:"#64FFDA" },
    { name:"Designer X",   role:"UI Designer",  online:true,  avatar:"D", color:"#FF5370" },
    { name:"Designer Y",   role:"UX Designer",  online:false, avatar:"Y", color:"#9B59B6" },
    { name:"Lohith S.",    role:"Frontend Dev", online:true,  avatar:"L", color:"#1A9FE0" },
    { name:"Client B",     role:"Client",       online:false, avatar:"B", color:"#E74C3C" },
    { name:"Art Director", role:"Art Director", online:true,  avatar:"A", color:"#3498DB" },
  ],
};

const initMessages = {
  1:[
    { id:1, sender:"Lohith S.",  avatar:"L", color:"#1A9FE0", text:"Hey team! Dashboard layout is done 🎉",                   time:"10:05 AM", self:false },
    { id:2, sender:"Rohan K.",   avatar:"R", color:"#F5A623", text:"Great! Auth APIs are also ready. Let's integrate tomorrow.", time:"10:08 AM", self:false },
    { id:3, sender:"You",        avatar:"P", color:"#64FFDA", text:"Awesome! Task Management UI is complete on my end 👍",     time:"10:12 AM", self:true  },
    { id:4, sender:"Lohith S.",  avatar:"L", color:"#1A9FE0", text:"Praveen can you also check the subscription purchase flow?", time:"10:15 AM", self:false },
    { id:5, sender:"You",        avatar:"P", color:"#64FFDA", text:"Sure! Group Chat UI is next on my list 💪",               time:"10:17 AM", self:true  },
  ],
  2:[
    { id:1, sender:"Client A", avatar:"C", color:"#FF5370", text:"Can we update the hero section design?",    time:"9:00 AM", self:false },
    { id:2, sender:"You",      avatar:"P", color:"#64FFDA", text:"Yes, I'll send revised mockups by EOD.",    time:"9:30 AM", self:true  },
  ],
  3:[
    { id:1, sender:"Rohan K.", avatar:"R", color:"#F5A623", text:"CI/CD pipeline configured on GitHub Actions.", time:"Yesterday", self:false },
    { id:2, sender:"You",      avatar:"P", color:"#64FFDA", text:"Perfect! Docker containers are ready too.",   time:"Yesterday", self:true  },
  ],
  4:[],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function nowTime() { return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}); }
function initials(name="") { return name.trim().charAt(0).toUpperCase() || "?"; }
function randomColor(name) {
  let h=0; for(let i=0;i<name.length;i++) h+=name.charCodeAt(i);
  return AVATAR_COLORS[h%AVATAR_COLORS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ letter, color, size=36, radius="50%" }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:radius, flexShrink:0,
      background:color+"28", border:`2px solid ${color}50`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.36, fontWeight:700, color,
    }}>{letter}</div>
  );
}

function Modal({ title, onClose, children, footer }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.76)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:"16px",
    }}>
      <div style={{
        background:"var(--color-bg-card)", border:"1px solid var(--color-border)",
        borderRadius:"var(--radius-lg)", padding:"24px",
        width:"100%", maxWidth:420, boxShadow:"0 24px 48px rgba(0,0,0,.5)",
        maxHeight:"calc(100vh - 40px)", overflowY:"auto",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{fontSize:16,fontWeight:700,color:"var(--color-text)",margin:0}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--color-text-muted)",fontSize:20,cursor:"pointer",lineHeight:1,padding:"2px 6px"}}>✕</button>
        </div>
        {children}
        {footer && <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20,flexWrap:"wrap"}}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{fontSize:12,fontWeight:600,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>{label}</label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type="text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{width:"100%",background:"var(--color-bg-input)",border:"1.5px solid var(--color-border)",
        borderRadius:"var(--radius-sm)",padding:"9px 12px",color:"var(--color-text)",
        fontSize:13,outline:"none",boxSizing:"border-box"}}
    />
  );
}

function Btn({ children, onClick, variant="primary", disabled }) {
  const s = {
    primary:   {background:"var(--gradient-blue)",color:"#fff",border:"none"},
    secondary: {background:"var(--color-bg-input)",color:"var(--color-text)",border:"1.5px solid var(--color-border)"},
    danger:    {background:"rgba(255,83,112,.12)",color:"#FF5370",border:"1.5px solid rgba(255,83,112,.25)"},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{...s[variant],borderRadius:"var(--radius-sm)",padding:"9px 18px",
        fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?.5:1,transition:"all .2s",whiteSpace:"nowrap"}}>
      {children}
    </button>
  );
}

// ─── LEFT SIDEBAR (Group List) ────────────────────────────────────────────────
function GroupSidebar({ groups, members, filteredGroups, activeId, search, onSearch, onSwitch, onCreateGroup }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100%",
      background:"var(--color-bg-card)",
      borderRight:"1px solid var(--color-border)",
    }}>
      {/* Header */}
      <div style={{padding:"16px 14px 12px",borderBottom:"1px solid var(--color-border)",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h2 style={{fontSize:15,fontWeight:700,color:"var(--color-text)",margin:0}}>Group Chats</h2>
          <button onClick={onCreateGroup} title="Create new group"
            style={{background:"var(--gradient-blue)",border:"none",color:"#fff",
              borderRadius:"var(--radius-sm)",width:30,height:30,fontSize:20,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              lineHeight:1,flexShrink:0}}>+</button>
        </div>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--color-text-muted)",pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search groups..."
            style={{width:"100%",background:"var(--color-bg-input)",border:"1.5px solid var(--color-border)",
              borderRadius:"var(--radius-sm)",padding:"7px 10px 7px 30px",color:"var(--color-text)",
              fontSize:12,outline:"none",boxSizing:"border-box"}}
          />
        </div>
      </div>

      {/* Group List */}
      <div style={{flex:1,overflowY:"auto",padding:"6px 8px"}}>
        {filteredGroups.length===0 && (
          <p style={{textAlign:"center",color:"var(--color-text-muted)",fontSize:12,marginTop:24}}>No groups found</p>
        )}
        {filteredGroups.map(g => (
          <div key={g.id} onClick={()=>onSwitch(g.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px",
              borderRadius:"var(--radius-sm)",cursor:"pointer",marginBottom:2,
              background:activeId===g.id?"rgba(26,159,224,.10)":"transparent",
              border:activeId===g.id?"1.5px solid rgba(26,159,224,.25)":"1.5px solid transparent",
              transition:"all .15s"}}>
            <Avatar letter={g.avatar} color={g.color} size={42} radius="var(--radius-sm)" />
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:4}}>
                <span style={{fontSize:13,fontWeight:600,color:"var(--color-text)",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.name}</span>
                {g.unread>0 && (
                  <span style={{background:"var(--color-primary)",color:"#fff",borderRadius:"var(--radius-full)",
                    fontSize:10,fontWeight:700,padding:"1px 6px",flexShrink:0}}>{g.unread}</span>
                )}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
                <span style={{fontSize:11,color:"var(--color-text-muted)"}}>
                  👥 {(members[g.id]||[]).length} members
                </span>
                <span style={{width:3,height:3,borderRadius:"50%",background:"#64FFDA",flexShrink:0}}/>
                <span style={{fontSize:11,color:"#64FFDA"}}>{g.online} online</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RIGHT MEMBERS PANEL ──────────────────────────────────────────────────────
function MembersPanel({ members, onRemove, onAddMember, onClose, isMobile }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100%",
      background:"var(--color-bg-card)",
      borderLeft: isMobile ? "none" : "1px solid var(--color-border)",
    }}>
      <div style={{padding:"14px 12px 10px",borderBottom:"1px solid var(--color-border)",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <p style={{fontSize:13,fontWeight:700,color:"var(--color-text)",margin:0}}>
          Members ({members.length})
        </p>
        {/* Show close button on tablet/mobile */}
        {onClose && (
          <button onClick={onClose}
            style={{background:"none",border:"none",color:"var(--color-text-muted)",
              fontSize:18,cursor:"pointer",padding:"2px 4px"}}>✕</button>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
        {members.length===0 && (
          <p style={{fontSize:12,color:"var(--color-text-muted)",textAlign:"center",marginTop:16}}>No members yet</p>
        )}
        {members.map((m,i) => (
          <div key={i}
            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",
              borderRadius:"var(--radius-sm)",marginBottom:2,position:"relative"}}
            onMouseEnter={e=>{const b=e.currentTarget.querySelector(".rm-btn");if(b)b.style.opacity="1"}}
            onMouseLeave={e=>{const b=e.currentTarget.querySelector(".rm-btn");if(b)b.style.opacity="0"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <Avatar letter={m.avatar} color={m.color} size={32} />
              <span style={{position:"absolute",bottom:0,right:0,width:8,height:8,borderRadius:"50%",
                background:m.online?"#64FFDA":"#556080",border:"2px solid var(--color-bg-card)"}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:12,fontWeight:600,color:"var(--color-text)",margin:0,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</p>
              <p style={{fontSize:10,color:"var(--color-text-muted)",margin:0}}>{m.role}</p>
            </div>
            <button className="rm-btn" onClick={()=>onRemove(i)} title="Remove member"
              style={{background:"rgba(255,83,112,.15)",color:"#FF5370",border:"none",
                borderRadius:4,width:20,height:20,fontSize:10,cursor:"pointer",
                flexShrink:0,opacity:0,transition:"opacity .15s",
                display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        ))}
      </div>

      <div style={{padding:"10px",borderTop:"1px solid var(--color-border)",flexShrink:0}}>
        <button onClick={onAddMember}
          style={{width:"100%",background:"rgba(26,159,224,.08)",color:"var(--color-primary)",
            border:"1.5px dashed rgba(26,159,224,.3)",borderRadius:"var(--radius-sm)",
            padding:"7px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
          + Add Member
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GroupChat() {
  const bp = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  // On mobile: "list" | "chat" | "members"
  const [mobileView, setMobileView] = useState("list");

  const [groups,   setGroups]   = useState(initGroups);
  const [members,  setMembers]  = useState(initMembers);
  const [messages, setMessages] = useState(initMessages);
  const [activeId, setActiveId] = useState(1);
  const [input,    setInput]    = useState("");
  const [search,   setSearch]   = useState("");
  const [typing,   setTyping]   = useState(false);
  // Members panel visible on tablet/desktop
  const [showMembers, setShowMembers] = useState(isDesktop);

  const [modal,   setModal]   = useState(null); // 'create-group'|'add-member'|'emoji'
  const [cgForm,  setCgForm]  = useState({ name:"", project:"", description:"" });
  const [cgError, setCgError] = useState("");
  const [amForm,  setAmForm]  = useState({ name:"", role:"" });
  const [amError, setAmError] = useState("");

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const typingTimer = useRef(null);

  const activeGroup    = groups.find(g=>g.id===activeId) || groups[0];
  const currentMsgs    = messages[activeId]  || [];
  const currentMembers = members[activeId]   || [];
  const filteredGroups = groups.filter(g=>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.project.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, activeId]);

  // Reset panel visibility when breakpoint changes
  useEffect(() => {
    if (isDesktop) setShowMembers(true);
    else setShowMembers(false);
  }, [isDesktop]);

  function switchGroup(id) {
    setActiveId(id);
    setGroups(prev=>prev.map(g=>g.id===id?{...g,unread:0}:g));
    setInput("");
    setTyping(false);
    if (isMobile) setMobileView("chat");
    setTimeout(()=>inputRef.current?.focus(),100);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const msg = { id:Date.now(), sender:"You", avatar:"P", color:"#64FFDA", text, time:nowTime(), self:true };
    setMessages(prev=>({...prev,[activeId]:[...(prev[activeId]||[]),msg]}));
    setInput("");
    setTyping(false);
    clearTimeout(typingTimer.current);
    // Simulated reply
    const mem = (members[activeId]||[]).find(m=>m.name!=="You"&&m.online);
    if (mem) {
      setTimeout(()=>{
        const replies=["Got it! 👍","Sure, I'll look into that.","Thanks for the update!","On it! Will update soon.","Sounds good to me 🙌","Let me check and get back to you."];
        const reply = {
          id:Date.now()+1, sender:mem.name, avatar:mem.avatar, color:mem.color,
          text:replies[Math.floor(Math.random()*replies.length)], time:nowTime(), self:false,
        };
        setMessages(prev=>({...prev,[activeId]:[...(prev[activeId]||[]),reply]}));
      },1500);
    }
  }

  function handleKey(e) { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }
  function handleInput(e) {
    setInput(e.target.value);
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(()=>setTyping(false),1500);
  }

  function handleCreateGroup() {
    if (!cgForm.name.trim())    { setCgError("Group name is required.");    return; }
    if (!cgForm.project.trim()) { setCgError("Project name is required."); return; }
    const id    = Date.now();
    const color = randomColor(cgForm.name);
    const newGroup = { id, name:cgForm.name.trim(), project:cgForm.project.trim(),
      avatar:initials(cgForm.name), color, unread:0, online:1 };
    setGroups(prev=>[...prev,newGroup]);
    setMembers(prev=>({...prev,[id]:[{name:"You (Praveen G.)",role:"Admin",online:true,avatar:"P",color:"#64FFDA"}]}));
    setMessages(prev=>({...prev,[id]:[]}));
    setCgForm({name:"",project:"",description:""});
    setCgError("");
    setModal(null);
    switchGroup(id);
  }

  function handleAddMember() {
    if (!amForm.name.trim()) { setAmError("Member name is required."); return; }
    if (!amForm.role.trim()) { setAmError("Role is required.");         return; }
    if (currentMembers.some(m=>m.name.toLowerCase()===amForm.name.trim().toLowerCase())) {
      setAmError("This member is already in the group."); return;
    }
    const color = randomColor(amForm.name);
    const newMember = { name:amForm.name.trim(), role:amForm.role.trim(), online:false, avatar:initials(amForm.name), color };
    setMembers(prev=>({...prev,[activeId]:[...(prev[activeId]||[]),newMember]}));
    setAmForm({name:"",role:""});
    setAmError("");
    setModal(null);
  }

  function removeMember(idx) {
    setMembers(prev=>({...prev,[activeId]:prev[activeId].filter((_,i)=>i!==idx)}));
  }

  function leaveGroup() {
    if (groups.length===1) return;
    const remaining = groups.filter(g=>g.id!==activeId);
    setGroups(remaining);
    switchGroup(remaining[0].id);
  }

  const EMOJIS = ["😊","😂","❤️","👍","🔥","🎉","✅","🙌","💪","👏","🤔","😅","🚀","⭐","💡","🎯","📌","✨"];

  // ── Layout config per breakpoint ──────────────────────────────────────────
  // Desktop: sidebar(260) | chat(flex) | members(220) — always side by side
  // Tablet:  sidebar(220) | chat(flex) | members overlay (slide-in drawer on right)
  // Mobile:  full-screen panels: list → chat → members (one at a time)

  const SIDEBAR_W = isDesktop ? 260 : isTablet ? 220 : "100%";
  const MEMBERS_W = isDesktop ? 220 : isTablet ? 240 : "100%";

  // ─────────────────────────────────────────────────────────────────────────────
  // MOBILE: one full-screen panel at a time
  // ─────────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{height:"100dvh",display:"flex",flexDirection:"column",background:"var(--color-bg)",fontFamily:"var(--font-family)",overflow:"hidden"}}>

        {/* MOBILE — GROUP LIST */}
        {mobileView==="list" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <GroupSidebar
              groups={groups} members={members} filteredGroups={filteredGroups}
              activeId={activeId} search={search} onSearch={setSearch}
              onSwitch={switchGroup}
              onCreateGroup={()=>{setCgForm({name:"",project:"",description:""});setCgError("");setModal("create-group");}}
            />
          </div>
        )}

        {/* MOBILE — CHAT VIEW */}
        {mobileView==="chat" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Mobile chat header with back button */}
            <div style={{padding:"10px 14px",borderBottom:"1px solid var(--color-border)",
              background:"var(--color-bg-card)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
              <button onClick={()=>setMobileView("list")}
                style={{background:"none",border:"none",color:"var(--color-primary)",
                  fontSize:22,cursor:"pointer",padding:"2px 6px",lineHeight:1,flexShrink:0}}>‹</button>
              <Avatar letter={activeGroup.avatar} color={activeGroup.color} size={36} radius="var(--radius-sm)" />
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:14,fontWeight:700,color:"var(--color-text)",margin:0,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{activeGroup.name}</p>
                <p style={{fontSize:11,color:"var(--color-text-muted)",margin:0}}>
                  {currentMembers.length} members · {activeGroup.online} online
                </p>
              </div>
              <button onClick={()=>setMobileView("members")}
                style={{background:"rgba(26,159,224,.10)",color:"var(--color-primary)",
                  border:"1px solid rgba(26,159,224,.25)",borderRadius:"var(--radius-sm)",
                  padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>
                👥 {currentMembers.length}
              </button>
            </div>

            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
              {currentMsgs.length===0 && (
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  color:"var(--color-text-muted)",gap:8,paddingTop:60}}>
                  <div style={{fontSize:40}}>💬</div>
                  <p style={{fontSize:14,fontWeight:600,color:"var(--color-text-secondary)",margin:0}}>No messages yet</p>
                  <p style={{fontSize:12,margin:0}}>Be the first to say something!</p>
                </div>
              )}
              {currentMsgs.map(msg=>(
                <div key={msg.id} style={{display:"flex",justifyContent:msg.self?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
                  {!msg.self && <Avatar letter={msg.avatar} color={msg.color} size={28} />}
                  <div style={{maxWidth:"78%",display:"flex",flexDirection:"column",gap:3,alignItems:msg.self?"flex-end":"flex-start"}}>
                    {!msg.self && <span style={{fontSize:11,fontWeight:600,color:msg.color,paddingLeft:2}}>{msg.sender}</span>}
                    <div style={{
                      background:msg.self?"var(--gradient-blue)":"var(--color-bg-secondary)",
                      color:"#fff",borderRadius:msg.self?"16px 16px 4px 16px":"16px 16px 16px 4px",
                      padding:"9px 13px",fontSize:13,lineHeight:1.5,
                      border:msg.self?"none":"1px solid var(--color-border)",wordBreak:"break-word",
                    }}>{msg.text}</div>
                    <span style={{fontSize:10,color:"var(--color-text-muted)",paddingLeft:2}}>{msg.time}</span>
                  </div>
                  {msg.self && <Avatar letter={msg.avatar} color={msg.color} size={28} />}
                </div>
              ))}
              {typing && (
                <div style={{display:"flex",alignItems:"center",gap:6,paddingLeft:36}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--color-text-muted)",
                      animation:`bounce 1s ease-in-out ${i*0.18}s infinite`}}/>
                  ))}
                  <span style={{fontSize:11,color:"var(--color-text-muted)"}}>typing...</span>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Mobile input bar */}
            <div style={{padding:"10px 12px",borderTop:"1px solid var(--color-border)",
              background:"var(--color-bg-card)",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--color-bg-input)",
                border:"1.5px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"7px 10px"}}>
                <button onClick={()=>setModal("emoji")}
                  style={{background:"none",border:"none",fontSize:18,cursor:"pointer",
                    color:"var(--color-text-muted)",padding:"0 2px",flexShrink:0}}>😊</button>
                <label style={{cursor:"pointer",fontSize:17,color:"var(--color-text-muted)",flexShrink:0}}>
                  📎
                  <input type="file" style={{display:"none"}} onChange={e=>{
                    const file=e.target.files?.[0]; if(!file) return;
                    const msg={id:Date.now(),sender:"You",avatar:"P",color:"#64FFDA",text:`📎 ${file.name}`,time:nowTime(),self:true};
                    setMessages(prev=>({...prev,[activeId]:[...(prev[activeId]||[]),msg]}));
                    e.target.value="";
                  }}/>
                </label>
                <input ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKey}
                  placeholder={`Message...`}
                  style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--color-text)",fontSize:14,minWidth:0}}
                />
                <button onClick={sendMessage} disabled={!input.trim()}
                  style={{background:input.trim()?"var(--gradient-blue)":"var(--color-bg-hover)",
                    color:input.trim()?"#fff":"var(--color-text-muted)",border:"none",
                    borderRadius:"var(--radius-sm)",padding:"7px 12px",fontSize:13,fontWeight:600,
                    cursor:input.trim()?"pointer":"not-allowed",transition:"all .2s",flexShrink:0}}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE — MEMBERS VIEW */}
        {mobileView==="members" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Back header */}
            <div style={{padding:"10px 14px",borderBottom:"1px solid var(--color-border)",
              background:"var(--color-bg-card)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
              <button onClick={()=>setMobileView("chat")}
                style={{background:"none",border:"none",color:"var(--color-primary)",
                  fontSize:22,cursor:"pointer",padding:"2px 6px",lineHeight:1}}>‹</button>
              <span style={{fontSize:14,fontWeight:700,color:"var(--color-text)"}}>{activeGroup.name} — Members</span>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <MembersPanel
                members={currentMembers}
                onRemove={removeMember}
                onAddMember={()=>{setAmForm({name:"",role:""});setAmError("");setModal("add-member");}}
                onClose={null}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        {renderModals()}
        <style>{STYLES}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TABLET & DESKTOP: side-by-side layout
  // Members panel: always rendered on desktop, overlay drawer on tablet
  // ─────────────────────────────────────────────────────────────────────────────
  function renderModals() {
    return (
      <>
        {modal==="create-group" && (
          <Modal title="Create New Group" onClose={()=>setModal(null)}
            footer={[
              <Btn key="c" variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>,
              <Btn key="cr" onClick={handleCreateGroup}>Create Group</Btn>,
            ]}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {cgError && <div style={{background:"rgba(255,83,112,.1)",border:"1px solid rgba(255,83,112,.3)",borderRadius:"var(--radius-sm)",padding:"8px 12px",color:"#FF5370",fontSize:12}}>{cgError}</div>}
              <Field label="Group Name *">
                <Inp value={cgForm.name} onChange={e=>{setCgForm(f=>({...f,name:e.target.value}));setCgError("");}} placeholder="e.g. Design Sprint Team"/>
              </Field>
              <Field label="Associated Project *">
                <Inp value={cgForm.project} onChange={e=>{setCgForm(f=>({...f,project:e.target.value}));setCgError("");}} placeholder="e.g. SkillAsAService"/>
              </Field>
              <Field label="Description (optional)">
                <textarea value={cgForm.description} onChange={e=>setCgForm(f=>({...f,description:e.target.value}))}
                  placeholder="What is this group about?" rows={3}
                  style={{width:"100%",background:"var(--color-bg-input)",border:"1.5px solid var(--color-border)",
                    borderRadius:"var(--radius-sm)",padding:"9px 12px",color:"var(--color-text)",
                    fontSize:13,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/>
              </Field>
            </div>
          </Modal>
        )}
        {modal==="add-member" && (
          <Modal title={`Add Member to "${activeGroup.name}"`} onClose={()=>setModal(null)}
            footer={[
              <Btn key="c" variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>,
              <Btn key="a" onClick={handleAddMember}>Add Member</Btn>,
            ]}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {amError && <div style={{background:"rgba(255,83,112,.1)",border:"1px solid rgba(255,83,112,.3)",borderRadius:"var(--radius-sm)",padding:"8px 12px",color:"#FF5370",fontSize:12}}>{amError}</div>}
              <Field label="Member Name *">
                <Inp value={amForm.name} onChange={e=>{setAmForm(f=>({...f,name:e.target.value}));setAmError("");}} placeholder="e.g. John Doe"/>
              </Field>
              <Field label="Role *">
                <Inp value={amForm.role} onChange={e=>{setAmForm(f=>({...f,role:e.target.value}));setAmError("");}} placeholder="e.g. Designer, Developer, Client"/>
              </Field>
              {currentMembers.length>0 && (
                <div>
                  <p style={{fontSize:11,fontWeight:600,color:"var(--color-text-muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Current Members</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {currentMembers.map((m,i)=>(
                      <span key={i} style={{fontSize:11,background:"var(--color-bg-secondary)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-full)",padding:"2px 10px",color:"var(--color-text-secondary)"}}>{m.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
        {modal==="emoji" && (
          <Modal title="Pick an Emoji" onClose={()=>setModal(null)}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {EMOJIS.map(em=>(
                <button key={em} onClick={()=>{setInput(prev=>prev+em);setModal(null);setTimeout(()=>inputRef.current?.focus(),50);}}
                  style={{background:"var(--color-bg-secondary)",border:"1px solid var(--color-border)",
                    borderRadius:"var(--radius-sm)",width:42,height:42,fontSize:20,cursor:"pointer"}}>{em}</button>
              ))}
            </div>
          </Modal>
        )}
      </>
    );
  }

  return (
    <div style={{
      height:"100dvh", display:"flex", flexDirection:"row",
      background:"var(--color-bg)", fontFamily:"var(--font-family)", overflow:"hidden",
      position:"relative",
    }}>

      {/* ══ SIDEBAR ══ */}
      <div style={{width:SIDEBAR_W, flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column"}}>
        <GroupSidebar
          groups={groups} members={members} filteredGroups={filteredGroups}
          activeId={activeId} search={search} onSearch={setSearch}
          onSwitch={switchGroup}
          onCreateGroup={()=>{setCgForm({name:"",project:"",description:""});setCgError("");setModal("create-group");}}
        />
      </div>

      {/* ══ CHAT AREA ══ */}
      <div style={{flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden"}}>

        {/* Chat Header */}
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--color-border)",
          background:"var(--color-bg-card)",display:"flex",alignItems:"center",
          justifyContent:"space-between",gap:10,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
            <Avatar letter={activeGroup.avatar} color={activeGroup.color} size={38} radius="var(--radius-sm)"/>
            <div style={{minWidth:0}}>
              <p style={{fontSize:14,fontWeight:700,color:"var(--color-text)",margin:0,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{activeGroup.name}</p>
              <p style={{fontSize:11,color:"var(--color-text-muted)",margin:0}}>
                {currentMembers.length} members · {activeGroup.online} online · {activeGroup.project}
              </p>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            <button title="Leave group" onClick={leaveGroup}
              style={{background:"rgba(255,83,112,.10)",color:"#FF5370",
                border:"1px solid rgba(255,83,112,.2)",borderRadius:"var(--radius-sm)",
                padding:"5px 10px",fontSize:11,fontWeight:600,
                cursor:groups.length>1?"pointer":"not-allowed",
                opacity:groups.length>1?1:0.4,whiteSpace:"nowrap"}}>Leave</button>
            <button onClick={()=>setShowMembers(v=>!v)}
              style={{background:showMembers?"rgba(26,159,224,.12)":"var(--color-bg-input)",
                border:showMembers?"1px solid rgba(26,159,224,.3)":"1px solid var(--color-border)",
                borderRadius:"var(--radius-sm)",padding:"5px 12px",height:32,fontSize:12,fontWeight:600,
                color:showMembers?"var(--color-primary)":"var(--color-text-secondary)",
                cursor:"pointer",whiteSpace:"nowrap"}}>
              👥 Members
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
          {currentMsgs.length===0 && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",color:"var(--color-text-muted)",gap:8,paddingTop:80}}>
              <div style={{fontSize:40}}>💬</div>
              <p style={{fontSize:14,fontWeight:600,color:"var(--color-text-secondary)",margin:0}}>No messages yet</p>
              <p style={{fontSize:12,margin:0}}>Be the first to say something!</p>
            </div>
          )}
          {currentMsgs.map(msg=>(
            <div key={msg.id} style={{display:"flex",justifyContent:msg.self?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
              {!msg.self && <Avatar letter={msg.avatar} color={msg.color} size={32}/>}
              <div style={{maxWidth:"65%",display:"flex",flexDirection:"column",gap:3,alignItems:msg.self?"flex-end":"flex-start"}}>
                {!msg.self && <span style={{fontSize:11,fontWeight:600,color:msg.color,paddingLeft:2}}>{msg.sender}</span>}
                <div style={{
                  background:msg.self?"var(--gradient-blue)":"var(--color-bg-secondary)",
                  color:"#fff",borderRadius:msg.self?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  padding:"10px 14px",fontSize:13.5,lineHeight:1.5,
                  border:msg.self?"none":"1px solid var(--color-border)",wordBreak:"break-word",
                }}>{msg.text}</div>
                <span style={{fontSize:10,color:"var(--color-text-muted)",paddingLeft:2}}>{msg.time}</span>
              </div>
              {msg.self && <Avatar letter={msg.avatar} color={msg.color} size={32}/>}
            </div>
          ))}
          {typing && (
            <div style={{display:"flex",alignItems:"center",gap:6,paddingLeft:40}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--color-text-muted)",
                  animation:`bounce 1s ease-in-out ${i*0.18}s infinite`}}/>
              ))}
              <span style={{fontSize:11,color:"var(--color-text-muted)"}}>typing...</span>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input Bar */}
        <div style={{padding:"12px 16px",borderTop:"1px solid var(--color-border)",
          background:"var(--color-bg-card)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--color-bg-input)",
            border:"1.5px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"8px 12px"}}>
            <button title="Emoji" onClick={()=>setModal("emoji")}
              style={{background:"none",border:"none",fontSize:18,cursor:"pointer",
                color:"var(--color-text-muted)",padding:"0 2px",flexShrink:0}}>😊</button>
            <label title="Attach file" style={{cursor:"pointer",fontSize:17,color:"var(--color-text-muted)",flexShrink:0}}>
              📎
              <input type="file" style={{display:"none"}} onChange={e=>{
                const file=e.target.files?.[0]; if(!file) return;
                const msg={id:Date.now(),sender:"You",avatar:"P",color:"#64FFDA",text:`📎 ${file.name}`,time:nowTime(),self:true};
                setMessages(prev=>({...prev,[activeId]:[...(prev[activeId]||[]),msg]}));
                e.target.value="";
              }}/>
            </label>
            <input ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKey}
              placeholder={`Message ${activeGroup.name}...`}
              style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--color-text)",fontSize:14,minWidth:0}}
            />
            <button onClick={sendMessage} disabled={!input.trim()}
              style={{background:input.trim()?"var(--gradient-blue)":"var(--color-bg-hover)",
                color:input.trim()?"#fff":"var(--color-text-muted)",border:"none",
                borderRadius:"var(--radius-sm)",padding:"7px 14px",fontSize:13,fontWeight:600,
                cursor:input.trim()?"pointer":"not-allowed",transition:"all .2s",flexShrink:0}}>
              Send ➤
            </button>
          </div>
        </div>
      </div>

      {/* ══ MEMBERS PANEL — Desktop: inline, Tablet: slide-in overlay ══ */}
      {showMembers && isDesktop && (
        <div style={{width:MEMBERS_W,flexShrink:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <MembersPanel
            members={currentMembers}
            onRemove={removeMember}
            onAddMember={()=>{setAmForm({name:"",role:""});setAmError("");setModal("add-member");}}
            onClose={null}
            isMobile={false}
          />
        </div>
      )}

      {/* Tablet members: overlay drawer from right */}
      {showMembers && isTablet && (
        <>
          {/* Backdrop */}
          <div onClick={()=>setShowMembers(false)}
            style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:10}}/>
          {/* Drawer */}
          <div style={{
            position:"absolute",top:0,right:0,bottom:0,width:MEMBERS_W,
            zIndex:11,display:"flex",flexDirection:"column",overflow:"hidden",
            boxShadow:"-8px 0 32px rgba(0,0,0,.4)",
          }}>
            <MembersPanel
              members={currentMembers}
              onRemove={removeMember}
              onAddMember={()=>{setAmForm({name:"",role:""});setAmError("");setModal("add-member");}}
              onClose={()=>setShowMembers(false)}
              isMobile={false}
            />
          </div>
        </>
      )}

      {renderModals()}
      <style>{STYLES}</style>
    </div>
  );
}

const STYLES = `
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
  * { -webkit-tap-highlight-color: transparent; }
`;