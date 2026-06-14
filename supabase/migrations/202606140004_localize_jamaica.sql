begin;

update public.church_settings
set
  address = '123 Liberty Way, Kingston, Jamaica',
  phone = '+1 876 555 0100',
  updated_at = now()
where id = '80000000-0000-0000-0000-000000000001';

update public.events
set
  start_date = '2026-06-27T23:00:00+00',
  end_date = '2026-06-28T02:00:00+00',
  updated_at = now()
where id = '20000000-0000-0000-0000-000000000001';

update public.events
set
  start_date = '2026-07-11T14:00:00+00',
  end_date = '2026-07-11T19:00:00+00',
  updated_at = now()
where id = '20000000-0000-0000-0000-000000000002';

commit;
