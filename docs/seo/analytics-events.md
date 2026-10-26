# Analytics Events Documentation

## Implementation

Events are dispatched via `client/src/lib/analytics.ts`. The module fires:
1. A `CustomEvent("sg_analytics")` on `window` for any listener.
2. A `dataLayer.push()` for GTM compatibility.
3. Console logs in development mode.

## Event Catalog

| Event | Parameters | Trigger |
|-------|-----------|---------|
| `app_download_click` | page_path, page_type, placement, button_text, destination_store | Any App Store link click |
| `book_buy_click` | page_path, book_slug, placement, destination_domain | Any Amazon book link click |
| `pricing_view` | page_type | Plans page load |
| `billing_toggle` | billing_period | Monthly/Yearly toggle |
| `plan_select` | plan_name, billing_period, displayed_price, currency | Plan CTA click |
| `guru_page_view` | guru_name | Guru page load |
| `guru_download_click` | guru_name, source_page, placement | App CTA on guru page |
| `stress_assessment_start` | - | Assessment begins |
| `stress_assessment_step` | step | Each question answered |
| `stress_assessment_complete` | profile_type | Assessment finished |
| `email_signup_view` | form_id, placement | Signup form visible |
| `email_signup_success` | form_id, lead_magnet | Signup submitted |
| `outbound_source_click` | destination_url | Citation link click |

## AI Referral Detection

The `detectAIReferral()` function identifies traffic from:
- ChatGPT (utm_source=chatgpt.com or referrer)
- Perplexity (utm_source=perplexity or referrer)
- Claude (referrer includes claude.ai)
- Copilot (referrer includes copilot.microsoft.com)
- Gemini (referrer includes gemini.google.com)

## Integration Steps

1. Import the relevant tracking function from `@/lib/analytics`.
2. Call it on the appropriate user action (click handler, page load effect).
3. Verify events in browser console during development.
4. Connect to GTM or analytics provider in production.

## Validation

- Open browser DevTools console on any page.
- Click an App Store link or book link.
- Verify `[Analytics] app_download_click` or `[Analytics] book_buy_click` appears with correct params.
