# Divyakala LMS - Design System

This is the current design source of truth for the Divyakala LMS user-side prototype. It replaces the earlier serif-heavy editorial direction with the compact Poppins-based LMS direction chosen during iteration.

## 1. Brand Direction

The interface should feel warm, devotional, calm, and polished, but not oversized. The current target is closer to the provided LMS screenshot: compact sidebar, clean course cards, restrained spacing, and readable Poppins typography.

The product should still honor Drdha's art, but the chrome should not feel like a museum poster. It should feel like a refined learning product.

Keywords:

- Compact
- Warm
- Refined
- Minimal
- Focused
- Not generic SaaS
- Not oversized

## 2. Color System

```css
--color-bg:            #F5ECD2;
--color-surface:       #FFFFFF;
--color-surface-warm:  #FBF6E9;

--color-ink:           #2A1F18;
--color-ink-muted:     #6B5D4A;
--color-ink-soft:      #9A8B72;

--color-chrome:        #2A1F18;
--color-chrome-text:   #F5ECD2;
--color-chrome-muted:  #9A8B72;

--color-primary:       #C9952A;
--color-primary-hover: #B07F1F;
--color-primary-soft:  #F4DFA0;

--color-accent:        #D87E5D;
--color-accent-soft:   #F4D6C5;

--color-border:        #E5D7B3;
--color-border-soft:   #EDE3CA;

--color-success:       #5C8A4F;
--color-error:         #B5482D;
```

Usage:

- Cream background is dominant.
- Dark brown chrome is mainly for the app sidebar.
- Ochre is for active states, CTAs, prices, selected tabs, and key actions.
- Terracotta is rare and mainly for warning/new/awaiting states.
- Use warm borders instead of heavy shadows.

## 3. Typography

Use Poppins everywhere.

```css
--font-display: "Poppins", sans-serif;
--font-body:    "Poppins", sans-serif;
```

Import:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
```

Current root scale:

```css
:root {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}

@media (max-width: 768px) {
  :root {
    font-size: 12.5px;
  }
}
```

Rules:

- Do not use Cormorant Garamond or Crimson Pro anymore.
- Do not use giant display headings.
- Keep headings readable but compact.
- Use uppercase tracked labels sparingly for section labels.

## 4. Layout Density

The UI should be compact.

Guidelines:

- App shell sidebar: about `216px` wide.
- Collapsed app shell sidebar: about `64px`.
- Main content max width: about `980px`.
- Top bars: around `56px` in the main shell.
- Cards: smaller padding (`p-3` to `p-5`) unless a hero card needs more room.
- Buttons: compact pills, usually `px-4 py-2`.
- Course cards: compact, not huge.
- Lesson player: avoid excessive whitespace and redundant bars.

## 5. Radius and Shadows

Use radius deliberately:

- Buttons: `rounded-full`
- Standard cards: `rounded-xl` or `rounded-2xl`
- Inputs: `rounded-lg`
- Lesson-player panels: mostly `rounded-lg` or `rounded-2xl` for contained top bars/sidebar shells
- Modals: `rounded-[20px]`

Shadows:

```js
sm: "0 1px 2px rgba(42, 31, 24, 0.06)"
md: "0 4px 12px rgba(42, 31, 24, 0.08)"
lg: "0 12px 32px rgba(42, 31, 24, 0.10)"
xl: "0 24px 64px rgba(42, 31, 24, 0.14)"
```

Most elements should use borders, not heavy shadows.

## 6. Component Patterns

### Buttons

- Primary: ochre background, white text, compact pill.
- Secondary: cream background, ochre border/text.
- Ghost: transparent text action, used sparingly.
- Icon buttons: small circular controls.

### Inputs

- Label above input.
- No floating labels.
- White background, warm border, ochre focus.

### Sidebar

Main app sidebar:

- Dark brown chrome.
- Compact navigation rows.
- Active row uses ochre state.
- Logo at top.
- User profile at bottom.

Lesson course-session sidebar:

- Separate from main app sidebar.
- Warm rounded panel.
- Left-arrow close button.
- Smooth open/close animation.
- Session rows are clickable cards.
- Locked sessions still click, but show locked lesson state.

### Course Cards

- Image is the visual anchor.
- Compact title/meta/action area.
- Browse course cards open course detail.
- My Learning course cards continue into lesson player.

### Lesson Player

The lesson player has a custom layout.

- One rounded top learning bar spans the lesson area.
- Main tabs: Overview, Assignment, Resources.
- Course sessions sidebar sits below the top bar and feels included.
- Overview includes video, companion panel, and brief description.
- Companion panel tabs: Notes, Reference, Canvas.
- Companion panel should align to video height.
- Assignment is a centered panel.
- Resources is a centered list.
- No Discussion tab.

## 7. Imagery

Use actual Drdha artwork where available. Current prototype uses local files in:

```text
public/art/
```

Do not use stock photos.

If video is missing, show a clear placeholder:

```text
Insert a video file here
/public/videos/<file-name>.mp4
```

## 8. Motion

Keep motion restrained.

- Hover transitions: 200ms ease-out.
- Sidebar open/close: 300ms ease-in-out.
- No bouncy/spring animations.
- No parallax.
- No flashy route transitions.

## 9. Tailwind Config

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5ECD2",
        surface: "#FFFFFF",
        "surface-warm": "#FBF6E9",
        ink: {
          DEFAULT: "#2A1F18",
          muted: "#6B5D4A",
          soft: "#9A8B72",
        },
        chrome: {
          DEFAULT: "#2A1F18",
          text: "#F5ECD2",
          muted: "#9A8B72",
        },
        primary: {
          DEFAULT: "#C9952A",
          hover: "#B07F1F",
          soft: "#F4DFA0",
        },
        accent: {
          DEFAULT: "#D87E5D",
          soft: "#F4D6C5",
        },
        border: {
          DEFAULT: "#E5D7B3",
          soft: "#EDE3CA",
        },
        success: "#5C8A4F",
        error: "#B5482D",
      },
      fontFamily: {
        display: ['"Poppins"', "sans-serif"],
        body: ['"Poppins"', "sans-serif"],
        sans: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(42, 31, 24, 0.06)",
        md: "0 4px 12px rgba(42, 31, 24, 0.08)",
        lg: "0 12px 32px rgba(42, 31, 24, 0.10)",
        xl: "0 24px 64px rgba(42, 31, 24, 0.14)",
      },
      borderRadius: {
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
```

## 10. Current Anti-Patterns

Avoid:

- Serif typography.
- Huge display headings.
- Giant cards and whitespace.
- Duplicate bars in the lesson player.
- Extra sidebars in Assignment or Resources tabs.
- Stock photos.
- Purple/blue/neon accents.
- Generic LMS empty states.
- Heavy shadows everywhere.

