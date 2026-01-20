# Tambola Caller - Number Generator for Housie/Tambola

## Overview

Tambola Caller is a cross-platform mobile application built with React Native and Expo designed for hosting Tambola (also known as Housie) games. It generates random numbers (1-100) with session memory to ensure each number appears only once per game, providing fairness and transparency. The app features a 100-box grid display, theatrical number presentation with smooth animations, and supports both manual and automatic number calling modes with adjustable speed.

The application follows a client-server architecture where the React Native client handles the UI and local session state, while an Express backend provides API capabilities. The app persists session data locally using AsyncStorage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses Expo's managed workflow with new architecture enabled
- React 19.1 with React Compiler experiments enabled
- Supports iOS, Android, and Web platforms

**Navigation**: React Navigation v7
- Stack-based navigation with 2 screens: Generator (home) and History
- Native stack navigator for smooth, platform-native transitions
- Transparent headers with blur effects on iOS

**State Management**:
- React Context for game session state (`GameSessionProvider`)
- TanStack React Query for server state management
- AsyncStorage for local session persistence

**Animation**: React Native Reanimated v4
- Spring-based animations for button interactions
- Fade-in animations for number reveals
- Staggered list animations in history view

**Styling Approach**:
- Custom theme system with light/dark mode support
- Centralized design tokens in `constants/theme.ts`
- StyleSheet-based component styling
- Safe area handling with react-native-safe-area-context

### Backend Architecture

**Framework**: Express.js v5
- TypeScript with tsx for development
- HTTP server with CORS configuration for Replit domains and localhost
- Static file serving for web builds

**API Structure**:
- Routes registered in `server/routes.ts`
- All API routes should be prefixed with `/api`
- Currently minimal backend - game logic runs client-side

**Database Schema** (Drizzle ORM):
- PostgreSQL configured but not actively used for core game logic
- Basic users table defined in `shared/schema.ts`
- Schema validation with Zod via drizzle-zod

### Key Design Patterns

**Path Aliasing**:
- `@/` maps to `./client/` for client code
- `@shared/` maps to `./shared/` for shared types/schemas

**Component Structure**:
- Themed components (`ThemedText`, `ThemedView`) for consistent styling
- Reusable UI components in `client/components/`
- Screen components in `client/screens/`
- Navigation configuration in `client/navigation/`

**Error Handling**:
- Error boundary component wrapping the app
- Development-mode error details modal
- Graceful fallback UI for production

## External Dependencies

### Core Services
- **PostgreSQL**: Database (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect
- **AsyncStorage**: Local storage for session persistence on mobile

### Third-Party Libraries
- **Expo SDK**: Platform abstraction, splash screen, haptics, blur effects, fonts
- **React Navigation**: Navigation framework with native stack and bottom tabs
- **TanStack React Query**: Server state management and caching
- **React Native Reanimated**: Animation library
- **React Native Gesture Handler**: Touch gesture handling

### Build & Development
- **tsx**: TypeScript execution for server development
- **esbuild**: Server bundling for production
- **Babel with module-resolver**: Path aliasing for imports
- **ESLint + Prettier**: Code quality and formatting

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REPLIT_DEV_DOMAIN`: Development domain for CORS and API URLs
- `REPLIT_DOMAINS`: Production domains for CORS
- `EXPO_PUBLIC_DOMAIN`: Public domain exposed to client for API calls

## App Store Publishing

### Google Play Store

**Prerequisites:**
1. Expo account at expo.dev
2. Google Play Developer account ($25 one-time fee)
3. EAS CLI installed: `npm install -g eas-cli`

**Configuration (already set up):**
- `app.json` contains Android package name: `com.tambolacaller.app`
- `app.json` contains versionCode: `1` (increment for each release)
- `eas.json` contains build profiles for development, preview, and production

**Build Commands:**
```bash
eas login                           # Login to Expo
eas build --platform android        # Build production AAB
eas build --platform android --profile preview  # Build APK for testing
```

**Publishing Process:**
1. Run `eas build --platform android` to create AAB file
2. Download the AAB from Expo dashboard
3. Upload to Google Play Console
4. Complete store listing (description, screenshots, graphics)
5. Submit for review

**Version Updates:**
- Increment `version` in app.json for display version (e.g., "1.0.1")
- Increment `android.versionCode` for each Play Store upload (e.g., 2, 3, 4...)

### iOS App Store

**Prerequisites:**
1. Apple Developer account ($99/year)
2. EAS CLI installed

**Configuration (already set up):**
- `ios.bundleIdentifier`: `com.tambolacaller.app`

**Build Command:**
```bash
eas build --platform ios
```