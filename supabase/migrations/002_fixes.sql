-- ============================================
-- Fixes: RLS policies, participant helper, trigger fix
-- Run this AFTER 001_schema.sql
-- ============================================

-- 0. Fix handle_new_user trigger (avatar_url column mismatch)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

-- 1. Add missing UPDATE policy for conversation_participants
create policy "Users can update own participation"
  on public.conversation_participants for update using (auth.uid() = user_id);

-- 2. Add missing UPDATE policy for messages
create policy "Users can update messages in their conversations"
  on public.messages for update using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
  );

-- 3. SECURITY DEFINER function to add conversation participants
-- (bypasses RLS so the initial participant can add the other user)
create or replace function public.add_conversation_participant(
  conv_id uuid,
  participant_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.conversation_participants (conversation_id, user_id)
  values (conv_id, participant_id)
  on conflict (conversation_id, user_id) do nothing;
end;
$$;

-- 4. Add missing DELETE policy for message-media bucket
create policy "Users can delete own message media"
  on storage.objects for delete using (
    bucket_id = 'message-media' and owner = auth.uid()
  );
