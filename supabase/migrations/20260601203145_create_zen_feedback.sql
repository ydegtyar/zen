create table if not exists public.zen_feedback (
  id uuid primary key default gen_random_uuid()
);

alter table public.zen_feedback
  add column if not exists created_at timestamp with time zone not null default now(),
  add column if not exists topic text not null default 'Feedback',
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists message text not null,
  add column if not exists user_agent text,
  add column if not exists page_url text,
  add column if not exists status text not null default 'new',
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_topic_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_topic_check
      check (topic in ('Feedback', 'Bug', 'Account', 'Other'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_status_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_status_check
      check (status in ('new', 'reviewed', 'closed', 'spam'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_name_length_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_name_length_check
      check (name is null or char_length(name) <= 120);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_email_length_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_email_length_check
      check (email is null or char_length(email) <= 320);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_message_length_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_message_length_check
      check (char_length(message) between 1 and 5000);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_user_agent_length_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_user_agent_length_check
      check (user_agent is null or char_length(user_agent) <= 512);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'zen_feedback_page_url_length_check'
      and conrelid = 'public.zen_feedback'::regclass
  ) then
    alter table public.zen_feedback
      add constraint zen_feedback_page_url_length_check
      check (page_url is null or char_length(page_url) <= 2048);
  end if;
end $$;

create index if not exists zen_feedback_created_at_idx
on public.zen_feedback (created_at desc);

create index if not exists zen_feedback_status_created_at_idx
on public.zen_feedback (status, created_at desc);

alter table public.zen_feedback enable row level security;

revoke all on table public.zen_feedback from anon, authenticated;
grant insert (topic, name, email, message, user_agent, page_url)
on public.zen_feedback
to anon, authenticated;

drop policy if exists "Anyone can submit feedback" on public.zen_feedback;

create policy "Anyone can submit feedback"
on public.zen_feedback
for insert
to anon, authenticated
with check (
  topic in ('Feedback', 'Bug', 'Account', 'Other')
  and status = 'new'
  and metadata = '{}'::jsonb
  and char_length(message) between 1 and 5000
  and (name is null or char_length(name) <= 120)
  and (email is null or char_length(email) <= 320)
  and (user_agent is null or char_length(user_agent) <= 512)
  and (page_url is null or char_length(page_url) <= 2048)
);
