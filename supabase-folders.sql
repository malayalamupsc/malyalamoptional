-- Run in Supabase > SQL Editor (safe to re-run, even if you ran an older version). No editing needed.
-- Collections: groups of articles shown as cards (with image + text) on the site.
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

  -- Card content for each collection (image, description, button text)
  alter table public.folders add column if not exists description text;
  alter table public.folders add column if not exists button_text text;
  alter table public.folders add column if not exists image_path text;

  -- Which collection an article belongs to (deleting a collection keeps its articles)
  alter table public.articles
    add column if not exists folder_id uuid references public.folders(id) on delete set null;

  raise notice 'Collections enabled. Admin: %', admin_email;
end $$;

notify pgrst, 'reload schema';
