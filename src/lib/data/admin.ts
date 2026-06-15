import type {
  ContentPage,
  ChurchSettings,
  Event,
  GivingProgram,
  GivingTransaction,
  AttendanceRecord,
  FollowUp,
  Member,
  Meeting,
  Ministry,
  Person,
  PlannedVisit,
  PrayerRequest,
  Sermon,
  ServiceTime,
  UUID,
} from "@/types";

import { supabase } from "../supabase/client";
import type {
  TableInsert,
  TableUpdate,
} from "../supabase/database.types";
import { requireData, throwIfDataError } from "./errors";
import type {
  ContentPageInput,
  ContentPageUpdateInput,
  ChurchSettingsUpdateInput,
  EventInput,
  EventUpdateInput,
  GivingProgramInput,
  GivingProgramUpdateInput,
  FollowUpInput,
  FollowUpUpdateInput,
  MemberInput,
  MemberUpdateInput,
  MeetingInput,
  MeetingUpdateInput,
  MinistryInput,
  MinistryUpdateInput,
  PersonUpdateInput,
  PersonInput,
  PlannedVisitInput,
  PrayerRequestInput,
  PlannedVisitUpdateInput,
  PrayerRequestUpdateInput,
  SermonInput,
  SermonUpdateInput,
  ServiceTimeInput,
  ServiceTimeUpdateInput,
} from "./inputs";
import {
  mapContentPage,
  mapChurchSettings,
  mapEvent,
  mapGivingProgram,
  mapGivingTransaction,
  mapAttendanceRecord,
  mapFollowUp,
  mapMember,
  mapMeeting,
  mapMinistry,
  mapPerson,
  mapPlannedVisit,
  mapPrayerRequest,
  mapSermon,
  mapServiceTime,
} from "./mappers";

export interface AdminListOptions {
  limit?: number;
}

const mapPersonUpdate = (
  input: PersonUpdateInput,
): TableUpdate<"people"> => ({
  first_name: input.firstName,
  last_name: input.lastName,
  email: input.email,
  phone: input.phone,
  address: input.address,
  preferred_contact_method: input.preferredContactMethod,
  status: input.status,
  source: input.source,
  notes: input.notes,
});

const mapPrayerRequestUpdate = (
  input: PrayerRequestUpdateInput,
): TableUpdate<"prayer_requests"> => ({
  person_id: input.personId,
  name: input.name,
  email: input.email,
  phone: input.phone,
  is_anonymous: input.isAnonymous,
  request_text: input.requestText,
  category: input.category,
  urgency: input.urgency,
  status: input.status,
  prayer_count: input.prayerCount,
  response: input.response,
  internal_notes: input.internalNotes,
});

const mapPlannedVisitUpdate = (
  input: PlannedVisitUpdateInput,
): TableUpdate<"planned_visits"> => ({
  person_id: input.personId,
  name: input.name,
  email: input.email,
  phone: input.phone,
  service_name: input.serviceName,
  visit_date: input.visitDate,
  status: input.status,
  source: input.source,
  notes: input.notes,
});

const mapSermonInsert = (input: SermonInput): TableInsert<"sermons"> => ({
  title: input.title,
  preacher_name: input.preacherName ?? null,
  sermon_date: input.sermonDate ?? null,
  series: input.series ?? null,
  bible_text: input.bibleText ?? null,
  description: input.description ?? null,
  video_url: input.videoUrl ?? null,
  audio_url: input.audioUrl ?? null,
  notes_url: input.notesUrl ?? null,
  thumbnail_url: input.thumbnailUrl ?? null,
  duration_minutes: input.durationMinutes ?? null,
  view_count: input.viewCount ?? 0,
  publication_status: input.publicationStatus ?? "DRAFT",
});

const mapSermonUpdate = (
  input: SermonUpdateInput,
): TableUpdate<"sermons"> => ({
  title: input.title,
  preacher_name: input.preacherName,
  sermon_date: input.sermonDate,
  series: input.series,
  bible_text: input.bibleText,
  description: input.description,
  video_url: input.videoUrl,
  audio_url: input.audioUrl,
  notes_url: input.notesUrl,
  thumbnail_url: input.thumbnailUrl,
  duration_minutes: input.durationMinutes,
  view_count: input.viewCount,
  publication_status: input.publicationStatus,
});

const mapEventInsert = (input: EventInput): TableInsert<"events"> => ({
  title: input.title,
  event_type: input.eventType ?? null,
  description: input.description ?? null,
  start_date: input.startDate,
  end_date: input.endDate ?? null,
  location: input.location ?? null,
  image_url: input.imageUrl ?? null,
  organizer_name: input.organizerName ?? null,
  is_registration_required: input.isRegistrationRequired ?? false,
  max_attendees: input.maxAttendees ?? null,
  status: input.status ?? "DRAFT",
  publication_status: input.publicationStatus ?? "DRAFT",
});

