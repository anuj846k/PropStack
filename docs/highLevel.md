PROPERTY MANAGEMENT SYSTEM AI native


Reference website:
https://www.buildium.com/features/ai-property-management-software/







Full flow 
Users Stores everyone who logs into the platform. Right now that's tenants and landlords. A tenant needs an account to report maintenance issues. A landlord needs an account to manage everything. One table for both, the role field separates them.

Properties A landlord can own multiple buildings. This table stores each building. "Sunrise Apartments on MG Road Pune" is one property. The landlord_id links it to whoever owns it.

Units Each property has multiple units inside it. Flat A101, Flat A102 etc. This table stores each individual unit. The property_id links it to the building it belongs to. Rent amount lives here because each unit can have a different rent.

Tenancies This is the relationship between a tenant and a unit. It answers "who is living in which flat, since when, until when, and for how much deposit." One unit can have multiple tenancies over time — old tenant leaves, new tenant moves in, both records exist for history. The status field tells you which one is currently active.

Vendors The landlord's trusted contacts — their regular plumber, electrician, carpenter. Not platform users, just a phonebook. When a maintenance issue comes in the agent picks the right vendor from this list based on the category of the issue. Each vendor belongs to a specific landlord.

Maintenance Tickets The core table. Every time a tenant reports an issue — burst pipe, broken light, leaking roof — it creates a ticket here. Tracks who reported it, which unit it's in, what the issue is, who's been assigned to fix it, and where it stands in the workflow. This is the main thing both the freelance bid and hackathon revolve around.

Ticket Images Separate from the ticket itself because one ticket can have multiple photos. Tenant takes 3 photos of the burst pipe — three rows here, all pointing to the same ticket. Stores the Supabase storage URL for each image.

Activity Log Every time anything changes on a ticket it gets recorded here. Ticket created, assigned to a vendor, status changed to in progress, resolved. This gives the landlord a full audit trail of exactly what happened and when. Also required explicitly by the freelance bid.

Notifications When something happens — ticket created, vendor assigned, status changed — the relevant person needs to be notified. This table stores those notifications. Landlord gets notified when a tenant raises a ticket. Tenant gets notified when their ticket is resolved. The is_read field tracks whether they've seen it yet.



Full flow to be followed : 
Let me break this down simply. Think of it like a real building and work your way from left to right.

Start from the right — the foundation
Users is where everyone starts. A landlord and a tenant are both users, just with different roles. Everything in the system belongs to or is created by a user.

Properties → Units → Tenancies (the building hierarchy)
A landlord (user) owns a property — think "Sunshine Apartments." That property has multiple units inside it — Flat 101, Flat 102 etc. A tenancy is created when a tenant moves into a unit — it records who moved in, when, until when, and for how much deposit. This is the chain: Landlord → Property → Unit → Tenancy → Tenant.

Now the maintenance side
When a tenant has a problem they create a maintenance ticket. The ticket is linked to the unit it belongs to. The landlord then assigns a vendor (plumber, electrician) to fix it. Vendors belong to a landlord — they're the landlord's trusted contacts.

Supporting tables
Ticket Images — photos the tenant uploads with their complaint. Linked to the ticket.
Activity Log — every action on a ticket gets recorded here. Created, assigned, status changed. Full history.
Notifications — when something happens, the right person gets notified. Linked to both the ticket and the user who should see it.

In one sentence:
Landlord owns properties → properties have units → tenants live in units via tenancies → tenants raise maintenance tickets → landlord assigns vendors to fix them → everything gets logged and notified.









Agentic thing we can implement:
Rent Collection
Automated calls to tenants when rent is overdue
Natural conversation handling — excuses, questions, pushback
Payment plan negotiation and commitment logging
Auto follow-up on promised payment dates
Landlord summary after every call
Voice & Language
Agent calls as "Sara from [Landlord Name]'s office"
Landlord voice cloning via Sarvam AI
Regional Indian language support — Hindi, Tamil, Telugu, Kannada, Marathi
Maintenance
Tenant reports issue via call or WhatsApp
Agent reads photo of issue and triages severity
Contacts vendor from landlord's preferred list
Follows up if vendor doesn't show up
Closes ticket and notifies landlord
Tenant Screening
Agent calls previous landlord and asks structured questions
Generates risk score report for the new landlord
Lease Renewal
Auto reminder 60 days before expiry
Agent calls tenant to gauge intent
Negotiates renewal terms conversationally
Drafts updated lease
Landlord Dashboard
All call recordings and summaries
Payment status across all units
Open maintenance tickets
Upcoming lease renewals

