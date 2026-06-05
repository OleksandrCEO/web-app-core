import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

/** Merge tailwind class strings safely. Always use this — never `${a} ${b}`. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** "7:42" / "0:09" — for durations under an hour. Returns "0:00" for nullish input. */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** "Jan 5, 2026 3:42 PM" — absolute, with time. */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'
  return format(new Date(dateString), 'MMM d, yyyy h:mm a')
}

/** "3 hours ago", "in 5 minutes". */
export function formatRelativeDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

/** "$1,234.56" — USD by default. Override the currency arg for other locales. */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  if (amount == null) return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0)
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}