const mapEventUpdate = (input: EventUpdateInput): TableUpdate<"events"> => ({
  title: input.title,
  event_type: input.eventType,
  description: input.description,
  start_date: input.startDate,
  end_date: input.endDate,
  location: input.location,
  image_url: input.imageUrl,
  organizer_name: input.organizerName,
  is_registration_required: input.isRegistrationRequired,
  max_attendees: input.maxAttendees,
  status: input.status,
  publication_status: input.publicationStatus,
});

const mapMinistryInsert = (
  input: MinistryInput,
): TableInsert<"ministries"> => ({
  name: input.name,
  description: input.description ?? null,
  leader_id: input.leaderId ?? null,
  leader_name: input.leaderName ?? null,
  contact_email: input.contactEmail ?? null,
  contact_phone: input.contactPhone ?? null,
  image_url: input.imageUrl ?? null,
  icon: input.icon ?? null,
  color: input.color ?? null,
  meeting_schedule: input.meetingSchedule ?? null,
  programs: input.programs ?? [],
  member_count: input.memberCount ?? 0,
  volunteer_count: input.volunteerCount ?? 0,
  status: input.status ?? "ACTIVE",
  sort_order: input.sortOrder ?? 0,
});

const mapMinistryUpdate = (
  input: MinistryUpdateInput,
): TableUpdate<"ministries"> => ({
  name: input.name,
  description: input.description,
  leader_id: input.leaderId,
  leader_name: input.leaderName,
  contact_email: input.contactEmail,
  contact_phone: input.contactPhone,
  image_url: input.imageUrl,
  icon: input.icon,
  color: input.color,
  meeting_schedule: input.meetingSchedule,
  programs: input.programs,
  member_count: input.memberCount,
  volunteer_count: input.volunteerCount,
  status: input.status,
  sort_order: input.sortOrder,
});

const mapContentPageInsert = (
  input: ContentPageInput,
): TableInsert<"content_pages"> => ({
  slug: input.slug,
  title: input.title,
  body: input.body ?? null,
  sections: input.sections ?? null,
  seo_title: input.seoTitle ?? null,
  seo_description: input.seoDescription ?? null,
  publication_status: input.publicationStatus ?? "DRAFT",
});

const mapContentPageUpdate = (
  input: ContentPageUpdateInput,
): TableUpdate<"content_pages"> => ({
  slug: input.slug,
  title: input.title,
  body: input.body,
  sections: input.sections,
  seo_title: input.seoTitle,
  seo_description: input.seoDescription,
  publication_status: input.publicationStatus,
});

