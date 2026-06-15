begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'images',
    'images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'audio',
    'audio',
    true,
    26214400,
    array['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm']
  ),
  (
    'videos',
    'videos',
    true,
    52428800,
    array['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'documents',
    'documents',
    true,
    10485760,
    array['application/pdf']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Active admins can upload public media" on storage.objects;
create policy "Active admins can upload public media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.is_active_admin()
);

drop policy if exists "Active admins can update public media" on storage.objects;
create policy "Active admins can update public media"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.is_active_admin()
)
with check (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.is_active_admin()
);

drop policy if exists "Active admins can delete public media" on storage.objects;
create policy "Active admins can delete public media"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('images', 'audio', 'videos', 'documents')
  and public.is_active_admin()
);

commit;
