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
      character_analysis: {
        Row: {
          character_id: string | null
          created_at: string
          id: string
          personality_text: string
          traits_json: Json
        }
        Insert: {
          character_id?: string | null
          created_at?: string
          id?: string
          personality_text: string
          traits_json: Json
        }
        Update: {
          character_id?: string | null
          created_at?: string
          id?: string
          personality_text?: string
          traits_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "character_analysis_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_attributes: {
        Row: {
          attribute_name: string
          character_id: string | null
          created_at: string
          id: string
          value: number
        }
        Insert: {
          attribute_name: string
          character_id?: string | null
          created_at?: string
          id?: string
          value: number
        }
        Update: {
          attribute_name?: string
          character_id?: string | null
          created_at?: string
          id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_attributes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_images: {
        Row: {
          character_id: string | null
          created_at: string
          id: string
          image_url: string
          is_selected: boolean | null
          prompt_used: string
        }
        Insert: {
          character_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_selected?: boolean | null
          prompt_used: string
        }
        Update: {
          character_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_selected?: boolean | null
          prompt_used?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_images_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_morality: {
        Row: {
          alignment_score: number
          character_id: string | null
          created_at: string
          good_evil_scale: number
          id: string
          lawful_chaotic_scale: number
        }
        Insert: {
          alignment_score: number
          character_id?: string | null
          created_at?: string
          good_evil_scale: number
          id?: string
          lawful_chaotic_scale: number
        }
        Update: {
          alignment_score?: number
          character_id?: string | null
          created_at?: string
          good_evil_scale?: number
          id?: string
          lawful_chaotic_scale?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_morality_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_prompts: {
        Row: {
          character_id: string | null
          created_at: string
          dalle_prompt: string
          id: string
          personality_prompt: string
        }
        Insert: {
          character_id?: string | null
          created_at?: string
          dalle_prompt: string
          id?: string
          personality_prompt: string
        }
        Update: {
          character_id?: string | null
          created_at?: string
          dalle_prompt?: string
          id?: string
          personality_prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_prompts_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_responses: {
        Row: {
          answer: string
          character_id: string | null
          created_at: string
          id: string
          question_id: string | null
        }
        Insert: {
          answer: string
          character_id?: string | null
          created_at?: string
          id?: string
          question_id?: string | null
        }
        Update: {
          answer?: string
          character_id?: string | null
          created_at?: string
          id?: string
          question_id?: string | null
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
          },
        ]
      }
      characters: {
        Row: {
          class: string | null
          created_at: string
          gender: string | null
          id: string
          name: string
          race: string | null
          status: Database["public"]["Enums"]["character_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          class?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name: string
          race?: string | null
          status?: Database["public"]["Enums"]["character_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          class?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name?: string
          race?: string | null
          status?: Database["public"]["Enums"]["character_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          created_at: string
          id: string
          morality_weight: number
          question_text: string
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          created_at?: string
          id?: string
          morality_weight: number
          question_text: string
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          created_at?: string
          id?: string
          morality_weight?: number
          question_text?: string
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
      character_status:
        | "naming"
        | "questioning"
        | "attributes"
        | "generated"
        | "completed"
        | "class"
        | "gender"
        | "race"
      question_category: "personality" | "background" | "morality"
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
