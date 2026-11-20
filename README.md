# DigiFox Library

**DigiFox Library** is a premium personal photo and video management web application designed to store, organize, browse, filter, and manage digital media files in one centralized library.

Engineered with a modern, minimal, and technology-focused brand personality, DigiFox Library provides a cinematic media browsing experience with instant Dark and Light mode switching.

---

## Brand Identity

- **Name:** DigiFox Library
- **Emblem:** Geometric, sleek, stylized fox emblem mark
- **Typography:** Modern grotesque with refined tracking (`Plus Jakarta Sans`)
- **Philosophy:** Media-first presentation — photos and video frames remain pristine and untouched by theme filters, with balanced spacing and subtle 1px architectural borders.

---

## Design System & Theme Architecture

DigiFox Library uses a centralized theme token architecture via CSS custom properties. No UI components are duplicated across themes.

### Theme Tokens & Colors

| Token Name | Dark Mode | Light Mode | Description |
|---|---|---|---|
| `--bg-main` | `#111214` | `#F6F7F9` | Main application backdrop |
| `--bg-sidebar` | `#18191C` | `#FFFFFF` | Navigation sidebar background |
| `--bg-card` / `--bg-surface` | `#202124` | `#FFFFFF` | Media cards, modals, and panel surfaces |
| `--bg-surface-elevated` | `#282A2E` | `#F9FAFB` | Elevated popovers, toolbars, and action bars |
| `--text-primary` | `#F5F5F5` | `#191A1C` | Primary typography |
| `--text-secondary` | `#9699A1` | `#737781` | Secondary metadata and labels |
| `--border-color` | `#2A2C31` | `#E5E7EB` | Subtle 1px borders |
| `--accent` | `#8B9EFF` | `#526DFF` | Primary brand accent and interactive states |
| `--hover-bg` | `#27282D` | `#F3F4F6` | Subtle hover state background |
| `--selected-bg` | `rgba(139, 158, 255, 0.16)` | `rgba(82, 109, 255, 0.10)` | Selected item highlight |
| `--color-success` | `#34D399` | `#10B981` | Success alerts and sync status |
| `--color-warning` | `#FBBF24` | `#F59E0B` | Storage warning indicators |
| `--color-error` | `#F87171` | `#EF4444` | Deletion and error states |

### Theme Features

- **Instant Switching:** Header Moon/Sun button toggles instantly with zero page reload.
- **Subtle Transitions:** 150–200ms cubic-bezier transition for background, border, and text colors.
- **Persistence:** Selected theme mode saved in `localStorage` (`digifox_theme_preference`).
- **OS Sync:** System Default option in Settings automatically adheres to `prefers-color-scheme`.
- **Live Theme Preview:** Settings → Appearance features interactive mock previews and active color swatch tokens.

---

## Core Capabilities

1. **Cinematic Gallery:**
   - Multi-density controls: Compact, Comfortable, and Expanded Cinematic view.
   - Date-based chronologic groupings ("Today", "November 2026", "October 2026").
   - Multi-selection action bar (Batch favorite, export, delete).
   - Media badges: 4K duration pills, RAW master indicators, resolution indicators.

2. **Full-Resolution Media Viewer (Lightbox):**
   - High-fidelity zoom, 90° rotation, keyboard shortcuts (`Arrows`, `Esc`, `I`).
   - Collapsible EXIF Inspector: Camera, lens, ISO, shutter speed, aperture, focal length, color space, bit depth, and geolocation.

3. **Collections & Albums:**
   - Dedicated filtering for Photos, 4K Videos, RAW files, and Starred Favorites.
   - Custom user album creation with metadata and count tracking.

4. **Upload & Ingest:**
   - Drag-and-drop zone with progress simulation and auto EXIF parsing.
   - Destination album routing.

5. **Security & Authentication:**
   - Vault lock screen with DigiFox master security and biometrics prompt.

---

## Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build & type-check
npm run build
```
