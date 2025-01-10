export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      animal_types: {
        Row: {
          abilities: string[]
          created_at: string | null
          description: string
          id: string
          name: string
          race_id: string
          updated_at: string | null
        }
        Insert: {
          abilities: string[]
          created_at?: string | null
          description: string
          id?: string
          name: string
          race_id: string
          updated_at?: string | null
        }
        Update: {
          abilities?: string[]
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          race_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_types_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      attributes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_value: number
          min_value: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_value?: number
          min_value?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_value?: number
          min_value?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      backgrounds: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          personality_traits: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          personality_traits: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          personality_traits?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      character_attributes: {
        Row: {
          attribute_id: string
          base_value: number
          character_id: string
          class_modifier: number | null
          created_at: string
          id: string
          racial_modifier: number | null
          updated_at: string
        }
        Insert: {
          attribute_id: string
          base_value: number
          character_id: string
          class_modifier?: number | null
          created_at?: string
          id?: string
          racial_modifier?: number | null
          updated_at?: string
        }
        Update: {
          attribute_id?: string
          base_value?: number
          character_id?: string
          class_modifier?: number | null
          created_at?: string
          id?: string
          racial_modifier?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_attributes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_backgrounds: {
        Row: {
          background_id: string
          created_at: string | null
          id: string
          notes: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          background_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          background_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_backgrounds_background_id_fkey"
            columns: ["background_id"]
            isOneToOne: false
            referencedRelation: "backgrounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_backgrounds_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_classes: {
        Row: {
          id: string
          name: string
          overview: string
          traits: string[]
        }
        Insert: {
          id?: string
          name: string
          overview: string
          traits: string[]
        }
        Update: {
          id?: string
          name?: string
          overview?: string
          traits?: string[]
        }
        Relationships: []
      }
      character_equipment: {
        Row: {
          created_at: string | null
          equipped: boolean
          id: string
          item_id: string
          profile_id: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipped?: boolean
          id?: string
          item_id: string
          profile_id: string
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipped?: boolean
          id?: string
          item_id?: string
          profile_id?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_equipment_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_equipment_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_faiths: {
        Row: {
          created_at: string | null
          devotion_level: number
          faith_id: string
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          devotion_level?: number
          faith_id: string
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          devotion_level?: number
          faith_id?: string
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_faiths_faith_id_fkey"
            columns: ["faith_id"]
            isOneToOne: false
            referencedRelation: "faiths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_faiths_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_progress: {
        Row: {
          character_id: string
          created_at: string | null
          experience: number
          id: string
          level: number
          updated_at: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          experience?: number
          id?: string
          level?: number
          updated_at?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          experience?: number
          id?: string
          level?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_progress_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_specialties: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          specialty_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          specialty_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          specialty_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_specialties_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          animal_type_id: string | null
          class_id: string | null
          created_at: string
          gender: string | null
          id: string
          name: string
          pronouns: Json | null
          race_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_type_id?: string | null
          class_id?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name: string
          pronouns?: Json | null
          race_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_type_id?: string | null
          class_id?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name?: string
          pronouns?: Json | null
          race_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_animal_type_id_fkey"
            columns: ["animal_type_id"]
            isOneToOne: false
            referencedRelation: "animal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "character_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          properties: Json
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          properties: Json
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          properties?: Json
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faiths: {
        Row: {
          abilities: string[]
          created_at: string | null
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          abilities: string[]
          created_at?: string | null
          description: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          abilities?: string[]
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      morality_alignments: {
        Row: {
          alignment: string
          created_at: string | null
          description: string
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          alignment: string
          created_at?: string | null
          description: string
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          alignment?: string
          created_at?: string | null
          description?: string
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "morality_alignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          character_class: string | null
          character_name: string | null
          created_at: string
          gender: string | null
          id: string
          race: string | null
          user_id: string
        }
        Insert: {
          character_class?: string | null
          character_name?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          race?: string | null
          user_id: string
        }
        Update: {
          character_class?: string | null
          character_name?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          race?: string | null
          user_id?: string
        }
        Relationships: []
      }
      race_class_restrictions: {
        Row: {
          class_name: string
          id: string
          is_restricted: boolean
          race_name: string
          restriction_reason: string | null
        }
        Insert: {
          class_name: string
          id?: string
          is_restricted?: boolean
          race_name: string
          restriction_reason?: string | null
        }
        Update: {
          class_name?: string
          id?: string
          is_restricted?: boolean
          race_name?: string
          restriction_reason?: string | null
        }
        Relationships: []
      }
      races: {
        Row: {
          abilities: string[]
          available_animal_types: boolean
          created_at: string | null
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          abilities: string[]
          available_animal_types?: boolean
          created_at?: string | null
          description: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          abilities?: string[]
          available_animal_types?: boolean
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      specialties: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
