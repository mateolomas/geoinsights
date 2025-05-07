# GeoInsights Frontend

This is the frontend application for GeoInsights, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Modern React with TypeScript
- Fast development with Vite
- Beautiful UI with Tailwind CSS
- Responsive design
- Component-based architecture
- Type-safe API integration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── layouts/        # Layout components
  ├── pages/         # Page components
  ├── services/      # API and other services
  ├── utils/         # Utility functions
  ├── hooks/         # Custom React hooks
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main App component
  └── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Headless UI
- Heroicons
