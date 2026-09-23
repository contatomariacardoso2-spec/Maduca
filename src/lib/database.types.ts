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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          category: string | null
          contact_email: string | null
          contact_handle: string | null
          contact_name: string | null
          created_at: string
          estimated_value: number
          id: string
          name: string
          next_action: string | null
          next_action_at: string | null
          notes: string | null
          stage: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          contact_handle?: string | null
          contact_name?: string | null
          created_at?: string
          estimated_value?: number
          id?: string
          name: string
          next_action?: string | null
          next_action_at?: string | null
          notes?: string | null
          stage?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          contact_handle?: string | null
          contact_name?: string | null
          created_at?: string
          estimated_value?: number
          id?: string
          name?: string
          next_action?: string | null
          next_action_at?: string | null
          notes?: string | null
          stage?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brand_id: string | null
          brief: string | null
          created_at: string
          deadline: string | null
          deliverables: Json
          exclusivity: Json
          fee: number
          hours_spent: number
          id: string
          included_revisions: number
          payment_due_at: string | null
          payment_status: string
          raw_files_included: boolean
          status: string
          title: string
          updated_at: string
          usage_rights: Json
          workspace_id: string
        }
        Insert: {
          brand_id?: string | null
          brief?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: Json
          exclusivity?: Json
          fee?: number
          hours_spent?: number
          id?: string
          included_revisions?: number
          payment_due_at?: string | null
          payment_status?: string
          raw_files_included?: boolean
          status?: string
          title: string
          updated_at?: string
          usage_rights?: Json
          workspace_id: string
        }
        Update: {
          brand_id?: string | null
          brief?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: Json
          exclusivity?: Json
          fee?: number
          hours_spent?: number
          id?: string
          included_revisions?: number
          payment_due_at?: string | null
          payment_status?: string
          raw_files_included?: boolean
          status?: string
          title?: string
          updated_at?: string
          usage_rights?: Json
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ideas: {
        Row: {
          angle: string | null
          category: string | null
          created_at: string
          format: string | null
          hook: string | null
          id: string
          notes: string | null
          product_id: string | null
          status: string
          title: string
          workspace_id: string
        }
        Insert: {
          angle?: string | null
          category?: string | null
          created_at?: string
          format?: string | null
          hook?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          status?: string
          title: string
          workspace_id: string
        }
        Update: {
          angle?: string | null
          category?: string | null
          created_at?: string
          format?: string | null
          hook?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          status?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ideas_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_ideas_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          campaign_id: string | null
          category: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          is_public: boolean
          media_url: string | null
          permission_status: string
          skill_tag: string | null
          sort_order: number
          thumbnail_url: string | null
          title: string
          workspace_id: string
        }
        Insert: {
          campaign_id?: string | null
          category?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_public?: boolean
          media_url?: string | null
          permission_status?: string
          skill_tag?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          workspace_id: string
        }
        Update: {
          campaign_id?: string | null
          category?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_public?: boolean
          media_url?: string | null
          permission_status?: string
          skill_tag?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          acquisition_cost: number
          category: string | null
          created_at: string
          creative_potential: number
          id: string
          name: string
          notes: string | null
          owned: boolean
          priority: string
          workspace_id: string
        }
        Insert: {
          acquisition_cost?: number
          category?: string | null
          created_at?: string
          creative_potential?: number
          id?: string
          name: string
          notes?: string | null
          owned?: boolean
          priority?: string
          workspace_id: string
        }
        Update: {
          acquisition_cost?: number
          category?: string | null
          created_at?: string
          creative_potential?: number
          id?: string
          name?: string
          notes?: string | null
          owned?: boolean
          priority?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          brand_id: string | null
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          due_at: string | null
          id: string
          priority: string
          title: string
          workspace_id: string
        }
        Insert: {
          brand_id?: string | null
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          priority?: string
          title: string
          workspace_id: string
        }
        Update: {
          brand_id?: string | null
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          priority?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          paid_at: string | null
          status: string
          type: string
          workspace_id: string
        }
        Insert: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          type: string
          workspace_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reviews: {
        Row: {
          blockers: string | null
          commercial_score: number | null
          created_at: string
          experiments: string | null
          id: string
          portfolio_score: number | null
          production_score: number | null
          week_start: string
          wins: string | null
          worked: string | null
          workspace_id: string
        }
        Insert: {
          blockers?: string | null
          commercial_score?: number | null
          created_at?: string
          experiments?: string | null
          id?: string
          portfolio_score?: number | null
          production_score?: number | null
          week_start: string
          wins?: string | null
          worked?: string | null
          workspace_id: string
        }
        Update: {
          blockers?: string | null
          commercial_score?: number | null
          created_at?: string
          experiments?: string | null
          id?: string
          portfolio_score?: number | null
          production_score?: number | null
          week_start?: string
          wins?: string | null
          worked?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reviews_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          monthly_goal: number
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_goal?: number
          name?: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_goal?: number
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
