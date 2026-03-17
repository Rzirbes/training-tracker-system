import { Transform } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

/**
 * Transforma uma string JSON em um objeto de instâncias de um DTO específico.
 * @param dto O tipo de DTO a ser instanciado.
 */
export function ParseJsonObjectOf(dto: new (...args: any[]) => any) {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return {} as typeof dto;
      }
    }

    return Boolean(value) ? plainToInstance(dto, value) : ({} as typeof dto);
  });
}
