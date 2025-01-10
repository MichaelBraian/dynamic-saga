# Character Creation Workflow

## Table of Contents
- [Overview](#overview)
- [Steps](#steps)
  - [1. Naming](#1-naming)
  - [2. Gender](#2-gender)
  - [3. Race](#3-race)
  - [4. Animal Type](#4-animal-type)
  - [5. Class](#5-class)
  - [6. Attributes](#6-attributes)
  - [7. Morality](#7-morality)
  - [8. Faith](#8-faith)
  - [9. Faith Points](#9-faith-points)
  - [10. Specialties](#10-specialties)
  - [11. Background](#11-background)
  - [12. Appearance](#12-appearance)
  - [13. Clothing](#13-clothing)
  - [14. Equipment](#14-equipment)
  - [15. Description](#15-description)
  - [16. Character Card](#16-character-card)
  - [17. Complete](#17-complete)
  - [18. Generated](#18-generated)
- [Component Organization](#component-organization)
  - [Step Components](#step-components)
  - [Shared Components](#shared-components)
  - [UI Components](#ui-components)
- [State Management](#state-management)
  - [Character State](#character-state)
  - [Step Navigation](#step-navigation)
- [Data Flow](#data-flow)
- [Error Handling](#error-handling)
- [Performance](#performance)

## Overview
The character creation process is implemented as a step-by-step workflow using React components and AI-powered assistance. The workflow integrates with OpenAI for character descriptions and image generation (GPT-4 and DALL-E 3), and Supabase for data persistence.

## Steps

1. **Naming** (`NamingStep`)
   - User enters character name
   - Validates name availability (2-50 characters)
   - Updates character status in Supabase
   - Initial character record creation

2. **Gender** (`GenderStep`)
   - Presents gender options
   - Handles selection and validation
   - Updates character gender in Supabase
   - Stores pronouns preferences

3. **Race** (`RaceStep`)
   - Displays available fantasy races
   - Provides race descriptions and abilities
   - Updates character race in Supabase
   - Influences available choices in later steps

4. **Animal Type** (`AnimalTypeStep`)
   - Available for specific race selections
   - Choose animal characteristics
   - Determines special abilities
   - Updates animal type in Supabase

5. **Class** (`ClassStep`)
   - Shows character class options
   - Includes class descriptions and abilities
   - Updates character class in Supabase
   - Available classes: Warrior, Mage, Rogue, Cleric, Ranger, Paladin, Druid, Bard, Monk, Warlock

6. **Attributes** (`AttributesStep`)
   - Assign core attribute points
   - Strength, Dexterity, Constitution
   - Intelligence, Wisdom, Charisma
   - Class-specific attribute bonuses

7. **Morality** (`MoralityStep`)
   - Presents alignment options
   - Good/Evil scale selection
   - Lawful/Chaotic scale selection
   - Updates character morality in Supabase

8. **Faith** (`FaithStep`)
   - Choose deity or belief system
   - Select religious alignment
   - Define spiritual beliefs
   - Updates faith in Supabase

9. **Faith Points** (`FaithPointsStep`)
   - Allocate faith-based resources
   - Choose divine abilities
   - Set devotion level
   - Updates faith points in Supabase

10. **Specialties** (`SpecialtyStep`)
    - Choose character specializations
    - Based on class and race choices
    - Select special abilities
    - Updates specialties in Supabase

11. **Background** (`BackgroundStep`)
    - Define character history
    - Choose background type
    - Set personality traits
    - Updates background in Supabase

12. **Appearance** (`AppearanceStep`)
    - Define physical characteristics
    - Choose height and build
    - Select distinguishing features
    - Updates appearance in Supabase

13. **Clothing** (`ClothingStep`)
    - Select character attire
    - Choose outfit style
    - Add accessories
    - Updates clothing in Supabase

14. **Equipment** (`EquipmentStep`)
    - Select starting gear
    - Choose weapons and armor
    - Add adventuring equipment
    - Updates equipment in Supabase

15. **Description** (`DescriptionStep`)
    - AI-generated character description using GPT-4
    - Personality profile generation
    - Background story creation
    - Updates description in Supabase

16. **Character Card** (`CharacterCardStep`)
    - Final character summary
    - Display all selections
    - Preview character sheet
    - Option to edit previous choices

17. **Complete** (`CompleteStep`)
    - Finalize character creation
    - Save all character data
    - Generate character sheet
    - Mark creation as complete

18. **Generated** (`GeneratedStep`)
    - Generate character portrait using DALL-E 3
    - Save final artwork
    - Complete character profile
    - Update final status

## Component Organization

### Step Components
All step components are located in `src/components/character-creation/steps/` and follow these conventions:
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

### Character State
- Creation progress tracking
- Form data persistence
- Validation state
- Real-time updates

### Step Navigation
- Forward progression
- Backward navigation
- Step validation
- Progress persistence

## Data Flow
1. User input → Step component
2. Validation → State update
3. API calls → Data persistence
4. Real-time sync → UI update

## Error Handling
- Input validation
- API error handling
- State recovery
- User feedback
- Automatic retries

## Performance
- Lazy loading
- State caching
- Image optimization
- Error boundaries
- Loading states 