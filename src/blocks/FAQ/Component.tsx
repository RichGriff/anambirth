import RichText from '@/components/RichText'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq as FAQProps } from '@/payload-types'

export const FAQ: React.FC<FAQProps> = ({ heading, items }) => {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div>
        <h2 className="mb-12 text-center font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
          Common Questions
        </h2>

        <div className="px-3">
          <Accordion type="single" collapsible className="w-full">
            {items.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-accent transition-colors text-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <RichText data={faq.answer} enableGutter={false} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