export const getPeople = async (
  options: AdminListOptions = {},
): Promise<Person[]> => {
  let query = supabase
    .from("people")
    .select("*")
    .order("created_at", { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load people.");
  return (data ?? []).map(mapPerson);
};

export const getPersonById = async (id: UUID): Promise<Person | null> => {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the person.");
  return data ? mapPerson(data) : null;
};

export const createPerson = async (input: PersonInput): Promise<Person> => {
  const { data, error } = await supabase.from("people").insert({
    first_name: input.firstName,
    last_name: input.lastName ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    address: input.address ?? null,
    preferred_contact_method: input.preferredContactMethod ?? "NONE",
    status: input.status ?? "NEW",
    source: input.source ?? null,
    notes: input.notes ?? null,
  }).select("*").single();
  return mapPerson(requireData(data, error, "Unable to create person."));
};

export const deletePerson = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("people").delete().eq("id", id);
  throwIfDataError(error, "Unable to remove person.");
};

export const updatePerson = async (
  id: UUID,
  input: PersonUpdateInput,
): Promise<Person> => {
  const { data, error } = await supabase
    .from("people")
    .update(mapPersonUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapPerson(requireData(data, error, "Unable to update the person."));
};

export const getPrayerRequests = async (
  options: AdminListOptions = {},
): Promise<PrayerRequest[]> => {
  let query = supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load prayer requests.");
  return (data ?? []).map(mapPrayerRequest);
};

export const getPrayerRequestById = async (
  id: UUID,
): Promise<PrayerRequest | null> => {
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the prayer request.");
  return data ? mapPrayerRequest(data) : null;
};

export const updatePrayerRequest = async (
  id: UUID,
  input: PrayerRequestUpdateInput,
): Promise<PrayerRequest> => {
  const { data, error } = await supabase
    .from("prayer_requests")
    .update(mapPrayerRequestUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapPrayerRequest(
    requireData(data, error, "Unable to update the prayer request."),
  );
};

export const getPlannedVisits = async (
  options: AdminListOptions = {},
): Promise<PlannedVisit[]> => {
  let query = supabase
    .from("planned_visits")
    .select("*")
    .order("visit_date", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load planned visits.");
  return (data ?? []).map(mapPlannedVisit);
};

export const updatePlannedVisit = async (
  id: UUID,
  input: PlannedVisitUpdateInput,
): Promise<PlannedVisit> => {
  const { data, error } = await supabase
    .from("planned_visits")
    .update(mapPlannedVisitUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapPlannedVisit(
    requireData(data, error, "Unable to update the planned visit."),
  );
};

export const createPlannedVisit = async (
  input: PlannedVisitInput,
): Promise<PlannedVisit> => {
  const { data, error } = await supabase.from("planned_visits").insert({
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    service_name: input.serviceName,
    visit_date: input.visitDate,
    source: input.source ?? null,
    notes: input.notes ?? null,
  }).select("*").single();
  return mapPlannedVisit(requireData(data, error, "Unable to create planned visit."));
};

export const createPrayerRequest = async (
  input: PrayerRequestInput,
): Promise<PrayerRequest> => {
  const { data, error } = await supabase.from("prayer_requests").insert({
    name: input.isAnonymous ? null : input.name ?? null,
    email: input.isAnonymous ? null : input.email ?? null,
    phone: input.isAnonymous ? null : input.phone ?? null,
    is_anonymous: input.isAnonymous ?? false,
    request_text: input.requestText,
    category: input.category ?? null,
    urgency: input.urgency ?? "MEDIUM",
  }).select("*").single();
  return mapPrayerRequest(requireData(data, error, "Unable to create prayer request."));
};

export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from("members").select("*").order("join_date", { ascending: false });
  throwIfDataError(error, "Unable to load members.");
  return (data ?? []).map(mapMember);
};

export const createMember = async (input: MemberInput): Promise<Member> => {
  const { data, error } = await supabase.from("members").insert({
    person_id: input.personId,
    membership_number: input.membershipNumber ?? null,
    join_date: input.joinDate ?? new Date().toISOString(),
    role: input.role ?? null,
    status: input.status ?? "NEW",
  }).select("*").single();
  const member = mapMember(requireData(data, error, "Unable to create member."));
  await updatePerson(input.personId, { status: "MEMBER" });
  return member;
};

export const updateMember = async (id: UUID, input: MemberUpdateInput): Promise<Member> => {
  const { data, error } = await supabase.from("members").update({
    membership_number: input.membershipNumber,
    join_date: input.joinDate,
    role: input.role,
    status: input.status,
  }).eq("id", id).select("*").single();
  return mapMember(requireData(data, error, "Unable to update member."));
};

export const getFollowUps = async (): Promise<FollowUp[]> => {
  const { data, error } = await supabase.from("follow_ups").select("*").order("due_date", { ascending: true });
  throwIfDataError(error, "Unable to load follow-ups.");
  return (data ?? []).map(mapFollowUp);
};

export const createFollowUp = async (input: FollowUpInput): Promise<FollowUp> => {
  const { data, error } = await supabase.from("follow_ups").insert({
    person_id: input.personId,
    assigned_to: input.assignedTo ?? null,
    type: input.type ?? "OTHER",
    due_date: input.dueDate ?? null,
    status: input.status ?? "PENDING",
    notes: input.notes ?? null,
    completed_at: input.completedAt ?? null,
  }).select("*").single();
  return mapFollowUp(requireData(data, error, "Unable to create follow-up."));
};

export const updateFollowUp = async (id: UUID, input: FollowUpUpdateInput): Promise<FollowUp> => {
  const { data, error } = await supabase.from("follow_ups").update({
    assigned_to: input.assignedTo,
    type: input.type,
    due_date: input.dueDate,
    status: input.status,
    notes: input.notes,
    completed_at: input.completedAt,
  }).eq("id", id).select("*").single();
  return mapFollowUp(requireData(data, error, "Unable to update follow-up."));
};

export const getMeetings = async (): Promise<Meeting[]> => {
  const { data, error } = await supabase.from("meetings").select("*").order("start_time", { ascending: true });
  throwIfDataError(error, "Unable to load meetings.");
  return (data ?? []).map(mapMeeting);
};

export const createMeeting = async (input: MeetingInput): Promise<Meeting> => {
  const { data, error } = await supabase.from("meetings").insert({
    person_id: input.personId,
    assigned_to: input.assignedTo ?? null,
    title: input.title,
    description: input.description ?? null,
    start_time: input.startTime,
    end_time: input.endTime ?? null,
    location: input.location ?? null,
    status: input.status ?? "SCHEDULED",
    notes: input.notes ?? null,
  }).select("*").single();
  return mapMeeting(requireData(data, error, "Unable to schedule meeting."));
};

export const updateMeeting = async (id: UUID, input: MeetingUpdateInput): Promise<Meeting> => {
  const { data, error } = await supabase.from("meetings").update({
    assigned_to: input.assignedTo,
    title: input.title,
    description: input.description,
    start_time: input.startTime,
    end_time: input.endTime,
    location: input.location,
    status: input.status,
    notes: input.notes,
  }).eq("id", id).select("*").single();
  return mapMeeting(requireData(data, error, "Unable to update meeting."));
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  const { data, error } = await supabase.from("attendance_records").select("*").order("service_date", { ascending: true });
  throwIfDataError(error, "Unable to load attendance.");
  return (data ?? []).map(mapAttendanceRecord);
};

export const getSermons = async (): Promise<Sermon[]> => {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false, nullsFirst: false });

  throwIfDataError(error, "Unable to load sermons.");
  return (data ?? []).map(mapSermon);
};

export const getSermonById = async (id: UUID): Promise<Sermon | null> => {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the sermon.");
  return data ? mapSermon(data) : null;
};

export const createSermon = async (input: SermonInput): Promise<Sermon> => {
  const { data, error } = await supabase
    .from("sermons")
    .insert(mapSermonInsert(input))
    .select("*")
    .single();

  return mapSermon(requireData(data, error, "Unable to create the sermon."));
};

export const updateSermon = async (
  id: UUID,
  input: SermonUpdateInput,
): Promise<Sermon> => {
  const { data, error } = await supabase
    .from("sermons")
    .update(mapSermonUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapSermon(requireData(data, error, "Unable to update the sermon."));
};

export const deleteSermon = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete the sermon.");
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });

  throwIfDataError(error, "Unable to load events.");
  return (data ?? []).map(mapEvent);
};

