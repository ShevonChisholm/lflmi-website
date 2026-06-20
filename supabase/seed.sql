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

insert into public.sermons (
  id,
  title,
  preacher_name,
  sermon_date,
  series,
  bible_text,
  description,
  video_url,
  audio_url,
  notes_url,
  thumbnail_url,
  duration_minutes,
  view_count,
  publication_status
)
values
  (
    '10000000-0000-0000-0000-000000000003',
    'Freedom for the Family',
    'Pastor Miriam Clarke',
    '2026-06-14T15:30:00+00',
    'Walking in Freedom',
    'Joshua 24:15',
    'A hope-filled message on building homes marked by worship, forgiveness, and spiritual courage.',
    'https://www.youtube.com/watch?v=example-family',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://example.com/sermon-notes/freedom-for-the-family.pdf',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&h=675&fit=crop&auto=format',
    51,
    214,
    'PUBLISHED'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'The Power of a Praying Church',
    'Apostle Daniel Reid',
    '2026-06-21T15:30:00+00',
    'Altars of Prayer',
    'Acts 12:5',
    'A stirring call for persistent prayer, unity, and expectation in the life of the church.',
    'https://www.youtube.com/watch?v=example-prayer',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://example.com/sermon-notes/praying-church.pdf',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=675&fit=crop&auto=format',
    58,
    342,
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
    '2026-06-27T23:00:00+00',
    '2026-06-28T02:00:00+00',
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
    '2026-07-11T14:00:00+00',
    '2026-07-11T19:00:00+00',
    'Liberty Community Centre',
    'Global Missions Team',
    true,
    120,
    'UPCOMING',
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
  image_url,
  organizer_name,
  is_registration_required,
  max_attendees,
  status,
  publication_status
)
values
  (
    '20000000-0000-0000-0000-000000000003',
    'Liberty Leadership Intensive',
    'Leadership',
    'A Saturday training for ministry leaders, volunteers, and emerging servant-leaders.',
    '2026-07-18T14:00:00+00',
    '2026-07-18T21:00:00+00',
    'Training Hall',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&auto=format',
    'Leadership Development Team',
    true,
    80,
    'UPCOMING',
    'PUBLISHED'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Night of Worship & Prayer',
    'Worship',
    'An extended evening of worship, intercession, testimonies, and ministry.',
    '2026-08-01T23:00:00+00',
    '2026-08-02T03:00:00+00',
    'Main Sanctuary',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop&auto=format',
    'Worship Arts Ministry',
    false,
    null,
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

insert into public.ministries (
  id,
  name,
  description,
  leader_name,
  contact_email,
  contact_phone,
  image_url,
  color,
  meeting_schedule,
  programs,
  member_count,
  volunteer_count,
  status,
  sort_order
)
values
  (
    '30000000-0000-0000-0000-000000000005',
    'Prayer & Care',
    'Intercession, pastoral care, hospital visits, counseling support, and practical help for families.',
    'Auntie Marcia Thompson',
    'care@lflmi.org',
    '+1 876 555 0110',
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1200&h=800&fit=crop&auto=format',
    '#D7261E',
    'Prayer room open Tuesdays and Saturdays',
    array['Prayer Chain', 'Hospital Visits', 'Care Calls'],
    64,
    22,
    'ACTIVE',
    5
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    'Life Groups',
    'Small groups across Kingston and online for discipleship, friendship, and practical Bible study.',
    'Deacon Andrew Brown',
    'lifegroups@lflmi.org',
    '+1 876 555 0111',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop&auto=format',
    '#16a34a',
    'Groups meet throughout the week',
    array['Young Families', 'Women of Liberty', 'Men of Purpose', 'Online Bible Study'],
    132,
    18,
    'ACTIVE',
    6
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
    '+1 876 555 0101',
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
    '+1 876 555 0102',
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
    '+1 876 555 0103',
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

insert into public.people (
  id,
  first_name,
  last_name,
  email,
  phone,
  address,
  preferred_contact_method,
  status,
  source,
  notes
)
values
  (
    '40000000-0000-0000-0000-000000000004',
    'Nadine',
    'Campbell',
    'nadine.campbell@example.com',
    '+1 876 555 0104',
    'Half Way Tree, Kingston',
    'EMAIL',
    'MEMBER',
    'Sunday Service',
    'Active member serving with hospitality and life groups.'
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    'Ricardo',
    'Williams',
    'ricardo.williams@example.com',
    '+1 876 555 0105',
    'Portmore, St. Catherine',
    'PHONE',
    'MEMBER',
    'Outreach',
    'Converted from visitor follow-up into membership class.'
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    'Shanice',
    'Henry',
    'shanice.henry@example.com',
    '+1 876 555 0106',
    'Spanish Town, St. Catherine',
    'EMAIL',
    'MEMBER',
    'Life Group',
    'Worship volunteer and youth mentor.'
  ),
  (
    '40000000-0000-0000-0000-000000000007',
    'Devon',
    'Grant',
    'devon.grant@example.com',
    '+1 876 555 0107',
    'New Kingston, Kingston',
    'PHONE',
    'FOLLOW_UP',
    'Website',
    'Requested a pastoral call after submitting a prayer request.'
  ),
  (
    '40000000-0000-0000-0000-000000000008',
    'Latoya',
    'Morrison',
    'latoya.morrison@example.com',
    '+1 876 555 0108',
    'Mandeville, Manchester',
    'EMAIL',
    'NEW',
    'Event Registration',
    'Registered for Family Faith Night with two children.'
  )
on conflict (id) do nothing;

insert into public.members (
  id,
  person_id,
  membership_number,
  join_date,
  role,
  status
)
values
  (
    '41000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000004',
    'LFLMI-2024-001',
    '2024-02-18T15:30:00+00',
    'Hospitality Volunteer',
    'ACTIVE'
  ),
  (
    '41000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000005',
    'LFLMI-2024-002',
    '2024-05-12T15:30:00+00',
    'Life Group Leader',
    'ACTIVE'
  ),
  (
    '41000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000006',
    'LFLMI-2025-001',
    '2025-01-19T15:30:00+00',
    'Worship Volunteer',
    'ACTIVE'
  )
on conflict (id) do nothing;

insert into public.ministry_memberships (
  id,
  ministry_id,
  member_id,
  role,
  joined_at,
  status
)
values
  (
    '42000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000005',
    '41000000-0000-0000-0000-000000000001',
    'VOLUNTEER',
    '2025-03-01T15:00:00+00',
    'ACTIVE'
  ),
  (
    '42000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000006',
    '41000000-0000-0000-0000-000000000002',
    'LEADER',
    '2025-04-08T23:00:00+00',
    'ACTIVE'
  ),
  (
    '42000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000003',
    '41000000-0000-0000-0000-000000000003',
    'VOLUNTEER',
    '2025-02-13T23:00:00+00',
    'ACTIVE'
  )
on conflict (id) do nothing;

insert into public.content_pages (
  id,
  slug,
  title,
  body,
  sections,
  seo_title,
  seo_description,
  publication_status
)
values
  (
    '43000000-0000-0000-0000-000000000001',
    'about-liberty',
    'About Liberty For Living',
    'Liberty For Living Ministries International is a Jamaica-based church family committed to helping people walk in the freedom, purpose, and hope found in Christ.',
    '[{"heading":"Our Heart","body":"We are a worshipping, praying, serving church that welcomes families, visitors, and seekers."},{"heading":"Our Community","body":"From Sunday worship to care groups, outreach, and Bible study, we create spaces for people to belong and grow."}]'::jsonb,
    'About Liberty For Living Ministries International',
    'Learn about the mission, story, and community life of Liberty For Living Ministries International.',
    'PUBLISHED'
  ),
  (
    '43000000-0000-0000-0000-000000000002',
    'new-here',
    'New Here',
    'Plan your first visit, meet our welcome team, and discover how to get connected at Liberty For Living.',
    '[{"heading":"What to Expect","body":"Warm hospitality, Christ-centered worship, practical teaching, and space to ask questions."},{"heading":"Next Steps","body":"Fill out a planned visit form, join a life group, or speak with our care team."}]'::jsonb,
    'New Here | Liberty For Living',
    'Everything first-time guests need to know before visiting Liberty For Living Ministries International.',
    'PUBLISHED'
  ),
  (
    '43000000-0000-0000-0000-000000000003',
    'faq',
    'Frequently Asked Questions',
    'Answers to common questions about visiting, getting connected, children, giving, prayer, and serving at Liberty For Living Ministries International.',
    '[{"question":"What should I expect when I visit?","answer":"You can expect warm hospitality, Christ-centered worship, practical teaching, and a welcome team ready to help you find your way. Come as you are."},{"question":"Do I need to register before attending a Sunday service?","answer":"No registration is required for Sunday services. If you are visiting for the first time, the Plan Your Visit form helps us prepare to welcome you well."},{"question":"Is there ministry for children?","answer":"Yes. Children''s Ministry provides safe, joyful, age-appropriate spaces during services so children can learn about Jesus and families can worship with peace of mind."},{"question":"How can I submit a prayer request?","answer":"Use the Prayer Request option on the website or speak with a member of the Prayer & Care team. You can choose to submit anonymously if the request is sensitive."},{"question":"How do I join a Life Group or ministry team?","answer":"Use the Ministries section to learn what is available, then contact the ministry leader or submit a contact request. Our team will help you take the next step."},{"question":"How can I give online?","answer":"Use the Give option on the website to view active giving programs and giving details. Gifts support ministry, outreach, care, youth, worship, and community impact."},{"question":"Where is the church based?","answer":"Liberty For Living Ministries International is based in Kingston, Jamaica, and serves families locally while also reaching people online and through missions."}]'::jsonb,
    'FAQ | Liberty For Living Ministries International',
    'Frequently asked questions about visiting, prayer, children, giving, ministries, and church life at Liberty For Living Ministries International.',
    'PUBLISHED'
  )
on conflict (id) do nothing;

insert into public.planned_visits (
  id,
  person_id,
  name,
  email,
  phone,
  service_name,
  visit_date,
  status,
  source,
  notes
)
values
  (
    '44000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000007',
    'Devon Grant',
    'devon.grant@example.com',
    '+1 876 555 0107',
    'Sunday Main Service',
    '2026-06-28T15:30:00+00',
    'CONFIRMED',
    'Website',
    'First visit with spouse; requested parking information.'
  ),
  (
    '44000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000008',
    'Latoya Morrison',
    'latoya.morrison@example.com',
    '+1 876 555 0108',
    'Sunday Early Service',
    '2026-07-05T13:00:00+00',
    'PENDING',
    'Event Registration',
    'Would like children ministry details before attending.'
  )
on conflict (id) do nothing;

insert into public.follow_ups (
  id,
  person_id,
  type,
  due_date,
  status,
  notes,
  completed_at
)
values
  (
    '45000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000002',
    'PHONE_CALL',
    '2026-06-22T20:00:00+00',
    'PENDING',
    'Call Michael about joining the Portmore life group.',
    null
  ),
  (
    '45000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000007',
    'PASTORAL_VISIT',
    '2026-06-24T21:00:00+00',
    'IN_PROGRESS',
    'Care team to coordinate a pastoral call and prayer support.',
    null
  ),
  (
    '45000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    'EMAIL',
    '2026-06-16T14:00:00+00',
    'COMPLETED',
    'Sent connect lunch follow-up and ministry interest links.',
    '2026-06-16T18:30:00+00'
  )
on conflict (id) do nothing;

insert into public.meetings (
  id,
  person_id,
  title,
  description,
  start_time,
  end_time,
  location,
  status,
  notes
)
values
  (
    '46000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000007',
    'Pastoral Care Call',
    'Initial call for prayer, encouragement, and next care steps.',
    '2026-06-24T21:00:00+00',
    '2026-06-24T21:30:00+00',
    'Phone',
    'SCHEDULED',
    'Assigned to care team after Sunday service.'
  ),
  (
    '46000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000005',
    'Membership Class Debrief',
    'Follow-up on serving interests and life group leadership.',
    '2026-06-18T23:00:00+00',
    '2026-06-19T00:00:00+00',
    'Church Office',
    'COMPLETED',
    'Confirmed leadership pathway and service schedule.'
  )
on conflict (id) do nothing;

insert into public.event_registrations (
  id,
  event_id,
  person_id,
  name,
  email,
  phone,
  attendee_count,
  status,
  notes
)
values
  (
    '47000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000008',
    'Latoya Morrison',
    'latoya.morrison@example.com',
    '+1 876 555 0108',
    3,
    'CONFIRMED',
    'Attending with two children.'
  ),
  (
    '47000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000004',
    'Nadine Campbell',
    'nadine.campbell@example.com',
    '+1 876 555 0104',
    1,
    'PENDING',
    'Interested in hospitality leadership training.'
  )
on conflict (id) do nothing;

insert into public.attendance_records (
  id,
  service_name,
  service_date,
  attendee_count,
  visitor_count,
  notes
)
values
  (
    '48000000-0000-0000-0000-000000000001',
    'Sunday Early Service',
    '2026-06-07T13:00:00+00',
    168,
    9,
    'Strong prayer response and two first-time families.'
  ),
  (
    '48000000-0000-0000-0000-000000000002',
    'Sunday Main Service',
    '2026-06-07T15:30:00+00',
    412,
    21,
    'Family dedication Sunday with high visitor turnout.'
  ),
  (
    '48000000-0000-0000-0000-000000000003',
    'Midweek Prayer',
    '2026-06-10T00:00:00+00',
    96,
    4,
    'Prayer focus for families and community outreach.'
  ),
  (
    '48000000-0000-0000-0000-000000000004',
    'Sunday Main Service',
    '2026-06-14T15:30:00+00',
    438,
    18,
    'Freedom for the Family sermon; several care cards submitted.'
  )
on conflict (id) do nothing;

insert into public.giving_programs (
  id,
  name,
  description,
  goal_amount,
  amount_raised,
  currency,
  color,
  icon,
  status
)
values
  (
    '49000000-0000-0000-0000-000000000001',
    'Community Care Fund',
    'Food support, school supplies, emergency care, and outreach resources for families across Kingston.',
    2500000.00,
    975000.00,
    'JMD',
    '#16a34a',
    'hand-heart',
    'ACTIVE'
  ),
  (
    '49000000-0000-0000-0000-000000000002',
    'Youth Camp Scholarships',
    'Helping students attend summer discipleship camp regardless of family income.',
    850000.00,
    410000.00,
    'JMD',
    '#0E5AA7',
    'graduation-cap',
    'ACTIVE'
  ),
  (
    '49000000-0000-0000-0000-000000000003',
    'Worship & Media Upgrade',
    'Audio, livestream, lighting, and media equipment for worship services and online ministry.',
    1800000.00,
    620000.00,
    'JMD',
    '#D7261E',
    'music',
    'ACTIVE'
  )
on conflict (id) do nothing;

insert into public.giving_transactions (
  id,
  program_id,
  person_id,
  giver_name,
  type,
  amount,
  currency,
  payment_method,
  received_at,
  reference,
  is_anonymous,
  notes
)
values
  (
    '4a000000-0000-0000-0000-000000000001',
    '49000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000004',
    'Nadine Campbell',
    'DONATION',
    75000.00,
    'JMD',
    'BANK_TRANSFER',
    '2026-06-12T17:30:00+00',
    'LFLMI-GIV-20260612-001',
    false,
    'Community care pantry support.'
  ),
  (
    '4a000000-0000-0000-0000-000000000002',
    '49000000-0000-0000-0000-000000000002',
    null,
    null,
    'OFFERING',
    125000.00,
    'JMD',
    'CARD',
    '2026-06-14T16:45:00+00',
    'LFLMI-GIV-20260614-001',
    true,
    'Anonymous camp scholarship gift.'
  ),
  (
    '4a000000-0000-0000-0000-000000000003',
    null,
    '40000000-0000-0000-0000-000000000005',
    'Ricardo Williams',
    'TITHE',
    58000.00,
    'JMD',
    'BANK_TRANSFER',
    '2026-06-16T13:00:00+00',
    'LFLMI-GIV-20260616-001',
    false,
    'Monthly tithe.'
  ),
  (
    '4a000000-0000-0000-0000-000000000004',
    '49000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000006',
    'Shanice Henry',
    'DONATION',
    45000.00,
    'JMD',
    'CASH',
    '2026-06-18T22:30:00+00',
    'LFLMI-GIV-20260618-001',
    false,
    'Worship and media upgrade.'
  )
on conflict (id) do nothing;

insert into public.contact_messages (
  id,
  name,
  email,
  phone,
  subject,
  message,
  status,
  resolved_at
)
values
  (
    '4b000000-0000-0000-0000-000000000001',
    'Alicia Brown',
    'alicia.brown@example.com',
    '+1 876 555 0120',
    'Plan a visit',
    'I would like to bring my family this Sunday. Can someone help us know where to park?',
    'NEW',
    null
  ),
  (
    '4b000000-0000-0000-0000-000000000002',
    'Marvin Ellis',
    'marvin.ellis@example.com',
    '+1 876 555 0121',
    'Volunteer with outreach',
    'I am interested in helping with the Community Care Outreach and food distribution.',
    'IN_PROGRESS',
    null
  ),
  (
    '4b000000-0000-0000-0000-000000000003',
    'Keisha Palmer',
    'keisha.palmer@example.com',
    null,
    'Bible study resources',
    'Thank you for sending the online Bible study resources. They were very helpful.',
    'RESOLVED',
    '2026-06-15T18:00:00+00'
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
  public_member_count,
  life_group_count,
  nations_reached,
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
  5000,
  12,
  8,
  '123 Liberty Way, Kingston, Jamaica',
  '+1 876 555 0100',
  'hello@lflmi.org',
  'https://www.lflmi.org',
  '{"facebook":"https://facebook.com/lflmi","instagram":"https://instagram.com/lflmi","youtube":"https://youtube.com/@lflmi","twitter":null}'::jsonb
)
on conflict (id) do nothing;

commit;
