# StocksOcean - Stock Analysis Dashboard

A modern stock analysis web application built with Next.js 14, TypeScript, TailwindCSS, and Supabase. Analyze multiple stocks at once with real-time data and AI-powered insights.

## Features

- ⚡ Next.js 14 with App Router
- 🔷 TypeScript for type safety
- 🎨 TailwindCSS for styling
- 🔐 Supabase authentication
- 📱 Fully responsive design
- 🌙 Dark mode support

## Project Structure

```
├── app/
│   ├── api/
│   │   └── placeholder/
│   │       └── route.ts          # Example API route
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx          # Sign in page
│   │   └── signup/
│   │       └── page.tsx          # Sign up page
│   ├── contributor/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Contributor dashboard
│   │   └── upload/
│   │       └── page.tsx          # Asset upload page
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx          # Admin dashboard
│   ├── asset/
│   │   └── [id]/
│   │       └── page.tsx          # Asset detail page
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── pricing/
│   │   └── page.tsx              # Pricing page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   └── supabaseClient.ts         # Supabase client configuration
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for authentication)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - The `.env.local` file has been automatically created with your Supabase credentials from the MCP server connection.
   - If you need to update it manually, ensure it contains:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://hwulgzdnltvudonxwffs.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UE5JKZPAebqK5kkp6YEqyQ_zYQIvIJC
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages Overview

- **Home** (`/`) - **StocksOcean** main dashboard - Stock analysis with AI insights
- **Stocks** (`/stocks`) - Alternative route to stock analysis dashboard
- **Sign In** (`/auth/signin`) - User authentication sign in
- **Sign Up** (`/auth/signup`) - User registration
- **Pricing** (`/pricing`) - Pricing plans display
- **About** (`/about`) - About page
- **Asset Detail** (`/asset/[id]`) - Dynamic asset detail page
- **Contributor Dashboard** (`/contributor/dashboard`) - Contributor management
- **Upload Asset** (`/contributor/upload`) - Asset upload form
- **Admin Dashboard** (`/admin/dashboard`) - Admin management panel

## API Routes

- **Placeholder API** (`/api/placeholder`) - Example API route with GET and POST methods
- **Stock Analysis** (`/api/stocks/analyze`) - Analyze multiple stock symbols with AI insights

## Database Schema

Your Supabase project includes the following tables:
- **profiles** - User profiles with contributor tiers and earnings
- **assets** - Asset marketplace items
- **images** - Image assets with metadata
- **tags** - Tagging system
- **image_tags** - Image-tag relationships
- **downloads** - Download tracking
- **orders** - Purchase orders
- **earnings** - Contributor earnings tracking

TypeScript types are automatically generated in `types/supabase.ts` and integrated with the Supabase client.

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Supabase](https://supabase.com/) - Backend and authentication
- [Supabase Auth UI](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui) - Pre-built auth components

## Customization

All pages are placeholder templates that you can customize according to your needs. The Supabase client is configured in `lib/supabaseClient.ts` and can be extended with additional Supabase features.

## License

This project is open source and available under the MIT License.

# stock-test
# StocksOcean-Production