export const getEventById = async (id: UUID): Promise<Event | null> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the event.");
  return data ? mapEvent(data) : null;
};

export const createEvent = async (input: EventInput): Promise<Event> => {
  const { data, error } = await supabase
    .from("events")
    .insert(mapEventInsert(input))
    .select("*")
    .single();

  return mapEvent(requireData(data, error, "Unable to create the event."));
};

export const updateEvent = async (
  id: UUID,
  input: EventUpdateInput,
): Promise<Event> => {
  const { data, error } = await supabase
    .from("events")
    .update(mapEventUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapEvent(requireData(data, error, "Unable to update the event."));
};

export const deleteEvent = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete the event.");
};

export const getMinistries = async (): Promise<Ministry[]> => {
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .order("sort_order", { ascending: true });

  throwIfDataError(error, "Unable to load ministries.");
  return (data ?? []).map(mapMinistry);
};

export const getMinistryById = async (id: UUID): Promise<Ministry | null> => {
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the ministry.");
  return data ? mapMinistry(data) : null;
};

export const createMinistry = async (
  input: MinistryInput,
): Promise<Ministry> => {
  const { data, error } = await supabase
    .from("ministries")
    .insert(mapMinistryInsert(input))
    .select("*")
    .single();

  return mapMinistry(requireData(data, error, "Unable to create the ministry."));
};

export const updateMinistry = async (
  id: UUID,
  input: MinistryUpdateInput,
): Promise<Ministry> => {
  const { data, error } = await supabase
    .from("ministries")
    .update(mapMinistryUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapMinistry(requireData(data, error, "Unable to update the ministry."));
};

export const deleteMinistry = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("ministries").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete the ministry.");
};

export const getContentPages = async (): Promise<ContentPage[]> => {
  const { data, error } = await supabase
    .from("content_pages")
    .select("*")
    .order("slug", { ascending: true });

  throwIfDataError(error, "Unable to load content pages.");
  return (data ?? []).map(mapContentPage);
};

