# TrailTales - Travel Route Discovery App

## Overview
A modern React Native mobile app built with Expo that allows users to discover, create, and share travel routes. Users can browse countries and cities, view detailed routes with photos and reviews, create new routes with multiple stops, rate and review routes, and save favorites.

## Project Status
**Last Updated:** November 24, 2025

### Completed Features
1. **Authentication System** (Mock-only)
   - Login/Signup screens with AsyncStorage persistence
   - User profile management
   - Basic session handling

2. **Route Browsing**
   - Browse countries and cities
   - View routes by city
   - Route detail screen with photos, ratings, and reviews
   - Favorite routes functionality

3. **Route Creation**
   - Multi-step form (basic info, stops, details)
   - Photo upload (max 5 photos) using expo-image-picker
   - Category, difficulty, duration selection
   - Placeholder map UI for stop selection

4. **Rating & Review System**
   - Star rating (1-5)
   - Comment submission
   - Display of user reviews with avatars
   - Optimistic UI updates

5. **Data Persistence**
   - AsyncStorage for created routes
   - AsyncStorage for ratings/reviews
   - Merge with mock data on load

### Architecture

#### Tech Stack
- **Framework:** Expo SDK 54 / React Native
- **Navigation:** React Navigation 7
- **Storage:** AsyncStorage
- **Images:** expo-image-picker
- **UI:** Custom components with iOS 26 Liquid Glass design

#### Key Directories
- `/screens` - All screen components
- `/navigation` - Navigation configuration
- `/components` - Reusable UI components
- `/services` - Data services (storage, mockData)
- `/constants` - Theme, colors, spacing
- `/assets` - Images and fonts
- `/hooks` - Custom React hooks

#### Design System
- **Primary Color:** Forest Green (#2B7A4B)
- **Accent Color:** Orange (#FF6B35)
- **Style:** Minimalist card-based UI with iOS 26 liquid glass effects
- **Typography:** Custom ThemedText components
- **Spacing:** Consistent spacing system from constants/theme.ts

### Known Limitations & Future Work

#### Photo Upload (Task 2)
- Edge case: Users can potentially exceed 5-photo limit by repeatedly opening picker on platforms that default to single-select
- Future: Add button disabling once 5 photos are selected
- Future: Normalize single-selection results to strictly enforce limit

#### Reviews (Task 4)
- Reviews persist to AsyncStorage but don't reload after navigation away/back
- No unique IDs on reviews (could cause duplicate display issues)
- Future: Add UUID to each review
- Future: Reload route data after review submission
- Future: Enable review editing/deletion

#### Data Persistence (Task 5)
- Newly created routes may briefly show "Route not found" due to AsyncStorage async nature
- Rating data can potentially be double-counted if mock routes are mutated during merge
- Future: Ensure route is fully persisted before navigation
- Future: Clone mock data before rating merge
- Future: Add loading states for async operations

#### Map Integration (Task 3 - Not Started)
- Currently placeholder UI only
- Future: Integrate react-native-maps
- Future: Add polylines for route paths
- Future: Add numbered markers for stops
- Future: Enable interactive stop selection

#### Features Not Yet Implemented
- Route filtering by category/duration/difficulty (Task 6)
- Nearby routes using GPS (Task 7)
- Offline mode with route caching (Task 8)
- Social features: following, sharing (Task 9)
- Turn-by-turn navigation (Task 10)

### User Preferences
- Minimalist, nature-focused design
- Forest green and orange color scheme
- iOS-first mobile experience
- No backend - pure frontend with AsyncStorage

### Development Notes
- Uses Expo Go for testing (scan QR code from Replit)
- Hot module reloading enabled
- All dependencies are Expo Go compatible
- Never modify package.json directly - use packager_tool
- Bundle identifier set: com.trailTales.app (do not change)

### Testing
- Manual testing via Expo Go on physical devices
- Web preview available but may differ from native
- Recommended test viewport: 402x874 (mobile)

### Recent Changes (Nov 24, 2025)
- Fixed AddReviewModal hook usage issues
- Fixed expo-image-picker mediaTypes configuration
- Fixed Feather icon fill prop errors
- Implemented optimistic UI updates for reviews
- Fixed rating double-counting bug in data merge
- Enhanced photo picker with duplicate prevention
- Updated data accessors to properly merge AsyncStorage and mock data
