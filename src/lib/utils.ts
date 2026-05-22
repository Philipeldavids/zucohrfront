
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn - Combines class names and merges Tailwind classes intelligently.
 * @param inputs - Any number of class name values (strings, arrays, objects)
 * @returns A single merged class name string
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

