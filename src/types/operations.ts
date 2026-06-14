import type {
  ISODateString,
  RecordStatus,
  TimestampedEntity,
  UUID,
} from "./common";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "PASTOR" | "EDITOR" | "CARE_TEAM";

export type AdminPermission =
  | "MANAGE_ADMINS"
  | "MANAGE_CMS"
  | "MANAGE_CARE"
  | "MANAGE_MEMBERS"
  | "MANAGE_GIVING"
  | "VIEW_DASHBOARD";

export interface AdminProfile extends TimestampedEntity {
  fullName: string | null;
  email: string | null;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
}

export type MemberStatus = "NEW" | "ACTIVE" | "INACTIVE";

export interface Member extends TimestampedEntity {
  personId: UUID;
  membershipNumber: string | null;
  joinDate: ISODateString;
  role: string | null;
  status: MemberStatus;
}

export type MinistryParticipationRole = "MEMBER" | "VOLUNTEER" | "LEADER";

export interface MinistryMembership extends TimestampedEntity {
  ministryId: UUID;
  memberId: UUID;
  role: MinistryParticipationRole;
  joinedAt: ISODateString;
  status: RecordStatus;
}

export interface AttendanceRecord extends TimestampedEntity {
  serviceName: string;
  serviceDate: ISODateString;
  attendeeCount: number;
  visitorCount: number;
  notes: string | null;
}

export interface GivingProgram extends TimestampedEntity {
  name: string;
  description: string | null;
  goalAmount: number | null;
  amountRaised: number;
  currency: string;
  color: string | null;
  icon: string | null;
  status: RecordStatus;
}

export type GivingType = "TITHE" | "OFFERING" | "DONATION" | "OTHER";
export type PaymentMethod = "BANK_TRANSFER" | "CARD" | "CASH" | "OTHER";

export interface GivingTransaction extends TimestampedEntity {
  programId: UUID | null;
  personId: UUID | null;
  giverName: string | null;
  type: GivingType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  receivedAt: ISODateString;
  reference: string | null;
  isAnonymous: boolean;
  notes: string | null;
}

export interface ServiceTime extends TimestampedEntity {
  dayOfWeek: string;
  label: string;
  time: string;
  location: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
}

export interface ChurchSettings extends TimestampedEntity {
  churchName: string;
  tagline: string | null;
  bio: string | null;
  vision: string | null;
  mission: string | null;
  foundedYear: number | null;
  seniorPastor: string | null;
  associatePastor: string | null;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  socialLinks: SocialLinks;
}
