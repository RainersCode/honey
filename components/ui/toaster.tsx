"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { getDictionary } from "@/lib/dictionary"

export function Toaster({ lang = 'en' }: { lang?: string }) {
  const { toasts } = useToast()
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    loadDictionary()
  }, [lang])

  if (!dict) return null

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, ...props }) {
        // Translate title if it matches a dictionary key
        const translatedTitle = dict?.common?.[title?.toLowerCase()] || title
        // Translate description if it matches a dictionary key
        const translatedDescription = dict?.common?.[description?.toLowerCase()] || description

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {translatedTitle && <ToastTitle>{translatedTitle}</ToastTitle>}
              {translatedDescription && (
                <ToastDescription>{translatedDescription}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
