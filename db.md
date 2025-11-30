# Charlie Image Board - Database Setup Guide

## Overview

This guide walks you through setting up the Supabase database for the Charlie image board application. The app requires tables for users and images, plus authentication for secure access.

---

## Prerequisites

- A Supabase project created (free tier is fine)
- Node.js and npm installed
- Charlie image board code cloned/downloaded

---

## Step 1: Connect Supabase to the Project

1. Go to your v0 project
2. Click **Connect** in the left sidebar
3. Select **Supabase**
4. Sign in with your Supabase account
5. Create a new Supabase project or select an existing one
6. The connection will automatically add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2: Database Schema

Run the following SQL in your Supabase SQL Editor to create the required tables:

### Users Table

\`\`\`sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own record
CREATE POLICY "Users can view their own record"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);
\`\`\`

### Images Table

\`\`\`sql
-- Create images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_images_uploaded_by ON images(uploaded_by);
CREATE INDEX idx_images_created_at ON images(created_at DESC);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view all images
CREATE POLICY "Anyone can view images"
  ON images FOR SELECT
  USING (true);

-- Allow users to insert their own images
CREATE POLICY "Users can insert their own images"
  ON images FOR INSERT
  WITH CHECK (uploaded_by = auth.uid()::uuid);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
  ON images FOR DELETE
  USING (uploaded_by = auth.uid()::uuid);
\`\`\`

### Storage Bucket for Images

\`\`\`sql
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('charlie-images', 'charlie-images', true);

-- Set up RLS policy for storage
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'charlie-images');

CREATE POLICY "Users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'charlie-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'charlie-images' AND owner = auth.uid());
\`\`\`

---

## Step 3: Update Environment Variables

Your environment variables should already be set by the integration. If not, add them manually in the **Vars** section:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

---

## Step 4: Implement Authentication

Update your auth logic to use Supabase. Replace the placeholder auth in `components/login-form.tsx`:

\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For sign up
const { data, error } = await supabase.auth.signUp({
  email: `${username}@charlie.local`,
  password: password,
})

// For sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: `${username}@charlie.local`,
  password: password,
})

// Store user info
await supabase.from('users').insert({
  username: username,
  password_hash: hashedPassword, // Use bcrypt to hash
})
\`\`\`

---

## Step 5: Image Upload

For image uploads, use Supabase Storage:

\`\`\`typescript
const { data, error } = await supabase.storage
  .from('charlie-images')
  .upload(`${userId}/${filename}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('charlie-images')
  .getPublicUrl(`${userId}/${filename}`)
\`\`\`

Then save metadata to the `images` table.

---

## Step 6: Security Checklist

- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] Users can only delete/modify their own images
- [ ] Public read access is enabled for image gallery
- [ ] Authenticated users can upload images
- [ ] Password hashing is implemented (use bcrypt)
- [ ] API keys are never exposed in client-side code

---

## Troubleshooting

### CORS Issues
If you get CORS errors when uploading, add your deployment domain to Supabase project settings:
- Settings > API > CORS allowed domains

### Authentication Errors
- Ensure environment variables are set correctly
- Check that users table exists with correct schema
- Verify email format (we use `username@charlie.local`)

### Image Upload Fails
- Check storage bucket permissions
- Verify file size is within limits (default 5MB)
- Ensure bucket name matches `charlie-images`

---

## Next Steps

1. Install Supabase SDK: `npm install @supabase/ssr @supabase/supabase-js`
2. Update API routes to use server-side client
3. Implement proper password hashing with bcrypt
4. Add email confirmation if needed
5. Test all auth flows
6. Deploy to Vercel

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
