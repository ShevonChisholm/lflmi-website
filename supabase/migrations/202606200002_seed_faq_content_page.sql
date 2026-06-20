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
values (
  '43000000-0000-0000-0000-000000000003',
  'faq',
  'Frequently Asked Questions',
  'Answers to common questions about visiting, getting connected, children, giving, prayer, and serving at Liberty For Living Ministries International.',
  '[{"question":"What should I expect when I visit?","answer":"You can expect warm hospitality, Christ-centered worship, practical teaching, and a welcome team ready to help you find your way. Come as you are."},{"question":"Do I need to register before attending a Sunday service?","answer":"No registration is required for Sunday services. If you are visiting for the first time, the Plan Your Visit form helps us prepare to welcome you well."},{"question":"Is there ministry for children?","answer":"Yes. Children''s Ministry provides safe, joyful, age-appropriate spaces during services so children can learn about Jesus and families can worship with peace of mind."},{"question":"How can I submit a prayer request?","answer":"Use the Prayer Request option on the website or speak with a member of the Prayer & Care team. You can choose to submit anonymously if the request is sensitive."},{"question":"How do I join a Life Group or ministry team?","answer":"Use the Ministries section to learn what is available, then contact the ministry leader or submit a contact request. Our team will help you take the next step."},{"question":"How can I give online?","answer":"Use the Give option on the website to view active giving programs and giving details. Gifts support ministry, outreach, care, youth, worship, and community impact."},{"question":"Where is the church based?","answer":"Liberty For Living Ministries International is based in Kingston, Jamaica, and serves families locally while also reaching people online and through missions."}]'::jsonb,
  'FAQ | Liberty For Living Ministries International',
  'Frequently asked questions about visiting, prayer, children, giving, ministries, and church life at Liberty For Living Ministries International.',
  'PUBLISHED'
)
on conflict (slug) do update
set
  title = excluded.title,
  body = excluded.body,
  sections = excluded.sections,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  publication_status = excluded.publication_status;
