-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;
DROP POLICY IF EXISTS "Users can view invites for their events" ON invites;
DROP POLICY IF EXISTS "Anyone can view invite by code" ON invites;
DROP POLICY IF EXISTS "Users can create invites for their events" ON invites;
DROP POLICY IF EXISTS "Anyone can update invite status" ON invites;

-- Disable RLS temporarily since we're using Clerk auth in API routes
-- The API routes will handle authorization
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE invites DISABLE ROW LEVEL SECURITY;

-- Note: Authorization is handled in API routes via Clerk authentication
-- Events are filtered by user_id in the API layer
-- Invites are publicly accessible via invite code for acceptance
