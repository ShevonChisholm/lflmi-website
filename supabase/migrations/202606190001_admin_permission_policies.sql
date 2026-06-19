begin;

create or replace function public.has_admin_permission(required_permission text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
      and (
        role = 'SUPER_ADMIN'
        or required_permission = any(permissions)
      )
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
      and role = 'SUPER_ADMIN'
  );
$$;

revoke all on function public.has_admin_permission(text) from public;
grant execute on function public.has_admin_permission(text) to authenticated;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_profiles',
    'people',
    'members',
    'sermons',
    'events',
    'ministries',
    'ministry_memberships',
    'content_pages',
    'contact_messages',
    'visitors',
    'planned_visits',
    'prayer_requests',
    'follow_ups',
    'meetings',
    'event_registrations',
    'attendance_records',
    'giving_programs',
    'giving_transactions',
    'service_times',
    'church_settings'
  ]
  loop
    execute format(
      'drop policy if exists "Active admins can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Active admins can view %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Admins with MANAGE_ADMINS can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Admins with MANAGE_CARE can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Admins with MANAGE_MEMBERS can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Admins with MANAGE_CMS can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'drop policy if exists "Admins with MANAGE_GIVING can manage %1$s" on public.%1$I',
      table_name
    );

    execute format(
      'create policy "Active admins can view %1$s" on public.%1$I for select to authenticated using (public.is_active_admin())',
      table_name
    );
  end loop;
end;
$$;

create policy "Admins with MANAGE_ADMINS can manage admin_profiles"
on public.admin_profiles
for all
to authenticated
using (public.has_admin_permission('MANAGE_ADMINS'))
with check (
  public.has_admin_permission('MANAGE_ADMINS')
  and (
    role <> 'SUPER_ADMIN'
    or public.is_super_admin()
  )
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'people',
    'visitors',
    'planned_visits',
    'prayer_requests',
    'follow_ups',
    'meetings',
    'contact_messages',
    'attendance_records'
  ]
  loop
    execute format(
      'create policy "Admins with MANAGE_CARE can manage %1$s" on public.%1$I for all to authenticated using (public.has_admin_permission(''MANAGE_CARE'')) with check (public.has_admin_permission(''MANAGE_CARE''))',
      table_name
    );
  end loop;
end;
$$;

create policy "Admins with MANAGE_MEMBERS can manage members"
on public.members
for all
to authenticated
using (public.has_admin_permission('MANAGE_MEMBERS'))
with check (public.has_admin_permission('MANAGE_MEMBERS'));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'sermons',
    'events',
    'event_registrations',
    'ministries',
    'ministry_memberships',
    'content_pages',
    'service_times',
    'church_settings'
  ]
  loop
    execute format(
      'create policy "Admins with MANAGE_CMS can manage %1$s" on public.%1$I for all to authenticated using (public.has_admin_permission(''MANAGE_CMS'')) with check (public.has_admin_permission(''MANAGE_CMS''))',
      table_name
    );
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'giving_programs',
    'giving_transactions'
  ]
  loop
    execute format(
      'create policy "Admins with MANAGE_GIVING can manage %1$s" on public.%1$I for all to authenticated using (public.has_admin_permission(''MANAGE_GIVING'')) with check (public.has_admin_permission(''MANAGE_GIVING''))',
      table_name
    );
  end loop;
end;
$$;

drop policy if exists "Active admins can upload public media" on storage.objects;
drop policy if exists "Active admins can update public media" on storage.objects;
drop policy if exists "Active admins can delete public media" on storage.objects;

drop policy if exists "Admins with MANAGE_CMS can upload public media" on storage.objects;
create policy "Admins with MANAGE_CMS can upload public media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.has_admin_permission('MANAGE_CMS')
);

drop policy if exists "Admins with MANAGE_CMS can update public media" on storage.objects;
create policy "Admins with MANAGE_CMS can update public media"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.has_admin_permission('MANAGE_CMS')
)
with check (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.has_admin_permission('MANAGE_CMS')
);

drop policy if exists "Admins with MANAGE_CMS can delete public media" on storage.objects;
create policy "Admins with MANAGE_CMS can delete public media"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.has_admin_permission('MANAGE_CMS')
);

commit;
