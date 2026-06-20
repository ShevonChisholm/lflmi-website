begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'ADMIN'
    check (role in ('SUPER_ADMIN', 'ADMIN', 'PASTOR', 'EDITOR', 'CARE_TEAM')),
  permissions text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text,
  phone text,
  address text,
  preferred_contact_method text not null default 'NONE'
    check (preferred_contact_method in ('PHONE', 'EMAIL', 'NONE')),
  status text not null default 'NEW'
    check (status in ('NEW', 'FOLLOW_UP', 'RETURNING', 'MEMBER', 'INACTIVE')),
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null unique references public.people(id) on delete cascade,
  membership_number text unique,
  join_date timestamptz not null default now(),
  role text,
  status text not null default 'NEW'
    check (status in ('NEW', 'ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preacher_name text,
  sermon_date timestamptz,
  series text,
  bible_text text,
  description text,
  video_url text,
  audio_url text,
  notes_url text,
  thumbnail_url text,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text,
  description text,
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  image_url text,
  organizer_name text,
  is_registration_required boolean not null default false,
  max_attendees integer check (max_attendees is null or max_attendees > 0),
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'UPCOMING', 'PAST', 'CANCELLED')),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  leader_id uuid references public.members(id) on delete set null,
  leader_name text,
  contact_email text,
  contact_phone text,
  image_url text,
  icon text,
  color text,
  meeting_schedule text,
  programs text[] not null default '{}',
  member_count integer not null default 0 check (member_count >= 0),
  volunteer_count integer not null default 0 check (volunteer_count >= 0),
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'INACTIVE', 'ON_HOLD')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ministry_memberships (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  role text not null default 'MEMBER'
    check (role in ('MEMBER', 'VOLUNTEER', 'LEADER')),
  joined_at timestamptz not null default now(),
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ministry_id, member_id)
);

create table public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text,
  sections jsonb,
  seo_title text,
  seo_description text,
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'NEW'
    check (status in ('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED')),
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  is_first_time_visitor boolean not null default true,
  service_date timestamptz not null,
  service_name text,
  source text,
  notes text,
  requires_follow_up boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.planned_visits (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete set null,
  name text not null,
  email text,
  phone text,
  service_name text not null,
  visit_date timestamptz not null,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED')),
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete set null,
  name text,
  email text,
  phone text,
  is_anonymous boolean not null default false,
  request_text text not null,
  category text,
  urgency text not null default 'MEDIUM'
    check (urgency in ('LOW', 'MEDIUM', 'HIGH')),
  status text not null default 'NEW'
    check (status in ('NEW', 'OPEN', 'PRAYED', 'ANSWERED', 'CLOSED')),
  prayer_count integer not null default 0 check (prayer_count >= 0),
  response text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  type text not null default 'OTHER'
    check (type in ('PHONE_CALL', 'EMAIL', 'MESSAGE', 'PASTORAL_VISIT', 'OTHER')),
  due_date timestamptz,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  status text not null default 'SCHEDULED'
    check (status in ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or end_time >= start_time)
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  person_id uuid references public.people(id) on delete set null,
  name text not null,
  email text,
  phone text,
  attendee_count integer not null default 1 check (attendee_count > 0),
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'ATTENDED', 'CANCELLED')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  service_date timestamptz not null,
  attendee_count integer not null default 0 check (attendee_count >= 0),
  visitor_count integer not null default 0 check (visitor_count >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_name, service_date)
);

create table public.giving_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  goal_amount numeric(14, 2) check (goal_amount is null or goal_amount >= 0),
  amount_raised numeric(14, 2) not null default 0 check (amount_raised >= 0),
  currency text not null default 'NGN',
  color text,
  icon text,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.giving_transactions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.giving_programs(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  giver_name text,
  type text not null default 'DONATION'
    check (type in ('TITHE', 'OFFERING', 'DONATION', 'OTHER')),
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'NGN',
  payment_method text not null default 'OTHER'
    check (payment_method in ('BANK_TRANSFER', 'CARD', 'CASH', 'OTHER')),
  received_at timestamptz not null default now(),
  reference text unique,
  is_anonymous boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_times (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null
    check (day_of_week in ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  label text not null,
  time time not null,
  location text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.church_settings (
  id uuid primary key default gen_random_uuid(),
  church_name text not null,
  tagline text,
  bio text,
  vision text,
  mission text,
  founded_year integer check (founded_year is null or founded_year between 1 and 9999),
  public_member_count integer check (public_member_count is null or public_member_count >= 0),
  life_group_count integer check (life_group_count is null or life_group_count >= 0),
  nations_reached integer check (nations_reached is null or nations_reached >= 0),
  senior_pastor text,
  associate_pastor text,
  logo_url text,
  address text,
  phone text,
  email text,
  website text,
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index people_email_unique_idx
  on public.people (lower(email))
  where email is not null;
create index people_status_idx on public.people (status);
create index visitors_person_id_idx on public.visitors (person_id);
create index visitors_service_date_idx on public.visitors (service_date desc);
create index planned_visits_visit_date_idx on public.planned_visits (visit_date);
create index prayer_requests_status_idx on public.prayer_requests (status);
create index prayer_requests_person_id_idx on public.prayer_requests (person_id);
create index follow_ups_person_id_idx on public.follow_ups (person_id);
create index follow_ups_assigned_due_idx on public.follow_ups (assigned_to, due_date);
create index meetings_person_id_idx on public.meetings (person_id);
create index meetings_assigned_start_idx on public.meetings (assigned_to, start_time);
create index sermons_publication_date_idx on public.sermons (publication_status, sermon_date desc);
create index events_publication_start_idx on public.events (publication_status, start_date);
create index events_status_start_idx on public.events (status, start_date);
create index ministries_status_sort_idx on public.ministries (status, sort_order);
create index event_registrations_event_id_idx on public.event_registrations (event_id);
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);
create index giving_transactions_received_at_idx on public.giving_transactions (received_at desc);
create index giving_transactions_program_id_idx on public.giving_transactions (program_id);
create unique index church_settings_singleton_idx on public.church_settings ((true));

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
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

commit;
