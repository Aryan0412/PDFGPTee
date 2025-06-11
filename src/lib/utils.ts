import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii (inputString : string) {
  // Remove non-ASCII
  let ascii = inputString.replace(/[^\x00-\x7F]+/g, "");
  // Replace anything not a-zA-Z0-9-_ with underscore
  return ascii.replace(/[^a-zA-Z0-9-_]/g, "_");

}
