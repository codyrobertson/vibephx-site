# Resource Article Generation System

Automated AI-powered system for generating high-quality, beginner-friendly resource articles about web development technologies.

## Overview

The Resource Article Generation Agent is a comprehensive system that:
- 🔍 **Researches** technologies using Exa AI (search, research, findSimilar)
- ✍️ **Generates** SEO-optimized articles with Claude 3.5 Sonnet
- 🖼️ **Creates** featured images using DALL-E 3
- 📧 **Notifies** admins when drafts are ready
- 🔄 **Automates** via cron jobs
- ✅ **Queues** drafts for manual approval in CMS

## Architecture

### Database Models

- **ResourceDraft**: Stores generated article drafts
  - Content, metadata, confidence scores
  - Status tracking (PENDING, APPROVED, PUBLISHED, REJECTED)
  - Image URLs and prompts
  - Research metadata

- **ResourceTopic**: Queued topics for generation
  - Technology name, priority, schedule
  - Generation status and attempt tracking

- **GenerationJob**: Cron job execution logs
  - Items processed, succeeded, failed
  - Errors and timing metrics

### Core Services

#### `lib/services/resource-generator.ts`
Main generation workflow implementing the agent logic:
1. **Topic Discovery & Validation**
   - Check for duplicates in content/resources and database
   - Generate URL-friendly slugs

2. **Research & Content Depth Assessment**
   - Initial Exa search (10 results)
   - Calculate confidence score
   - Deep research if confidence < 0.8
   - Find similar content for authoritative links

3. **Content Generation**
   - Call Claude 3.5 Sonnet via OpenRouter
   - Parse AI-generated MDX
   - Extract frontmatter metadata

4. **Quality Validation**
   - Minimum 800 words
   - At least 3 external links recommended
   - Confidence score ≥ 0.6

#### `lib/services/image-generator.ts`
DALL-E 3 image generation:
- Creates tech-focused featured images
- Uploads to Vercel Blob storage
- Falls back to placeholder on failure

#### `lib/services/email.ts`
Resend email notifications:
- Sends admin notification when draft ready
- Includes draft preview and metadata
- Links to CMS for review

### API Routes

#### `POST /api/resources/generate`
Manual generation endpoint:
```bash
curl -X POST http://localhost:3000/api/resources/generate \
  -H "Content-Type: application/json" \
  -d '{"technology": "Stripe"}'
```

Response:
```json
{
  "success": true,
  "draft_id": "clxyz123...",
  "metadata": {
    "technology": "Stripe",
    "confidenceScore": 0.92,
    "wordCount": 1847,
    "externalLinks": 5
  }
}
```

#### `GET /api/resources/generate`
List pending drafts:
```bash
curl http://localhost:3000/api/resources/generate
```

#### `GET /api/cron/generate-resources`
Cron job endpoint (secured with CRON_SECRET):
- Processes up to 3 queued topics per run
- Generates articles + images
- Sends notifications
- Updates job metrics

## Setup

### 1. Environment Variables

Add to `.env.local`:
```bash
# Required
EXA_API_KEY=your_exa_api_key
OPENROUTER_API_KEY=your_openrouter_key
ADMIN_EMAIL=your@email.com
CRON_SECRET=random_secure_string

# Optional
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Get API keys:
- **Exa**: https://exa.ai
- **OpenRouter**: https://openrouter.ai/keys

### 2. Database Migration

Already applied via `prisma db push`.

### 3. Vercel Cron Job

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/generate-resources",
    "schedule": "0 */6 * * *"
  }]
}
```

This runs every 6 hours.

### 4. Set Cron Secret

```bash
vercel env add CRON_SECRET
# Enter your secure random string
```

## Usage

### Manual Generation

```typescript
// Queue a topic
await prisma.resourceTopic.create({
  data: {
    technology: 'Stripe',
    priority: 10,
    scheduledFor: new Date()
  }
})

// Or directly generate
const response = await fetch('/api/resources/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ technology: 'Stripe' })
})
```

### Cron Job

Automatically processes queued topics:

```typescript
// Add multiple topics
await prisma.resourceTopic.createMany({
  data: [
    { technology: 'Vercel', priority: 10 },
    { technology: 'Supabase', priority: 9 },
    { technology: 'Prisma', priority: 8 }
  ]
})
```

