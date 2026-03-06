Here are the tables for the AI native version:

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR UNIQUE,
  role VARCHAR CHECK (role IN ('tenant', 'landlord')),
  preferred_language VARCHAR DEFAULT 'english'
    CHECK (preferred_language IN ('english','hindi','tamil','telugu','kannada','marathi')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**properties**
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**units**
```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_number VARCHAR NOT NULL,
  floor INTEGER,
  rent_amount DECIMAL NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**tenancies**
```sql
CREATE TABLE tenancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  deposit_amount DECIMAL NOT NULL,
  status VARCHAR DEFAULT 'active'
    CHECK (status IN ('active','expired','terminated')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**vendors**
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  specialty VARCHAR CHECK (specialty IN ('plumbing','electrical','carpentry','painting','cleaning','other')),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**maintenance_tickets**
```sql
CREATE TABLE maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  issue_category VARCHAR CHECK (issue_category IN ('plumbing','electrical','carpentry','painting','cleaning','other')),
  issue_description TEXT NOT NULL,
  priority VARCHAR DEFAULT 'low'
    CHECK (priority IN ('low','medium','high','emergency')),
  status VARCHAR DEFAULT 'open'
    CHECK (status IN ('open','assigned','in_progress','resolved')),
  ai_severity_score INTEGER,
  ai_summary TEXT,
  scheduled_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**ticket_images**
```sql
CREATE TABLE ticket_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
  image_url VARCHAR NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

**activity_log**
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  notes TEXT,
  performed_at TIMESTAMP DEFAULT NOW()
);
```

---

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES maintenance_tickets(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR DEFAULT 'ticket_created'
    CHECK (type IN ('ticket_created','ticket_assigned','status_changed','rent_due','lease_expiring')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**call_logs** (AI native — Sara's actions)
```sql
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id) ON DELETE SET NULL,
  landlord_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES maintenance_tickets(id) ON DELETE SET NULL,
  initiated_by VARCHAR CHECK (initiated_by IN ('agent','tenant','landlord')),
  transcript TEXT,
  summary TEXT,
  outcome VARCHAR,
  language_used VARCHAR,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**10 tables total.** The key difference from before is `ai_severity_score`, `ai_summary` in tickets and the full `call_logs` table are now in from day one since this is AI native. Sara's actions get logged from the start. Ready to set up the folder structure?

---

**auth.users Trigger (Auto-sync)**
Whenever someone signs up in Supabase (Google or Email/Password), this drops them into the `public.users` table:
```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Unknown User'), 
    coalesce(new.raw_user_meta_data->>'role', 'landlord')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```