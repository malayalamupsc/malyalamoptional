-- Run in Supabase > SQL Editor. Safe to re-run.
-- STEP: change ONLY the email on the next line (keep the quotes), then click Run.
do $$
declare admin_email text := 'PUT_YOUR_EMAIL_HERE';
begin

  -- Table for articles
  create table if not exists public.articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category text not null default 'General',
    html text not null,
    file_path text,
    created_at timestamptz not null default now()
  );
  alter table public.articles enable row level security;

  -- Remove old policies (from any earlier run)
  drop policy if exists "public can read" on public.articles;
  drop policy if exists "admin can write" on public.articles;
  drop policy if exists "public can read docx" on storage.objects;
  drop policy if exists "admin can write docx" on storage.objects;

  -- Everyone can read articles
  create policy "public can read" on public.articles
    for select using (true);

  -- Only the admin email can add/edit/delete articles
  execute format($p$
    create policy "admin can write" on public.articles for all to authenticated
      using ((auth.jwt() ->> 'email') = %L)
      with check ((auth.jwt() ->> 'email') = %L)
  $p$, admin_email, admin_email);

  -- Storage bucket for the original .docx files
  insert into storage.buckets (id, name, public)
    values ('docx', 'docx', true)
    on conflict (id) do nothing;

  create policy "public can read docx" on storage.objects
    for select using (bucket_id = 'docx');

  execute format($p$
    create policy "admin can write docx" on storage.objects for all to authenticated
      using (bucket_id = 'docx' and (auth.jwt() ->> 'email') = %L)
      with check (bucket_id = 'docx' and (auth.jwt() ->> 'email') = %L)
  $p$, admin_email, admin_email);

end $$;
