import type {
  ContentPage,
  Event,
  Ministry,
  Person,
  PlannedVisit,
  PrayerRequest,
  Sermon,
} from "@/types";

import type { TableRow } from "../supabase/database.types";

export const mapSermon = (row: TableRow<"sermons">): Sermon => ({
  id: row.id,
  title: row.title,
  preacherName: row.preacher_name,
  sermonDate: row.sermon_date,
  series: row.series,
  bibleText: row.bible_text,
  description: row.description,
  videoUrl: row.video_url,
  audioUrl: row.audio_url,
  notesUrl: row.notes_url,
  thumbnailUrl: row.thumbnail_url,
  durationMinutes: row.duration_minutes,
  viewCount: row.view_count,
  publicationStatus: row.publication_status as Sermon["publicationStatus"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapEvent = (row: TableRow<"events">): Event => ({
  id: row.id,
  title: row.title,
  eventType: row.event_type,
  description: row.description,
  startDate: row.start_date,
  endDate: row.end_date,
  location: row.location,
  imageUrl: row.image_url,
  organizerName: row.organizer_name,
  isRegistrationRequired: row.is_registration_required,
  maxAttendees: row.max_attendees,
  status: row.status as Event["status"],
  publicationStatus: row.publication_status as Event["publicationStatus"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapMinistry = (row: TableRow<"ministries">): Ministry => ({
  id: row.id,
  name: row.name,
  description: row.description,
  leaderId: row.leader_id,
  leaderName: row.leader_name,
  contactEmail: row.contact_email,
  contactPhone: row.contact_phone,
  imageUrl: row.image_url,
  icon: row.icon,
  color: row.color,
  meetingSchedule: row.meeting_schedule,
  programs: row.programs,
  memberCount: row.member_count,
  volunteerCount: row.volunteer_count,
  status: row.status as Ministry["status"],
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapContentPage = (
  row: TableRow<"content_pages">,
): ContentPage => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  body: row.body,
  sections: row.sections,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  publicationStatus: row.publication_status as ContentPage["publicationStatus"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapPerson = (row: TableRow<"people">): Person => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  preferredContactMethod:
    row.preferred_contact_method as Person["preferredContactMethod"],
  status: row.status as Person["status"],
  source: row.source,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapPrayerRequest = (
  row: TableRow<"prayer_requests">,
): PrayerRequest => ({
  id: row.id,
  personId: row.person_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  isAnonymous: row.is_anonymous,
  requestText: row.request_text,
  category: row.category,
  urgency: row.urgency as PrayerRequest["urgency"],
  status: row.status as PrayerRequest["status"],
  prayerCount: row.prayer_count,
  response: row.response,
  internalNotes: row.internal_notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapPlannedVisit = (
  row: TableRow<"planned_visits">,
): PlannedVisit => ({
  id: row.id,
  personId: row.person_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  serviceName: row.service_name,
  visitDate: row.visit_date,
  status: row.status as PlannedVisit["status"],
  source: row.source,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
