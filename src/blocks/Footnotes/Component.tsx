import type { Footnotes as FootnotesProps } from '@/payload-types'
import { SparklesIcon } from 'lucide-react'

export const Footnotes: React.FC<FootnotesProps> = ({ footnotes }) => {
  if (!footnotes || footnotes.length === 0) return null

  return (
    <div className="container">
      <div className="mt-8 space-y-3 text-sm text-muted-foreground">
        {footnotes.map((footnote, i) => (
          <p key={footnote.id ?? i} className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary/60" />
            {footnote.text}
          </p>
        ))}
      </div>
    </div>
  )
}
