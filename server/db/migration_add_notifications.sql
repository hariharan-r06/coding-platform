-- 1. Add admin_notes column to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL, 
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add RLS Policies for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" 
ON notifications FOR INSERT 
WITH CHECK (true);

-- 4. Add our_video_url column to problems (if not already added)
ALTER TABLE problems ADD COLUMN IF NOT EXISTS our_video_url TEXT;

-- 5. Grant permissions if necessary (Supabase handles this usually)
GRANT ALL ON TABLE notifications TO service_role;
GRANT ALL ON TABLE notifications TO postgres;
