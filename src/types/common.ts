export type UUID = string;
export type ISODateString = string;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Entity {
  id: UUID;
}

export interface TimestampedEntity extends Entity {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PreferredContactMethod = "PHONE" | "EMAIL" | "NONE";
export type RecordStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
