/**
 * Joins class name strings, filtering out falsy values.
 * Usage: cn('base', condition && 'active', 'always')
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
