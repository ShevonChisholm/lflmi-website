import type {
  ISODateString,
  JsonValue,
  PublicationStatus,
  TimestampedEntity,
  UUID,
} from "./common";

export interface Sermon extends TimestampedEntity {
  title: string;
  preacherName: string | null;
  sermonDate: ISODateString | null;
  series: string | null;
  bibleText: string | null;
  description: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  notesUrl: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  viewCount: number;
  publicationStatus: PublicationStatus;
}

export type EventStatus = "DRAFT" | "UPCOMING" | "PAST" | "CANCELLED";

export interface Event extends TimestampedEntity {
  title: string;
  eventType: string | null;
  description: string | null;
  startDate: ISODateString;
  endDate: ISODateString | null;
  location: string | null;
  imageUrl: string | null;
  organizerName: string | null;
  isRegistrationRequired: boolean;
  maxAttendees: number | null;
  status: EventStatus;
  publicationStatus: PublicationStatus;
}

export type EventRegistrationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ATTENDED"
  | "CANCELLED";

export interface EventRegistration extends TimestampedEntity {
  eventId: UUID;
  personId: UUID | null;
  name: string;
  email: string | null;
  phone: string | null;
  attendeeCount: number;
  status: EventRegistrationStatus;
  notes: string | null;
}

export type MinistryStatus = "ACTIVE" | "INACTIVE" | "ON_HOLD";

export interface Ministry extends TimestampedEntity {
  name: string;
  description: string | null;
  leaderId: UUID | null;
  leaderName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  imageUrl: string | null;
  icon: string | null;
  color: string | null;
  meetingSchedule: string | null;
  programs: string[];
  memberCount: number;
  volunteerCount: number;
  status: MinistryStatus;
  sortOrder: number;
}

export interface ContentPage extends TimestampedEntity {
  slug: string;
  title: string;
  body: string | null;
  sections: JsonValue | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationStatus: PublicationStatus;
}

export type ContactMessageStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ARCHIVED";

export interface ContactMessage extends TimestampedEntity {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  assignedTo: UUID | null;
  resolvedAt: ISODateString | null;
}
