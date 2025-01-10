# Dynamic Saga

A modern character creation system built with React, TypeScript, and AI integration. Create unique characters with AI-powered descriptions and visualizations, featuring an 18-step workflow for detailed character development.

## Features

- Comprehensive 18-step character creation workflow
- AI-powered character descriptions using GPT-4
- Character visualization with DALL-E 3
- Real-time data persistence with Supabase
- Type-safe codebase with strict TypeScript configuration
- Responsive design with Tailwind CSS and Radix UI
- Faith and morality system
- Equipment and inventory management
- Character card generation
- Background story creation
- Appearance customization
- Real-time collaboration support
- Comprehensive test coverage
- Automated documentation
- CI/CD pipeline

## Tech Stack

### Frontend
- React 18 with TypeScript 5
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for accessible components
- React Hot Toast for notifications
- React Query for data fetching
- Zustand for state management
- React Hook Form for form handling

### Backend
- Supabase for database and authentication
- Netlify Functions for serverless operations
- OpenAI API (GPT-4 + DALL-E 3)
- Real-time subscriptions
- Rate limiting and caching

### Testing
- Jest for unit testing
- React Testing Library
- Vitest for component testing
- Cypress for E2E testing
- MSW for API mocking

### Documentation
- TypeDoc for API documentation
- Markdown documentation
- Swagger for API specs
- Storybook for component documentation

## Prerequisites

- Node.js >= 18.20.5
- npm >= 10.8.2
- Supabase account
- OpenAI API key
- Netlify account

## Quick Start

1. **Clone and Install:**
```bash
git clone https://github.com/yourusername/dynamic-saga.git
cd dynamic-saga
npm install
```

2. **Configure Environment:**
Create `.env` file with required variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_MAX_REQUESTS_PER_MINUTE=3
VITE_CHARACTER_NAME_MIN_LENGTH=2
VITE_CHARACTER_NAME_MAX_LENGTH=50
```

3. **Start Development:**
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Netlify Functions
netlify dev
```

4. **Open Application:**
Visit `http://localhost:5173` in your browser

## Development Guide

### Available Scripts

```bash
# Development
npm run dev           # Start Vite dev server
npm run netlify:dev   # Start Netlify Functions

# Testing
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Generate coverage
npm run test:e2e     # Run Cypress tests

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checks
npm run format       # Format with Prettier

# Documentation
npm run docs         # Generate TypeDoc
npm run docs:serve   # Serve documentation
npm run storybook    # Run Storybook
```

## Project Structure

```
src/
├── components/        # React components
│   ├── character/    # Character-related components
│   ├── ui/          # Shared UI components
│   └── steps/       # Workflow step components
├── hooks/            # Custom React hooks
├── lib/              # Core utilities
├── pages/            # Route components
├── services/         # API services
├── store/           # State management
├── types/            # TypeScript definitions
└── utils/            # Utility functions

docs/                # Generated documentation
MD/                  # Project documentation
netlify/functions/   # Serverless functions
```

## Documentation

Comprehensive documentation is available:
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed codebase organization
- [Architecture](ARCHITECTURE.md) - System design and patterns
- [Character Creation Workflow](CHARACTER_CREATION_WORKFLOW.md) - 18-step process
- [Next Steps](NEXT_STEPS.md) - Roadmap and future features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Update documentation
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Create a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write unit tests for new features
- Update documentation
- Follow the existing code style
- Add proper JSDoc comments
- Include Storybook stories for components

## Testing Strategy

- Unit tests for components and utilities
- Integration tests for workflows
- E2E tests for critical paths
- API mocking with MSW
- Real-time testing
- Performance testing
- Accessibility testing

## Security Measures

- Environment variable protection
- API key rotation system
- Rate limiting implementation
- Content validation and sanitization
- Error handling and logging
- Security headers configuration
- CORS policy enforcement
- Input validation
- XSS protection
- CSRF protection

## Performance Optimization

- Code splitting and lazy loading
- Image optimization with next/image
- Response caching strategy
- Bundle size optimization
- Tree shaking
- Error boundaries
- Performance monitoring
- Memory leak prevention
- Network optimization
- Asset preloading

## License

MIT
