import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn("font-bold", className)}>
      {children}
    </span>
  )
}