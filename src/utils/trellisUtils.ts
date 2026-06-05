export const TRELLIS_TAGS = [
  'trellis-context',
  'first-reply-notice',
  'current-state',
  'workflow',
  'guidelines',
  'task-status',
  'ready',
  'workflow-state',
]

const TRELLIS_TAG_RE = new RegExp(
  `<(${TRELLIS_TAGS.join('|')})>([\\s\\S]*?)</\\1>`,
  'gi',
)

export function extractTrellisContext(text: string): {
  cleanText: string
  trellisTags: string[]
} {
  const trellisTags: string[] = []
  let cleanText = text
    .replace(TRELLIS_TAG_RE, (_, _tagName, content) => {
      trellisTags.push(content.trim())
      return ''
    })
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')

  // Remove leading markdown divider often injected by Trellis init
  cleanText = cleanText.replace(/^(?:---\n?)/, '').replace(/^\n+/, '').trim()

  return { cleanText, trellisTags }
}

export function cleanTrellisTitle(title: string): string {
  if (!title) return title
  // Quick check to avoid regex if not needed
  if (!title.includes('<')) return title
  
  let clean = title.replace(TRELLIS_TAG_RE, '')
  clean = clean.replace(/^(?:---\n?)/, '').replace(/^\n+/, '').trim()
  return clean || title // fallback to original if it becomes empty
}
