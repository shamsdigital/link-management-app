import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vatszijupxpjfsxibxvg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdHN6aWp1cHhwamZzeGlieHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2NTUxOTksImV4cCI6MjA0NTIzMTE5OX0.Hf2Nevts7q3CmqzXVUFr2HGkPXHJkAiyuAO3_qT3FLI'

export const supabase = createClient(supabaseUrl, supabaseKey)

// SQL commands to run in Supabase SQL editor:
/*

-- Drop existing table if it exists
drop table if exists public.links;

-- Create the links table with all required fields
create table public.links (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  icon text not null,
  user_id uuid references auth.users not null
);

-- Enable Row Level Security
alter table public.links enable row level security;

-- Create policy for inserting links
create policy "Users can insert their own links"
on public.links for insert
to authenticated
with check (auth.uid() = user_id);

-- Create policy for selecting links
create policy "Users can view their own links"
on public.links for select
to authenticated
using (auth.uid() = user_id);

-- Create policy for deleting links
create policy "Users can delete their own links"
on public.links for delete
to authenticated
using (auth.uid() = user_id);

*/