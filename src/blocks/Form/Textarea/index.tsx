import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
    placeholder?: string
  }
> = ({ name, defaultValue, errors, label, placeholder, register, required, rows = 3, width }) => {
  return (
    <Width width={width}>
      <Label
        className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
        htmlFor={name}
      >
        {label}

        {required && (
          <span className="text-primary">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>

      <TextAreaComponent
        aria-invalid={Boolean(errors[name])}
        className="min-h-32 rounded-lg border-border/70 bg-background/70 px-4 py-3 shadow-none"
        defaultValue={defaultValue}
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
