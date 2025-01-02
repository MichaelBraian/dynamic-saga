# Dynamic Saga - Character Creation System

A modern, mobile-first web application for creating and managing role-playing game characters. Built with React, TypeScript, Vite, and Supabase.

## Project Overview

This application provides a step-by-step character creation system with the following features:

- Progressive character creation flow
- Mobile-first responsive design
- Real-time database integration with Supabase
- Modern UI components using shadcn/ui
- Tailwind CSS for styling
- Animated dice rolling system
- Interactive character customization

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript 5
- **Build Tool**: Vite 5
- **Database**: Supabase
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form
- **Type Safety**: Zod + TypeScript

## Project Structure

```
src/
├── components/
│   ├── character-creation/
│   │   ├── steps/                  # Individual creation steps
│   │   │   ├── attributes/         # Character attributes management
│   │   │   ├── specialty/          # Character specialty selection
│   │   │   └── faith-points/       # Faith Points system
│   │   ├── step-groups/            # Grouped step components
│   │   └── CharacterCreationBackground.tsx  # Background animations
│   ├── shared/                     # Shared components
│   │   └── InfoTooltip.tsx        # Enhanced mobile-friendly tooltips
│   └── ui/                         # shadcn/ui components
│       └── tooltip.tsx            # Base tooltip with portal support
├── hooks/                          # Custom React hooks
│   └── useMediaQuery.ts           # Responsive design hook
├── config/                         # Configuration files
├── lib/                           # Utility functions
├── types/                         # TypeScript definitions
└── integrations/
    └── supabase/                  # Supabase integration
```

## Key Features

### Character Creation Flow

1. **Basic Information**
   - Character name with validation
   - Gender selection with custom icons
   - Race selection with descriptions
   - Class selection with specialties

2. **Enhanced Attributes System**
   - Six core attributes with animated icons:
     - Strength (STR) - Swords icon
     - Dexterity (DEX) - Move icon
     - Constitution (CON) - Heart icon
     - Intelligence (INT) - Brain icon
     - Wisdom (WIS) - Eye icon
     - Charisma (CHA) - Users icon
   - Improved 2d6 dice rolling with physics animation
   - Real-time validation and error handling
   - Enhanced tooltips with detailed descriptions
   - Visual feedback with sound effects

3. **Advanced Specialty Selection**
   - Dynamic class-specific specialties
   - Real-time attribute modification preview
   - Interactive comparison view
   - Specialty-specific bonuses
   - Detailed specialty descriptions

4. **Faith Points System**
   - Enhanced d6 dice roll animation
   - Three-tier Faith Points system:
     - Roll 1-2: 1 Faith Point
     - Roll 3-4: 2 Faith Points
     - Roll 5-6: 3 Faith Points
   - Persistent results with visual effects
   - Faith point usage tracking

### Mobile-First Design

- Optimized touch interactions
- Responsive layouts with breakpoint optimization
- Enhanced mobile tooltips with:
  - Single-tap interaction
  - Proper positioning relative to trigger
  - Overlay system to prevent unwanted interactions
  - Portal-based rendering for better stacking
- Gesture-based navigation
- Adaptive UI elements

### Database Schema

Updated Supabase schema with new tables:

- `characters`: Core character information
- `character_attributes`: Attribute values
- `character_specialties`: Specialty selections
- `character_faith_points`: Faith point tracking
- `character_equipment`: Equipment loadout
- `character_progress`: Creation progress tracking

## Component Details

### Enhanced Mobile Tooltips
- Single-tap interaction model
- Portal-based rendering
- Collision detection and boundary handling
- Safe zone implementation
- Proper z-index management
- Touch event optimization
- Responsive positioning
- Overlay system for interaction control

### Attribute System
- Enhanced attribute components with:
  - Animated icons
  - Interactive tooltips
  - Real-time validation
  - Sound effects
  - Progress tracking

### Faith Points System
- Improved animation system
- Enhanced visual feedback
- Progress persistence
- Usage tracking
- Effect visualization

### Background System
- Dynamic particle effects
- Theme-based animations
- Performance optimization
- Mobile-friendly rendering

## State Management

- Context-based state management
- Custom hooks for specific features:
  - `useMediaQuery` for responsive design
  - Enhanced tooltip state management
- Real-time synchronization
- Progress persistence
- Error handling

## Development Practices

- TypeScript strict mode
- Component composition
- Custom hook abstractions
- Mobile-first development
- Real-time updates
- Error boundary implementation
- Performance optimization
- Portal-based UI elements for better stacking
- Safe zone implementation for UI elements

## Known Issues and Solutions

1. **Mobile Performance**: Optimized animations for mobile devices
2. **State Persistence**: Enhanced local storage handling
3. **Loading States**: Improved loading indicators
4. **Error Handling**: Comprehensive error boundaries
5. **Form Validation**: Enhanced validation with Zod
6. **Mobile Tooltips**: Implemented portal-based solution with proper positioning
7. **Touch Interactions**: Enhanced overlay system to prevent unwanted selections
8. **Specialty Selection**: Implemented transaction-based specialty application
9. **Attribute Updates**: Enhanced real-time attribute modification system
10. **Status Progression**: Improved character status tracking and updates

## Recent Updates

1. **Specialty System Enhancement**
   - Added `handle_specialty_selection` database function for managing specialty selection
   - Implemented attribute modification preview system
   - Real-time attribute updates based on specialty choices
   - Automatic status progression to faith points after selection
   - Transaction-based specialty application for data consistency

2. **Database Schema Updates**
   - Enhanced `character_attributes` table structure
   - Added `character_specialties` table for tracking specialty selections
   - Implemented attribute modifiers system using JSONB
   - Added database functions for specialty management
   - Updated character status tracking

3. **Character Creation Flow Improvements**
   - Streamlined progression through creation steps
   - Enhanced attribute modification preview
   - Added specialty selection validation
   - Improved error handling and user feedback
   - Real-time status updates

4. **Technical Improvements**
   - Added database function for handling specialty selection
   - Implemented transaction-based updates
   - Enhanced error handling and validation
   - Improved state management for character creation
   - Added real-time attribute updates

## Database Functions

### handle_specialty_selection
```sql
Function: handle_specialty_selection(p_character_id UUID, p_specialty_id UUID, p_attribute_modifiers JSONB)
Purpose: Manages the specialty selection process including:
- Updates character status to 'faith_points'
- Applies attribute modifiers to character attributes
- Records specialty selection in character_specialties table
```

This README will be updated as the project evolves.
