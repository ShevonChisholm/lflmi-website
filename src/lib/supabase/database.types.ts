import type { JsonValue } from "@/types";

type Nullable<T> = T | null;

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: Nullable<string>;
          subject: string;
          message: string;
          status: string;
          assigned_to: Nullable<string>;
          resolved_at: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: Nullable<string>;
          subject: string;
          message: string;
          status?: string;
          assigned_to?: Nullable<string>;
          resolved_at?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      church_settings: {
        Row: {
          id: string;
          church_name: string;
          tagline: Nullable<string>;
          bio: Nullable<string>;
          vision: Nullable<string>;
          mission: Nullable<string>;
          founded_year: Nullable<number>;
          senior_pastor: Nullable<string>;
          associate_pastor: Nullable<string>;
          logo_url: Nullable<string>;
          address: Nullable<string>;
          phone: Nullable<string>;
          email: Nullable<string>;
          website: Nullable<string>;
          social_links: JsonValue;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          church_name: string;
          tagline?: Nullable<string>;
          bio?: Nullable<string>;
          vision?: Nullable<string>;
          mission?: Nullable<string>;
          founded_year?: Nullable<number>;
          senior_pastor?: Nullable<string>;
          associate_pastor?: Nullable<string>;
          logo_url?: Nullable<string>;
          address?: Nullable<string>;
          phone?: Nullable<string>;
          email?: Nullable<string>;
          website?: Nullable<string>;
          social_links?: JsonValue;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["church_settings"]["Insert"]>;
        Relationships: [];
      };
      content_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body: Nullable<string>;
          sections: Nullable<JsonValue>;
          seo_title: Nullable<string>;
          seo_description: Nullable<string>;
          publication_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body?: Nullable<string>;
          sections?: Nullable<JsonValue>;
          seo_title?: Nullable<string>;
          seo_description?: Nullable<string>;
          publication_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_pages"]["Insert"]>;
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          person_id: Nullable<string>;
          name: string;
          email: Nullable<string>;
          phone: Nullable<string>;
          attendee_count: number;
          status: string;
          notes: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          person_id?: Nullable<string>;
          name: string;
          email?: Nullable<string>;
          phone?: Nullable<string>;
          attendee_count?: number;
          status?: string;
          notes?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["event_registrations"]["Insert"]>;
        Relationships: [];
      };
      giving_programs: {
        Row: {
          id: string;
          name: string;
          description: Nullable<string>;
          goal_amount: Nullable<number>;
          amount_raised: number;
          currency: string;
          color: Nullable<string>;
          icon: Nullable<string>;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: Nullable<string>;
          goal_amount?: Nullable<number>;
          amount_raised?: number;
          currency?: string;
          color?: Nullable<string>;
          icon?: Nullable<string>;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["giving_programs"]["Insert"]>;
        Relationships: [];
      };
      giving_transactions: {
        Row: {
          id: string;
          program_id: Nullable<string>;
          person_id: Nullable<string>;
          giver_name: Nullable<string>;
          type: string;
          amount: number;
          currency: string;
          payment_method: string;
          received_at: string;
          reference: Nullable<string>;
          is_anonymous: boolean;
          notes: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id?: Nullable<string>;
          person_id?: Nullable<string>;
          giver_name?: Nullable<string>;
          type?: string;
          amount: number;
          currency?: string;
          payment_method?: string;
          received_at?: string;
          reference?: Nullable<string>;
          is_anonymous?: boolean;
          notes?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["giving_transactions"]["Insert"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          event_type: Nullable<string>;
          description: Nullable<string>;
          start_date: string;
          end_date: Nullable<string>;
          location: Nullable<string>;
          image_url: Nullable<string>;
          organizer_name: Nullable<string>;
          is_registration_required: boolean;
          max_attendees: Nullable<number>;
          status: string;
          publication_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          event_type?: Nullable<string>;
          description?: Nullable<string>;
          start_date: string;
          end_date?: Nullable<string>;
          location?: Nullable<string>;
          image_url?: Nullable<string>;
          organizer_name?: Nullable<string>;
          is_registration_required?: boolean;
          max_attendees?: Nullable<number>;
          status?: string;
          publication_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      ministries: {
        Row: {
          id: string;
          name: string;
          description: Nullable<string>;
          leader_id: Nullable<string>;
          leader_name: Nullable<string>;
          contact_email: Nullable<string>;
          contact_phone: Nullable<string>;
          image_url: Nullable<string>;
          icon: Nullable<string>;
          color: Nullable<string>;
          meeting_schedule: Nullable<string>;
          programs: string[];
          member_count: number;
          volunteer_count: number;
          status: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: Nullable<string>;
          leader_id?: Nullable<string>;
          leader_name?: Nullable<string>;
          contact_email?: Nullable<string>;
          contact_phone?: Nullable<string>;
          image_url?: Nullable<string>;
          icon?: Nullable<string>;
          color?: Nullable<string>;
          meeting_schedule?: Nullable<string>;
          programs?: string[];
          member_count?: number;
          volunteer_count?: number;
          status?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ministries"]["Insert"]>;
        Relationships: [];
      };
      people: {
        Row: {
          id: string;
          first_name: string;
          last_name: Nullable<string>;
          email: Nullable<string>;
          phone: Nullable<string>;
          address: Nullable<string>;
          preferred_contact_method: string;
          status: string;
          source: Nullable<string>;
          notes: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name?: Nullable<string>;
          email?: Nullable<string>;
          phone?: Nullable<string>;
          address?: Nullable<string>;
          preferred_contact_method?: string;
          status?: string;
          source?: Nullable<string>;
          notes?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["people"]["Insert"]>;
        Relationships: [];
      };
      planned_visits: {
        Row: {
          id: string;
          person_id: Nullable<string>;
          name: string;
          email: Nullable<string>;
          phone: Nullable<string>;
          service_name: string;
          visit_date: string;
          status: string;
          source: Nullable<string>;
          notes: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          person_id?: Nullable<string>;
          name: string;
          email?: Nullable<string>;
          phone?: Nullable<string>;
          service_name: string;
          visit_date: string;
          status?: string;
          source?: Nullable<string>;
          notes?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["planned_visits"]["Insert"]>;
        Relationships: [];
      };
      prayer_requests: {
        Row: {
          id: string;
          person_id: Nullable<string>;
          name: Nullable<string>;
          email: Nullable<string>;
          phone: Nullable<string>;
          is_anonymous: boolean;
          request_text: string;
          category: Nullable<string>;
          urgency: string;
          status: string;
          prayer_count: number;
          response: Nullable<string>;
          internal_notes: Nullable<string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          person_id?: Nullable<string>;
          name?: Nullable<string>;
          email?: Nullable<string>;
          phone?: Nullable<string>;
          is_anonymous?: boolean;
          request_text: string;
          category?: Nullable<string>;
          urgency?: string;
          status?: string;
          prayer_count?: number;
          response?: Nullable<string>;
          internal_notes?: Nullable<string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prayer_requests"]["Insert"]>;
        Relationships: [];
      };
      sermons: {
        Row: {
          id: string;
          title: string;
          preacher_name: Nullable<string>;
          sermon_date: Nullable<string>;
          series: Nullable<string>;
          bible_text: Nullable<string>;
          description: Nullable<string>;
          video_url: Nullable<string>;
          audio_url: Nullable<string>;
          notes_url: Nullable<string>;
          thumbnail_url: Nullable<string>;
          duration_minutes: Nullable<number>;
          view_count: number;
          publication_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          preacher_name?: Nullable<string>;
          sermon_date?: Nullable<string>;
          series?: Nullable<string>;
          bible_text?: Nullable<string>;
          description?: Nullable<string>;
          video_url?: Nullable<string>;
          audio_url?: Nullable<string>;
          notes_url?: Nullable<string>;
          thumbnail_url?: Nullable<string>;
          duration_minutes?: Nullable<number>;
          view_count?: number;
          publication_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sermons"]["Insert"]>;
        Relationships: [];
      };
      service_times: {
        Row: {
          id: string;
          day_of_week: string;
          label: string;
          time: string;
          location: Nullable<string>;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: string;
          label: string;
          time: string;
          location?: Nullable<string>;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["service_times"]["Insert"]>;
        Relationships: [];
      };
      visitors: {
        Row: {
          id: string;
          person_id: string;
          is_first_time_visitor: boolean;
          service_date: string;
          service_name: Nullable<string>;
          source: Nullable<string>;
          notes: Nullable<string>;
          requires_follow_up: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          is_first_time_visitor?: boolean;
          service_date: string;
          service_name?: Nullable<string>;
          source?: Nullable<string>;
          notes?: Nullable<string>;
          requires_follow_up?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["visitors"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_visitor: {
        Args: {
          p_first_name: string;
          p_service_date: string;
          p_last_name?: Nullable<string>;
          p_email?: Nullable<string>;
          p_phone?: Nullable<string>;
          p_address?: Nullable<string>;
          p_preferred_contact_method?: string;
          p_source?: Nullable<string>;
          p_person_notes?: Nullable<string>;
          p_is_first_time_visitor?: boolean;
          p_service_name?: Nullable<string>;
          p_visit_notes?: Nullable<string>;
          p_requires_follow_up?: boolean;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];
