"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none",
        "font-poppins tracking-wide select-none cursor-pointer",
        "transition-colors duration-150",
        "hover:text-brand-blue-600 focus:text-brand-blue-600",
        "peer-focus:text-brand-blue-600 peer-focus:font-semibold",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

export { Label }
