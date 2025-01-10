# Dynamic Saga

A modern web application for creating and managing character stories using AI-powered generation.

## Features

- 18-step character creation workflow
- AI-powered character description generation
- AI-powered character visualization
- Real-time progress saving
- Modern and accessible UI
- Dark mode support

## Tech Stack

- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for accessible components
- Supabase for database and authentication
- OpenAI API for AI features
- Zustand for state management
- React Query for data fetching
- React Hook Form for form handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/dynamic-saga.git
cd dynamic-saga
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy the environment variables file and fill in your values:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

- \`VITE_SUPABASE_URL\`: Your Supabase project URL
- \`VITE_SUPABASE_ANON_KEY\`: Your Supabase anonymous key
- \`VITE_OPENAI_API_KEY\`: Your OpenAI API key
- \`VITE_APP_NAME\`: Application name
- \`VITE_API_URL\`: API URL
- \`VITE_MAX_REQUESTS_PER_MINUTE\`: Rate limiting setting

## Development

### Available Scripts

- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm run preview\`: Preview production build
- \`npm run lint\`: Run ESLint
- \`npm run format\`: Format code with Prettier
- \`npm run type-check\`: Run TypeScript type checking

### Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components
├── hooks/          # Custom React hooks
├── lib/           # Third-party library configurations
├── pages/         # Page components
├── services/      # API and external service integrations
├── store/         # Global state management
├── styles/        # Global styles and Tailwind configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
\`\`\`

## Deployment

The application is configured for deployment on Netlify. Push to the main branch will trigger automatic deployment.

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Deploy to Netlify:
\`\`\`bash
netlify deploy --prod
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
