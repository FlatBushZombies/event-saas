-- Smart seater plan (tables + assignments)

CREATE TABLE IF NOT EXISTS seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
  order_index INTEGER NOT NULL DEFAULT 0,
  pos_x_percent REAL NOT NULL DEFAULT 50,
  pos_y_percent REAL NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seating_tables_event_id ON seating_tables(event_id);
CREATE INDEX IF NOT EXISTS idx_seating_tables_event_order ON seating_tables(event_id, order_index);

CREATE TABLE IF NOT EXISTS seating_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES seating_tables(id) ON DELETE CASCADE,
  invite_id UUID NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invite_id)
);

CREATE INDEX IF NOT EXISTS idx_seating_assignments_table_id ON seating_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_seating_assignments_invite_id ON seating_assignments(invite_id);

