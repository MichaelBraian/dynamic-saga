# Project Structure

## Table of Contents
- [Directory Layout](#directory-layout)
- [Component Organization](#component-organization)
  - [Character Creation Steps](#character-creation-steps)
  - [Shared Components](#shared-components)
  - [UI Components](#ui-components)
- [State Management](#state-management)
  - [Character Creation State](#character-creation-state)
  - [Authentication State](#authentication-state)
  - [UI State](#ui-state)
- [Type System](#type-system)
  - [Base Types](#base-types)
  - [Enums](#enums)
  - [Interfaces](#interfaces)
- [Testing Strategy](#testing-strategy)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [E2E Tests](#e2e-tests)
- [Naming Conventions](#naming-conventions)
  - [Files and Directories](#files-and-directories)
  - [TypeScript](#typescript)
  - [React Components](#react-components)
- [Import Order](#import-order)
- [Component Organization](#component-organization-1)

## Directory Layout

```
src/
├── components/          # React components
│   ├── character-creation/  # Character creation components
│   │   ├── steps/     # Step components
│   │   │   ├── NamingStep.tsx
│   │   │   ├── GenderStep.tsx
│   │   │   ├── RaceStep.tsx
│   │   │   ├── AnimalTypeStep.tsx
│   │   │   ├── ClassStep.tsx
│   │   │   ├── AttributesStep.tsx
│   │   │   ├── MoralityStep.tsx
│   │   │   ├── FaithStep.tsx
│   │   │   ├── FaithPointsStep.tsx
│   │   │   ├── SpecialtyStep.tsx
│   │   │   ├── BackgroundStep.tsx
│   │   │   ├── AppearanceStep.tsx
│   │   │   ├── ClothingStep.tsx
│   │   │   ├── EquipmentStep.tsx
│   │   │   ├── DescriptionStep.tsx
│   │   │   ├── CharacterCardStep.tsx
│   │   │   ├── CompleteStep.tsx
│   │   │   └── GeneratedStep.tsx
│   │   ├── shared/    # Shared components
│   │   │   ├── SelectionStep.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   └── ValidationMessage.tsx
│   │   └── providers/ # Context providers
│   ├── ui/            # UI components
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── card/
│   │   └── toast/
│   └── providers/     # Global providers
├── hooks/             # Custom React hooks
│   ├── character-creation/ # Character creation hooks
│   │   ├── useCharacterCreation.ts
│   │   ├── useStepValidation.ts
│   │   └── useStepNavigation.ts
│   ├── ai/           # AI-related hooks
│   └── auth/         # Authentication hooks
├── lib/              # Core utilities
│   ├── api/          # API clients
│   ├── database/     # Database utilities
│   ├── ai/           # AI service integrations
│   └── validation/   # Input validation
├── pages/            # Route components
│   ├── character-creation/
│   ├── auth/
│   └── dashboard/
├── services/         # Business logic
│   ├── character-creation.service.ts
│   ├── ai.service.ts
│   ├── auth.service.ts
│   └── storage.service.ts
├── store/           # State management
│   ├── character/
│   ├── auth/
│   └── ui/
├── types/           # TypeScript types
│   ├── character-creation.types.ts
│   ├── ai.types.ts
│   ├── auth.types.ts
│   └── common.types.ts
└── utils/           # Utility functions
    ├── validation.ts
    ├── formatting.ts
    └── test-utils.ts

config/             # Configuration files
├── jest/           # Test configuration
├── vite/          # Build configuration
└── storybook/     # Storybook configuration

docs/              # Generated documentation
├── api/           # API documentation
└── storybook/     # Component documentation

MD/                # Project documentation
├── ARCHITECTURE.md
├── CHARACTER_CREATION_WORKFLOW.md
├── NEXT_STEPS.md
├── PROJECT_STRUCTURE.md
└── README.md
```

## Component Organization

### Character Creation Steps
All step components follow these conventions:
- Located in `src/components/character-creation/steps/`
- PascalCase naming (e.g., `NamingStep.tsx`)
- Props interface with `Props` suffix
- Consistent prop pattern: `characterId`, `onComplete`, `onBack`

### Shared Components
Located in `src/components/character-creation/shared/`:
- `SelectionStep` - Base component for selection-based steps
- `ProgressBar` - Step progress indicator
- `StepNavigation` - Navigation controls
- `ValidationMessage` - Input validation display

### UI Components
Located in `src/components/ui/`:
- `Button` - Action buttons
- `Input` - Form inputs
- `Select` - Dropdown selection
- `Card` - Container component
- `Toast` - Notifications

## State Management

### Character Creation State
- Creation progress tracking
- Form data persistence
- Validation state
- Real-time updates

### Authentication State
- User session management
- Permissions handling
- Token management

### UI State
- Loading states
- Error states
- Modal states
- Toast notifications

## Type System

### Base Types
- `Character` - Character data
- `User` - User data
- `AIResponse` - AI generation response
- `ValidationError` - Error types

### Enums
- `CharacterCreationStep` - Workflow steps
- `CharacterClass` - Available classes
- `Race` - Available races
- `Gender` - Gender options
- `AlignmentType` - Moral alignments
- `FaithType` - Faith options

### Interfaces
- `ICharacterCreationService` - Character creation service
- `IAIService` - AI service
- `IAuthService` - Authentication service
- `IStorageService` - Storage service

## Testing Strategy

### Unit Tests
- Component tests
- Hook tests
- Service tests
- Utility tests

### Integration Tests
- Workflow tests
- API integration
- State management
- Form submission

### E2E Tests
- User flows
- Character creation
- Authentication
- Error handling

## Naming Conventions

### Files and Directories
- Components: PascalCase (e.g., `Button.tsx`)
- Services: camelCase with `.service.ts` suffix
- Types: camelCase with `.types.ts` suffix
- Tests: camelCase with `.test.ts` suffix
- Documentation: UPPERCASE with `.md` suffix

### TypeScript
- Interfaces: PascalCase with 'I' prefix
- Types: PascalCase
- Enums: PascalCase
- Services: PascalCase with 'Service' suffix

### React Components
- Components: PascalCase
- Props: PascalCase with 'Props' suffix
- Hooks: camelCase with 'use' prefix
- Tests: PascalCase with 'Test' suffix

## Import Order
1. React and external libraries
2. Types and interfaces
3. Components and hooks
4. Services and utilities
5. Assets and styles
6. Test utilities (in test files)

## Component Organization
- Props interface
- Component declaration
- Hooks and state
- Helper functions
- JSX structure
- Styles
- Export statement
``` 