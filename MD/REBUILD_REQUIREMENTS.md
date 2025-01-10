# Dynamic Saga Rebuild Requirements

## Core System Requirements

### Technology Stack
- React 18+ with TypeScript 5
- Vite for build tooling
- Supabase for database and authentication
- Netlify for deployment and serverless functions
- OpenAI API (GPT-4 + DALL-E 3) integration
- Tailwind CSS for styling
- Radix UI for accessible components
- React Query for data fetching
- Zustand for state management
- React Hook Form for form handling

### Critical Configurations
- TypeScript strict mode enabled
- Netlify build process compatibility
- Supabase real-time subscriptions
- Rate limiting implementation
- Proper environment variable handling
- Client-side routing (React Router)
- Security headers configuration

## Database Structure (Supabase)

### Core Tables
1. Characters
   - Basic info (name, gender, race, class)
   - Attributes and stats
   - Equipment and inventory
   - Faith and morality settings
   - Generated content (descriptions, images)
   - Creation progress tracking

2. Users
   - Profile information
   - Settings
   - Character relationships

3. CharacterProgress
   - Current step tracking
   - Saved data per step
   - Validation states

## Character Creation Workflow

### 18-Step Process
1. Name Selection (2-50 characters)
2. Gender Selection (with pronouns)
3. Race Selection (with attributes)
4. Animal Type (conditional)
5. Class Selection
6. Attributes Assignment
7. Morality System
8. Faith Selection
9. Faith Points
10. Specialties
11. Background
12. Appearance
13. Clothing
14. Equipment
15. Description (AI-generated)
16. Character Card
17. Complete
18. Generated (AI visualization)

## State Management Requirements

### Global State (Zustand)
- Character creation progress
- Form data persistence
- User session
- UI states (loading, errors)
- Real-time sync states

### Local State
- Form state management
- Component-level states
- Validation states
- Loading states

## API Integration Requirements

### OpenAI Integration
- Character description generation (GPT-4)
- Character visualization (DALL-E 3)
- Rate limiting
- Error handling
- Response caching

### Supabase Integration
- Real-time subscriptions
- Row Level Security (RLS)
- Authentication flow
- File storage
- Database queries

## Security Requirements

### Authentication
- User session management
- Protected routes
- JWT handling
- Role-based access

### Data Protection
- Input validation
- Content sanitization
- Rate limiting
- Error handling
- CORS configuration

## Performance Requirements

### Optimization
- Code splitting
- Lazy loading
- Bundle optimization
- Image optimization
- Caching strategy

### Loading States
- Skeleton loaders
- Progress indicators
- Error states
- Fallback components

## Environment Variables Structure

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# API Configuration
VITE_API_URL=http://localhost:3000
VITE_MAX_REQUESTS_PER_MINUTE=3

# Application Settings
VITE_CHARACTER_NAME_MIN_LENGTH=2
VITE_CHARACTER_NAME_MAX_LENGTH=50
```

## Type System Requirements

### Core Types
```typescript
interface Character {
  id: string;
  name: string;
  gender: string;
  race: Race;
  class: CharacterClass;
  attributes: Attributes;
  morality: Morality;
  faith: Faith;
  equipment: Equipment;
  appearance: Appearance;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: 'draft' | 'complete';
  currentStep: number;
}

interface User {
  id: string;
  email: string;
  characters: Character[];
  settings: UserSettings;
}

interface CharacterProgress {
  characterId: string;
  currentStep: number;
  stepData: Record<number, any>;
  validation: Record<number, boolean>;
}
```

## Build and Deployment Requirements

### Netlify Configuration
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Environment variable configuration
- Redirect rules for client-side routing

### Production Requirements
- Error monitoring
- Performance tracking
- Analytics integration
- Logging system
- Backup strategy

## Testing Requirements

### Test Coverage
- Component testing
- Hook testing
- Integration testing
- E2E workflow testing
- API mocking

## Documentation Requirements

### Technical Documentation
- API documentation
- Component documentation
- Type documentation
- Workflow documentation

### User Documentation
- User guides
- API references
- Integration guides
- Troubleshooting guides
``` 