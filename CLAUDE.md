# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Healthcare B2B bidding platform built with Next.js 15, Supabase, and Chakra UI. The platform connects healthcare providers (buyers/type A users) with vendors (suppliers/type B users) through a transparent bidding system.

## Key Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Setup (one-time)
# Execute supabase/schema.sql in Supabase SQL Editor
```

## Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or production URL
```

## Architecture

### User Types
- **Type A (Buyers)**: Healthcare institutions that create project requests
- **Type B (Suppliers)**: Vendors that submit bids on projects

### Core Data Flow
1. **Authentication Flow**: Supabase Auth → Profile creation with user_type → Role-based dashboard routing
2. **Bidding Flow**: Project creation (A) → Bid submission (B) → Comparison/Selection (A) → Email notifications
3. **Data Access**: All database queries use Row Level Security (RLS) policies defined in Supabase

### Key Architectural Decisions

**Supabase Integration**:
- `lib/supabase/client.ts`: Browser client for client components
- `lib/supabase/server.ts`: Server client for server components/API routes
- `middleware.ts`: Session management and auth refresh
- Database schema enforces business rules through RLS policies

**State Management**:
- No global state management library - relies on React hooks and Supabase real-time subscriptions
- Form state managed with react-hook-form + zod validation

**Routing Structure**:
- `/auth/*`: Public authentication pages
- `/dashboard/buyer/*`: Type A user pages (project management, bid comparison)
- `/dashboard/supplier/*`: Type B user pages (project browsing, bid submission)
- Protected routes enforced via middleware and dashboard layouts

**Component Architecture**:
- `DashboardLayout`: Handles user type detection and navigation
- Auth components check user type and route accordingly
- All dashboard pages verify user type matches their access level

### Database Schema

Core relationships:
- `profiles` extends Supabase auth.users with business data
- `projects` belongs to Type A users only
- `bids` connects Type B users to projects (unique constraint on project_id + bidder_id)
- All tables have RLS policies enforcing user type restrictions

### Email System

Resend integration at `/api/email/route.ts`:
- Triggered on: new project, new bid, bid acceptance/rejection
- Templates defined in `lib/email/resend.ts`
- Requires manual API call from components (not automated via database triggers)

### Excel Export

Uses `xlsx` library for bid comparison exports in buyer project detail page. Generates on-demand client-side.