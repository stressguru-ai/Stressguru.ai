# Standard Hero Section Policy

To ensure consistency across all pages (Home, How It Works, Plans, About Us, Contact Us, Gurus), the following rules must be strictly applied to all hero sections.

## 1. Layout Structure
- **Container:** `relative h-screen min-h-[800px] flex items-center overflow-hidden`
- **Background Image:** `absolute inset-0 z-0` with `object-cover object-center`
- **Overlay:** `absolute inset-0 bg-black/20` (adjust opacity if needed for readability, but keep consistent)
- **Content Wrapper:** `container mx-auto px-6 relative z-10 pt-20` (The `pt-20` is critical for clearing the fixed header)
- **Text Container:** `max-w-3xl` (Limits width to prevent reading fatigue and ensures left alignment)

## 2. Typography (Desktop)
- **Headline (H1):** `text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg`
- **Subheadline (P):** `text-xl md:text-3xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md`
- **Alignment:** STRICTLY `text-left` (No `text-center` on desktop)

## 3. Typography (Mobile)
- **Headline:** `text-5xl` (Already covered by responsive classes above)
- **Subheadline:** `text-xl`
- **Alignment:** `text-left` (Consistent with desktop)

## 4. Spacing
- **Top Padding:** `pt-20` on the container is the baseline. If the header is taller, this may need to be `pt-32` or `pt-40` in specific cases, but `pt-20` is the Home page standard.
- **Gap:** `space-y-8` between elements.

## 5. Buttons/CTAs
- **Primary Button:** `rounded-full px-8 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl shadow-xl hover:scale-105 transition-transform bg-white text-slate-900 hover:bg-slate-100 border-none`
- **Secondary Button:** `rounded-full px-8 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50`

## 6. Brand Colors
- **Primary Accent:** `#7BDDE5` (Cyan) - Used for icons, highlights, or secondary text accents.
- **Text Color:** White (`text-white`) on dark hero backgrounds.
- **Dark Text:** Slate-900 (`text-slate-900`) on light backgrounds (if any hero uses a light bg).

## 7. Specific Page Fixes
- **How It Works:** Ensure the hero image is aligned correctly and not pushed down differently from other pages.
- **Gurus:** Apply the same standard to the main Gurus page and individual Guru profile pages.
