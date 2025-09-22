import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge CSS classes.
 * It uses `clsx` to conditionally join class names together and `tailwind-merge` to merge Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - A list of class values to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
