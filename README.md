# HRMS Lite - Frontend

Modern React frontend for the HRMS Lite application.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

For production, update `VITE_API_URL` to your deployed backend URL.

## Features

- Modern React with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Responsive design
- Form validation
- Error handling
- Loading states

## Deployment

### Vercel (Recommended)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Set environment variable `VITE_API_URL` in Vercel dashboard.

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable `VITE_API_URL`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
