import type { InvitationList as InvitationListProps } from '@/payload-types'

export const InvitationList: React.FC<InvitationListProps> = ({ title, items }) => {
  return (
    <div className="container">
      <div className="rounded-2xl bg-card p-8 md:p-12">
        <h3 className="mb-8 font-(family-name:--font-cormorant) text-2xl font-medium text-foreground md:text-3xl">
          {title}
        </h3>

        <ul className="grid gap-4 md:grid-cols-2">
          {items &&
            items.map((item, i) => (
              <li key={i} className="flex gap-4 text-muted-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
