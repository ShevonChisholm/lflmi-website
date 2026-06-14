begin;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

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
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

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
      'revoke all on public.%I from anon, authenticated',
      table_name
    );
  end loop;
end;
$$;

grant select on public.sermons, public.events, public.ministries,
  public.content_pages, public.service_times, public.church_settings
  to anon, authenticated;

grant insert (name, email, phone, subject, message)
  on public.contact_messages to anon;

grant insert (
  id,
  first_name,
  last_name,
  email,
  phone,
  address,
  preferred_contact_method,
  source,
  notes
)
  on public.people to anon;

grant insert (
  person_id,
  is_first_time_visitor,
  service_date,
  service_name,
  source,
  notes,
  requires_follow_up
)
  on public.visitors to anon;

grant insert (
  person_id,
  name,
  email,
  phone,
  service_name,
  visit_date,
  source,
  notes
)
  on public.planned_visits to anon;

grant insert (
  person_id,
  name,
  email,
  phone,
  is_anonymous,
  request_text,
  category,
  urgency
)
  on public.prayer_requests to anon;

grant insert (
  event_id,
  person_id,
  name,
  email,
  phone,
  attendee_count,
  notes
)
  on public.event_registrations to anon;

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
      'grant select, insert, update, delete on public.%I to authenticated',
      table_name
    );
  end loop;
end;
$$;

create policy "Public can read published sermons"
on public.sermons
for select
to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read active ministries"
on public.ministries
for select
to anon, authenticated
using (status = 'ACTIVE');

create policy "Public can read published content pages"
on public.content_pages
for select
to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read active service times"
on public.service_times
for select
to anon, authenticated
using (is_active = true);

create policy "Public can read church settings"
on public.church_settings
for select
to anon, authenticated
using (true);

create policy "Public can submit contact messages"
on public.contact_messages
for insert
to anon
with check (
  status = 'NEW'
  and assigned_to is null
  and resolved_at is null
);

create policy "Public can submit people"
on public.people
for insert
to anon
with check (status = 'NEW');

create policy "Public can submit visitor records"
on public.visitors
for insert
to anon
with check (true);

create policy "Public can submit planned visits"
on public.planned_visits
for insert
to anon
with check (status = 'PENDING');

create policy "Public can submit prayer requests"
on public.prayer_requests
for insert
to anon
with check (
  status = 'NEW'
  and prayer_count = 0
  and response is null
  and internal_notes is null
);

create policy "Public can register for published events"
on public.event_registrations
for insert
to anon
with check (
  status = 'PENDING'
  and exists (
    select 1
    from public.events
    where events.id = event_registrations.event_id
      and events.publication_status = 'PUBLISHED'
      and events.status = 'UPCOMING'
      and events.start_date >= now()
      and events.is_registration_required = true
  )
);

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
      'create policy "Active admins can manage %1$s" on public.%1$I for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin())',
      table_name
    );
  end loop;
end;
$$;

commit;
