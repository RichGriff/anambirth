import type { Field, SelectField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type BackgroundColorValue =
  | 'bg-primary'
  | 'bg-secondary'
  | 'bg-black'
  | 'bg-light'
  | 'bg-lighter'
  | 'bg-dark'
  | 'bg-white'

const neutralBackgroundOptions: SelectField['options'] = [
  { value: 'bg-light', label: 'Light' },
  { value: 'bg-lighter', label: 'Lighter' },
  { value: 'bg-dark', label: 'Dark' },
  { value: 'bg-white', label: 'White' },
]

const fullBackgroundOptions: SelectField['options'] = [
  { value: 'bg-primary', label: 'Primary Color' },
  { value: 'bg-secondary', label: 'Secondary Color' },
  { value: 'bg-black', label: 'Black' },
  ...neutralBackgroundOptions,
]

type BackgroundColorFieldType = (options?: {
  includeBrandColors?: boolean
  overrides?: Partial<SelectField>
}) => Field

export const backgroundColorField: BackgroundColorFieldType = ({
  includeBrandColors = false,
  overrides = {},
} = {}) => {
  const generatedBackgroundColorField: SelectField = {
    name: 'bg',
    type: 'select',
    label: 'Background Color',
    options: includeBrandColors ? fullBackgroundOptions : neutralBackgroundOptions,
    defaultValue: 'bg-white',
    required: true,
  }

  return deepMerge(generatedBackgroundColorField, overrides)
}
