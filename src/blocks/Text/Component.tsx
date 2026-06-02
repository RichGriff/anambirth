import RichText from '@/components/RichText'
import type { TextBlock as TextProps } from '@/payload-types'

export const Text = (props: TextProps) => {
  const { text } = props

  return <RichText className={'my-2'} data={text} />
}
