import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'
import React from 'react'

import { Error } from '../Error'
import type { FormFieldStyleProps } from '../fields'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string
  } & FormFieldStyleProps
> = ({
  name,
  defaultValue,
  errors,
  label,
  placeholder,
  register,
  required,
  width,
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
      <Input
        aria-invalid={Boolean(errors[name])}
        className={cn(
          'h-12 rounded-lg border-border/70 px-4 shadow-none',
          fieldBgClassName || 'bg-background/70',
        )}
        defaultValue={defaultValue}
        id={name}
        placeholder={placeholder}
        type="text"
        {...register(name, { required })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
