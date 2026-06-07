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
import { CheckCircle2Icon, CheckIcon, ClockIcon } from 'lucide-react'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  introEyebrowHeading?: string
  introHeading?: string
  introDescription?: string
  introList?: { item: string }[]
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
    introDescription,
    introList,
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
  const fieldBgClassName =
    'bg-[#F6F3EC16] border-none text-foreground-light placeholder:text-muted-foreground-light/30 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0'
  const fieldLabelClassName = 'text-foreground-light'

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
    <div
      id="connection"
      className="bg-primary py-16 bg-[radial-gradient(120%_120%_at_100%_100%,color-mix(in_oklab,var(--color-accent)_20%,transparent)_0%,transparent_58%)] md:bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_40%,transparent)_0%,transparent_58%)]"
    >
      <div className="grid grid-cols-1 px-3 md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto py-6 md:py-16 text-white">
        {enableIntro && (introEyebrowHeading || introHeading) && (
          <div className="px-4">
            {introEyebrowHeading && (
              <div className="mb-4 flex items-center text-sm uppercase tracking-[0.3em] text-foreground-light before:mr-3 before:block before:h-px before:w-8 before:bg-current">
                {introEyebrowHeading}
              </div>
            )}
            {introHeading && (
              <h2 className="font-(family-name:--font-cormorant) text-5xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground-light text-balance">
                {introHeading}
              </h2>
            )}
            {introDescription && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground-light md:text-xl lg:mx-0">
                {introDescription}
              </p>
            )}
            {introList && introList.length > 0 && (
              <ul className="mt-8 list-none space-y-4">
                {introList.map((item, index) => (
                  <li key={index} className="flex justify-start items-center gap-2">
                    <CheckCircle2Icon className="inline size-4 text-green-500" />
                    <span className="leading-relaxed text-white md:text-xl lg:mx-0">
                      {item.item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          <div className="rounded-2xl bg-[hsla(0,0%,100%,0.03)] p-6 shadow-sm md:p-8 lg:p-10 col-span-6">
            <FormProvider {...formMethods}>
              {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <div className="rounded-xl p-6 md:p-8">
                  <p className="mb-3 text-[0.72rem] uppercase tracking-[0.22em] text-accent text-center">
                    Contact Form Submitted!
                  </p>
                  <RichText data={confirmationMessage} className="text-foreground-light" />
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
                            fieldBgClassName={fieldBgClassName}
                            fieldLabelClassName={fieldLabelClassName}
                            register={register}
                          />
                        )
                      }
                      return null
                    })}

                  <div className="mt-2 flex flex-col-reverse w-full gap-4 pt-2 pb-2">
                    <p className="text-sm text-muted-foreground-light text-center">
                      We will only use your details for this enquiry.
                    </p>
                    <Button
                      className="w-full rounded-full px-8 md:w-auto py-6"
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
    </div>
  )
}
