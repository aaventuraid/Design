# Yuki Yaki Corner

A Next.js application optimized for production deployment with Coolify.

## Production Deployment

This application is configured for deployment using Docker with Coolify:

1. The application uses a multi-stage Dockerfile optimized for production
2. Database migrations are handled automatically via Prisma
3. Environment variables are managed through Coolify

## Environment Variables

Configure these environment variables in your Coolify panel:

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`)
- `JWT_SECRET` - Secret key for JWT token signing (generate a secure random string)
- `NEXT_PUBLIC_APP_URL` - Public URL of your application (e.g., `https://yourdomain.com`)

### Optional Variables
- `NODE_ENV` - Set to `production` (usually auto-configured by Coolify)
- `PORT` - Port number (default: 3000, usually auto-configured by Coolify)
- `HOSTNAME` - Host binding (default: 0.0.0.0, usually auto-configured by Coolify)

### Coolify Configuration
1. In your Coolify panel, go to your application settings
2. Navigate to "Environment Variables" section
3. Add each variable with its corresponding value
4. Deploy your application

**Note**: Do not include `.env` files in production. All environment variables should be configured directly in Coolify panel for security and proper deployment management.

## Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate:prod` - Run database migrations
- `npm run db:seed` - Seed the database

## Tech Stack

- Next.js 15
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS