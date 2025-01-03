export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      character_attributes: {
        Row: {
          character_id: string
          charisma: number
          charisma_modifier: number
          constitution: number
          constitution_modifier: number
          created_at: string
          dexterity: number
          dexterity_modifier: number
          id: string
          intelligence: number
          intelligence_modifier: number
          strength: number
          strength_modifier: number
          updated_at: string
          wisdom: number
          wisdom_modifier: number
        }
        Insert: {
          character_id: string
          charisma?: number
          charisma_modifier?: number
          constitution?: number
          constitution_modifier?: number
          created_at?: string
          dexterity?: number
          dexterity_modifier?: number
          id?: string
          intelligence?: number
          intelligence_modifier?: number
          strength?: number
          strength_modifier?: number
          updated_at?: string
          wisdom?: number
          wisdom_modifier?: number
        }
        Update: {
          character_id?: string
          charisma?: number
          charisma_modifier?: number
          constitution?: number
          constitution_modifier?: number
          created_at?: string
          dexterity?: number
          dexterity_modifier?: number
          id?: string
          intelligence?: number
          intelligence_modifier?: number
          strength?: number
          strength_modifier?: number
          updated_at?: string
          wisdom?: number
          wisdom_modifier?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_attributes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          id: string
          question_text: string
          morality_weight: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          question_text: string
          morality_weight: number
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          morality_weight?: number
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      character_responses: {
        Row: {
          id: string
          character_id: string
          question_id: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          character_id: string
          question_id: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          question_id?: string
          answer?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_responses_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      character_cards: {
        Row: {
          card_data: Json
          character_id: string
          created_at: string
          error_message: string | null
          id: string
          image_url: string | null
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          card_data?: Json
          character_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          card_data?: Json
          character_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_cards_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_faith_points: {
        Row: {
          available_points: number | null
          character_id: string
          created_at: string
          faith_abilities: Json
          id: string
          spent_points: number
          total_points: number
          updated_at: string
        }
        Insert: {
          available_points?: number | null
          character_id: string
          created_at?: string
          faith_abilities?: Json
          id?: string
          spent_points?: number
          total_points?: number
          updated_at?: string
        }
        Update: {
          available_points?: number | null
          character_id?: string
          created_at?: string
          faith_abilities?: Json
          id?: string
          spent_points?: number
          total_points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_faith_points_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_morality: {
        Row: {
          id: string
          character_id: string
          good_evil_scale: number
          lawful_chaotic_scale: number
          alignment_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          character_id: string
          good_evil_scale: number
          lawful_chaotic_scale: number
          alignment_score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          good_evil_scale?: number
          lawful_chaotic_scale?: number
          alignment_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_morality_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          }
        ]
      }
      character_specialties: {
        Row: {
          acquired_at: string
          character_id: string
          id: string
          specialty_id: string
        }
        Insert: {
          acquired_at?: string
          character_id: string
          id?: string
          specialty_id: string
        }
        Update: {
          acquired_at?: string
          character_id?: string
          id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_specialties_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
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
          animal_type: string | null
          character_card_generated_at: string | null
          character_card_url: string | null
          class: string | null
          created_at: string
          gender: Database["public"]["Enums"]["character_gender"] | null
          id: string
          name: string
          race: string | null
          status: Database["public"]["Enums"]["character_creation_status"]
          updated_at: string
          user_id: string
          clothing_type: string | null
        }
        Insert: {
          animal_type?: string | null
          character_card_generated_at?: string | null
          character_card_url?: string | null
          class?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["character_gender"] | null
          id?: string
          name: string
          race?: string | null
          status?: Database["public"]["Enums"]["character_creation_status"]
          updated_at?: string
          user_id: string
          clothing_type?: string | null
        }
        Update: {
          animal_type?: string | null
          character_card_generated_at?: string | null
          character_card_url?: string | null
          class?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["character_gender"] | null
          id?: string
          name?: string
          race?: string | null
          status?: Database["public"]["Enums"]["character_creation_status"]
          updated_at?: string
          user_id?: string
          clothing_type?: string | null
        }
        Relationships: []
      }
      faith_abilities: {
        Row: {
          cost: number
          created_at: string
          description: string
          effects: Json
          id: string
          name: string
          required_faith_points: number | null
          required_level: number | null
          updated_at: string
        }
        Insert: {
          cost: number
          created_at?: string
          description: string
          effects?: Json
          id?: string
          name: string
          required_faith_points?: number | null
          required_level?: number | null
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string
          effects?: Json
          id?: string
          name?: string
          required_faith_points?: number | null
          required_level?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      morality_alignments: {
        Row: {
          created_at: string
          description: string
          effects: Json | null
          ethical_axis: string
          id: string
          moral_axis: string
          name: string
          restrictions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          effects?: Json | null
          ethical_axis: string
          id?: string
          moral_axis: string
          name: string
          restrictions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          effects?: Json | null
          ethical_axis?: string
          id?: string
          moral_axis?: string
          name?: string
          restrictions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      specialties: {
        Row: {
          charisma_bonus: number | null
          constitution_bonus: number | null
          created_at: string
          description: string
          dexterity_bonus: number | null
          id: string
          intelligence_bonus: number | null
          name: string
          required_charisma: number | null
          required_constitution: number | null
          required_dexterity: number | null
          required_intelligence: number | null
          required_strength: number | null
          required_wisdom: number | null
          strength_bonus: number | null
          updated_at: string
          wisdom_bonus: number | null
        }
        Insert: {
          charisma_bonus?: number | null
          constitution_bonus?: number | null
          created_at?: string
          description: string
          dexterity_bonus?: number | null
          id?: string
          intelligence_bonus?: number | null
          name: string
          required_charisma?: number | null
          required_constitution?: number | null
          required_dexterity?: number | null
          required_intelligence?: number | null
          required_strength?: number | null
          required_wisdom?: number | null
          strength_bonus?: number | null
          updated_at?: string
          wisdom_bonus?: number | null
        }
        Update: {
          charisma_bonus?: number | null
          constitution_bonus?: number | null
          created_at?: string
          description?: string
          dexterity_bonus?: number | null
          id?: string
          intelligence_bonus?: number | null
          name?: string
          required_charisma?: number | null
          required_constitution?: number | null
          required_dexterity?: number | null
          required_intelligence?: number | null
          required_strength?: number | null
          required_wisdom?: number | null
          strength_bonus?: number | null
          updated_at?: string
          wisdom_bonus?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_alignment: {
        Args: {
          p_good_evil: number
          p_law_chaos: number
        }
        Returns: {
          moral_axis: string
          ethical_axis: string
        }[]
      }
      check_specialty_eligibility: {
        Args: {
          p_character_id: string
          p_specialty_id: string
        }
        Returns: boolean
      }
      compile_character_card_data: {
        Args: {
          p_character_id: string
        }
        Returns: Json
      }
      generate_character_card: {
        Args: {
          p_character_id: string
        }
        Returns: string
      }
      get_total_attributes: {
        Args: {
          p_character_id: string
        }
        Returns: Json
      }
      purchase_faith_ability: {
        Args: {
          p_character_id: string
          p_ability_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      character_creation_status:
        | "initiated"
        | "demographics"
        | "attributes"
        | "morality"
        | "specialty"
        | "faith_points"
        | "character_card"
        | "completed"
      character_gender: "Male" | "Female"
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