Every 6 hours, the cron job will:
1. Find highest priority QUEUED topics
2. Generate articles (max 3 per run)
3. Create featured images
4. Email admin
5. Mark topics as COMPLETED

### Draft Approval Workflow

1. **Receive Email** - Admin gets notification with draft preview
2. **Review in CMS** - Go to `/admin/cms` → "📝 AI-Generated Drafts"
3. **Edit if Needed** - Make any adjustments
4. **Approve**:
   - Copy content from draft
   - Create new "Learning Resource"
   - Publish to `content/resources`
5. **Update Database**:
```typescript
await prisma.resourceDraft.update({
  where: { id: draftId },
  data: {
    status: 'APPROVED',
    publishedAt: new Date()
  }
})
```

Or **Reject**:
```typescript
await prisma.resourceDraft.update({
  where: { id: draftId },
  data: {
    status: 'REJECTED',
    rejectedAt: new Date(),
    rejectionReason: 'Content quality insufficient'
  }
})
```

## Content Quality Standards

Generated articles must meet:

### ✅ Required
- 800+ words
- 3-5 external authoritative links
- At least 1 code example
- Beginner-friendly (8th grade reading level)
- Active voice throughout
- Concrete examples over abstract concepts

### Structure
```markdown
## What is [Technology]?
- First principles explanation
- Everyday analogy
- Why it exists

## Why Should You Care?
- 3-5 real-world use cases
- Business/project impact

## How Does It Work?
- Conceptual overview
- No implementation details

## Getting Started
- Step-by-step example
- Working code with comments

## Common Use Cases
- Specific scenarios
- Mini examples

## Best Practices
- Do's and Don'ts
- Common mistakes

## Next Steps
- Official docs
- Community resources
- Related topics
```

## Monitoring

### View Jobs
```typescript
const jobs = await prisma.generationJob.findMany({
  where: { type: 'resource_article' },
  orderBy: { startedAt: 'desc' },
  take: 10
})
```

### View Drafts
```typescript
const drafts = await prisma.resourceDraft.findMany({
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' }
})
```

### Metrics
```typescript
const stats = await prisma.resourceDraft.aggregate({
  _avg: { confidenceScore: true, wordCount: true },
  _count: { id: true },
  where: { status: 'PENDING' }
})
```

## Troubleshooting

### Low Confidence Score
If confidence < 0.8, the agent runs deep research automatically. If still low:
- Technology might be too new/obscure
- Try more specific technology name
- Check Exa API limits

### Image Generation Fails
System falls back to placeholder. Check:
- OPENROUTER_API_KEY has DALL-E access
- Vercel Blob storage configured

### Email Not Sending
Check:
- RESEND_API_KEY valid
- ADMIN_EMAIL configured
- Resend domain verified

### Cron Not Running
Verify:
- CRON_SECRET matches in Vercel env
- Cron schedule in vercel.json
- Check Vercel logs

## Cost Estimates

Per article generation:
- **Exa API**: ~$0.02-0.03 (neural search + findSimilar + content)
  - Neural search (10 results): $0.005
  - FindSimilar: $0.005
  - Content retrieval (10-15 pieces): $0.01-0.015
  - Deep research if needed: $0.005
- **Claude 3.5 Sonnet**: ~$0.15 (10k input + 8k output tokens)
  - Via OpenRouter: ~$3/M input, ~$15/M output
- **gpt-image-1**: ~$0.02 (1792x1024, cost-effective alternative)
- **Total**: ~$0.19-0.20 per article

Cron job (3 articles every 6 hours = 12 articles/day):
- **Daily**: ~$2.40
- **Monthly**: ~$72

Costs with Exa gate (using keyword search for some queries):
- **Optimized**: ~$0.15-0.17 per article
- **Monthly (12/day)**: ~$54-60

## Future Enhancements

- [ ] Auto-publish approved drafts to GitHub
- [ ] A/B test different prompts
- [ ] Multi-language support
- [ ] Custom style guides per topic category
- [ ] Automatic SEO score calculation
- [ ] Integration with analytics for topic suggestions

## Support

For issues or questions:
1. Check logs in Vercel dashboard
2. View generation jobs in database
3. Test manual generation first
4. Check all env vars set correctly
