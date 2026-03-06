export const mockTickets = [
  {
    id: "T-001",
    unit: "A101",
    tenant: "Rahul Mehta",
    issue: "Burst pipe in bathroom",
    severity: "high",
    status: "open",
    time: "2h ago",
    iconType: "wrench",
  },
  {
    id: "T-002",
    unit: "B204",
    tenant: "Priya Sharma",
    issue: "AC not cooling properly",
    severity: "medium",
    status: "in_progress",
    time: "1d ago",
    iconType: "snowflake",
  },
  {
    id: "T-003",
    unit: "A103",
    tenant: "Anil Kapoor",
    issue: "Light flickering in kitchen",
    severity: "low",
    status: "resolved",
    time: "3d ago",
    iconType: "lightbulb",
  },
  {
    id: "T-004",
    unit: "C301",
    tenant: "Sneha Patil",
    issue: "Main door lock broken",
    severity: "high",
    status: "open",
    time: "4h ago",
    iconType: "lock",
  },
];

export const mockTenants = [
  {
    id: 1,
    name: "Rahul Mehta",
    unit: "A101",
    property: "Sunrise Apartments",
    rent: 18000,
    status: "overdue",
    lease: "Mar 2025",
  },
  {
    id: 2,
    name: "Priya Sharma",
    unit: "B204",
    property: "Sunrise Apartments",
    rent: 22000,
    status: "paid",
    lease: "Jun 2025",
  },
  {
    id: 3,
    name: "Anil Kapoor",
    unit: "A103",
    property: "Sunrise Apartments",
    rent: 18000,
    status: "paid",
    lease: "Aug 2025",
  },
  {
    id: 4,
    name: "Sneha Patil",
    unit: "C301",
    property: "MG Heights",
    rent: 25000,
    status: "overdue",
    lease: "Jan 2025",
  },
];

export const mockCalls = [
  {
    id: "C-001",
    tenant: "Rahul Mehta",
    unit: "A101",
    property: "Sunrise Apartments",
    type: "rent_collection",
    status: "completed",
    duration: "3m 42s",
    time: "Today, 9:14 AM",
    outcome: "promise",
    promiseAmount: "₹18,000",
    promiseDate: "Feb 24",
    language: "Hindi",
    summary:
      "Rahul acknowledged the overdue rent. Said he had a medical emergency last week. Promised to pay ₹18,000 by Feb 24. Sounded cooperative. No escalation needed.",
    transcript: [
      {
        role: "sara",
        text: "Namaste Rahul ji, main Sara bol rahi hoon, Vikram ji ke office se.",
      },
      { role: "tenant", text: "Haan bolo, kya baat hai?" },
      {
        role: "sara",
        text: "Aapka is mahine ka kiraya ₹18,000 pending hai. Kab transfer kar sakte hain?",
      },
      {
        role: "tenant",
        text: "Sorry yaar, pichle hafte hospital mein tha. 24 tak pakka kar dunga.",
      },
      {
        role: "sara",
        text: "Theek hai Rahul ji, 24 February tak noted kar liya. Thank you.",
      },
    ],
    sentiment: "cooperative",
  },
  {
    id: "C-002",
    tenant: "Sneha Patil",
    unit: "C301",
    property: "MG Heights",
    type: "rent_collection",
    status: "completed",
    duration: "1m 58s",
    time: "Today, 9:31 AM",
    outcome: "no_answer",
    language: "Marathi",
    summary:
      "Call went unanswered after 3 rings. Voicemail not set up. Scheduled automatic follow-up for 2 PM today.",
    transcript: [],
    sentiment: "no_answer",
  },
  {
    id: "C-003",
    tenant: "Anil Kapoor",
    unit: "A103",
    property: "Sunrise Apartments",
    type: "lease_renewal",
    status: "completed",
    duration: "5m 12s",
    time: "Yesterday, 4:00 PM",
    outcome: "interested",
    language: "English",
    summary:
      "Anil is open to renewal but wants a rent reduction or at least a freeze. Current rent ₹18,000. Market rate is ₹19,500. Suggested 6-month renewal at same rate. Anil will confirm by weekend.",
    transcript: [
      {
        role: "sara",
        text: "Hi Anil, this is Sara calling from Vikram's office about your lease renewal.",
      },
      { role: "tenant", text: "Oh yes, it expires in August right?" },
      {
        role: "sara",
        text: "Correct — August 2025. We'd like to renew. Would you be interested?",
      },
      {
        role: "tenant",
        text: "I am, but I was hoping the rent could stay the same or even come down a bit.",
      },
      {
        role: "sara",
        text: "Understood. I'll pass that to Vikram. We can offer a 6-month renewal at current rate.",
      },
      {
        role: "tenant",
        text: "That sounds fair. Let me think and get back by Sunday.",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "C-004",
    tenant: "Priya Sharma",
    unit: "B204",
    property: "Sunrise Apartments",
    type: "maintenance_followup",
    status: "in_progress",
    duration: "—",
    time: "Live now",
    outcome: "live",
    language: "English",
    summary:
      "Sara is currently calling Priya to follow up on the AC maintenance ticket T-002.",
    transcript: [],
    sentiment: "live",
  },
];

export const chatHistories = [
  {
    id: 1,
    title: "Overdue rent this month",
    preview: "Rahul Mehta owes ₹18k...",
    time: "Today",
  },
  {
    id: 2,
    title: "Open maintenance tickets",
    preview: "4 tickets, 2 high severity...",
    time: "Today",
  },
  {
    id: 3,
    title: "Vacancy cost Sunrise",
    preview: "Unit A102 vacant 23 days...",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Lease renewals expiring",
    preview: "3 leases expire in 60 days...",
    time: "Feb 19",
  },
  {
    id: 5,
    title: "MG Heights rent summary",
    preview: "Collection rate 91%...",
    time: "Feb 17",
  },
];

export const initChat = [
  {
    role: "ai",
    text: "Good morning, Vikram. I'm Sara — your AI property manager. I'm watching your 2 properties, 12 units, and all tenant interactions. What would you like to know?",
    time: "9:00 AM",
  },
  {
    role: "user",
    text: "Who are the overdue tenants this month?",
    time: "9:02 AM",
  },
  {
    role: "ai",
    text: `Two tenants are overdue this month:

• Rahul Mehta (A101, Sunrise) — ₹18,000, 12 days late. I called him this morning. He promised payment by Feb 24.

• Sneha Patil (C301, MG Heights) — ₹25,000, 4 days late. Call went unanswered. Follow-up scheduled for 2 PM.

Total overdue: ₹43,000. Want me to send a WhatsApp reminder to Sneha as well?`,
    time: "9:02 AM",
    hasCard: true,
    card: {
      type: "overdue",
      items: [
        {
          name: "Rahul Mehta",
          unit: "A101",
          amount: "₹18,000",
          days: 12,
          status: "promised",
        },
        {
          name: "Sneha Patil",
          unit: "C301",
          amount: "₹25,000",
          days: 4,
          status: "unreachable",
        },
      ],
    },
  },
];
