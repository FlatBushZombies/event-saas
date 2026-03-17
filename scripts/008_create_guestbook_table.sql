-- Create guestbook entries table
-- Each accepted invite can leave one personal message (upsertable).
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  invite_id UUID NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  attendee_name TEXT,
  attendee_email TEXT,
  message TEXT NOT NULL,
  photo_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invite_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_event_id ON guestbook_entries(event_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_invite_id ON guestbook_entries(invite_id);

