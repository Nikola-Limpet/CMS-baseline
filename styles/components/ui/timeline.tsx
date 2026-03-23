import React from 'react'
import { cn } from '@/lib/utils'

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

interface TimelineItemProps {
  children: React.ReactNode
  isActive?: boolean
  isCompleted?: boolean
  icon?: React.ReactNode
  timestamp?: string
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

export function TimelineItem({ 
  children, 
  isActive = false, 
  isCompleted = false, 
  icon, 
  timestamp,
  className 
}: TimelineItemProps) {
  return (
    <div className={cn("relative flex items-start gap-4 pb-8 last:pb-0", className)}>
      {/* Timeline line */}
      <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200 last:hidden" />
      
      {/* Timeline dot */}
      <div className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
        isCompleted && "border-green-500 bg-green-50 text-green-600",
        isActive && !isCompleted && "border-blue-500 bg-blue-50 text-blue-600",
        !isActive && !isCompleted && "border-gray-300 bg-gray-50 text-gray-400"
      )}>
        {icon || <div className="h-2 w-2 rounded-full bg-current" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {children}
          </div>
          {timestamp && (
            <div className="text-sm text-gray-500 ml-4">
              {timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 