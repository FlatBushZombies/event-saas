-- Wedding timeline items shown to guests after they accept an invite.
CREATE TABLE IF NOT EXISTS event_timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time_label TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_timeline_items_event_id
ON event_timeline_items(event_id);

CREATE INDEX IF NOT EXISTS idx_event_timeline_items_event_order
ON event_timeline_items(event_id, order_index);
