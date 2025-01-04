export interface Database {
  public: {
    Tables: {
      // ... existing tables ...
    };
    Functions: {
      // ... existing functions ...
      handle_specialty_selection: {
        Args: {
          p_character_id: string;
          p_specialty_id: string;
        };
        Returns: void;
      };
    };
  };
} 