export const getContentPageById = async (
  id: UUID,
): Promise<ContentPage | null> => {
  const { data, error } = await supabase
    .from("content_pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfDataError(error, "Unable to load the content page.");
  return data ? mapContentPage(data) : null;
};

export const createContentPage = async (
  input: ContentPageInput,
): Promise<ContentPage> => {
  const { data, error } = await supabase
    .from("content_pages")
    .insert(mapContentPageInsert(input))
    .select("*")
    .single();

  return mapContentPage(
    requireData(data, error, "Unable to create the content page."),
  );
};

export const updateContentPage = async (
  id: UUID,
  input: ContentPageUpdateInput,
): Promise<ContentPage> => {
  const { data, error } = await supabase
    .from("content_pages")
    .update(mapContentPageUpdate(input))
    .eq("id", id)
    .select("*")
    .single();

  return mapContentPage(
    requireData(data, error, "Unable to update the content page."),
  );
};

export const deleteContentPage = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("content_pages").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete the content page.");
};

export const updateChurchSettings = async (
  id: UUID,
  input: ChurchSettingsUpdateInput,
): Promise<ChurchSettings> => {
  const { data, error } = await supabase
    .from("church_settings")
    .update({
      church_name: input.churchName,
      tagline: input.tagline,
      bio: input.bio,
      vision: input.vision,
      mission: input.mission,
      founded_year: input.foundedYear,
      senior_pastor: input.seniorPastor,
      associate_pastor: input.associatePastor,
      logo_url: input.logoUrl,
      address: input.address,
      phone: input.phone,
      email: input.email,
      website: input.website,
      social_links: input.socialLinks,
    })
    .eq("id", id)
    .select("*")
    .single();

  return mapChurchSettings(
    requireData(data, error, "Unable to update church settings."),
  );
};

export const getServiceTimes = async (): Promise<ServiceTime[]> => {
  const { data, error } = await supabase
    .from("service_times")
    .select("*")
    .order("sort_order", { ascending: true });
  throwIfDataError(error, "Unable to load service times.");
  return (data ?? []).map(mapServiceTime);
};

export const createServiceTime = async (
  input: ServiceTimeInput,
): Promise<ServiceTime> => {
  const { data, error } = await supabase
    .from("service_times")
    .insert({
      day_of_week: input.dayOfWeek,
      label: input.label,
      time: input.time,
      location: input.location ?? null,
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .select("*")
    .single();
  return mapServiceTime(requireData(data, error, "Unable to create service time."));
};

export const updateServiceTime = async (
  id: UUID,
  input: ServiceTimeUpdateInput,
): Promise<ServiceTime> => {
  const { data, error } = await supabase
    .from("service_times")
    .update({
      day_of_week: input.dayOfWeek,
      label: input.label,
      time: input.time,
      location: input.location,
      sort_order: input.sortOrder,
      is_active: input.isActive,
    })
    .eq("id", id)
    .select("*")
    .single();
  return mapServiceTime(requireData(data, error, "Unable to update service time."));
};

export const deleteServiceTime = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("service_times").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete service time.");
};

export const getGivingPrograms = async (): Promise<GivingProgram[]> => {
  const { data, error } = await supabase
    .from("giving_programs")
    .select("*")
    .order("created_at", { ascending: false });
  throwIfDataError(error, "Unable to load giving programs.");
  return (data ?? []).map(mapGivingProgram);
};

export const createGivingProgram = async (
  input: GivingProgramInput,
): Promise<GivingProgram> => {
  const { data, error } = await supabase
    .from("giving_programs")
    .insert({
      name: input.name,
      description: input.description ?? null,
      goal_amount: input.goalAmount ?? null,
      amount_raised: input.amountRaised ?? 0,
      currency: input.currency ?? "JMD",
      color: input.color ?? "#0E5AA7",
      icon: input.icon ?? null,
      status: input.status ?? "ACTIVE",
    })
    .select("*")
    .single();
  return mapGivingProgram(requireData(data, error, "Unable to create giving program."));
};

export const updateGivingProgram = async (
  id: UUID,
  input: GivingProgramUpdateInput,
): Promise<GivingProgram> => {
  const { data, error } = await supabase
    .from("giving_programs")
    .update({
      name: input.name,
      description: input.description,
      goal_amount: input.goalAmount,
      amount_raised: input.amountRaised,
      currency: input.currency,
      color: input.color,
      icon: input.icon,
      status: input.status,
    })
    .eq("id", id)
    .select("*")
    .single();
  return mapGivingProgram(requireData(data, error, "Unable to update giving program."));
};

export const deleteGivingProgram = async (id: UUID): Promise<void> => {
  const { error } = await supabase.from("giving_programs").delete().eq("id", id);
  throwIfDataError(error, "Unable to delete giving program.");
};

export const getGivingTransactions = async (): Promise<GivingTransaction[]> => {
  const { data, error } = await supabase
    .from("giving_transactions")
    .select("*")
    .order("received_at", { ascending: false });
  throwIfDataError(error, "Unable to load giving transactions.");
  return (data ?? []).map(mapGivingTransaction);
};
