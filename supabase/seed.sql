begin;

insert into public.sermons (
  id,
  title,
  preacher_name,
  sermon_date,
  series,
  bible_text,
  description,
  video_url,
  duration_minutes,
  view_count,
  publication_status
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'Walking in the Freedom of Christ',
    'Pastor Emmanuel Adeyemi',
    '2026-06-07T10:30:00+00',
    'Walking in Freedom',
    'Galatians 5:1',
    'A message about standing firm in the freedom Christ provides.',
    'https://www.youtube.com/watch?v=example-one',
    46,
    128,
    'PUBLISHED'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Faith That Serves',
    'Pastor Yemi Adeyemi',
    '2026-05-31T10:30:00+00',
    'Living Faith',
    'James 2:14-18',
    'A practical invitation to express faith through loving service.',
    'https://www.youtube.com/watch?v=example-two',
    42,
    96,
    'PUBLISHED'
  )
on conflict (id) do nothing;

insert into public.events (
  id,
  title,
  event_type,
  description,
  start_date,
  end_date,
  location,
  organizer_name,
  is_registration_required,
  max_attendees,
  status,
  publication_status
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    'Family Faith Night',
    'Family',
    'An evening of worship, games, and fellowship for the whole family.',
    '2026-06-27T18:00:00+00',
    '2026-06-27T21:00:00+00',
    'Main Sanctuary',
    'Family Ministry Team',
    true,
    300,
    'UPCOMING',
    'PUBLISHED'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Community Care Outreach',
    'Outreach',
    'Serving local families through practical support and prayer.',
    '2026-07-11T09:00:00+00',
    '2026-07-11T14:00:00+00',
    'Liberty Community Centre',
    'Global Missions Team',
    true,
    120,
    'UPCOMING',
    'PUBLISHED'
  )
on conflict (id) do nothing;

insert into public.ministries (
  id,
  name,
  description,
  leader_name,
  contact_email,
  meeting_schedule,
  programs,
  member_count,
  volunteer_count,
  status,
  sort_order
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'Children''s Ministry',
    'Safe, joyful, and faith-filled environments for children.',
    'Grace Obi',
    'children@lflmi.org',
    'Sundays during all services',
    array['Sunday School', 'Kids Worship'],
    24,
    12,
    'ACTIVE',
    1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Youth & Young Adults',
    'Helping the next generation grow in faith, purpose, and community.',
    'Kola Abiodun',
    'youth@lflmi.org',
    'Fridays at 6:00 PM',
    array['Youth Service', 'Mentorship'],
    87,
    8,
    'ACTIVE',
    2
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Worship Arts',
    'Serving the church through music, media, and creative expression.',
    'Esther Ike',
    'worship@lflmi.org',
    'Thursdays at 6:00 PM',
    array['Choir', 'Band', 'Media'],
    45,
    5,
    'ACTIVE',
    3
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Global Missions',
    'Sharing the love of Christ through local and international outreach.',
    'Fatima Al-Hassan',
    'missions@lflmi.org',
    'Bi-weekly Tuesdays at 7:00 PM',
    array['Local Outreach', 'Missionary Support'],
    38,
    15,
    'ACTIVE',
    4
  )
on conflict (id) do nothing;

insert into public.people (
  id,
  first_name,
  last_name,
  email,
  phone,
  preferred_contact_method,
  status,
  source,
  notes
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'Adaeze',
    'Okonkwo',
    'adaeze.example@example.com',
    '+234 800 000 0001',
    'EMAIL',
    'NEW',
    'Friend Referral',
    'Interested in learning more about the church community.'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Michael',
    'Osei',
    'michael.example@example.com',
    '+234 800 000 0002',
    'PHONE',
    'FOLLOW_UP',
    'Social Media',
    'Interested in joining a life group.'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'Grace',
    'Mensah',
    'grace.example@example.com',
    '+234 800 000 0003',
    'EMAIL',
    'RETURNING',
    'Website',
    'Returning visitor who attended the connect lunch.'
  )
on conflict (id) do nothing;

insert into public.visitors (
  id,
  person_id,
  is_first_time_visitor,
  service_date,
  service_name,
  source,
  notes,
  requires_follow_up
)
values
  (
    '50000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    true,
    '2026-06-07T10:30:00+00',
    'Sunday Main Service',
    'Friend Referral',
    'Welcomed by the hospitality team.',
    false
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000002',
    true,
    '2026-06-07T08:00:00+00',
    'Sunday Early Service',
    'Social Media',
    'Requested information about life groups.',
    true
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    false,
    '2026-06-14T10:30:00+00',
    'Sunday Main Service',
    'Website',
    'Stayed for the connect lunch.',
    false
  )
on conflict (id) do nothing;

insert into public.prayer_requests (
  id,
  person_id,
  name,
  email,
  is_anonymous,
  request_text,
  category,
  urgency,
  status,
  prayer_count
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    null,
    null,
    null,
    true,
    'Please pray for strength and peace for a family facing a difficult season.',
    'Family',
    'HIGH',
    'OPEN',
    4
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000002',
    'Michael Osei',
    'michael.example@example.com',
    false,
    'Please pray for wisdom and direction as I make an important decision.',
    'Spiritual',
    'MEDIUM',
    'PRAYED',
    2
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    'Grace Mensah',
    'grace.example@example.com',
    false,
    'Please pray for good health and renewed strength.',
    'Health',
    'LOW',
    'OPEN',
    1
  )
on conflict (id) do nothing;

insert into public.service_times (
  id,
  day_of_week,
  label,
  time,
  location,
  sort_order,
  is_active
)
values
  (
    '70000000-0000-0000-0000-000000000001',
    'Sunday',
    'Early Service',
    '08:00',
    'Main Sanctuary',
    1,
    true
  ),
  (
    '70000000-0000-0000-0000-000000000002',
    'Sunday',
    'Main Service',
    '10:30',
    'Main Sanctuary',
    2,
    true
  ),
  (
    '70000000-0000-0000-0000-000000000003',
    'Wednesday',
    'Midweek Prayer',
    '19:00',
    'Main Sanctuary',
    3,
    true
  )
on conflict (id) do nothing;

insert into public.church_settings (
  id,
  church_name,
  tagline,
  vision,
  mission,
  founded_year,
  address,
  phone,
  email,
  website,
  social_links
)
values (
  '80000000-0000-0000-0000-000000000001',
  'Liberty For Living Ministries International',
  'Walking in freedom. Living in purpose. Together in Christ.',
  'To see every person walk in the fullness of the liberty Christ provides.',
  'To make disciples, build authentic community, and transform lives.',
  2005,
  '123 Liberty Way, Abuja, Nigeria',
  '+234 800 LIBERTY',
  'hello@lflmi.org',
  'https://www.lflmi.org',
  '{"facebook":"https://facebook.com/lflmi","instagram":"https://instagram.com/lflmi","youtube":"https://youtube.com/@lflmi","twitter":null}'::jsonb
)
on conflict (id) do nothing;

commit;
