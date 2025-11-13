# Dark Mode Implementation

## Changes Made

### New Components Created

1. **components/ThemeProvider.tsx**
   - Custom React Context provider for theme management
   - Handles light/dark mode state
   - Persists theme preference in localStorage
   - Respects system preference on first load
   - Prevents flash of unstyled content (FOUC)

2. **components/ThemeToggle.tsx**
   - Toggle button component for switching themes
   - Shows moon icon for dark mode, sun icon for light mode
   - Accessible with proper ARIA labels

### Modified Files

1. **app/layout.tsx**
   - Added ThemeProvider wrapper around children
   - Added `suppressHydrationWarning` to html tag to prevent hydration warnings

2. **app/page.tsx**
   - Added ThemeToggle button in header
   - Updated all color classes to support dark mode variants
   - Background gradients now adapt to theme
   - Header, divider, and footer now respond to theme

3. **components/QRGenerator.tsx**
   - All backgrounds, borders, and text colors now have dark mode variants
   - Form inputs styled for both themes
   - Error messages styled for both themes
   - Buttons and interactive elements adapted

4. **components/ContactForm.tsx**
   - Form container, inputs, and labels styled for dark mode
   - Success/error messages with dark mode variants
   - Submit button adapted for theme changes
   - Character counters styled for both themes

5. **app/globals.css**
   - Updated CSS custom properties for dark mode
   - Added smooth transitions for theme changes
   - Configured Tailwind v4 theme system
   - Added .dark class for manual theme control

## Features

- ✅ Manual theme toggle (light/dark)
- ✅ Persistent theme preference (localStorage)
- ✅ System preference detection on first visit
- ✅ Smooth color transitions
- ✅ No flash of unstyled content
- ✅ Fully accessible toggle button
- ✅ All components themed consistently

## How It Works

1. On first load, the app checks localStorage for saved preference
2. If no preference exists, it checks system preference
3. User can toggle theme manually using the button in the header
4. Theme preference is saved to localStorage
5. All components use Tailwind's `dark:` variant for dark mode styles

## Usage

The theme toggle button is located in the top-right corner of the header. Click it to switch between light and dark modes. The preference will be remembered for future visits.
