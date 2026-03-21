import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge multiple class names with Tailwind CSS support
 * @param inputs - Class values to merge
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Vietnamese Dong currency
 * @param price - The price number to format
 * @returns Formatted price string (e.g., "35,000 VNĐ")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VNĐ';
}
