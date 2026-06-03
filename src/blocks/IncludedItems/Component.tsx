import type { IncludedItems as IncludedItemsProps } from '@/payload-types'

import { defaultIncludedItemIcon, includedItemIcons } from './icons'

export const IncludedItems: React.FC<IncludedItemsProps> = ({ title, items }) => {
  return (
    <div className="container">
      <div className="rounded-2xl bg-card p-8 my-4 md:p-12">
        <h3 className="mb-8 font-(family-name:--font-cormorant) text-2xl font-medium text-foreground md:text-3xl">
          {title}
        </h3>

        <ul className="grid gap-6 md:grid-cols-2">
          {items &&
            items.map((item, i) => (
              <li key={i} className="flex gap-4 text-muted-foreground">
                {(() => {
                  const Icon = includedItemIcons[item.icon ?? defaultIncludedItemIcon]

                  return <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                })()}
                <span className="text-muted-foreground leading-relaxed">{item.text}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
