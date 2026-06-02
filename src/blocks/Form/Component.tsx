'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { ClockIcon } from 'lucide-react'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  introEyebrowHeading?: string
  introHeading?: string
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    introEyebrowHeading,
    introHeading,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container py-8 mt-6">
      <div className="mx-auto max-w-3xl mb-16">
        {enableIntro && (introEyebrowHeading || introHeading) && !hasSubmitted && (
          <div className="mb-8 lg:mb-10 flex justify-center items-center flex-col">
            {introEyebrowHeading && (
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
                <ClockIcon className="size-3" />
                {introEyebrowHeading}
              </span>
            )}
            {introHeading && (
              <h2 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight md:text-5xl text-foreground">
                {introHeading}
              </h2>
            )}
          </div>
        )}
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className="mb-8 lg:mb-10" data={introContent} enableGutter={false} />
        )}
        <div className="rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm md:p-8 lg:p-10">
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 md:p-8">
                <p className="mb-3 text-[0.72rem] uppercase tracking-[0.22em] text-primary">
                  Submission received
                </p>
                <RichText data={confirmationMessage} />
              </div>
            )}
            {isLoading && !hasSubmitted && (
              <div className="rounded-2xl border border-border/60 bg-background/60 px-5 py-4 text-sm text-muted-foreground">
                Loading, please wait...
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
                {`${error.status || '500'}: ${error.message || ''}`}
              </div>
            )}
            {!hasSubmitted && (
              <form
                id={formID}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-wrap gap-x-5 gap-y-6"
              >
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <Field
                          key={index}
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      )
                    }
                    return null
                  })}

                <div className="mt-2 flex w-full flex-col gap-4 border-t border-border/50 pt-6 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-muted-foreground">
                    We will only use your details for this enquiry.
                  </p>
                  <Button
                    className="w-full rounded-full px-8 md:w-auto"
                    form={formID}
                    size="lg"
                    type="submit"
                    variant="default"
                  >
                    {submitButtonLabel}
                  </Button>
                </div>
              </form>
            )}
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
