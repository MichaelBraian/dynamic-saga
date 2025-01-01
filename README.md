# Dynamic Saga - Character Creation System

A modern, mobile-first web application for creating and managing role-playing game characters. Built with React, TypeScript, Vite, and Supabase.

## Project Overview

This application provides a step-by-step character creation system with the following features:

- Progressive character creation flow
- Mobile-first responsive design
- Real-time database integration with Supabase
- Modern UI components using shadcn/ui
- Tailwind CSS for styling

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Database**: Supabase
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── character-creation/
│   │   └── steps/
│   │       ├── attributes/         # Character attributes management
│   │       │   ├── AttributeItem.tsx   # Individual attribute component
│   │       │   └── AttributesList.tsx  # Attributes list container
│   │       ├── specialty/          # Character specialty selection
│   │       └── faith-points/       # Faith Points system
│   ├── shared/                     # Shared components (InfoTooltip, etc.)
│   └── ui/                         # shadcn/ui components
├── hooks/                          # Custom React hooks
├── integrations/
│   └── supabase/                   # Supabase integration and types
└── types/                          # TypeScript type definitions
```

## Key Features

### Character Creation Flow

1. **Basic Information**
   - Character name
   - Gender selection
   - Race selection
   - Class selection

2. **Attributes System**
   - Six core attributes with codes and icons:
     - Strength (STR) - Swords icon
     - Dexterity (DEX) - Move icon
     - Constitution (CON) - Heart icon
     - Intelligence (INT) - Brain icon
     - Wisdom (WIS) - Eye icon
     - Charisma (CHA) - Users icon
   - Animated 2d6 dice rolling system (2-12 range)
   - Real-time validation
   - Tooltips with attribute descriptions
   - Visual feedback during rolls

3. **Specialty Selection**
   - Class-specific specialties
   - Interactive attribute modification preview
   - Real-time attribute updates with visual feedback
   - Color-coded attribute changes
   - Side-by-side comparison of original and modified attributes

4. **Faith Points System**
   - Single d6 dice roll with animation
   - Three tiers of Faith Points:
     - Roll 1-2: 1 Faith Point
     - Roll 3-4: 2 Faith Points
     - Roll 5-6: 3 Faith Points
   - Persistent roll results (cannot be rerolled)
   - Visual feedback and animations
   - Detailed tooltip explanation

### Mobile-First Design

- Touch-optimized interface
- Responsive layouts
- Mobile-friendly tooltips and information displays
- Adaptive button sizes and spacing

### Database Schema

The application uses Supabase with the following main tables:

- `characters`: Core character information
- `character_attributes`: Character attribute values (using three-letter codes: STR, DEX, etc.)
- `character_specialties`: Character specialty selections

## Component Details

### Attribute System
The attribute system features:
- Individual attribute components with:
  - Three-letter codes (STR, DEX, etc.)
  - Thematic icons
  - Descriptive tooltips
  - Animated dice rolls
  - Visual feedback
- Centralized layout
- Persistent attribute values
- 2d6 dice system (2-12 range)

### Faith Points System
The Faith Points system includes:
- Animated d6 dice roll
- Three-tier point allocation
- One-time roll limitation
- Persistent results
- Detailed tooltip explanation
- Visual feedback and animations

### InfoTooltip Component
A mobile-friendly tooltip component used throughout the application:
- Touch-optimized for mobile devices
- Consistent styling across all instances
- Accessible design with proper ARIA labels
- Responsive sizing for different screen sizes

## State Management

The application uses React hooks for state management, with key hooks including:

- `useAttributesManagement`: Manages attribute rolling and saving
- Custom hooks for character creation flow
- Supabase real-time subscription hooks

## Styling Approach

The project uses a consistent styling approach with:

- Tailwind CSS for utility-first styling
- Mobile-first responsive design
- Custom components extending shadcn/ui
- Consistent color scheme and typography
- Visual feedback for user interactions

## Database Constraints

The Supabase database includes several constraints:

- Character attributes use three-letter codes (STR, DEX, CON, etc.)
- Required fields for character creation
- Foreign key relationships between tables
- Attribute value constraints (2-12 for base rolls)
- Unique constraints on character specialties and attributes

## Development Practices

- TypeScript for type safety
- Component-based architecture
- Reusable UI components
- Mobile-first development approach
- Real-time database updates

## Known Issues and Solutions

1. **Attribute Saving**: The character_attributes table uses three-letter codes (STR, DEX, etc.)
2. **Mobile Tooltip Behavior**: Tooltips are optimized for touch interactions with larger hit areas
3. **Real-time Updates**: State management handles Supabase real-time subscription updates
4. **Faith Points Persistence**: Faith Points can only be rolled once and are locked after initial roll

This README will be updated as the project evolves.
