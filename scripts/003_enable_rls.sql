-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid()::TEXT = user_id);

-- Invites policies
CREATE POLICY "Users can view invites for their events"
  ON invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = invites.event_id 
      AND events.user_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Anyone can view invite by code"
  ON invites FOR SELECT
  USING (true);

CREATE POLICY "Users can create invites for their events"
  ON invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = invites.event_id 
      AND events.user_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Anyone can update invite status"
  ON invites FOR UPDATE
  USING (true);
