"use client"

import * as React from "react"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ToastViewport />
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastAction altText="Close" className="ring-offset-background ring-offset-8 focus:ring-2" />
          </Toast>
        )
      })}
    </ToastProvider>
  )
}