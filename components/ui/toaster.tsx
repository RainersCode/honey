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
import { Locale } from "@/config/i18n.config"

export function Toaster({ lang = 'en' }: { lang?: Locale }) {
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
        // Only translate simple keys (like 'error', 'success') that exist in common dictionary
        // Don't translate complex messages that are already translated
        const isSimpleKey = (str: string) => {
          if (!str) return false
          const trimmed = str.trim().toLowerCase()
          // Simple keys are single words that exist in our common dictionary
          return !trimmed.includes(' ') && !trimmed.includes('{') && dict?.common?.[trimmed]
        }
        
        const translatedTitle = (title && typeof title === 'string' && isSimpleKey(title)) 
          ? dict.common[title.toLowerCase()]
          : title
          
        const translatedDescription = (description && typeof description === 'string' && isSimpleKey(description))
          ? dict.common[description.toLowerCase()]
          : description

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
