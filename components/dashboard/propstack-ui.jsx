import { useState, useRef, useEffect } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:        "#f4f4f5",
  surface:   "#ffffff",
  surfaceAlt:"#f8f8fa",
  border:    "#e4e4e7",
  blue:      "#3b7ff5",
  blueDark:  "#2563eb",
  blueLight: "#eff6ff",
  navy:      "#0f172a",
  muted:     "#64748b",
  faint:     "#94a3b8",
  red:       "#ef4444",
  redLight:  "#fef2f2",
  green:     "#22c55e",
  greenLight:"#f0fdf4",
  amber:     "#f59e0b",
  amberLight:"#fffbeb",
  purple:    "#8b5cf6",
  purpleLight:"#f5f3ff",
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockTickets = [
  { id:"T-001", unit:"A101", tenant:"Rahul Mehta",  issue:"Burst pipe in bathroom",      severity:"high",   status:"open",        time:"2h ago",  emoji:"🔧" },
  { id:"T-002", unit:"B204", tenant:"Priya Sharma", issue:"AC not cooling properly",     severity:"medium", status:"in_progress", time:"1d ago",  emoji:"❄️" },
  { id:"T-003", unit:"A103", tenant:"Anil Kapoor",  issue:"Light flickering in kitchen", severity:"low",    status:"resolved",    time:"3d ago",  emoji:"💡" },
  { id:"T-004", unit:"C301", tenant:"Sneha Patil",  issue:"Main door lock broken",       severity:"high",   status:"open",        time:"4h ago",  emoji:"🔐" },
];

const mockTenants = [
  { id:1, name:"Rahul Mehta",  unit:"A101", property:"Sunrise Apartments", rent:18000, status:"overdue", lease:"Mar 2025" },
  { id:2, name:"Priya Sharma", unit:"B204", property:"Sunrise Apartments", rent:22000, status:"paid",    lease:"Jun 2025" },
  { id:3, name:"Anil Kapoor",  unit:"A103", property:"Sunrise Apartments", rent:18000, status:"paid",    lease:"Aug 2025" },
  { id:4, name:"Sneha Patil",  unit:"C301", property:"MG Heights",         rent:25000, status:"overdue", lease:"Jan 2025" },
];

const mockCalls = [
  {
    id:"C-001", tenant:"Rahul Mehta", unit:"A101", property:"Sunrise Apartments",
    type:"rent_collection", status:"completed", duration:"3m 42s", time:"Today, 9:14 AM",
    outcome:"promise", promiseAmount:"₹18,000", promiseDate:"Feb 24", language:"Hindi",
    summary:"Rahul acknowledged the overdue rent. Said he had a medical emergency last week. Promised to pay ₹18,000 by Feb 24. Sounded cooperative. No escalation needed.",
    transcript:[
      {role:"sara", text:"Namaste Rahul ji, main Sara bol rahi hoon, Vikram ji ke office se."},
      {role:"tenant", text:"Haan bolo, kya baat hai?"},
      {role:"sara", text:"Aapka is mahine ka kiraya ₹18,000 pending hai. Kab transfer kar sakte hain?"},
      {role:"tenant", text:"Sorry yaar, pichle hafte hospital mein tha. 24 tak pakka kar dunga."},
      {role:"sara", text:"Theek hai Rahul ji, 24 February tak noted kar liya. Thank you."},
    ],
    sentiment:"cooperative",
  },
  {
    id:"C-002", tenant:"Sneha Patil", unit:"C301", property:"MG Heights",
    type:"rent_collection", status:"completed", duration:"1m 58s", time:"Today, 9:31 AM",
    outcome:"no_answer", language:"Marathi",
    summary:"Call went unanswered after 3 rings. Voicemail not set up. Scheduled automatic follow-up for 2 PM today.",
    transcript:[],
    sentiment:"no_answer",
  },
  {
    id:"C-003", tenant:"Anil Kapoor", unit:"A103", property:"Sunrise Apartments",
    type:"lease_renewal", status:"completed", duration:"5m 12s", time:"Yesterday, 4:00 PM",
    outcome:"interested", language:"English",
    summary:"Anil is open to renewal but wants a rent reduction or at least a freeze. Current rent ₹18,000. Market rate is ₹19,500. Suggested 6-month renewal at same rate. Anil will confirm by weekend.",
    transcript:[
      {role:"sara", text:"Hi Anil, this is Sara calling from Vikram's office about your lease renewal."},
      {role:"tenant", text:"Oh yes, it expires in August right?"},
      {role:"sara", text:"Correct — August 2025. We'd like to renew. Would you be interested?"},
      {role:"tenant", text:"I am, but I was hoping the rent could stay the same or even come down a bit."},
      {role:"sara", text:"Understood. I'll pass that to Vikram. We can offer a 6-month renewal at current rate."},
      {role:"tenant", text:"That sounds fair. Let me think and get back by Sunday."},
    ],
    sentiment:"positive",
  },
  {
    id:"C-004", tenant:"Priya Sharma", unit:"B204", property:"Sunrise Apartments",
    type:"maintenance_followup", status:"in_progress", duration:"—", time:"Live now",
    outcome:"live", language:"English",
    summary:"Sara is currently calling Priya to follow up on the AC maintenance ticket T-002.",
    transcript:[],
    sentiment:"live",
  },
];

