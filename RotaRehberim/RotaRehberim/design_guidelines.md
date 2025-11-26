# Travel Route Discovery App - Design Guidelines

## Architecture

### Authentication
**Required:** User accounts for route creation, ratings, favorites.

**Implementation:**
- Primary: Apple/Google Sign-In; fallback: email/password
- Mock with local state in prototype
- Login/Signup with privacy/terms links
- Profile includes: avatar (4 travel-themed options), display name, email (read-only), preferences (notifications, units, map style), logout (with confirmation), delete account (Settings > Account > Delete, double confirmation)

### Navigation
**Tab Bar** (4 tabs + FAB):
1. **Explore** - Countries/cities/routes
2. **Favorites** - Saved routes
3. **Profile** - Account & created routes
4. **Settings** - App preferences

**FAB:** Center-bottom "Create Route"

**Stacks:** Explore: Country → City Routes → Detail | Favorites: List → Detail | Profile: Profile → My Routes → Detail | Create: Modal

---

## Screen Specifications

### 1. Country/City Selection
- **Header:** Transparent, "Explore Destinations", filter icon, integrated search bar
- **Content:** ScrollView, top inset: `headerHeight + Spacing.xl`, bottom: `tabBarHeight + Spacing.xl`
- **Components:** Search ("Search countries or cities"), country cards (flag, name, city count), expandable city lists (thumbnail, name, route count)
- **Interaction:** Real-time search, smooth expand/collapse, tap city → City Routes

### 2. City Routes
- **Header:** City name, sort/filter icon, transparent
- **Content:** FlatList with pull-to-refresh, same insets as above
- **Components:** Hero section (image, name, country), recommended routes (horizontal scroll, top 3), all routes (thumbnail, title, description 2-line ellipsis, rating stars + count, duration badge, transport icon, creator avatar 24px)
- **Interaction:** Tap card → Route Detail

### 3. Route Detail
- **Header:** Transparent over map, back/share/favorite icons, gradient overlay
- **Content:** ScrollView, no top inset, bottom: `tabBarHeight + Spacing.xl`
- **Components:**
  - Map (300px): polyline route, numbered markers, zoom-to-fit
  - Info card (rounded top over map): title, creator (avatar, name, date), rating (stars + avg + count), badges (duration, distance, transport), description
  - Stops list: numbered, name, description, thumbnail, tap highlights on map
  - Photo gallery: horizontal scroll, 3:2 cards
  - Reviews: summary bar chart, individual reviews, "Write Review" button
- **Floating:** "Start Navigation" button, full-width, rounded, primary, shadow `{width: 0, height: 2}, opacity: 0.10, radius: 2`, inset: `tabBarHeight + Spacing.xl`

### 4. Create Route (Modal)
- **Header:** Cancel (confirm if edited), "Create Route", Next (enabled when valid)
- **Content:** Multi-step form, top: `Spacing.xl`, bottom: `insets.bottom + Spacing.xl`
- **Steps:**
  1. **Basic:** Title, description, city selector, category
  2. **Stops:** Map (400px), tap-to-add, reorderable list (numbered chip, name, description, delete)
  3. **Details:** Duration picker, transport selector, photo upload (max 5, thumbnails + remove)
- **Validation:** Min: title, 2 stops, duration, 1 photo. Inline errors.
- **Buttons:** "Save Draft" (secondary), "Publish Route" (primary)

### 5. Profile
- **Header:** Transparent, "Profile", settings icon
- **Content:** ScrollView, standard insets
- **Components:** Profile card (80px avatar, editable name, member date, stats: routes/ratings/favorites), "My Routes" (horizontal scroll, "See All" if >3), quick actions (Favorites, Settings, Help, Log Out)

### 6. Favorites
- **Header:** "Favorites", Edit (batch delete)
- **Content:** FlatList, standard insets
- **Components:** Route cards (same as City Routes), empty state (illustration + "No favorites yet"), swipe-left to remove

---

## Design System

### Colors
- **Primary:** #2B7A4B (Forest Green), Light: #4CAF50, Dark: #1B5E33
- **Accent:** #FF6B35 (Orange), Light: #FF8555
- **Neutrals:** Background: #F8F9FA, Surface: #FFFFFF, Border: #E0E0E0, Text: #1A1A1A/#666666/#999999
- **Semantic:** Success: #4CAF50, Warning: #FFC107, Error: #F44336, Info: #2196F3

### Typography
- **Family:** System (San Francisco/Roboto)
- **Scale:** Hero: 32/Bold, H1: 24/Bold, H2: 20/Semibold, H3: 18/Semibold, Body: 16/Regular, Small: 14/Regular, Caption: 12/Regular, Button: 16/Semibold
- **Line Height:** 1.5x body, 1.2x headings

### Spacing
xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, 2xl: 32px, 3xl: 48px

### Components

**Cards:** 12px radius, white bg, 1px border, lg padding, no shadow, active: scale 0.98 + opacity

**Buttons:**
- Primary: Filled primary, white text, 8px radius, 48px height
- Secondary: Outlined primary, primary text, 8px radius, 48px height
- Text: Primary color, no border
- Press: opacity 0.7

**FAB:** 56px diameter, accent bg, white plus icon, 16px above tab bar, shadow: `{0, 2}, 0.10, 2`

**Inputs:** 1px border, 8px radius, md padding, focus: primary border, 48px height (single), auto (multi)

**Tab Bar:** White bg, 1px top border, Feather icons 24px, active: primary, inactive: text tertiary, caption labels

### Icons (Feather)
- **Sizes:** 24px tabs, 20px buttons, 16px inline
- **Color:** Inherit/text secondary
- **Key:** map, heart, user, settings, plus-circle, map-pin, star, share-2, search, filter, trending-up, truck, camera

### Visual Assets
**Required:**
1. **Avatars (4):** Backpacker/mountain, city explorer/skyline, beach wanderer/coast, cultural traveler/landmark (flat, circular, vibrant)
2. **Empty States:** No favorites (bookmark), no routes (dotted path), no results (magnifying glass + X)
3. **Transport Icons:** Walking figure, car, mixed

**Don't Generate:** Flags (use emoji), map tiles (Expo MapView), generic icons (Feather)

### Accessibility
- Touch target: min 44x44px
- Contrast: 4.5:1 normal, 3:1 large
- Accessible labels on all interactive elements
- VoiceOver/TalkBack support
- Clear form labels/errors
- Map text alternatives for screen readers