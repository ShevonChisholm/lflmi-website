import type {
  ISODateString,
  PreferredContactMethod,
  TimestampedEntity,
  UUID,
} from "./common";

export type PersonStatus =
  | "NEW"
  | "FOLLOW_UP"
  | "RETURNING"
  | "MEMBER"
  | "INACTIVE";

export interface Person extends TimestampedEntity {
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  preferredContactMethod: PreferredContactMethod;
  status: PersonStatus;
  source: string | null;
  notes: string | null;
}

export interface Visitor extends TimestampedEntity {
  personId: UUID;
  isFirstTimeVisitor: boolean;
  serviceDate: ISODateString;
  serviceName: string | null;
  source: string | null;
  notes: string | null;
  requiresFollowUp: boolean;
}

export type PlannedVisitStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ATTENDED"
  | "NO_SHOW"
  | "CANCELLED";

export interface PlannedVisit extends TimestampedEntity {
  personId: UUID | null;
  name: string;
  email: string | null;
  phone: string | null;
  serviceName: string;
  visitDate: ISODateString;
  status: PlannedVisitStatus;
  source: string | null;
  notes: string | null;
}

export type PrayerRequestStatus = "NEW" | "OPEN" | "PRAYED" | "ANSWERED" | "CLOSED";
export type PrayerRequestUrgency = "LOW" | "MEDIUM" | "HIGH";

export interface PrayerRequest extends TimestampedEntity {
  personId: UUID | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  isAnonymous: boolean;
  requestText: string;
  category: string | null;
  urgency: PrayerRequestUrgency;
  status: PrayerRequestStatus;
  prayerCount: number;
  response: string | null;
  internalNotes: string | null;
}

export type FollowUpType =
  | "PHONE_CALL"
  | "EMAIL"
  | "MESSAGE"
  | "PASTORAL_VISIT"
  | "OTHER";
export type FollowUpStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface FollowUp extends TimestampedEntity {
  personId: UUID;
  assignedTo: UUID | null;
  type: FollowUpType;
  dueDate: ISODateString | null;
  status: FollowUpStatus;
  notes: string | null;
  completedAt: ISODateString | null;
}

export type MeetingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface Meeting extends TimestampedEntity {
  personId: UUID;
  assignedTo: UUID | null;
  title: string;
  description: string | null;
  startTime: ISODateString;
  endTime: ISODateString | null;
  location: string | null;
  status: MeetingStatus;
  notes: string | null;
}
