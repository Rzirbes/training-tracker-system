/**
 * Quebra um array de N posições em um array de arrays, onde cada sub-array é limitado a um número máximo de itens.
 *
 * @param array O array original a ser dividido.
 * @param chunkSize O tamanho máximo de cada sub-array (padrão é 10).
 * @returns Um array de arrays, onde cada sub-array tem no máximo `chunkSize` itens.
 */
export function chunkArray<T>(array: T[], chunkSize: number = 10): T[][] {
  const result: T[][] = [];

  if (!array || array.length === 0) {
    return result;
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}
