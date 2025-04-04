# Alpha - Scrach for solana

This is a robust [Next.js](https://nextjs.org/) project featuring authentication, Prisma ORM, and elegant UI components for building scalable web applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm, yarn, or pnpm package manager
- Git

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alpha-www
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   - Copy the `.env.example` file to create your local `.env`:
     ```bash
     cp .env.example .env
     ```
   - Configure the following environment variables in your `.env` file:
     - Authentication providers:
       - `GITHUB_ID` and `GITHUB_SECRET`: Create these in [GitHub OAuth Apps](https://github.com/settings/developers)
       - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Generate from [Google Cloud Console](https://console.cloud.google.com/)
     - NextAuth configuration:
       - `NEXTAUTH_SECRET`: Generate a secure random string (e.g., `openssl rand -base64 32`)
       - `NEXTAUTH_URL`: Set to `http://localhost:3000` for local development
     - Database connection:
       - `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://username:password@localhost:5432/database_name`)
       - `DIRECT_URL`: Direct database connection for migrations (same format as DATABASE_URL)

4. **Database Setup**

   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio to manage your database

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/types` - TypeScript type definitions
- `/hooks` - Custom React hooks

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [React Query](https://tanstack.com/query/latest) - Data synchronization for React

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Comprehensive Prisma guides
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction) - Authentication guides
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Explore Tailwind's utility classes

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Environment Variables

To run this project, you will need to set up the following environment variables in a `.env` file:

- `GITHUB_ID`: Your GitHub client ID from OAuth Apps
- `GITHUB_SECRET`: Your GitHub client secret
- `GOOGLE_CLIENT_ID`: Your Google client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Your Google client secret
- `NEXTAUTH_SECRET`: A secure random string for session encryption and security
- `NEXTAUTH_URL`: The URL where your NextAuth.js instance is running (e.g., `http://localhost:3000`)
- `DATABASE_URL`: The URL for your database connection. This should be a PostgreSQL connection string (e.g., `postgresql://username:password@localhost:5432/database_name`)
- `DIRECT_URL`: Direct connection to the database, used for migrations. This is particularly important when using connection pooling services like PgBouncer.

Make sure to replace the placeholder values with your actual credentials and URLs.


//https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/3DPingPong.sb3