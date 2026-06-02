import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width
      className="my-2 rounded-3xl border border-border/60 bg-background/50 p-5 md:p-6"
      width="100"
    >
      {message && <RichText data={message} />}
    </Width>
  )
}
