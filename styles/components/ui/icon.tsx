import { type LucideIcon } from 'lucide-react';
import { type IconWeight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { type ComponentType } from 'react';

interface IconProps {
  name: LucideIcon | ComponentType<any>;
  className?: string;
  size?: number;
  strokeWidth?: number;    // Lucide
  weight?: IconWeight;     // Phosphor (thin | light | regular | bold | fill | duotone)
  color?: string;
}

export function Icon({
  name: IconComponent,
  className,
  size,
  strokeWidth = 2,
  weight,
  color,
  ...props
}: IconProps) {
  return (
    <IconComponent
      className={cn('h-5 w-5', className)}
      size={size}
      strokeWidth={strokeWidth}
      weight={weight}
      color={color}
      {...props}
    />
  );
}
