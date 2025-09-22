"use client"

import * as React from "react"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "./toast"
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
          </Toast>
        )
      })}
    </ToastProvider>
  )
}