# Dynamic Saga - Character Creation System

A modern, mobile-first web application for creating and managing role-playing game characters. Built with React, TypeScript, Vite, and Supabase.

## Project Overview

This application provides a step-by-step character creation system with real-time database synchronization and a seamless user experience.

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript 5
- **Build Tool**: Vite 5
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context + Custom Hooks
- **Type Safety**: Zod + TypeScript

## Database Synchronization

### Character Creation Flow & Database States

Each step in the character creation process is tightly coupled with database state management:

1. **Character Initialization**
   ```typescript
   // Database State: characters.status = 'naming'
   // Required Fields: name, user_id
   interface Character {
     id: string;
     name: string;
     status: CharacterStatus;
     user_id: string;
   }
   ```

2. **Gender Selection**
   ```typescript
   // Database State: characters.status = 'gender'
   // New Fields: gender (enum: 'male' | 'female')
   // Validation: Enforced through database enum constraint
   ```

3. **Race Selection**
   ```typescript
   // Database State: characters.status = 'race'
   // New Fields: race (enum: 'Human' | 'Dwarf' | 'Animal')
   // Triggers: On Animal selection, sets next status to 'animal_type'
   ```

4. **Class Selection**
   ```typescript
   // Database State: characters.status = 'class'
   // New Fields: class (references available_classes)
   // Constraints: Certain classes restricted by race
   ```

5. **Clothing Selection**
   ```typescript
   // Database State: characters.status = 'clothing'
   // Table: character_clothing
   // Relations: One-to-one with characters
   ```

6. **Armor Selection**
   ```typescript
   // Database State: characters.status = 'armor'
   // Table: character_armor
   // Relations: One-to-one with characters
   ```

7. **Morality Questions**
   ```typescript
   // Database State: characters.status = 'morality'
   // Tables: 
   //   - character_responses (stores question answers)
   //   - character_morality (stores calculated alignment)
   // Flow:
   //   1. Load questions from questions table
   //   2. Save responses in character_responses
   //   3. Calculate alignment on completion
   ```

8. **Attributes**
   ```typescript
   // Database State: characters.status = 'attributes'
   // Table: character_attributes
   // Structure: Stores STR, DEX, CON, INT, WIS, CHA
   ```

### Database Schema

```sql
-- Core character table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  status character_status NOT NULL DEFAULT 'naming',
  gender gender_type,
  race race_type,
  class TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Morality responses
CREATE TABLE character_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id),
  question_id UUID REFERENCES questions(id),
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Character morality
CREATE TABLE character_morality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id),
  alignment_id UUID REFERENCES morality_alignments(id),
  good_evil_points INTEGER NOT NULL,
  law_chaos_points INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### State Management & Database Sync

Each component in the creation flow follows these principles:

1. **State Initialization**
   ```typescript
   // Load initial state from database
   const { data: character } = await supabase
     .from('characters')
     .select()
     .eq('id', characterId)
     .single();
   ```

2. **State Updates**
   ```typescript
   // Update database before local state
   const { error } = await supabase
     .from('characters')
     .update({ status: nextStatus })
     .eq('id', characterId);

   if (!error) {
     setCurrentStep(nextStatus);
   }
   ```

3. **Error Handling**
   ```typescript
   try {
     // Database operation
   } catch (error) {
     toast({
       variant: "destructive",
       description: "Failed to save. Please try again.",
     });
   }
   ```

### Navigation & State Management

The application uses a robust navigation system that ensures database and UI state consistency:

```typescript
const handleBack = useCallback(() => {
  switch (currentStep) {
    case "morality":
      // Update database first
      await updateStatus(characterId, 'armor');
      // Then update UI
      setCurrentStep("armor");
      break;
    // ... other cases
  }
}, [currentStep, characterId]);
```

### Production Database Considerations

1. **Migration Strategy**
   - All schema changes are versioned in `supabase/migrations/`
   - Migrations are applied in order using timestamp prefixes
   - Each migration includes both up and down scripts

2. **Data Integrity**
   - Foreign key constraints ensure referential integrity
   - Enum types enforce valid status values
   - Triggers maintain updated_at timestamps

3. **Performance**
   - Indexes on frequently queried columns
   - Materialized views for complex calculations
   - Connection pooling for optimal resource usage

4. **Security**
   - Row Level Security (RLS) policies
   - Proper role-based access control
   - Prepared statements to prevent SQL injection

## Development Setup

1. **Environment Configuration**
   ```bash
   # .env.local
   VITE_SUPABASE_URL=your_production_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Database Migration**
   ```bash
   supabase db push
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

## Production Deployment

1. **Pre-deployment Checks**
   - Run migration dry-run
   - Verify RLS policies
   - Check for breaking changes

2. **Database Migration**
   ```bash
   supabase db push --db-url=$PRODUCTION_DB_URL
   ```

3. **Frontend Deployment**
   ```bash
   npm run build
   # Deploy dist/ to your hosting service
   ```

## Troubleshooting

Common issues and solutions:

1. **Database Sync Issues**
   - Check network connectivity
   - Verify Supabase credentials
   - Check RLS policies

2. **State Management Issues**
   - Verify character status in database
   - Check for race conditions in updates
   - Validate step transitions

3. **Navigation Issues**
   - Confirm current step in database
   - Verify navigation conditions
   - Check for missing status updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE.md for details
