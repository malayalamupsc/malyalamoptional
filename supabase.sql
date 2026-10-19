-- Run once in Supabase > SQL Editor. Replace YOUR_ADMIN_EMAIL (2 places in each policy) first.
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'General',
  html text not null,
  file_path text,
  created_at timestamptz not null default now()
);
alter table public.articles enable row level security;

create policy "public can read" on public.articles for select using (true);
create policy "admin can write" on public.articles for all to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- Storage bucket for the original .docx files
insert into storage.buckets (id, name, public) values ('docx', 'docx', true)
  on conflict (id) do nothing;
create policy "public can read docx" on storage.objects for select using (bucket_id = 'docx');
create policy "admin can write docx" on storage.objects for all to authenticated
  using (bucket_id = 'docx' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check (bucket_id = 'docx' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');
