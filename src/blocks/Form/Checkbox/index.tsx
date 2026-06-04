import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'
import React from 'react'

import { Error } from '../Error'
import type { FormFieldStyleProps } from '../fields'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  } & FormFieldStyleProps
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  width,
  fieldBgClassName,
  fieldLabelClassName,
}) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div
        className={cn(
          'flex min-h-12 items-start gap-3 rounded-xl border border-border/60 px-4 py-3',
          fieldBgClassName || 'bg-background/50',
        )}
      >
        <CheckboxUi
          aria-invalid={Boolean(errors[name])}
          className="mt-0.5"
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <Label
          className={cn('text-sm leading-6 text-foreground', fieldLabelClassName)}
          htmlFor={name}
        >
          {required && (
            <span className="text-primary">
              * <span className="sr-only">(required)</span>
            </span>
          )}
          {label}
        </Label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