const chatHistories = [
  { id:1, title:"Overdue rent this month", preview:"Rahul Mehta owes ₹18k...", time:"Today" },
  { id:2, title:"Open maintenance tickets", preview:"4 tickets, 2 high severity...", time:"Today" },
  { id:3, title:"Vacancy cost Sunrise", preview:"Unit A102 vacant 23 days...", time:"Yesterday" },
  { id:4, title:"Lease renewals expiring", preview:"3 leases expire in 60 days...", time:"Feb 19" },
  { id:5, title:"MG Heights rent summary", preview:"Collection rate 91%...", time:"Feb 17" },
];

const initChat = [
  { role:"ai", text:"Good morning, Vikram. I'm Sara — your AI property manager. I'm watching your 2 properties, 12 units, and all tenant interactions. What would you like to know?", time:"9:00 AM" },
  { role:"user", text:"Who are the overdue tenants this month?", time:"9:02 AM" },
  { role:"ai", text:"Two tenants are overdue this month:\n\n• Rahul Mehta (A101, Sunrise) — ₹18,000, 12 days late. I called him this morning. He promised payment by Feb 24.\n\n• Sneha Patil (C301, MG Heights) — ₹25,000, 4 days late. Call went unanswered. Follow-up scheduled for 2 PM.\n\nTotal overdue: ₹43,000. Want me to send a WhatsApp reminder to Sneha as well?", time:"9:02 AM", hasCard:true, card:{ type:"overdue", items:[{name:"Rahul Mehta",unit:"A101",amount:"₹18,000",days:12,status:"promised"},{name:"Sneha Patil",unit:"C301",amount:"₹25,000",days:4,status:"unreachable"}] } },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sevColor  = s => s==="high"?T.red:s==="medium"?T.amber:T.green;
const sevBg     = s => s==="high"?T.redLight:s==="medium"?T.amberLight:T.greenLight;
const statColor = s => s==="open"?T.red:s==="in_progress"?T.amber:T.green;
const statBg    = s => s==="open"?T.redLight:s==="in_progress"?T.amberLight:T.greenLight;
const statLabel = s => s==="open"?"Open":s==="in_progress"?"In Progress":"Resolved";

const outcomeColor = o => o==="promise"?T.green:o==="no_answer"?T.amber:o==="interested"?T.blue:o==="live"?T.purple:T.muted;
const outcomeBg    = o => o==="promise"?T.greenLight:o==="no_answer"?T.amberLight:o==="interested"?T.blueLight:o==="live"?T.purpleLight:T.surfaceAlt;
const outcomeLabel = o => o==="promise"?"Payment Promised":o==="no_answer"?"No Answer":o==="interested"?"Interested":o==="live"?"🔴 Live":o==="completed"?"Completed":"—";

const sentimentIcon = s => s==="cooperative"?"😊":s==="positive"?"👍":s==="no_answer"?"📵":s==="live"?"🔴":"😐";

// ── Shared components ─────────────────────────────────────────────────────────
function PropLogo({ size=22 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:size+10,height:size+10,background:T.blue,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width={size-2} height={size-2} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="8" width="6" height="10" rx="1" fill="white"/>
          <rect x="10" y="4" width="8" height="14" rx="1" fill="white" opacity="0.7"/>
          <rect x="4" y="3" width="4" height="4" rx="0.5" fill="white" opacity="0.5"/>
        </svg>
      </div>
      <span style={{fontWeight:700,fontSize:size-1,color:T.navy,letterSpacing:-0.3}}>PropStack</span>
    </div>
  );
}

function SplitBtn({ label, onClick, small=false, color=T.navy }) {
  const pad = small?"7px 14px":"11px 22px";
  const fs  = small?12:14;
  return (
    <div onClick={onClick} style={{display:"inline-flex",borderRadius:10,overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.13)"}}>
      <div style={{background:color,color:"#fff",padding:pad,fontSize:fs,fontWeight:700}}>{label}</div>
      <div style={{background:T.blue,color:"#fff",padding:pad,fontSize:fs,display:"flex",alignItems:"center",justifyContent:"center",minWidth:34}}>↗</div>
    </div>
  );
}

function Pill({ label, color, bg, size=11 }) {
  return <span style={{fontSize:size,padding:"3px 9px",borderRadius:20,background:bg,color,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen }) {
  const Item = ({ id, label, icon, badge }) => (
    <div onClick={()=>setScreen(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 12px",borderRadius:8,cursor:"pointer",background:screen===id?T.blueLight:"transparent",color:screen===id?T.blue:T.muted,fontSize:13,fontWeight:screen===id?600:400,marginBottom:1}}>
      <span style={{fontSize:15,width:18,textAlign:"center"}}>{icon}</span>
      <span style={{flex:1}}>{label}</span>
      {badge && <span style={{fontSize:10,background:T.red,color:"#fff",borderRadius:10,padding:"1px 6px",fontWeight:700}}>{badge}</span>}
    </div>
  );
  return (
    <div style={{width:220,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"20px 14px",flexShrink:0}}>
      <div style={{paddingLeft:4,marginBottom:26}}><PropLogo/></div>
      <p style={{fontSize:10,color:T.faint,letterSpacing:1.4,textTransform:"uppercase",marginBottom:6,paddingLeft:12}}>Main</p>
      <Item id="dashboard"  label="Dashboard"   icon="⊡"/>
      <Item id="agents"     label="AI Agents"   icon="✦" badge="1"/>
      <Item id="chat"       label="Ask Sara"    icon="💬"/>
      <Item id="tickets"    label="Maintenance" icon="🔧" badge="2"/>
      <Item id="tenants"    label="Tenants"     icon="👤"/>
      <div style={{height:14}}/>
      <p style={{fontSize:10,color:T.faint,letterSpacing:1.4,textTransform:"uppercase",marginBottom:6,paddingLeft:12}}>More</p>
      <Item id="x" label="Properties" icon="🏠"/>
      <Item id="x" label="Documents"  icon="📄"/>
      <div style={{flex:1}}/>
      <div style={{background:T.surfaceAlt,borderRadius:12,padding:12,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,background:T.blue,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13}}>V</div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:T.navy}}>Vikram Nair</div>
            <div style={{fontSize:11,color:T.muted}}>2 properties · 12 units</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI AGENTS HUB ─────────────────────────────────────────────────────────────
function AgentsPage() {
  const [selected, setSelected] = useState(mockCalls[0]);
  const [filter, setFilter] = useState("All");

  const filters = ["All","Rent Collection","Lease Renewal","Maintenance","Live"];
  const filtered = mockCalls.filter(c =>
    filter==="All" ? true :
    filter==="Live" ? c.outcome==="live" :
    filter==="Rent Collection" ? c.type==="rent_collection" :
    filter==="Lease Renewal" ? c.type==="lease_renewal" :
    c.type==="maintenance_followup"
  );

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>

      {/* Left: call list */}
      <div style={{width:380,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.surface}}>
        <div style={{padding:"20px 20px 14px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <h1 style={{fontSize:19,fontWeight:800,color:T.navy}}>AI Agents</h1>
              <p style={{fontSize:12,color:T.muted,marginTop:2}}>Sara's calls & activity today</p>
            </div>
            <SplitBtn label="Trigger Call" onClick={()=>{}} small/>
          </div>

          {/* Live status banner */}
          <div style={{background:T.purpleLight,border:`1px solid ${T.purple}33`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:T.purple,boxShadow:`0 0 0 3px ${T.purple}33`,animation:"pulse 1.5s infinite"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:T.purple}}>Sara is live right now</div>
              <div style={{fontSize:11,color:T.muted}}>Calling Priya Sharma — AC maintenance follow-up</div>
            </div>
            <span style={{fontSize:11,color:T.purple,fontWeight:600}}>View →</span>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {label:"Calls today", val:"4"},
              {label:"Promises",    val:"1", color:T.green},
              {label:"Follow-ups",  val:"2", color:T.amber},
            ].map(({label,val,color=T.navy})=>(
              <div key={label} style={{background:T.surfaceAlt,borderRadius:9,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                <div style={{fontSize:18,fontWeight:800,color}}>{val}</div>
                <div style={{fontSize:10,color:T.muted,marginTop:1}}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 11px",borderRadius:20,border:"1.5px solid",borderColor:filter===f?T.blue:T.border,background:filter===f?T.blue:T.surface,color:filter===f?"#fff":T.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              {f==="Live"?"🔴 Live":f}
            </button>
          ))}
        </div>

        {/* Call list */}
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(c=>(
            <div key={c.id} onClick={()=>setSelected(c)} style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:selected?.id===c.id?T.blueLight:"transparent",transition:"background 0.12s"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:36,height:36,borderRadius:10,background:outcomeBg(c.outcome),display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {sentimentIcon(c.sentiment)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.navy}}>{c.tenant}</span>
                    <span style={{fontSize:10,color:T.faint}}>{c.time}</span>
                  </div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:5}}>{c.unit} · {c.property}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Pill label={outcomeLabel(c.outcome)} color={outcomeColor(c.outcome)} bg={outcomeBg(c.outcome)}/>
                    <span style={{fontSize:10,color:T.faint}}>{c.language} · {c.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: call detail */}
      <div style={{flex:1,overflowY:"auto",padding:28,background:T.bg}}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <h2 style={{fontSize:20,fontWeight:800,color:T.navy}}>{selected.tenant}</h2>
                  <Pill label={outcomeLabel(selected.outcome)} color={outcomeColor(selected.outcome)} bg={outcomeBg(selected.outcome)} size={12}/>
                </div>
                <p style={{fontSize:13,color:T.muted}}>Unit {selected.unit} · {selected.property} · {selected.time} · {selected.language} · {selected.duration}</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{padding:"7px 14px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,color:T.muted,cursor:"pointer"}}>Schedule follow-up</button>
                <SplitBtn label="Call again" onClick={()=>{}} small/>
              </div>
            </div>

            {/* AI Summary card */}
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:28,height:28,background:T.navy,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12}}>✦</div>
                <span style={{fontSize:13,fontWeight:700,color:T.navy}}>Sara's Call Summary</span>
              </div>
              <p style={{fontSize:13,color:T.navy,lineHeight:1.7,marginBottom:selected.promiseAmount?14:0}}>{selected.summary}</p>
              {selected.promiseAmount && (
                <div style={{display:"flex",gap:10,marginTop:12}}>
                  <div style={{flex:1,background:T.greenLight,border:`1px solid ${T.green}33`,borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:T.green,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Amount Promised</div>
                    <div style={{fontSize:18,fontWeight:800,color:T.navy}}>{selected.promiseAmount}</div>
                  </div>
                  <div style={{flex:1,background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:T.blue,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Promise Date</div>
                    <div style={{fontSize:18,fontWeight:800,color:T.navy}}>{selected.promiseDate}</div>
                  </div>
                  <div style={{flex:1,background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Sentiment</div>
                    <div style={{fontSize:18,fontWeight:800,color:T.navy}}>{sentimentIcon(selected.sentiment)} {selected.sentiment}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Transcript */}
            {selected.transcript.length > 0 ? (
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h3 style={{fontSize:13,fontWeight:700,color:T.navy}}>Call Transcript</h3>
                  <span style={{fontSize:11,color:T.muted}}>{selected.language}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {selected.transcript.map((line,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:50,flexShrink:0,fontSize:11,fontWeight:600,color:line.role==="sara"?T.blue:T.muted,paddingTop:2}}>
                        {line.role==="sara"?"Sara":"Tenant"}
                      </div>
                      <div style={{flex:1,background:line.role==="sara"?T.blueLight:T.surfaceAlt,padding:"8px 12px",borderRadius:10,fontSize:13,color:T.navy,lineHeight:1.5,border:`1px solid ${line.role==="sara"?"#bfdbfe":T.border}`}}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:32,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:10}}>{selected.outcome==="live"?"🔴":"📵"}</div>
                <div style={{fontSize:14,fontWeight:700,color:T.navy,marginBottom:6}}>
                  {selected.outcome==="live"?"Call in progress…":"No transcript available"}
                </div>
                <div style={{fontSize:13,color:T.muted}}>{selected.outcome==="live"?"Transcript will appear here when the call ends.":"This call went unanswered — no audio recorded."}</div>
              </div>
            )}
          </>
        ) : (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:T.faint,fontSize:14}}>Select a call to view details</div>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}

// ── FULL CHAT PAGE ────────────────────────────────────────────────────────────
function ChatPage() {
  const [messages, setMessages] = useState(initChat);
  const [val, setVal]           = useState("");
  const [typing, setTyping]     = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send = (text) => {
    const t = (text||val).trim();
    if (!t) return;
    setVal("");
    setMessages(p=>[...p,{role:"user",text:t,time:"now"}]);
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      setMessages(p=>[...p,{role:"ai",text:"Let me check that across your properties…",time:"now"}]);
    },1500);
  };

  const suggestions = [
    "Which tenants are overdue this month?",
    "Show me open maintenance tickets",
    "What's my vacancy cost this month?",
    "Call Rahul about pending rent",
    "Which leases expire in 60 days?",
    "Recommend a vendor for burst pipe in A101",
  ];

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>

      {/* Chat history sidebar */}
      <div style={{width:260,borderRight:`1px solid ${T.border}`,background:T.surface,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h3 style={{fontSize:13,fontWeight:700,color:T.navy}}>Conversations</h3>
            <button onClick={()=>setMessages(initChat)} style={{padding:"4px 10px",background:T.blue,color:"#fff",borderRadius:7,fontSize:11,fontWeight:600,border:"none",cursor:"pointer"}}>+ New</button>
          </div>
          <input placeholder="Search conversations…" style={{width:"100%",padding:"8px 11px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,color:T.navy,background:T.surfaceAlt,outline:"none"}}/>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"8px 8px"}}>
          {chatHistories.map(c=>(
            <div key={c.id} onClick={()=>setActiveChat(c.id)} style={{padding:"10px 10px",borderRadius:9,cursor:"pointer",background:activeChat===c.id?T.blueLight:"transparent",marginBottom:2,border:activeChat===c.id?`1px solid #bfdbfe`:"1px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:600,color:T.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:160}}>{c.title}</span>
                <span style={{fontSize:10,color:T.faint,flexShrink:0}}>{c.time}</span>
              </div>
              <span style={{fontSize:11,color:T.muted}}>{c.preview}</span>
            </div>
          ))}
        </div>

        {/* Sara status */}
        <div style={{padding:"12px 14px",borderTop:`1px solid ${T.border}`,background:T.surfaceAlt}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,background:T.navy,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}}>✦</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.navy}}>Sara AI</div>
              <div style={{fontSize:10,color:T.green,display:"flex",alignItems:"center",gap:4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}/>Watching all properties
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>

        {/* Top bar */}
        <div style={{padding:"14px 24px",borderBottom:`1px solid ${T.border}`,background:T.surface,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{fontSize:14,fontWeight:700,color:T.navy}}>Ask Sara Anything</h2>
            <p style={{fontSize:11,color:T.muted}}>Rent, maintenance, tenants, calls — Sara knows it all</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:T.blueLight,border:"1px solid #bfdbfe",borderRadius:8,padding:"5px 11px",fontSize:11,color:T.blue,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}/>Sara is active
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:10,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="ai" && (
                <div style={{width:30,height:30,background:T.navy,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,flexShrink:0,marginTop:2}}>✦</div>
              )}
              <div style={{maxWidth:"70%"}}>
                <div style={{
                  padding:"12px 16px",
                  borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  background:m.role==="user"?T.blue:T.surface,
                  color:m.role==="user"?"#fff":T.navy,
                  fontSize:13,lineHeight:1.6,
                  border:m.role==="ai"?`1px solid ${T.border}`:"none",
                  boxShadow:m.role==="ai"?"0 1px 3px rgba(0,0,0,0.05)":"none",
                  whiteSpace:"pre-line",
                }}>{m.text}</div>

                {/* Inline data card */}
                {m.hasCard && m.card.type==="overdue" && (
                  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginTop:8}}>
                    <div style={{padding:"8px 14px",background:T.surfaceAlt,borderBottom:`1px solid ${T.border}`,fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>Overdue Tenants</div>
                    {m.card.items.map((item,j)=>(
                      <div key={j} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:j<m.card.items.length-1?`1px solid ${T.border}`:"none"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700,color:T.navy}}>{item.name}</div>
                          <div style={{fontSize:11,color:T.muted}}>Unit {item.unit} · {item.days} days late</div>
                        </div>
                        <div style={{fontSize:13,fontWeight:800,color:T.navy}}>{item.amount}</div>
                        <Pill label={item.status==="promised"?"Promised":"Unreachable"} color={item.status==="promised"?T.green:T.amber} bg={item.status==="promised"?T.greenLight:T.amberLight}/>
                      </div>
                    ))}
                  </div>
                )}

                {m.role==="ai" && (
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <button style={{padding:"4px 10px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,fontSize:11,color:T.muted,cursor:"pointer"}}>Call them</button>
                    <button style={{padding:"4px 10px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,fontSize:11,color:T.muted,cursor:"pointer"}}>WhatsApp reminder</button>
                  </div>
                )}
              </div>
              {m.role==="user" && (
                <div style={{width:30,height:30,background:T.blue,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12,flexShrink:0,marginTop:2}}>V</div>
              )}
            </div>
          ))}

          {typing && (
            <div style={{display:"flex",gap:10}}>
              <div style={{width:30,height:30,background:T.navy,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12}}>✦</div>
              <div style={{padding:"12px 16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"16px 16px 16px 4px",fontSize:13,color:T.faint}}>Sara is thinking…</div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Suggestion chips — only if few messages */}
        {messages.length <= 3 && (
          <div style={{padding:"0 24px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
            {suggestions.map(s=>(
              <span key={s} onClick={()=>send(s)} style={{fontSize:12,padding:"6px 12px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,color:T.muted,cursor:"pointer",fontWeight:500}}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{padding:"12px 24px 16px",borderTop:`1px solid ${T.border}`,background:T.surface}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{flex:1,border:`1.5px solid ${T.border}`,borderRadius:12,background:T.surface,overflow:"hidden"}}>
              <textarea
                value={val}
                onChange={e=>setVal(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); }}}
                placeholder="Ask Sara about rent, maintenance, tenants, vendors…"
                rows={2}
                style={{width:"100%",padding:"11px 14px",border:"none",resize:"none",fontSize:13,color:T.navy,outline:"none",fontFamily:"inherit",lineHeight:1.5}}
              />
              <div style={{padding:"6px 10px",display:"flex",gap:6,borderTop:`1px solid ${T.border}`}}>
                {["📞 Trigger call","📋 Ticket","📊 Report"].map(a=>(
                  <span key={a} style={{fontSize:11,padding:"3px 9px",background:T.surfaceAlt,borderRadius:20,color:T.muted,cursor:"pointer",border:`1px solid ${T.border}`}}>{a}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>send()} style={{padding:"12px 18px",background:T.blue,color:"#fff",borderRadius:12,fontSize:16,border:"none",cursor:"pointer",height:48,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
          </div>
          <p style={{fontSize:11,color:T.faint,marginTop:8,textAlign:"center"}}>Sara can trigger calls, create tickets, and take actions — just ask.</p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ setScreen }) {
  return (
    <div style={{flex:1,padding:28,overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:T.navy}}>Overview</h1>
          <p style={{fontSize:13,color:T.muted,marginTop:2}}>Saturday, 21 Feb 2026</p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{background:T.blueLight,border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 12px",fontSize:12,color:T.blue,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.green,display:"inline-block"}}/>Sara AI is active
          </div>
          <SplitBtn label="Ask Sara" onClick={()=>setScreen("chat")} small/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total Monthly Rent", val:"₹4,25,000", sub:"+12% vs last month", sc:T.green},
          {label:"Active Maintenance", val:"12 Open",   sub:"3 Critical",         sc:T.red},
          {label:"AI Efficiency",      val:"42 hrs",    sub:"saved this month",   sc:T.blue},
          {label:"Vacancy Cost",       val:"₹31,000",   sub:"lost this month",    sc:T.amber},
        ].map(({label,val,sub,sc})=>(
          <div key={label} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
            <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>{label}</div>
            <div style={{fontSize:21,fontWeight:800,color:T.navy,marginBottom:4}}>{val}</div>
            <div style={{fontSize:12,color:sc,fontWeight:500}}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Live AI feed */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.navy}}>Live AI Activity</h3>
            <span onClick={()=>setScreen("agents")} style={{fontSize:11,color:T.blue,fontWeight:600,cursor:"pointer"}}>View all →</span>
          </div>
          {[
            {text:"Sara calling Priya Sharma — AC follow-up",  time:"Live",         tag:"🔴 Live",    dot:T.purple},
            {text:"Rahul Mehta promised ₹18k by Feb 24",       time:"9:14 AM",      tag:"✓ Promise",  dot:T.green},
            {text:"Burst pipe photo analyzed — Severity High",  time:"2 mins ago",   tag:"Vision AI",  dot:T.red},
            {text:"Sneha Patil call unanswered — retry 2 PM",   time:"9:31 AM",      tag:"Follow-up",  dot:T.amber},
          ].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:f.dot,marginTop:5,flexShrink:0}}/>
              <div style={{flex:1,fontSize:12,color:T.navy,lineHeight:1.5}}>{f.text}</div>
              <div style={{flexShrink:0,textAlign:"right"}}>
                <div style={{fontSize:10,color:T.faint}}>{f.time}</div>
                <div style={{fontSize:10,color:T.blue,fontWeight:600}}>{f.tag}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent tickets */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.navy}}>Recent Maintenance</h3>
            <span onClick={()=>setScreen("tickets")} style={{fontSize:11,color:T.blue,fontWeight:600,cursor:"pointer"}}>View all →</span>
          </div>
          {mockTickets.slice(0,3).map((t,i)=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:sevColor(t.severity),flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy}}>{t.issue}</div>
                <div style={{fontSize:11,color:T.muted}}>Unit {t.unit} · {t.tenant}</div>
              </div>
              <Pill label={statLabel(t.status)} color={statColor(t.status)} bg={statBg(t.status)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAINTENANCE PAGE ──────────────────────────────────────────────────────────
function TicketsPage() {
  const [filter, setFilter] = useState("All");
  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{flex:1,padding:28,overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,color:T.navy}}>Maintenance</h1>
            <p style={{fontSize:13,color:T.muted,marginTop:2}}>4 tickets · 2 require immediate attention</p>
          </div>
          <SplitBtn label="New Ticket" onClick={()=>{}} small/>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:18}}>
          {["All","Open","In Progress","Resolved"].map((f,i)=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid",borderColor:filter===f?T.blue:T.border,background:filter===f?T.blue:T.surface,color:filter===f?"#fff":T.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{f}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {mockTickets.map(t=>(
            <div key={t.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:18,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,background:sevBg(t.severity),borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{t.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:14,fontWeight:700,color:T.navy}}>{t.issue}</span>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:sevBg(t.severity),color:sevColor(t.severity),fontWeight:700,textTransform:"uppercase"}}>{t.severity}</span>
                </div>
                <div style={{fontSize:12,color:T.muted}}>{t.id} · Unit {t.unit} · {t.tenant}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <Pill label={statLabel(t.status)} color={statColor(t.status)} bg={statBg(t.status)}/>
                <span style={{fontSize:11,color:T.faint}}>{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor panel */}
      <div style={{width:280,borderLeft:`1px solid ${T.border}`,background:T.surface,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{fontSize:13,fontWeight:700,color:T.navy,marginBottom:4}}>Vendor Phonebook</h3>
          <p style={{fontSize:11,color:T.muted}}>Sara picks from this list automatically</p>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
          {[
            {name:"Ravi Plumber",      phone:"+91 98201 11111", tag:"Plumbing",  rating:"4.8", available:true},
            {name:"Suresh Electric",   phone:"+91 90112 22222", tag:"Electrical",rating:"4.6", available:true},
            {name:"Mohan Carpenter",   phone:"+91 87654 33333", tag:"Carpentry", rating:"4.5", available:false},
            {name:"AC Cool Services",  phone:"+91 99321 44444", tag:"HVAC",      rating:"4.7", available:true},
          ].map((v,i)=>(
            <div key={i} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:T.navy}}>{v.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{v.phone}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                  <span style={{fontSize:10,padding:"2px 7px",background:T.blueLight,color:T.blue,borderRadius:10,fontWeight:600}}>{v.tag}</span>
                  <span style={{fontSize:10,color:v.available?T.green:T.muted}}>● {v.available?"Available":"Busy"}</span>
                </div>
              </div>
              <div style={{fontSize:11,color:T.faint}}>⭐ {v.rating} · Sara recommended</div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${T.border}`}}>
          <button style={{width:"100%",padding:"9px",background:T.navy,color:"#fff",borderRadius:9,fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>+ Add vendor</button>
        </div>
      </div>
    </div>
  );
}

// ── TENANTS PAGE ──────────────────────────────────────────────────────────────
function TenantsPage() {
  return (
    <div style={{flex:1,padding:28,overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:T.navy}}>Tenants</h1>
          <p style={{fontSize:13,color:T.muted,marginTop:2}}>4 active tenancies · 2 overdue</p>
        </div>
        <SplitBtn label="Add Tenant" onClick={()=>{}} small/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        {[
          {label:"Collection Status", val:"100% collected", sub:"All paid this month",  color:T.green},
          {label:"Active Units",      val:"24 occupied",   sub:"1 vacant unit",         color:T.blue},
          {label:"Overdue Rent",      val:"₹43,000",       sub:"2 tenants overdue",     color:T.red},
        ].map(({label,val,sub,color})=>(
          <div key={label} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:16}}>
            <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>{label}</div>
            <div style={{fontSize:18,fontWeight:800,color:T.navy}}>{val}</div>
            <div style={{fontSize:12,color,fontWeight:500,marginTop:3}}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 110px",padding:"11px 18px",background:T.surfaceAlt,borderBottom:`1px solid ${T.border}`}}>
          {["Tenant","Unit","Rent/mo","Status","Lease Ends","Actions"].map(h=>(
            <div key={h} style={{fontSize:11,color:T.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8}}>{h}</div>
          ))}
        </div>
        {mockTenants.map((t,i)=>(
          <div key={t.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 110px",padding:"14px 18px",alignItems:"center",borderBottom:i<mockTenants.length-1?`1px solid ${T.surfaceAlt}`:"none"}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:T.navy}}>{t.name}</div>
              <div style={{fontSize:11,color:T.muted}}>{t.property}</div>
            </div>
            <div style={{fontSize:13,color:T.navy,fontWeight:500}}>{t.unit}</div>
            <div style={{fontSize:13,color:T.navy,fontWeight:500}}>₹{(t.rent/1000).toFixed(0)}k</div>
            <Pill label={t.status==="paid"?"Paid":"Overdue"} color={t.status==="paid"?T.green:T.red} bg={t.status==="paid"?T.greenLight:T.redLight}/>
            <div style={{fontSize:12,color:T.muted}}>{t.lease}</div>
            <div style={{display:"flex",gap:6}}>
              <button style={{padding:"5px 10px",background:T.blueLight,color:T.blue,borderRadius:7,fontSize:11,fontWeight:600,border:"1px solid #bfdbfe",cursor:"pointer"}}>Call</button>
              <button style={{padding:"5px 10px",background:T.surfaceAlt,color:T.muted,borderRadius:7,fontSize:11,border:`1px solid ${T.border}`,cursor:"pointer"}}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ setScreen }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#dbeafe 0%,#eff6ff 45%,#e0e7ff 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:24}}>
      <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",borderRadius:16,padding:"11px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:`1px solid ${T.border}`}}>
        <PropLogo/>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <span style={{fontSize:13,color:T.muted,cursor:"pointer"}}>Pricing</span>
          <SplitBtn label="Try for free" onClick={()=>setScreen("onboarding")} small/>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.8)",border:`1px solid ${T.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,color:T.muted,marginBottom:14}}>Now Available ✦</div>
          <h1 style={{fontSize:32,fontWeight:800,color:T.navy,lineHeight:1.15,marginBottom:6}}>Manage Properties<br/><span style={{color:T.blue,fontStyle:"italic"}}>with AI Intelligence</span></h1>
          <p style={{fontSize:13,color:T.muted}}>Sign in to your PropStack account</p>
        </div>
        <div style={{background:T.surface,borderRadius:20,padding:32,boxShadow:"0 4px 24px rgba(0,0,0,0.09)",border:`1px solid ${T.border}`}}>
          <button onClick={()=>setScreen("onboarding")} style={{width:"100%",padding:"11px 16px",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:13,color:T.navy,fontWeight:500,marginBottom:14,cursor:"pointer"}}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0"}}>
            <div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:12,color:T.faint}}>or</span><div style={{flex:1,height:1,background:T.border}}/>
          </div>
          {[["Email","email","vikram@example.com"],["Password","password","••••••••"]].map(([l,t,p])=>(
            <div key={l} style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:T.navy,marginBottom:5}}>{l}</label>
              <input type={t} placeholder={p} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border}`,borderRadius:9,fontSize:13,color:T.navy,background:T.surface,outline:"none"}}/>
            </div>
          ))}
          <div style={{marginTop:18}}><SplitBtn label="Sign in" onClick={()=>setScreen("onboarding")}/></div>
          <p style={{textAlign:"center",marginTop:16,fontSize:12,color:T.muted}}>New landlord? <span onClick={()=>setScreen("onboarding")} style={{color:T.blue,fontWeight:600,cursor:"pointer"}}>Create free account</span></p>
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function OnboardingPage({ setScreen }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title:"Tell us about you",       sub:"Basic details for your PropStack account",      fields:[["Full name","text","Vikram Nair"],["Phone","tel","+91 98201 00000"]] },
    { title:"Add your first property", sub:"You can add more properties from the dashboard", fields:[["Property name","text","Sunrise Apartments"],["City","text","Pune"],["Total units","number","12"]] },
    { title:"Meet Sara",               sub:"Your AI property manager is configured and ready", final:true },
  ];
  const s = steps[step];
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:24}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <PropLogo/>
          <span style={{fontSize:12,color:T.faint}}>Step {step+1} of {steps.length}</span>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:24}}>
          {steps.map((_,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:4,background:i<=step?T.blue:T.border,transition:"background 0.3s"}}/>
          ))}
        </div>
        <div style={{background:T.surface,borderRadius:20,padding:36,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",border:`1px solid ${T.border}`}}>
          {s.final ? (
            <div style={{textAlign:"center"}}>
              <div style={{width:68,height:68,background:T.blue,borderRadius:18,margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:28}}>✦</div>
              <h2 style={{fontSize:24,fontWeight:800,color:T.navy,marginBottom:8}}>Sara is ready</h2>
              <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Sara will handle rent reminders, maintenance triage, vendor coordination, and tenant calls in Hindi, Tamil, Marathi, or English.</p>
              <div style={{background:T.surfaceAlt,borderRadius:12,padding:16,marginBottom:24,border:`1px solid ${T.border}`,textAlign:"left"}}>
                {[["🗣️","Voice & WhatsApp","Tenants interact naturally — no app download"],["🏠","Sunrise Apartments","12 units configured"],["🌐","Multi-language","Hindi, English, Marathi enabled"]].map(([icon,title,sub])=>(
                  <div key={title} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                    <span style={{fontSize:18}}>{icon}</span>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.navy}}>{title}</div><div style={{fontSize:11,color:T.muted}}>{sub}</div></div>
                    <span style={{color:T.green,fontWeight:700}}>✓</span>
                  </div>
                ))}
              </div>
              <SplitBtn label="Open Dashboard" onClick={()=>setScreen("dashboard")}/>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:22,fontWeight:800,color:T.navy,marginBottom:4}}>{s.title}</h2>
              <p style={{color:T.muted,fontSize:13,marginBottom:22}}>{s.sub}</p>
              {s.fields.map(([l,t,p])=>(
                <div key={l} style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:T.navy,marginBottom:5}}>{l}</label>
                  <input type={t} placeholder={p} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border}`,borderRadius:9,fontSize:13,color:T.navy,background:T.surface,outline:"none"}}/>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:22,alignItems:"center"}}>
                {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:11,background:T.surfaceAlt,color:T.muted,borderRadius:9,fontSize:13,border:`1px solid ${T.border}`,cursor:"pointer"}}>← Back</button>}
                <div style={{flex:2}}><SplitBtn label="Continue" onClick={()=>setStep(s=>s+1)}/></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");

  const noLayout = ["login","onboarding"].includes(screen);

  if (screen==="login") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus{outline:none;}button{cursor:pointer;border:none;}`}</style>
      <LoginPage setScreen={setScreen}/>
    </>
  );
  if (screen==="onboarding") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus,textarea:focus{outline:none;}button{cursor:pointer;border:none;}`}</style>
      <OnboardingPage setScreen={setScreen}/>
    </>
  );

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus,textarea:focus{outline:none;}button{cursor:pointer;border:none;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <Sidebar screen={screen} setScreen={setScreen}/>
      {screen==="dashboard" && <DashboardPage setScreen={setScreen}/>}
      {screen==="agents"    && <AgentsPage/>}
      {screen==="chat"      && <ChatPage/>}
      {screen==="tickets"   && <TicketsPage/>}
      {screen==="tenants"   && <TenantsPage/>}
    </div>
  );
}
