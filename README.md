# Financial Literacy Calculator

A comprehensive financial literacy web application built with Next.js that provides various calculators and educational tools to help users make informed financial decisions.

## Features

### Calculators
- **Budget Breakdown Calculator** - Analyze and categorize your expenses
- **Budget Template Generator** - Create personalized budget plans
- **Emergency Fund Calculator** - Determine optimal emergency savings
- **Unit Price Calculator** - Compare product prices for better shopping decisions

### Educational Components
- **Budget Rules** - Learn about different budgeting methodologies
- **Savings Strategies** - Understand various saving approaches
- **Unit Pricing Guide** - Make cost-effective purchasing decisions

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── calculators/    # Financial calculators
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── ui/             # Reusable UI components
└── lib/                # Utility functions
```

## Contributing

1. Follow the existing code style and conventions
2. Run linting before submitting changes
3. Test all calculators for accuracy
4. Ensure responsive design works across devices

## License

This project is private and not licensed for public use.
