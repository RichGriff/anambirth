import RichText from '@/components/RichText'
import { InViewFade, StaggerInView, StaggerItem } from '@/components/animations/InView'
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
        <InViewFade>
          <h2 className="mb-12 text-center font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
            Common Questions
          </h2>
        </InViewFade>

        <div className="px-3">
          <StaggerInView staggerChildren={0.07}>
            <Accordion type="single" collapsible className="w-full">
              {items.map((faq, i) => (
                <StaggerItem key={i}>
                  <AccordionItem value={`item-${i}`} className="border-border">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-accent transition-colors text-md">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <RichText data={faq.answer} enableGutter={false} />
                    </AccordionContent>
                  </AccordionItem>
                </StaggerItem>
              ))}
            </Accordion>
          </StaggerInView>
        </div>
      </div>
    </div>
  )
}
