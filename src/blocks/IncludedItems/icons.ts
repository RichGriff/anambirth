import {
  CheckCircleIcon,
  GiftIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneCallIcon,
  SparklesIcon,
  type LucideIcon,
} from 'lucide-react'

export const includedItemIconOptions = [
  { label: 'Phone', value: 'phone' },
  { label: 'Heart', value: 'heart' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Location', value: 'location' },
  { label: 'Gift', value: 'gift' },
  { label: 'Check', value: 'check' },
  { label: 'Message', value: 'message' },
] as const

export type IncludedItemIcon = (typeof includedItemIconOptions)[number]['value']

export const defaultIncludedItemIcon: IncludedItemIcon = 'phone'

export const includedItemIcons: Record<IncludedItemIcon, LucideIcon> = {
  phone: PhoneCallIcon,
  heart: HeartIcon,
  sparkles: SparklesIcon,
  location: MapPinIcon,
  gift: GiftIcon,
  check: CheckCircleIcon,
  message: MessageCircleIcon,
}
