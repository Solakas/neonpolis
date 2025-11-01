# Character Card Design Update

## Overview
Updated the NeonPolis character cards to match the Figma design specification with full-bleed backgrounds, glass panels, and hex stat tiles.

## Components Created/Updated

### 1. `/components/CharacterCard.tsx` (NEW)
- **Full-bleed background**: Character hero image with dark gradient overlay
- **Rounded corners**: 24px on container, 16px on media panel
- **Glass identity bar**: Semi-transparent panel with cyan border
- **Hex stat tiles**: Energy (⚡) and Life (❤️) with diamond-shaped backgrounds
- **VP Badge**: Gold circular badge (shown in detail view, hidden in selection)
- **Selection indicator**: Checkmark badge for selected state
- **Two variants**:
  - `selection`: Compact view for character selection screen
  - `detail`: Full view with abilities panel (ready for arena/detail screens)

### 2. `/components/PlayerHUD.tsx` (NEW)
- Simplified HUD component for arena gameplay
- Uses the same hex tile design for Energy and Life
- Displays HP, Energy, and VP with visual stat tiles
- Active player highlighting with neon cyan glow
- Center occupation status badge

### 3. `/components/CharacterSelection.tsx` (UPDATED)
- Replaced old Card-based design with new CharacterCard component
- Maintains selection state and grid layout
- Uses `variant="selection"` for compact view

### 4. `/components/Arena.tsx` (UPDATED)
- Integrated PlayerHUD component for player status display
- Replaced old Card-based player panels with glass-styled HUDs
- Enhanced visual consistency with character cards

### 5. `/styles/globals.css` (UPDATED)
- Added Roboto and Cinzel font imports for hex tiles and VP badge
- All design tokens from spec already in place

## Design Features Implemented

✅ **Background**
- Full-bleed character image with readability overlay gradient
- `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.9) 100%)`

✅ **Corners & Shadows**
- Container: 24px radius with `0 12px 30px rgba(0,0,0,0.5)` shadow
- Media panel: 16px radius with `0 6px 18px rgba(0,0,0,0.35)` shadow

✅ **Identity Bar (Glass Panel)**
- Background: `rgba(20, 24, 32, 0.6)` with blur
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Cyan accent border overlay

✅ **Hex Stat Tiles**
- Diamond-shaped SVG backgrounds
- Energy: Cyan (#00B3C8)
- Life: Red (#D94A1E)
- Texture overlays and beveled edges from Figma import

✅ **VP Badge**
- Gold gradient (#F8D24B → #D9A500)
- 48px circle with shadow
- Cinzel Bold font for number
- Visible only in detail variant

✅ **Abilities Panel**
- Frosted glass effect with white gradients
- 16px radius with proper padding
- Only shown in detail variant

## Currency Update

✅ **Diamonds → Energy (⚡)**
- All references to "Diamond" replaced with "Energy"
- Energy icon (⚡) used in hex tiles
- Max Life cap of 10 enforced

## Variants

### Selection Variant
- Compact layout for grid display
- VP badge hidden
- Abilities panel hidden
- Name: 18px, Tagline: 12px
- Stat tiles: 36px

### Detail Variant
- Full layout with all elements
- VP badge visible
- Abilities panel visible
- Name: 22px, Tagline: 14px
- Stat tiles: 36px

## Imported Figma Assets

Used the following imports from `/imports/`:
- `CardTemplate.tsx`: Reference design structure
- `svg-7bt78jcxm7.ts`: SVG path data for hex tiles and badges
- `svg-u1yst.tsx`: Texture mask for tile overlays

## Visual States

1. **Default**: Standard appearance with gradient background
2. **Hover**: Subtle scale transform (1.02x)
3. **Selected**: Cyan ring glow, scale (1.05x), checkmark badge
4. **Active (HUD)**: Cyan border glow for current player

## Notes

- Placeholder background images used (gradient SVG data URIs)
- In production, unique character images would be provided via `figma:asset` imports
- All hex tile SVG paths preserved from Figma export for authentic styling
- Glass morphism effects use backdrop-filter for modern browsers
