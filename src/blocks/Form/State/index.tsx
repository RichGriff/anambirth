import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import type { FormFieldStyleProps } from '../fields'
import { Width } from '../Width'
import { stateOptions } from './options'

export const State: React.FC<
  StateField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  } & FormFieldStyleProps
> = ({ name, control, errors, label, required, width, fieldBgClassName, fieldLabelClassName }) => {
  return (
    <Width width={width}>
      <Label
        className={cn(
          'mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted-foreground',
          fieldLabelClassName,
        )}
        htmlFor={name}
      >
        {label}
        {required && (
          <span className="text-primary">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = stateOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger
                aria-invalid={Boolean(errors[name])}
                className={cn(
                  'h-12 w-full rounded-xl border-border/70 px-4 text-base shadow-none',
                  fieldBgClassName || 'bg-background/70',
                )}
                id={name}
              >
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
