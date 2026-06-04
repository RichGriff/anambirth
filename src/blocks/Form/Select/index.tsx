import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select as SelectComponent,
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

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  } & FormFieldStyleProps
> = ({
  name,
  control,
  errors,
  label,
  options,
  required,
  width,
  defaultValue,
  fieldBgClassName,
  fieldLabelClassName,
}) => {
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
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger
                aria-invalid={Boolean(errors[name])}
                className={cn(
                  'h-12 w-full rounded-lg border-border/70 px-4 text-sm shadow-none',
                  fieldBgClassName || 'bg-background/70',
                )}
                id={name}
              >
                <SelectValue placeholder={'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
