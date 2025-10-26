export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          audience: string
          commission_rate: number | null
          company: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          name: string
          referred_count: number | null
          status: string
          total_commission: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          audience: string
          commission_rate?: number | null
          company?: string | null
          created_at?: string | null
          description: string
          email: string
          id?: string
          name: string
          referred_count?: number | null
          status?: string
          total_commission?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          audience?: string
          commission_rate?: number | null
          company?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          name?: string
          referred_count?: number | null
          status?: string
          total_commission?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          actor_user_id: string | null
          created_at: string | null
          entity: string | null
          entity_id: string | null
          id: string
          metadata_json: Json | null
          tenant_id: string | null
        }
        Insert: {
          action?: string | null
          actor_user_id?: string | null
          created_at?: string | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata_json?: Json | null
          tenant_id?: string | null
        }
        Update: {
          action?: string | null
          actor_user_id?: string | null
          created_at?: string | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata_json?: Json | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      campaign_analytics: {
        Row: {
          campaign_id: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string | null
          tenant_id: string
        }
        Insert: {
          campaign_id: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          tenant_id: string
        }
        Update: {
          campaign_id?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_attachments: {
        Row: {
          campaign_id: string
          created_at: string | null
          file_data: string | null
          file_name: string
          file_type: string
          id: string
          metadata: Json | null
          storage_path: string | null
          tenant_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          file_data?: string | null
          file_name: string
          file_type: string
          id?: string
          metadata?: Json | null
          storage_path?: string | null
          tenant_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          file_data?: string | null
          file_name?: string
          file_type?: string
          id?: string
          metadata?: Json | null
          storage_path?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_attachments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_comments: {
        Row: {
          author_email: string | null
          author_name: string
          campaign_id: string
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          campaign_id: string
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          campaign_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_comments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_shares: {
        Row: {
          campaign_id: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          password_hash: string | null
          share_token: string
          tenant_id: string
          view_count: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          password_hash?: string | null
          share_token: string
          tenant_id: string
          view_count?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          password_hash?: string | null
          share_token?: string
          tenant_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_shares_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ai_generated_data: Json | null
          created_at: string | null
          description: string
          event_id: string
          id: string
          is_template: boolean | null
          location_id: string | null
          recommended_end: string
          recommended_start: string
          status: Database["public"]["Enums"]["campaign_status"] | null
          tenant_id: string | null
          title: string
          updated_at: string | null
          user_edited_data: Json | null
        }
        Insert: {
          ai_generated_data?: Json | null
          created_at?: string | null
          description: string
          event_id: string
          id?: string
          is_template?: boolean | null
          location_id?: string | null
          recommended_end: string
          recommended_start: string
          status?: Database["public"]["Enums"]["campaign_status"] | null
          tenant_id?: string | null
          title: string
          updated_at?: string | null
          user_edited_data?: Json | null
        }
        Update: {
          ai_generated_data?: Json | null
          created_at?: string | null
          description?: string
          event_id?: string
          id?: string
          is_template?: boolean | null
          location_id?: string | null
          recommended_end?: string
          recommended_start?: string
          status?: Database["public"]["Enums"]["campaign_status"] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string | null
          user_edited_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["event_category"]
          city: string | null
          created_at: string | null
          description: string | null
          end_time: string
          expected_attendance: number
          id: string
          p10: number | null
          p90: number | null
          raw_url: string | null
          source: string | null
          source_id: string | null
          start_time: string
          title: string
          venue_lat: number
          venue_lon: number
          venue_name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["event_category"]
          city?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          expected_attendance: number
          id?: string
          p10?: number | null
          p90?: number | null
          raw_url?: string | null
          source?: string | null
          source_id?: string | null
          start_time: string
          title: string
          venue_lat: number
          venue_lon: number
          venue_name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["event_category"]
          city?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          expected_attendance?: number
          id?: string
          p10?: number | null
          p90?: number | null
          raw_url?: string | null
          source?: string | null
          source_id?: string | null
          start_time?: string
          title?: string
          venue_lat?: number
          venue_lon?: number
          venue_name?: string
        }
        Relationships: []
      }
      internal_events: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          end_time: string
          event_type: string
          id: string
          start_time: string
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          event_type: string
          id?: string
          start_time: string
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          start_time?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      investor_applications: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          investment_range: string
          message: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          investment_range: string
          message: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          investment_range?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      lead_finder_jobs: {
        Row: {
          business_types: string[]
          cities: string[]
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          max_results_per_city: number
          progress: number
          results_json: Json | null
          started_at: string | null
          status: string
          total_steps: number
          user_id: string
        }
        Insert: {
          business_types: string[]
          cities: string[]
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_results_per_city?: number
          progress?: number
          results_json?: Json | null
          started_at?: string | null
          status?: string
          total_steps?: number
          user_id: string
        }
        Update: {
          business_types?: string[]
          cities?: string[]
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_results_per_city?: number
          progress?: number
          results_json?: Json | null
          started_at?: string | null
          status?: string
          total_steps?: number
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          source: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          source: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          source?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          address_line: string | null
          brand_tone: string | null
          business_description: string | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          lat: number
          lon: number
          name: string | null
          open_hours_text: string | null
          previous_successful_campaigns: string | null
          radius_km: number | null
          target_customer_profile: string | null
          tenant_id: string | null
          typical_offerings: string | null
          unique_selling_points: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          address_line?: string | null
          brand_tone?: string | null
          business_description?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id: string
          lat: number
          lon: number
          name?: string | null
          open_hours_text?: string | null
          previous_successful_campaigns?: string | null
          radius_km?: number | null
          target_customer_profile?: string | null
          tenant_id?: string | null
          typical_offerings?: string | null
          unique_selling_points?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          address_line?: string | null
          brand_tone?: string | null
          business_description?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          lat?: number
          lon?: number
          name?: string | null
          open_hours_text?: string | null
          previous_successful_campaigns?: string | null
          radius_km?: number | null
          target_customer_profile?: string | null
          tenant_id?: string | null
          typical_offerings?: string | null
          unique_selling_points?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"] | null
          created_at: string | null
          enabled: boolean | null
          id: string
          last_fired_at: string | null
          location_id: string | null
          min_attendance: number | null
          radius_km: number | null
          tenant_id: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_fired_at?: string | null
          location_id?: string | null
          min_attendance?: number | null
          radius_km?: number | null
          tenant_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_fired_at?: string | null
          location_id?: string | null
          min_attendance?: number | null
          radius_km?: number | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          email: string
          id: string
          referral_code: string
          referred_count: number | null
          total_commission: number | null
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          email: string
          id?: string
          referral_code: string
          referred_count?: number | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          email?: string
          id?: string
          referral_code?: string
          referred_count?: number | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referred_users: {
        Row: {
          commission_amount: number | null
          converted_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_email: string | null
          referred_user_id: string | null
          status: string | null
        }
        Insert: {
          commission_amount?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string | null
        }
        Update: {
          commission_amount?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referred_users_referral_code_fkey"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["referral_code"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          api_settings: Json | null
          branding: Json | null
          created_at: string | null
          id: string
          name: string
          plan: Database["public"]["Enums"]["plan_type"] | null
          status: Database["public"]["Enums"]["tenant_status"] | null
        }
        Insert: {
          api_settings?: Json | null
          branding?: Json | null
          created_at?: string | null
          id?: string
          name: string
          plan?: Database["public"]["Enums"]["plan_type"] | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
        }
        Update: {
          api_settings?: Json | null
          branding?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          plan?: Database["public"]["Enums"]["plan_type"] | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "staff" | "admin" | "moderator" | "viewer" | "editor"
      business_type: "cafe" | "bar" | "restaurant" | "hotel"
      campaign_status: "draft" | "scheduled" | "published"
      event_category:
        | "concert"
        | "sports"
        | "conference"
        | "festival"
        | "theatre"
        | "community"
        | "other"
      notification_channel: "email" | "inapp"
      plan_type: "starter" | "pro" | "business" | "professional" | "enterprise"
      tenant_status: "trial" | "active" | "past_due" | "canceled"
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
    Enums: {
      app_role: ["owner", "staff", "admin", "moderator", "viewer", "editor"],
      business_type: ["cafe", "bar", "restaurant", "hotel"],
      campaign_status: ["draft", "scheduled", "published"],
      event_category: [
        "concert",
        "sports",
        "conference",
        "festival",
        "theatre",
        "community",
        "other",
      ],
      notification_channel: ["email", "inapp"],
      plan_type: ["starter", "pro", "business", "professional", "enterprise"],
      tenant_status: ["trial", "active", "past_due", "canceled"],
    },
  },
} as const
