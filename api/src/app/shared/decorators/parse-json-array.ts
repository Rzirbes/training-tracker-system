import { Transform } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

/**
 * Transforma uma string JSON em um array de instâncias de um DTO específico.
 * @param dto O tipo de DTO a ser instanciado.
 */
export function ParseJsonArrayOf(dto: new (...args: any[]) => any) {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return [];
      }
    }

    return Array.isArray(value)
      ? value.map((v) => plainToInstance(dto, v))
      : [];
  });
}
