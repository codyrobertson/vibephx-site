import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminNotification(draftId: string) {
  const draft = await prisma.resourceDraft.findUnique({
    where: { id: draftId }
  })

  if (!draft) throw new Error('Draft not found')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vibecodephx.com'

  await resend.emails.send({
    from: 'Vibe Code PHX <noreply@vibecodephx.com>',
    to: adminEmail,
    subject: `📝 New Resource Draft: ${draft.title}`,
    html: `
      <h2>New Resource Article Draft Ready for Review</h2>
      <p><strong>Technology:</strong> ${draft.technology}</p>
      <p><strong>Title:</strong> ${draft.title}</p>
      <p><strong>Word Count:</strong> ${draft.wordCount}</p>
      <p><strong>Confidence Score:</strong> ${(draft.confidenceScore * 100).toFixed(0)}%</p>
      <p><strong>External Links:</strong> ${draft.externalLinks}</p>
      <p><strong>Code Examples:</strong> ${draft.codeExamples}</p>

      <h3>Preview:</h3>
      <p>${draft.description}</p>

      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/cms">Review in CMS →</a></p>

      <hr/>
      <p><small>Generated automatically by Resource Article Agent</small></p>
    `
  })
}
