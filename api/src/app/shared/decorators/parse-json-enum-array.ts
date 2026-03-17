import { Transform } from 'class-transformer';

/**
 * Transforma uma string JSON em um array de enums primitivos.
 */
export function ParseJsonEnumArray() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  });
}
