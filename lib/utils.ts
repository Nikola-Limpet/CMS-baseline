import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a URL-friendly slug from a string
 * @param input The string to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with a single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    || 'untitled'; // Fallback if empty
}