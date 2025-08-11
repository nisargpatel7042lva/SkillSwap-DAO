export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: string | null
          auto_release_at: string | null
          created_at: string | null
          id: number
          payment_status: string | null
          requester_id: string | null
          requirements: string | null
          skill_id: number | null
          status: string | null
          token_address: string | null
          tx_hash: string | null
        }
        Insert: {
          amount?: string | null
          auto_release_at?: string | null
          created_at?: string | null
          id?: number
          payment_status?: string | null
          requester_id?: string | null
          requirements?: string | null
          skill_id?: number | null
          status?: string | null
          token_address?: string | null
          tx_hash?: string | null
        }
        Update: {
          amount?: string | null
          auto_release_at?: string | null
          created_at?: string | null
          id?: number
          payment_status?: string | null
          requester_id?: string | null
          requirements?: string | null
          skill_id?: number | null
          status?: string | null
          token_address?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "bookings_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_events: {
        Row: {
          amount: string
          booking_id: number
          created_at: string
          event_type: string
          id: string
          token_address: string
          triggered_by: string
          tx_hash: string | null
        }
        Insert: {
          amount: string
          booking_id: number
          created_at?: string
          event_type: string
          id?: string
          token_address: string
          triggered_by: string
          tx_hash?: string | null
        }
        Update: {
          amount?: string
          booking_id?: number
          created_at?: string
          event_type?: string
          id?: string
          token_address?: string
          triggered_by?: string
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: string
          block_number: number | null
          booking_id: number
          created_at: string
          from_address: string
          gas_price: string | null
          gas_used: string | null
          id: string
          status: string
          to_address: string
          token_address: string
          tx_hash: string
        }
        Insert: {
          amount: string
          block_number?: number | null
          booking_id: number
          created_at?: string
          from_address: string
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          status: string
          to_address: string
          token_address: string
          tx_hash: string
        }
        Update: {
          amount?: string
          block_number?: number | null
          booking_id?: number
          created_at?: string
          from_address?: string
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          status?: string
          to_address?: string
          token_address?: string
          tx_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          description: string | null
          due_date: string | null
          id: number
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          description?: string | null
          due_date?: string | null
          id?: number
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          description?: string | null
          due_date?: string | null
          id?: number
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          rater_id: string | null
          rating: number | null
          service_id: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          rater_id?: string | null
          rating?: number | null
          service_id?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          rater_id?: string | null
          rating?: number | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "ratings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          illustration_url: string | null
          price: number
          title: string
          token_symbol: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          illustration_url?: string | null
          price: number
          title: string
          token_symbol?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          illustration_url?: string | null
          price?: number
          title?: string
          token_symbol?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          },
        ]
      }
      users: {
        Row: {
          address: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          reputation: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          reputation?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          reputation?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      work_evidence: {
        Row: {
          booking_id: number
          created_at: string
          evidence_url: string
          id: string
          notes: string | null
          request_id: number | null
          submitter: string
        }
        Insert: {
          booking_id: number
          created_at?: string
          evidence_url: string
          id?: string
          notes?: string | null
          request_id?: number | null
          submitter: string
        }
        Update: {
          booking_id?: number
          created_at?: string
          evidence_url?: string
          id?: string
          notes?: string | null
          request_id?: number | null
          submitter?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_evidence_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
