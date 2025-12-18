# Agentorix Tech- Website

A modern, responsive website for Agentorix Tech built with Next.js 16, featuring comprehensive service pages, animated components, and a beautiful UI.

## 🚀 Overview

Agentorix Tech is a multi-disciplinary technology & marketing company helping global brands build digital efficiency, accelerate revenue, and automate operations. This website showcases our services, portfolio, team, and company culture.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with animated components
- **Dynamic Service Pages**: Individual pages for each service with detailed information
- **Animated Sections**: Auto-scrolling testimonials, flip cards, and particle animations
- **SEO Optimized**: Meta tags and structured data for better search visibility
- **Performance**: Optimized images, lazy loading, and efficient rendering
- **Accessibility**: WCAG compliant components and semantic HTML

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives
- **Images**: Next.js Image Optimization with Unsplash integration

## 📁 Project Structure

```
Agentorix-tech/
├── app/
│   ├── (mainRoutes)/          # Main website routes
│   │   ├── page.tsx           # Home page
│   │   ├── about/
│   │   │   └── page.tsx       # About Us page
│   │   ├── services/
│   │   │   ├── page.tsx       # Services listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Dynamic service detail pages
│   │   └── layout.tsx         # Main layout with navbar & footer
│   ├── (adminRoutes)/         # Admin routes (future)
│   ├── globals.css            # Global styles & theme
│   └── layout.tsx             # Root layout
├── components/
│   ├── navigations/
│   │   └── footer.tsx         # Footer component
│   ├── sections/              # Page sections
│   │   ├── hero-section.tsx
│   │   ├── services-snapshot.tsx
│   │   ├── why-choose.tsx
│   │   ├── industries-serve.tsx
│   │   ├── portfolio-highlight.tsx
│   │   ├── testimonials.tsx
│   │   ├── cta-banner.tsx
│   │   ├── about-hero.tsx
│   │   ├── company-intro.tsx
│   │   ├── our-story.tsx
│   │   ├── leadership-team.tsx
│   │   ├── our-process.tsx
│   │   ├── achievements.tsx
│   │   ├── company-culture.tsx
│   │   ├── services-hero.tsx
│   │   ├── all-services.tsx
│   │   └── additional-services.tsx
│   ├── services/
│   │   └── service-detail-page.tsx  # Service detail page component
│   └── ui/
│       ├── button.tsx
│       └── floating-navbar.tsx
├── lib/
│   ├── services-data.ts        # Service data (JSON structure)
│   └── utils.ts               # Utility functions
└── public/
    ├── logo.png
    └── icon.png
```

## 🎨 Pages & Routes

### Main Pages

- **Home** (`/`) - Hero section, services snapshot, why choose us, industries, portfolio, testimonials
- **About Us** (`/about`) - Company introduction, story, leadership team, process, achievements, culture
- **Services** (`/services`) - All services overview with links to individual pages

### Dynamic Service Pages

All service pages are accessible via `/services/[slug]`:

**Main Services:**

- `/services/it-services`
- `/services/digital-marketing`
- `/services/lead-generation`
- `/services/ai-sales-agent`
- `/services/ai-chatbot`
- `/services/web-app-development`
- `/services/cloud-solutions`
- `/services/cybersecurity`
- `/services/custom-software`

**Additional Services:**

- `/services/creatives`
- `/services/content-writing`
- `/services/business-plans-strategy`
- `/services/administrative-assistance`
- `/services/website-designing`
- `/services/seo`
- `/services/custom-development`
- `/services/crm-assistance`
- `/services/staff-augmentation`
- `/services/white-label`

## 🎯 Key Components

### Animated Components

- **Hero Sections**: Particle animations, grid patterns, gradient orbs
- **Testimonials**: Auto-scrolling carousel with hover pause
- **Industries Serve**: 3D flip cards on hover
- **Company Culture**: Flip cards with event information
- **Additional Services**: Auto-scrolling horizontal carousel

### Interactive Features

- **Floating Navbar**: Auto-hide/show on scroll
- **Hover Effects**: Image reveals, scale transforms, gradient overlays
- **Smooth Animations**: CSS transitions and Framer Motion animations

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd agentorix-tech
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📝 Service Data Structure

Service data is stored in `lib/services-data.ts` as JSON objects. Each service includes:

- `slug`: URL-friendly identifier
- `title`: Service name
- `shortDescription`: Brief description
- `overview`: Detailed overview
- `sections`: Array of service sections with content and items
- `features`: Key features array
- `benefits`: Benefits list
- `useCases`: Use cases array
- `caseStudies`: Case study objects
- `pricing`: Pricing information
- `cta`: Call-to-action button
- `image`: Service image URL
- `icon`: Icon name

**Note**: Currently using static JSON data. Ready to be replaced with backend API calls.

## 🎨 Theme & Styling

- **Primary Color**: Teal/Cyan (`oklch(0.65 0.15 200)`)
- **Theme**: Light theme only (dark theme removed)
- **Animations**: Custom keyframe animations for grid, float, pulse, rotate
- **Gradients**: Extensive use of gradient backgrounds and text

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Responsive typography

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# OpenRouter API (for AI Chatbot)
OPENROUTER_API_KEY="your-openrouter-api-key"
# OR use OpenAI API key directly
OPENAI_API_KEY="your-openai-api-key"

# NextAuth (for admin dashboard)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Site URL (optional, for OpenRouter referrer)
NEXT_PUBLIC_SITE_URL="https://agentorix	.com"
```

**Note**: The chatbot uses OpenRouter API (OpenAI-compatible). You can use either `OPENROUTER_API_KEY` or `OPENAI_API_KEY`. OpenRouter is recommended as it provides access to multiple AI models.

### Next.js Config

- Image optimization with Unsplash domain whitelist
- TypeScript configuration
- ESLint setup

### Tailwind Config

- Custom theme variables
- Animation utilities
- Custom color palette

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📄 License

This project is private and proprietary to Agentorix Tech.

## 👥 Contact

- **Phone**: +92 333 1916991
- **Email**: agentorixtech@gmail.com
- **Address**: I-8 Markaz, I-8, Islamabad, Pakistan

## 🔄 Future Enhancements

- [X] Backend API integration for service data
- [X] Admin dashboard for content management
- [X] Blog section
- [X] Contact form with email automation
- [X] AI chatbot integration
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Performance monitoring

## 📚 Documentation

For more information about the project structure and components, refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

Built with ❤️ by Uzair Ullah
