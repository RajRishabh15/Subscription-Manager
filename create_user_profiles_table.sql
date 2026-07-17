-- Run this once in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/abecitvproprkxhbtwtt/sql/new

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write profiles (works with mock login)
CREATE POLICY "Open access for profile sync"
  ON public.user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);
