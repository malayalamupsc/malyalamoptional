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

  -- Collections inside collections: parent_id points at the collection that holds this one.
  -- (deleting a parent keeps its sub-collections; they move up to the top level)
  alter table public.folders
    add column if not exists parent_id uuid references public.folders(id) on delete set null;

  raise notice 'Collections enabled. Admin: %', admin_email;
end $$;

-- Safety net: a collection can never be placed inside itself or inside one of its own sub-collections.
create or replace function public.folders_no_cycle() returns trigger language plpgsql as $f$
declare cur uuid := new.parent_id; hops int := 0;
begin
  while cur is not null loop
    if cur = new.id then raise exception 'A collection cannot be placed inside itself.'; end if;
    select parent_id into cur from public.folders where id = cur;
    hops := hops + 1;
    if hops > 50 then raise exception 'Collections are nested too deeply.'; end if;
  end loop;
  return new;
end $f$;
drop trigger if exists folders_no_cycle on public.folders;
create trigger folders_no_cycle before insert or update of parent_id on public.folders
  for each row execute function public.folders_no_cycle();

notify pgrst, 'reload schema';
