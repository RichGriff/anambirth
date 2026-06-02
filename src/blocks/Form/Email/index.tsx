import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string
  }
> = ({ name, defaultValue, errors, label, placeholder, register, required, width }) => {
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
      <Input
        aria-invalid={Boolean(errors[name])}
        className="h-12 rounded-lg border-border/70 bg-background/70 px-4 shadow-none"
        defaultValue={defaultValue}
        id={name}
        placeholder={placeholder || 'your@email.com'}
        type="email"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
