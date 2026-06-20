alter table public.church_settings
  add column if not exists public_member_count integer check (public_member_count is null or public_member_count >= 0),
  add column if not exists life_group_count integer check (life_group_count is null or life_group_count >= 0),
  add column if not exists nations_reached integer check (nations_reached is null or nations_reached >= 0);

update public.church_settings
set
  public_member_count = coalesce(public_member_count, 5000),
  life_group_count = coalesce(life_group_count, 12),
  nations_reached = coalesce(nations_reached, 8)
where id = '80000000-0000-0000-0000-000000000001';
