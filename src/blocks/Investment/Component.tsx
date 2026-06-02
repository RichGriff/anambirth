import type { Investment as InvestmentProps } from '@/payload-types'
import { isPopulatedRelationship } from '@/utilities/isPopulatedRelationship'

export const Investment: React.FC<InvestmentProps> = ({ title, description, investments }) => {
  const selectedInvestments = investments.filter(isPopulatedRelationship)

  const renderPriceLabel = (option: (typeof selectedInvestments)[number]) => {
    if (option.paymentOption === 'monthly') {
      if (typeof option.monthlyCost === 'number') {
        const totalCost =
          typeof option.monthlyCommitmentMonths === 'number'
            ? option.monthlyCost * option.monthlyCommitmentMonths
            : null

        return (
          <>
            £{option.monthlyCost}
            <span className="text-sm text-muted-foreground font-serif"> /month</span>
            {typeof totalCost === 'number' && (
              <span className="text-sm text-muted-foreground font-serif">
                {' '}
                • £{totalCost} total
              </span>
            )}
          </>
        )
      }

      return 'Monthly amount not set'
    }

    if (typeof option.oneOffCost === 'number') {
      return `£${option.oneOffCost}`
    }

    return 'One-off amount not set'
  }

  return (
    <div className="container">
      <div className="">
        <h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">{title}</h3>
        {description && <p className="mb-8 text-muted-foreground">{description}</p>}

        <div
          className={`grid gap-4 ${selectedInvestments.length > 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'}`}
        >
          {selectedInvestments.map((option, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div
                className={`flex ${selectedInvestments.length > 2 ? 'flex-col' : 'flex-row'} items-baseline justify-between`}
              >
                <h4 className="font-medium text-foreground">{option.name}</h4>
                <span className="font-(family-name:--font-cormorant) text-2xl font-light text-primary">
                  {renderPriceLabel(option)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
