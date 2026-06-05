import { memo, useState } from 'react'
import { ChevronDownIcon, GitWorktreeIcon } from '../../../components/Icons'
import { MarkdownRenderer } from '../../../components/MarkdownRenderer'
import { useDelayedRender } from '../../../hooks'

interface WorkflowStatePartViewProps {
  content: string
  tagCount?: number
}

export const WorkflowStatePartView = memo(function WorkflowStatePartView({
  content,
  tagCount,
}: WorkflowStatePartViewProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldRenderBody = useDelayedRender(expanded)

  if (!content.trim()) return null

  const summarySuffix = tagCount && tagCount > 1 ? ` (${tagCount})` : ''

  return (
    <div className="flex flex-col items-end w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[length:var(--fs-sm)] text-text-400 hover:text-text-300 transition-colors py-1 px-2 rounded hover:bg-bg-200"
      >
        <span className="inline-flex w-[14px] items-center justify-center shrink-0">
          <GitWorktreeIcon size={14} />
        </span>
        <span>{`Trellis Context${summarySuffix}`}</span>
        <span
          className={`inline-flex items-center justify-center shrink-0 transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`}
        >
          <ChevronDownIcon size={10} />
        </span>
      </button>

      <div
        className={`grid w-full transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {shouldRenderBody && (
            <div className="px-4 py-2.5 bg-bg-300 rounded-2xl max-w-full">
              <MarkdownRenderer content={content} variant="reasoning" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
