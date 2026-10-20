-- Run ONCE in Supabase > SQL Editor (safe to re-run). No editing needed.
-- Adds "collections": groups of articles shown as cards on the site.
do $$
declare admin_email text;
begin
  select lower(email) into admin_email from auth.users order by created_at limit 1;
  if admin_email is null then
    raise exception 'No user found. Create your admin user first (Authentication > Users > Add user).';
  end if;

  create table if not exists public.folders (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    icon text not null default '1',
    created_at timestamptz not null default now()
  );
  alter table public.folders enable row level security;

  drop policy if exists "public can read folders" on public.folders;
  drop policy if exists "admin can write folders" on public.folders;
  create policy "public can read folders" on public.folders for select using (true);
  execute format($p$
    create policy "admin can write folders" on public.folders for all to authenticated
      using (lower(auth.jwt() ->> 'email') = %L)
      with check (lower(auth.jwt() ->> 'email') = %L)
  $p$, admin_email, admin_email);

  -- Which collection an article belongs to (deleting a collection keeps its articles)
  alter table public.articles
    add column if not exists folder_id uuid references public.folders(id) on delete set null;

  raise notice 'Collections enabled. Admin: %', admin_email;
end $$;

notify pgrst, 'reload schema';
