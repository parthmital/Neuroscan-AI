# NeuroScan AI Frontend

## Overview

The NeuroScan AI Frontend is a modern React application built with Vite, TypeScript, and Tailwind CSS, providing a user-friendly interface for the NeuroScan AI platform. It allows users to upload MRI scans, view analysis results, manage scans, and access reports.

## Features

- **User Authentication**: Login and registration with JWT-based authentication.
- **Dashboard**: Overview of user scans and recent activity.
- **Scan Upload**: Upload multiple MRI modalities for processing.
- **Scan Library**: Browse and manage all processed scans.
- **Scan Detail View**: Detailed view of individual scans with 3D visualization, segmentation masks, and AI results.
- **Reports**: Analytics and reports on scan data.
- **Settings**: User profile management and application settings.
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.

## Architecture

The frontend is built with:

- **React 18**: Component-based UI library.
- **Vite**: Fast build tool and development server.
- **TypeScript**: Type-safe JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: High-quality UI components built on Radix UI.
- **React Router**: Client-side routing.
- **TanStack Query**: Data fetching and state management.
- **Recharts**: Data visualization.

## Folder Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
    - `auth/` - Authentication components (AuthContext)
    - `dashboard/` - Dashboard-specific components
    - `layout/` - Layout components (AppLayout)
    - `scan/` - Scan-related components
    - `ui/` - shadcn/ui components
    - `upload/` - Upload components
  - `pages/` - Page components (Index, Login, Register, etc.)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions and configurations
  - `App.tsx` - Main app component with routing
  - `main.tsx` - Entry point
  - `index.css` - Global styles
- `public/` - Static assets
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind configuration
- `tsconfig.*` - TypeScript configurations
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui configuration

## Key Dependencies

- React, React DOM
- React Router DOM for routing
- TanStack React Query for data fetching
- shadcn/ui components (Radix UI primitives)
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for charts
- Sonner for toasts

## Pages

- `/` - Dashboard/Index page
- `/login` - User login
- `/register` - User registration
- `/upload` - Upload MRI scans
- `/scan/:id` - Detailed scan view
- `/scans` - Scan library
- `/reports` - Reports and analytics
- `/settings` - User settings
