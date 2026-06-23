-- ============================================
-- JustUs Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  website text,
  phone text,
  is_verified boolean default false,
  is_private boolean default false,
  theme_preference text default 'system' check (theme_preference in ('light', 'dark', 'system')),
  language text default 'en',
  notification_preferences jsonb default '{"likes":true,"comments":true,"follows":true,"messages":true,"calls":true}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  caption text check (char_length(caption) <= 2200),
  media_urls text[] default '{}',
  media_types text[] default '{}',
  location text,
  hashtags text[] default '{}',
  is_archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_posts_hashtags on public.posts using gin(hashtags);

-- 3. Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_comments_post_id on public.comments(post_id);

-- 4. Likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

create index if not exists idx_likes_post_id on public.likes(post_id);

-- 5. Follows
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id),
  constraint follows_no_self check (follower_id != following_id)
);

create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- 6. Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Conversation Participants
create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz default now(),
  unique(conversation_id, user_id)
);

-- 8. Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  media_url text,
  media_type text check (media_type in ('image', 'audio', 'video')),
  voice_duration int,
  status text default 'sent' check (status in ('sending', 'sent', 'delivered', 'seen')),
  reply_to_id uuid references public.messages(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at desc);

-- 9. Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('follow', 'like', 'comment', 'message', 'call')),
  reference_id uuid,
  reference_type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

-- 10. Calls
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  caller_id uuid not null references public.profiles(id) on delete cascade,
  callee_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('voice', 'video')),
  status text not null check (status in ('missed', 'completed', 'declined', 'cancelled')),
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_seconds int
);

create index if not exists idx_calls_user on public.calls(caller_id, callee_id);

-- 11. Blocked Users
create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

-- 12. Saved Posts
create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger if not exists posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at();

-- Get or create direct conversation
create or replace function public.get_direct_conversation(user_a uuid, user_b uuid)
returns uuid
language sql
as $$
  select cp1.conversation_id
  from public.conversation_participants cp1
  join public.conversation_participants cp2
    on cp1.conversation_id = cp2.conversation_id
  join public.conversations c
    on c.id = cp1.conversation_id
  where cp1.user_id = user_a
    and cp2.user_id = user_b
    and c.type = 'direct'
  limit 1;
$$;

-- Auto-create notification on follow
create or replace function public.handle_follow_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type, reference_id, reference_type)
  values (new.following_id, new.follower_id, 'follow', new.follower_id, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_follow_created on public.follows;
create trigger on_follow_created
  after insert on public.follows
  for each row execute function public.handle_follow_notification();

-- Auto-create notification on like
create or replace function public.handle_like_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type, reference_id, reference_type)
  select p.user_id, new.user_id, 'like', new.post_id, 'post'
  from public.posts p
  where p.id = new.post_id and p.user_id != new.user_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_like_created on public.likes;
create trigger on_like_created
  after insert on public.likes
  for each row execute function public.handle_like_notification();

-- Auto-create notification on comment
create or replace function public.handle_comment_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type, reference_id, reference_type)
  select p.user_id, new.user_id, 'comment', new.post_id, 'post'
  from public.posts p
  where p.id = new.post_id and p.user_id != new.user_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_comment_created on public.comments;
create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.handle_comment_notification();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.calls enable row level security;
alter table public.blocked_users enable row level security;
alter table public.saved_posts enable row level security;

-- Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Posts
create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Users can insert own posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- Comments
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Users can insert own comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Likes
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can insert own likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- Follows
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can manage own follows"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can delete own follows"
  on public.follows for delete using (auth.uid() = follower_id);

-- Conversations
create policy "Users can view their conversations"
  on public.conversations for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = id and user_id = auth.uid()
    )
  );

create policy "Users can create conversations"
  on public.conversations for insert with check (true);

-- Conversation Participants
create policy "Users can view participants in their conversations"
  on public.conversation_participants for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
        and user_id = auth.uid()
    )
  );

create policy "Users can join conversations"
  on public.conversation_participants for insert with check (
    user_id = auth.uid()
  );

-- Messages
create policy "Users can view messages in their conversations"
  on public.messages for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
  );

create policy "Users can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
  );

-- Notifications
create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- Calls
create policy "Users can view their calls"
  on public.calls for select using (
    auth.uid() in (caller_id, callee_id)
  );

create policy "Users can create calls"
  on public.calls for insert with check (auth.uid() = caller_id);

create policy "Users can update calls they're in"
  on public.calls for update using (
    auth.uid() in (caller_id, callee_id)
  );

-- Blocked Users
create policy "Users can manage their blocks"
  on public.blocked_users for select using (auth.uid() = blocker_id);

create policy "Users can block others"
  on public.blocked_users for insert with check (auth.uid() = blocker_id);

create policy "Users can unblock"
  on public.blocked_users for delete using (auth.uid() = blocker_id);

-- Saved Posts
create policy "Users can view own saved posts"
  on public.saved_posts for select using (auth.uid() = user_id);

create policy "Users can save posts"
  on public.saved_posts for insert with check (auth.uid() = user_id);

create policy "Users can unsave posts"
  on public.saved_posts for delete using (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', true),
  ('message-media', 'message-media', true)
on conflict (id) do nothing;

-- Avatars: anyone can view, authenticated users can upload/delete their own
create policy "Avatars are public"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload avatars"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.role() = 'authenticated'
  );

create policy "Users can delete own avatars"
  on storage.objects for delete using (
    bucket_id = 'avatars' and owner = auth.uid()
  );

-- Post media: anyone can view, authenticated users can upload/delete
create policy "Post media is public"
  on storage.objects for select using (bucket_id = 'post-media');

create policy "Users can upload post media"
  on storage.objects for insert with check (
    bucket_id = 'post-media' and auth.role() = 'authenticated'
  );

create policy "Users can delete own post media"
  on storage.objects for delete using (
    bucket_id = 'post-media' and owner = auth.uid()
  );

-- Message media: conversation participants can view
create policy "Message media for participants"
  on storage.objects for select using (
    bucket_id = 'message-media'
    and exists (
      select 1 from public.conversation_participants cp
      join public.messages m on m.conversation_id = cp.conversation_id
      where cp.user_id = auth.uid()
        and m.media_url like '%' || storage.objects.name
    )
  );

create policy "Users can upload message media"
  on storage.objects for insert with check (
    bucket_id = 'message-media' and auth.role() = 'authenticated'
  );

-- ============================================
-- REALTIME
-- ============================================

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.calls;
