# Email Templates

This directory contains email templates for the VibePHX platform.

## Setup

Emails are sent using [Resend](https://resend.com). The API key is stored in `.env.local`:

```bash
RESEND_API_KEY=re_apqUhRqn_AmuLThrLP4iDq4q5F7YDiLFx
```

## Templates

### WorkshopWelcome.tsx

Sent when an attendee is added to a workshop.

**Features:**
- Personalized greeting
- Workshop details (title, date, location)
- Credits awarded amount highlighted in green
- Explanation of the PRD Builder and what credits can be used for
- Dynamic CTA based on account status:
  - **Has Account**: "Log In & Start Building" → `/auth/signin`
  - **No Account**: "Create Account & Get Started" → `/auth/signup`

**Triggered by:**
- Single attendee addition: `/api/admin/workshops/attendees` (POST)
- Bulk attendee import: `/api/admin/workshops/attendees/bulk` (POST)

**Data required:**
```typescript
{
  attendeeName: string         // User's name or email username
  workshopTitle: string         // Workshop name
  workshopDate: string          // ISO date string
  workshopLocation: string|null // Physical location
  creditsAwarded: number        // Dollar amount of credits
  hasAccount: boolean           // True if user exists in DB
}
```

## Email Content

The welcome email includes:

1. **Header**: Gradient banner with "Welcome to VibeCode PHX! 🎉"
2. **Personal Greeting**: "Hey {name},"
3. **Credits Announcement**: Highlights the awarded credits in green
4. **Workshop Details Box**:
   - Event name
   - Date and time (formatted)
   - Location (if provided)
   - Credits awarded
5. **PRD Builder Explanation Box**:
   - What is the PRD Builder
   - What it does (bullet points)
   - How credits are used
6. **Call to Action Button**:
   - Orange button with appropriate action
   - Links to signup or signin
7. **Footer**: VibePHX branding and website link

## Styling

- Dark theme (#000000 background, #ffffff text)
- Orange/red gradient accent (#f97316 → #dc2626)
- Responsive design for email clients
- Inline styles for maximum compatibility

## Testing Locally

To test email sending:

1. Ensure RESEND_API_KEY is set in `.env.local`
2. Add an attendee through the admin panel at `/admin/workshops`
3. Check the Resend dashboard for sent emails
4. Email errors are logged but don't fail the attendee creation

## From Address

All emails are sent from:
```
VibeCode PHX <noreply@vibecodephx.com>
```

Make sure this domain is verified in Resend before sending production emails.
