/**
 * Formatting utility functions
 */

/**
 * Format a number as Vietnamese Dong currency
 * @param price - The price number to format
 * @returns Formatted price string (e.g., "35,000 VNĐ")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * Format a date string to Vietnamese format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "17/04/2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}

/**
 * Format a date string to Vietnamese format with time
 * @param dateString - ISO date string
 * @returns Formatted date and time (e.g., "17/04/2024 12:00")
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a phone number
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "0912 345 678")
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phone;
}

/**
 * Format an address
 * @param address - Address components
 * @returns Formatted full address
 */
export function formatAddress(address: {
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
}): string {
  const parts = [
    address.address,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}