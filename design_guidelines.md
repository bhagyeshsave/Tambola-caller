# Random Number Generator - Design Guidelines

## Brand Identity

**Purpose**: A game utility that generates truly random numbers (1-100) with session memory to ensure fairness and transparency.

**Aesthetic Direction**: **Bold/striking with playful energy** - Think modern lottery machine meets digital precision. Large, confidence-inspiring typography. High contrast. Smooth, satisfying animations that make number generation feel like an event, not just a button press.

**Memorable Element**: The generated number dominates the screen with theatrical presentation - animated reveal, massive size, impossible to miss. This isn't a calculator; it's a moment of anticipation.

## Navigation Architecture

**Type**: Stack Navigation (2 screens)

**Screens**:
1. **Generator** (Home) - Primary screen for generating numbers
2. **History** - List of all generated numbers in current session

## Screen-by-Screen Specifications

### 1. Generator Screen
**Purpose**: Generate random numbers and display current result

**Layout**:
- Header: Transparent, no title
  - Right button: "History" text button (navigates to History screen)
- Content (non-scrollable):
  - Center: Massive number display (current/last generated number)
  - Below: "Generate" action button
  - Bottom: Subtle session info ("23 of 100 generated")
- Safe area insets: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl

**Components**:
- Number display: 120pt bold font, centered, animated fade-in on each generation
- Generate button: Large pill-shaped button, full-width with horizontal margins
- Session counter: Small text, medium opacity
- First-time empty state: Show "0" or "—" with helper text "Tap to generate your first number"

### 2. History Screen
**Purpose**: Review all numbers generated in current session

**Layout**:
- Header: Default with title "History"
  - Left button: Back arrow
  - Right button: "Clear" text button (clears session with confirmation alert)
- Content (scrollable list):
  - List of generated numbers, newest first
  - Each item shows: number (large) + order badge (e.g., "#1", "#2")
- Safe area insets: top: Spacing.xl, bottom: insets.bottom + Spacing.xl

**Components**:
- Number cards: Horizontal layout, number on left (bold), order badge on right
- Empty state: Centered illustration (empty-history.png) + "No numbers generated yet"
- Clear confirmation alert: "Clear this session? This will reset all generated numbers."

## Color Palette

- **Primary**: #312E81 (Deep Indigo) - Used for number display, key UI elements
- **Accent**: #84CC16 (Electric Lime) - Generate button, success states
- **Background**: #FAFAFA (Off-White) - Main background
- **Surface**: #FFFFFF (White) - Cards, modals
- **Text Primary**: #1F2937 (Charcoal)
- **Text Secondary**: #6B7280 (Gray)
- **Border**: #E5E7EB (Light Gray)
- **Error**: #EF4444 (Red) - For session complete state

## Typography

**Font**: System default (SF Pro for iOS)

**Type Scale**:
- Display (Number): 120pt, Bold
- Title: 24pt, Bold
- Headline: 18pt, Semibold
- Body: 16pt, Regular
- Caption: 14pt, Regular
- Small: 12pt, Regular

## Visual Design

- Generate button has subtle drop shadow:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Number display uses scale animation on generation (1.0 → 1.1 → 1.0)
- History items have subtle separators (border-bottom)
- All buttons show pressed state (slight opacity reduction)

## Assets to Generate

1. **icon.png**
   - Description: Bold "RNG" letters or stylized dice with "100" face, indigo and lime colors
   - WHERE USED: App icon on device home screen

2. **splash-icon.png**
   - Description: Same as app icon, simplified for splash screen
   - WHERE USED: App launch screen

3. **empty-history.png**
   - Description: Simple illustration of a blank notepad/clipboard, soft gray tones
   - WHERE USED: History screen empty state