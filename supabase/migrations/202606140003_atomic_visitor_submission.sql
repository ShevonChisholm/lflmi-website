begin;

create or replace function public.submit_visitor(
  p_first_name text,
  p_service_date timestamptz,
  p_last_name text default null,
  p_email text default null,
  p_phone text default null,
  p_address text default null,
  p_preferred_contact_method text default 'NONE',
  p_source text default null,
  p_person_notes text default null,
  p_is_first_time_visitor boolean default true,
  p_service_name text default null,
  p_visit_notes text default null,
  p_requires_follow_up boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_person_id uuid;
begin
  insert into public.people (
    first_name,
    last_name,
    email,
    phone,
    address,
    preferred_contact_method,
    source,
    notes
  )
  values (
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_address,
    p_preferred_contact_method,
    p_source,
    p_person_notes
  )
  returning id into new_person_id;

  insert into public.visitors (
    person_id,
    is_first_time_visitor,
    service_date,
    service_name,
    source,
    notes,
    requires_follow_up
  )
  values (
    new_person_id,
    p_is_first_time_visitor,
    p_service_date,
    p_service_name,
    p_source,
    p_visit_notes,
    p_requires_follow_up
  );

  return new_person_id;
end;
$$;

revoke all on function public.submit_visitor(
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  text,
  boolean
) from public;

grant execute on function public.submit_visitor(
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  text,
  boolean
) to anon;

revoke insert on public.people, public.visitors from anon;

drop policy if exists "Public can submit people" on public.people;
drop policy if exists "Public can submit visitor records" on public.visitors;

revoke insert (person_id)
  on public.planned_visits, public.prayer_requests, public.event_registrations
  from anon;

drop policy if exists "Public can submit planned visits" on public.planned_visits;
create policy "Public can submit planned visits"
on public.planned_visits
for insert
to anon
with check (
  person_id is null
  and status = 'PENDING'
);

drop policy if exists "Public can submit prayer requests" on public.prayer_requests;
create policy "Public can submit prayer requests"
on public.prayer_requests
for insert
to anon
with check (
  person_id is null
  and status = 'NEW'
  and prayer_count = 0
  and response is null
  and internal_notes is null
);

drop policy if exists "Public can register for published events" on public.event_registrations;
create policy "Public can register for published events"
on public.event_registrations
for insert
to anon
with check (
  person_id is null
  and status = 'PENDING'
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

commit;
