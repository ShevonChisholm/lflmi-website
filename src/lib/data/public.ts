import type {
  ContentPage,
  Event,
  Ministry,
  Sermon,
  ServiceTime,
  ChurchSettings,
  UUID,
} from "@/types";

import { supabase } from "../supabase/client";
import { throwIfDataError } from "./errors";
import type {
  ContactMessageInput,
  EventRegistrationInput,
  PlannedVisitInput,
  PrayerRequestInput,
  VisitorInput,
} from "./inputs";
import {
  mapContentPage,
  mapEvent,
  mapMinistry,
  mapSermon,
  mapServiceTime,
  mapChurchSettings,
} from "./mappers";

export interface PublicListOptions {
  limit?: number;
}

export interface PublishedEventOptions extends PublicListOptions {
  upcomingOnly?: boolean;
}

export const getPublishedSermons = async (
  options: PublicListOptions = {},
): Promise<Sermon[]> => {
  let query = supabase
    .from("sermons")
    .select("*")
    .eq("publication_status", "PUBLISHED")
    .order("sermon_date", { ascending: false, nullsFirst: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load published sermons.");

  return (data ?? []).map(mapSermon);
};

export const getPublishedSermonById = async (
  id: UUID,
): Promise<Sermon | null> => {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .eq("publication_status", "PUBLISHED")
    .maybeSingle();

  throwIfDataError(error, "Unable to load the published sermon.");
  return data ? mapSermon(data) : null;
};

export const getPublishedEvents = async (
  options: PublishedEventOptions = {},
): Promise<Event[]> => {
  let query = supabase
    .from("events")
    .select("*")
    .eq("publication_status", "PUBLISHED")
    .order("start_date", { ascending: true });

  if (options.upcomingOnly) {
    query = query.eq("status", "UPCOMING").gte("start_date", new Date().toISOString());
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load published events.");

  return (data ?? []).map(mapEvent);
};

export const getPublishedEventById = async (
  id: UUID,
): Promise<Event | null> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("publication_status", "PUBLISHED")
    .maybeSingle();

  throwIfDataError(error, "Unable to load the published event.");
  return data ? mapEvent(data) : null;
};

export const getActiveMinistries = async (
  options: PublicListOptions = {},
): Promise<Ministry[]> => {
  let query = supabase
    .from("ministries")
    .select("*")
    .eq("status", "ACTIVE")
    .order("sort_order", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  throwIfDataError(error, "Unable to load active ministries.");

  return (data ?? []).map(mapMinistry);
};

export const getPublishedPageBySlug = async (
  slug: string,
): Promise<ContentPage | null> => {
  const { data, error } = await supabase
    .from("content_pages")
    .select("*")
    .eq("slug", slug)
    .eq("publication_status", "PUBLISHED")
    .maybeSingle();

  throwIfDataError(error, "Unable to load the published content page.");
  return data ? mapContentPage(data) : null;
};

export const getActiveServiceTimes = async (): Promise<ServiceTime[]> => {
  const { data, error } = await supabase
    .from("service_times")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  throwIfDataError(error, "Unable to load active service times.");
  return (data ?? []).map(mapServiceTime);
};

export const getChurchSettings = async (): Promise<ChurchSettings | null> => {
  const { data, error } = await supabase
    .from("church_settings")
    .select("*")
    .maybeSingle();

  throwIfDataError(error, "Unable to load church settings.");
  return data ? mapChurchSettings(data) : null;
};

export const submitContactMessage = async (
  input: ContactMessageInput,
): Promise<void> => {
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject,
    message: input.message,
  });

  throwIfDataError(error, "Unable to submit the contact message.");
};

export const submitVisitor = async (input: VisitorInput): Promise<UUID> => {
  const { data, error } = await supabase.rpc("submit_visitor", {
    p_first_name: input.firstName,
    p_service_date: input.serviceDate,
    p_last_name: input.lastName ?? null,
    p_email: input.email ?? null,
    p_phone: input.phone ?? null,
    p_address: input.address ?? null,
    p_preferred_contact_method: input.preferredContactMethod ?? "NONE",
    p_source: input.source ?? null,
    p_person_notes: input.personNotes ?? null,
    p_is_first_time_visitor: input.isFirstTimeVisitor ?? true,
    p_service_name: input.serviceName ?? null,
    p_visit_notes: input.visitNotes ?? null,
    p_requires_follow_up: input.requiresFollowUp ?? false,
  });

  throwIfDataError(error, "Unable to submit the visitor information.");

  if (!data) {
    throw new Error("Visitor submission did not return a person ID.");
  }

  return data;
};

export const submitPrayerRequest = async (
  input: PrayerRequestInput,
): Promise<void> => {
  const { error } = await supabase.from("prayer_requests").insert({
    name: input.isAnonymous ? null : (input.name ?? null),
    email: input.isAnonymous ? null : (input.email ?? null),
    phone: input.isAnonymous ? null : (input.phone ?? null),
    is_anonymous: input.isAnonymous ?? false,
    request_text: input.requestText,
    category: input.category ?? null,
    urgency: input.urgency ?? "MEDIUM",
  });

  throwIfDataError(error, "Unable to submit the prayer request.");
};

export const submitPlannedVisit = async (
  input: PlannedVisitInput,
): Promise<void> => {
  const { error } = await supabase.from("planned_visits").insert({
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    service_name: input.serviceName,
    visit_date: input.visitDate,
    source: input.source ?? null,
    notes: input.notes ?? null,
  });

  throwIfDataError(error, "Unable to submit the planned visit.");
};

export const registerForEvent = async (
  input: EventRegistrationInput,
): Promise<void> => {
  const { error } = await supabase.from("event_registrations").insert({
    event_id: input.eventId,
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    attendee_count: input.attendeeCount ?? 1,
    notes: input.notes ?? null,
  });

  throwIfDataError(error, "Unable to register for the event.");
};
