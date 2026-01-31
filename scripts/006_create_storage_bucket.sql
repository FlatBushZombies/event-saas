-- Create storage bucket for event media
-- Run this in the Supabase SQL Editor or Dashboard

-- Create the bucket (private by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Allow authenticated users to upload to their event folders
CREATE POLICY "Users can upload media to their events"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-media'
);

-- Allow anyone to read media (access controlled via signed URLs)
CREATE POLICY "Anyone can read media with valid URL"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-media');

-- Allow users to delete their own media
CREATE POLICY "Users can delete their event media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-media');
