# Dynamic Saga Character Creation

A character creation system for a fantasy RPG, built with Next.js, Supabase, and TypeScript.

## Project Status

### Recent Updates (as of last session)
- Fixed morality scoring system and character response handling
- Implemented proper error handling and loading states
- Updated database schema for questions and responses
- Added automatic morality calculation after all questions are answered

### Current State
- Character creation flow is functional but needs testing
- Morality system calculates both good/evil and lawful/chaotic alignments
- Questions are stored in Supabase with proper weights for alignment calculation
- Response saving and score calculation are implemented

### Components Updated
1. `MoralityQuestionCard.tsx`
   - Fixed answer selection and submission
   - Added loading states
   - Improved error handling

2. `useMoralityResponses.tsx`
   - Fixed response saving logic
   - Added validation for required parameters
   - Implemented automatic morality calculation trigger

3. `useMoralityCalculation.tsx`
   - Updated score calculation logic
   - Added proper error handling
   - Improved database operations

### Database Schema
- `questions` table: Stores morality questions with weights
- `character_responses` table: Stores character answers
- `character_morality` table: Stores calculated alignment scores

### Next Steps
1. Test the complete character creation flow
2. Add validation for edge cases
3. Improve error messages and user feedback
4. Add proper loading states throughout the application
5. Implement character review/edit functionality

## Getting Started

### Prerequisites
- Node.js
- npm/yarn
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Notes

### Morality System
The system calculates two alignment scales:
- Good/Evil (-100 to 100)
- Lawful/Chaotic (-100 to 100)

Questions are weighted to contribute to either scale, and final alignment is determined by the combination of both scores.

### Character Creation Flow
1. Basic Information
2. Class Selection
3. Morality Questions (10 questions)
4. Alignment Calculation
5. Character Review

### Known Issues
- Need to handle edge cases in morality calculation
- Improve error handling for network issues
- Add proper validation for all user inputs
