import type {
  AdminProfile,
  ContactMessage,
  ContentPage,
  Event,
  EventRegistration,
  FollowUp,
  GivingProgram,
  GivingTransaction,
  Ministry,
  Member,
  Meeting,
  Person,
  PlannedVisit,
  PrayerRequest,
  Sermon,
  ServiceTime,
  ChurchSettings,
  SocialLinks,
  AttendanceRecord,
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

export const mapAdminProfile = (
  row: TableRow<"admin_profiles">,
): AdminProfile => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  role: row.role as AdminProfile["role"],
  permissions: row.permissions as AdminProfile["permissions"],
  isActive: row.is_active,
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

export const mapEventRegistration = (
  row: TableRow<"event_registrations">,
): EventRegistration => ({
  id: row.id,
  eventId: row.event_id,
  personId: row.person_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  attendeeCount: row.attendee_count,
  status: row.status as EventRegistration["status"],
  notes: row.notes,
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

export const mapContactMessage = (
  row: TableRow<"contact_messages">,
): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  subject: row.subject,
  message: row.message,
  status: row.status as ContactMessage["status"],
  assignedTo: row.assigned_to,
  resolvedAt: row.resolved_at,
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

export const mapMember = (row: TableRow<"members">): Member => ({
  id: row.id,
  personId: row.person_id,
  membershipNumber: row.membership_number,
  joinDate: row.join_date,
  role: row.role,
  status: row.status as Member["status"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapFollowUp = (row: TableRow<"follow_ups">): FollowUp => ({
  id: row.id,
  personId: row.person_id,
  assignedTo: row.assigned_to,
  type: row.type as FollowUp["type"],
  dueDate: row.due_date,
  status: row.status as FollowUp["status"],
  notes: row.notes,
  completedAt: row.completed_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapMeeting = (row: TableRow<"meetings">): Meeting => ({
  id: row.id,
  personId: row.person_id,
  assignedTo: row.assigned_to,
  title: row.title,
  description: row.description,
  startTime: row.start_time,
  endTime: row.end_time,
  location: row.location,
  status: row.status as Meeting["status"],
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapAttendanceRecord = (
  row: TableRow<"attendance_records">,
): AttendanceRecord => ({
  id: row.id,
  serviceName: row.service_name,
  serviceDate: row.service_date,
  attendeeCount: row.attendee_count,
  visitorCount: row.visitor_count,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const emptySocialLinks: SocialLinks = {
  facebook: null,
  instagram: null,
  youtube: null,
  twitter: null,
};

const mapSocialLinks = (
  value: TableRow<"church_settings">["social_links"],
): SocialLinks => {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return emptySocialLinks;
  }

  return {
    facebook: typeof value.facebook === "string" ? value.facebook : null,
    instagram: typeof value.instagram === "string" ? value.instagram : null,
    youtube: typeof value.youtube === "string" ? value.youtube : null,
    twitter: typeof value.twitter === "string" ? value.twitter : null,
  };
};

export const mapServiceTime = (
  row: TableRow<"service_times">,
): ServiceTime => ({
  id: row.id,
  dayOfWeek: row.day_of_week,
  label: row.label,
  time: row.time,
  location: row.location,
  sortOrder: row.sort_order,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapChurchSettings = (
  row: TableRow<"church_settings">,
): ChurchSettings => ({
  id: row.id,
  churchName: row.church_name,
  tagline: row.tagline,
  bio: row.bio,
  vision: row.vision,
  mission: row.mission,
  foundedYear: row.founded_year,
  publicMemberCount: row.public_member_count,
  lifeGroupCount: row.life_group_count,
  nationsReached: row.nations_reached,
  seniorPastor: row.senior_pastor,
  associatePastor: row.associate_pastor,
  logoUrl: row.logo_url,
  address: row.address,
  phone: row.phone,
  email: row.email,
  website: row.website,
  socialLinks: mapSocialLinks(row.social_links),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapGivingProgram = (
  row: TableRow<"giving_programs">,
): GivingProgram => ({
  id: row.id,
  name: row.name,
  description: row.description,
  goalAmount: row.goal_amount,
  amountRaised: row.amount_raised,
  currency: row.currency,
  color: row.color,
  icon: row.icon,
  status: row.status as GivingProgram["status"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapGivingTransaction = (
  row: TableRow<"giving_transactions">,
): GivingTransaction => ({
  id: row.id,
  programId: row.program_id,
  personId: row.person_id,
  giverName: row.giver_name,
  type: row.type as GivingTransaction["type"],
  amount: row.amount,
  currency: row.currency,
  paymentMethod: row.payment_method as GivingTransaction["paymentMethod"],
  receivedAt: row.received_at,
  reference: row.reference,
  isAnonymous: row.is_anonymous,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
