/**
 * Sanitize workshop data for logging by removing large file content
 */
export function sanitizeWorkshopForLog(workshop: any) {
  if (!workshop) return workshop

  const sanitized = { ...workshop }

  // Sanitize files array to only show metadata, not content
  if (sanitized.files && Array.isArray(sanitized.files)) {
    sanitized.files = sanitized.files.map((file: any) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: file.uploadedAt,
      // Exclude URL if it contains base64 data
      url: file.url?.includes('base64') ? '[base64-data]' : file.url
    }))
  }

  // Truncate content if it's very long
  if (sanitized.content && sanitized.content.length > 200) {
    sanitized.content = sanitized.content.substring(0, 200) + '... [truncated]'
  }

  // Truncate header image if it's base64
  if (sanitized.headerImage && sanitized.headerImage.includes('base64')) {
    sanitized.headerImage = '[base64-image]'
  }

  return sanitized
}

/**
 * Sanitize array of workshops for logging
 */
export function sanitizeWorkshopsForLog(workshops: any[]) {
  if (!workshops) return workshops
  return workshops.map(sanitizeWorkshopForLog)
}
