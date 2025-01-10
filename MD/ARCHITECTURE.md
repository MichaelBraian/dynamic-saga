# Architecture Documentation

## System Overview
Dynamic Saga is a modern web application built with React, TypeScript, and a serverless architecture. It features an 18-step character creation workflow powered by AI through OpenAI's APIs for character generation and visualization, with Supabase handling real-time data persistence.

## Core Architecture

### Frontend Architecture
```
UI Layer (React + TypeScript)
↓
State Management (Zustand + React Query)
↓
Service Layer (API Clients + Type-Safe Utilities)
↓
Data Layer (Supabase Client + OpenAI Integration)
```

### Backend Architecture
```
Netlify Functions (Serverless)
↓
OpenAI API (GPT-4 + DALL-E 3)
↓
Supabase (PostgreSQL + Real-time)
↓
File Storage (Supabase Storage)
```

## Workflow Architecture

### Character Creation Pipeline
```
User Input → Validation → State Update → AI Generation → Storage → Real-time Update
```

### 18-Step Workflow Implementation
1. **Name Selection**
   - Input validation
   - Uniqueness check
   - Real-time persistence

2. **Gender Selection**
   - Pronouns handling
   - State management
   - Preference storage

3. **Race Selection**
   - Race attributes
   - Special abilities
   - Racial bonuses

4. **Animal Type**
   - Conditional rendering
   - Type-specific abilities
   - Visual customization

5. **Class Selection**
   - Class abilities
   - Starting equipment
   - Skill bonuses

6. **Attributes**
   - Point allocation
   - Class modifiers
   - Validation rules

7. **Morality**
   - Alignment system
   - Behavior tracking
   - Story impact

8. **Faith Selection**
   - Deity system
   - Faith abilities
   - Religious rules

9. **Faith Points**
   - Point allocation
   - Divine abilities
   - Faith mechanics

10. **Specialties**
    - Class-specific options
    - Skill synergies
    - Ability unlocks

11. **Background**
    - Story generation
    - History creation
    - Trait selection

12. **Appearance**
    - Physical traits
    - Visual details
    - Customization options

13. **Clothing**
    - Outfit selection
    - Style customization
    - Equipment visuals

14. **Equipment**
    - Item management
    - Inventory system
    - Equipment effects

15. **Description**
    - AI generation
    - Story integration
    - Character details

16. **Character Card**
    - Data compilation
    - Visual layout
    - Export options

17. **Complete**
    - Data validation
    - Final checks
    - State completion

18. **Generated**
    - Image generation
    - Final processing
    - Character finalization

## State Management Architecture

### Global State (Zustand)
```
Store
├── Character State
│   ├── Creation Progress
│   ├── Form Data
│   └── Validation State
├── Auth State
│   ├── User Session
│   └── Permissions
└── UI State
    ├── Loading States
    └── Error States
```

### Local State (React)
- Form state (React Hook Form)
- Component state (useState)
- Effect management (useEffect)
- Custom hooks (workflow-specific)

## Data Architecture

### Database Schema
```
Characters
├── Basic Info
├── Attributes
├── Equipment
├── Faith
├── Background
└── Generated Content

Users
├── Profile
├── Settings
└── Characters

CharacterProgress
├── Current Step
├── Saved Data
└── Validation State
```

### Real-time Updates
- Supabase subscriptions
- Optimistic updates
- Conflict resolution
- State synchronization

## Security Architecture

### Authentication Flow
```
User → Auth UI → Supabase Auth → JWT → Protected Routes
```

### Data Protection
- Row Level Security (RLS)
- Input validation
- Type checking
- Content filtering
- Rate limiting

### API Security
- Environment isolation
- Key rotation
- Request validation
- Error handling
- CORS policies

## Performance Architecture

### Optimization Strategies
```
Code Splitting
├── Route-based
├── Component-based
└── Library-based

Caching Strategy
├── API responses
├── Generated content
└── Static assets

Loading Strategy
├── Lazy loading
├── Suspense
└── Fallbacks
```

### Performance Monitoring
- Web Vitals tracking
- Error monitoring
- Performance metrics
- User analytics

## Testing Architecture

### Test Pyramid
```
E2E Tests (Cypress)
↓
Integration Tests (React Testing Library)
↓
Unit Tests (Jest + Vitest)
```

### Test Coverage
- Component testing
- Hook testing
- Service testing
- Integration testing
- E2E workflows

## Deployment Architecture

### CI/CD Pipeline
```
GitHub Actions
↓
Testing & Validation
↓
Build & Optimization
↓
Netlify Deployment
```

### Environment Management
- Development
- Staging
- Production
- Feature branches

## Scaling Strategy

### Horizontal Scaling
- Serverless functions
- Database scaling
- Storage optimization
- Cache distribution

### Rate Limiting
- API requests
- Image generation
- Database queries
- Real-time connections

## Monitoring and Observability

### Metrics Collection
```
Performance Metrics
├── Load times
├── API latency
├── Error rates
└── User engagement

System Health
├── Service status
├── Database health
├── API availability
└── Storage usage
```

### Logging Strategy
- Error tracking
- User actions
- System events
- Performance data

## Documentation Architecture

### Technical Documentation
- API documentation
- Component documentation
- Type documentation
- Architecture guides

### User Documentation
- User guides
- API references
- Integration guides
- Troubleshooting

## Future Considerations

### Planned Improvements
- Enhanced AI integration
- Advanced customization
- Mobile optimization
- Offline support
- Social features

### Scalability Plans
- Multi-region support
- Enhanced caching
- Performance optimization
- Advanced analytics