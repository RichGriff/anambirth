import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { FormFieldStyleProps } from '../fields'
import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const Message: React.FC<{ message: DefaultTypedEditorState } & FormFieldStyleProps> = ({
  message,
  fieldBgClassName,
}) => {
  return (
    <Width
      className={cn(
        'my-2 rounded-3xl border border-border/60 p-5 md:p-6',
        fieldBgClassName || 'bg-background/50',
      )}
      width="100"
    >
      {message && <RichText data={message} />}
    </Width>
  )
}