Security Deposit Disputes
This is one of the most common landlord-tenant conflicts worldwide. Tenant moves out, landlord claims damage, tenant wants full deposit back. Right now there's no good paper trail. Your agent can solve this by doing a move-in and move-out video walkthrough — tenant records a video of the entire unit, agent analyzes it visually, documents condition of every room, stores it with a timestamp. When the tenant moves out, same process. Agent compares both videos automatically and generates a damage report with visual evidence. No more "he said she said." This is genuinely unsolved and would save landlords thousands.


Document Management
Rental agreements, police verification forms, society NOCs, electricity bills, property tax receipts — small landlords store these in WhatsApp chats and random folders. An agent that maintains a clean document vault per property and per tenant, sends reminders when documents are expiring, and generates standard agreements automatically is genuinely useful.
Vacancy Cost Awareness
Landlords don't think in terms of vacancy cost. They'll spend 3 months finding the "perfect tenant" not realizing those 3 empty months cost them more than a slightly imperfect tenant would have. An agent that tells them "your unit has been vacant 23 days, that's already cost you ₹31,000 in lost rent, here are 3 qualified applicants you haven't responded to yet" changes their decision making completely.

Rent Price Intelligence
You have vacancy cost awareness but you don't have a feature that tells the landlord they're undercharging in the first place. These are two different problems. Vacancy awareness is reactive — unit is already empty. Rent intelligence is proactive — tells them every 6 months "comparable 2BHK in your area on NoBroker is listing at ₹18,000, you're charging ₹14,000, you're leaving ₹48,000 per year on the table." This is genuinely valuable and nobody does it for small landlords.
Third gap: WhatsApp as the tenant interface
You mention WhatsApp for maintenance but you haven't explicitly made it a core channel. Most tenants in India will never download your app. WhatsApp is where they already live. Your entire tenant-facing experience — maintenance requests, payment confirmations, document sharing, renewal discussions — should work natively over WhatsApp Business API. The landlord uses your app, the tenant uses WhatsApp. This is critical for actual adoption in India




Rent agreement flow 
https://legaldesk.com/form/forms/rentalagreement

So your tech integration path is: ZoopSign or similar for e-stamp + Aadhaar eSign → SHCIL backend → PDF stored in your vault.






How it works in practice:
Your Node.js server is the brain. It handles all business logic — auth, tickets, roles, file uploads, notifications. When something needs AI — a tenant calls, a photo needs analysis, a vendor needs to be contacted — Node.js makes a simple HTTP request to your Python FastAPI service. Python handles the AI work and returns the result. Node.js stores it in the database and continues the workflow.
Concrete example flow:
Tenant calls in about a maintenance issue → Sarvam AI receives the call → Python service processes voice + photo via Gemini → Python returns structured JSON {severity: high, category: plumbing, summary: "burst pipe"} → Node.js creates a ticket in Supabase → Node.js notifies the manager → Done

The key principle is Python service stays dumb and focused. It only does AI tasks. It doesn't touch the database directly, doesn't handle auth, doesn't manage business logic. Node.js owns all of that. Python just receives a request, calls Gemini/ADK/Sarvam, returns a clean response.
This makes Sprint 2 very clean — you're not touching your Sprint 1 codebase at all. You're just building a new service and adding a few API calls in your existing Node.js routes.
Two endpoints you'll likely need in the Python service:
POST /analyze-maintenance — receives photo + voice transcript, returns severity + category + summary
POST /agent/call — triggers an outbound call via Sarvam, runs the Live Agent conversation, returns transcript + outcome
That's honestly all the Python service needs to do for the hackathon demo.








