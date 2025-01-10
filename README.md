# Dynamic Saga

A modern character creation system built with React, TypeScript, and AI integration. Create unique characters with AI-powered descriptions and visualizations, featuring an 18-step workflow for detailed character development.

## Quick Start

1. **Clone and Install:**
```bash
git clone https://github.com/MichaelBraian/dynamic-saga.git
cd dynamic-saga
npm install
```

2. **Configure Environment:**
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

3. **Development:**
```bash
npm run dev
```

4. **Production Build:**
```bash
npm run build
npm run preview
```

## Deployment

### Netlify Deployment

1. **Connect to Netlify:**
   - Fork this repository
   - Create a new site in Netlify
   - Connect to your forked repository

2. **Environment Variables:**
   Add the following environment variables in Netlify's dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
   - `VITE_API_URL`
   - `VITE_MAX_REQUESTS_PER_MINUTE`
   - `VITE_CHARACTER_NAME_MIN_LENGTH`
   - `VITE_CHARACTER_NAME_MAX_LENGTH`

3. **Build Settings:**
   The following settings are automatically configured in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Deploy:**
   - Push your changes to the main branch
   - Netlify will automatically deploy your site

## Development

### Available Scripts

```bash
# Development
npm run dev           # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checks
npm run format       # Format with Prettier
```

### Project Structure

```
src/
├── components/        # React components
├── features/         # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Core utilities
├── store/           # State management
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

MIT
