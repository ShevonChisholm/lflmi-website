import type {
  AdminPermission,
  AdminRole,
  ContactMessageStatus,
  EventStatus,
  EventRegistrationStatus,
  FollowUpStatus,
  FollowUpType,
  JsonValue,
  MeetingStatus,
  MemberStatus,
  MinistryStatus,
  PlannedVisitStatus,
  PrayerRequestStatus,
  PrayerRequestUrgency,
  PreferredContactMethod,
  PublicationStatus,
  RecordStatus,
  UUID,
} from "@/types";

export interface AdminProfileInput {
  fullName?: string | null;
  email?: string | null;
  role: AdminRole;
  permissions?: AdminPermission[];
  isActive?: boolean;
}

export interface AdminProfileCreateInput extends AdminProfileInput {
  email: string;
  password: string;
}

export type AdminProfileUpdateInput = Partial<AdminProfileInput>;

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export interface ContactMessageUpdateInput {
  status?: ContactMessageStatus;
  assignedTo?: UUID | null;
  resolvedAt?: string | null;
}

export interface VisitorInput {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  preferredContactMethod?: PreferredContactMethod;
  source?: string | null;
  personNotes?: string | null;
  isFirstTimeVisitor?: boolean;
  serviceDate: string;
  serviceName?: string | null;
  visitNotes?: string | null;
  requiresFollowUp?: boolean;
}

export interface PrayerRequestInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  isAnonymous?: boolean;
  requestText: string;
  category?: string | null;
  urgency?: PrayerRequestUrgency;
}

export interface PlannedVisitInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  serviceName: string;
  visitDate: string;
  source?: string | null;
  notes?: string | null;
}

export interface EventRegistrationInput {
  eventId: UUID;
  name: string;
  email?: string | null;
  phone?: string | null;
  attendeeCount?: number;
  notes?: string | null;
}

export interface EventRegistrationUpdateInput {
  personId?: UUID | null;
  name?: string;
  email?: string | null;
  phone?: string | null;
  attendeeCount?: number;
  status?: EventRegistrationStatus;
  notes?: string | null;
}

export interface PersonUpdateInput {
  firstName?: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  preferredContactMethod?: PreferredContactMethod;
  status?: "NEW" | "FOLLOW_UP" | "RETURNING" | "MEMBER" | "INACTIVE";
  source?: string | null;
  notes?: string | null;
}

export interface PersonInput {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  preferredContactMethod?: PreferredContactMethod;
  status?: "NEW" | "FOLLOW_UP" | "RETURNING" | "MEMBER" | "INACTIVE";
  source?: string | null;
  notes?: string | null;
}

export interface MemberInput {
  personId: UUID;
  membershipNumber?: string | null;
  joinDate?: string;
  role?: string | null;
  status?: MemberStatus;
}

export type MemberUpdateInput = Partial<Omit<MemberInput, "personId">>;

export interface FollowUpInput {
  personId: UUID;
  assignedTo?: UUID | null;
  type?: FollowUpType;
  dueDate?: string | null;
  status?: FollowUpStatus;
  notes?: string | null;
  completedAt?: string | null;
}

export type FollowUpUpdateInput = Partial<Omit<FollowUpInput, "personId">>;

export interface MeetingInput {
  personId: UUID;
  assignedTo?: UUID | null;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  status?: MeetingStatus;
  notes?: string | null;
}

export type MeetingUpdateInput = Partial<Omit<MeetingInput, "personId">>;

export interface PrayerRequestUpdateInput {
  personId?: UUID | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  isAnonymous?: boolean;
  requestText?: string;
  category?: string | null;
  urgency?: PrayerRequestUrgency;
  status?: PrayerRequestStatus;
  prayerCount?: number;
  response?: string | null;
  internalNotes?: string | null;
}

export interface SermonInput {
  title: string;
  preacherName?: string | null;
  sermonDate?: string | null;
  series?: string | null;
  bibleText?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  notesUrl?: string | null;
  thumbnailUrl?: string | null;
  durationMinutes?: number | null;
  viewCount?: number;
  publicationStatus?: PublicationStatus;
}

export type SermonUpdateInput = Partial<SermonInput>;

export interface EventInput {
  title: string;
  eventType?: string | null;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  organizerName?: string | null;
  isRegistrationRequired?: boolean;
  maxAttendees?: number | null;
  status?: EventStatus;
  publicationStatus?: PublicationStatus;
}

export type EventUpdateInput = Partial<EventInput>;

export interface MinistryInput {
  name: string;
  description?: string | null;
  leaderId?: UUID | null;
  leaderName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  color?: string | null;
  meetingSchedule?: string | null;
  programs?: string[];
  memberCount?: number;
  volunteerCount?: number;
  status?: MinistryStatus;
  sortOrder?: number;
}

export type MinistryUpdateInput = Partial<MinistryInput>;

export interface GivingProgramInput {
  name: string;
  description?: string | null;
  goalAmount?: number | null;
  amountRaised?: number;
  currency?: string;
  color?: string | null;
  icon?: string | null;
  status?: RecordStatus;
}

export type GivingProgramUpdateInput = Partial<GivingProgramInput>;

export interface ServiceTimeInput {
  dayOfWeek: string;
  label: string;
  time: string;
  location?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export type ServiceTimeUpdateInput = Partial<ServiceTimeInput>;

export interface ChurchSettingsUpdateInput {
  churchName?: string;
  tagline?: string | null;
  bio?: string | null;
  vision?: string | null;
  mission?: string | null;
  foundedYear?: number | null;
  seniorPastor?: string | null;
  associatePastor?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  socialLinks?: JsonValue;
}

export interface ContentPageInput {
  slug: string;
  title: string;
  body?: string | null;
  sections?: JsonValue | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publicationStatus?: PublicationStatus;
}

export type ContentPageUpdateInput = Partial<ContentPageInput>;

export interface PlannedVisitUpdateInput {
  personId?: UUID | null;
  name?: string;
  email?: string | null;
  phone?: string | null;
  serviceName?: string;
  visitDate?: string;
  status?: PlannedVisitStatus;
  source?: string | null;
  notes?: string | null;
}
