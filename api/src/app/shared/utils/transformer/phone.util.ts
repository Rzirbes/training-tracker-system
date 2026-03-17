export enum DialingCode {
  USA_CANADA = '+1',
  UK = '+44',
  GERMANY = '+49',
  BRAZIL = '+55',
  PORTUGAL = '+351',
  FRANCE = '+33',
  JAPAN = '+81',
  INDIA = '+91',
  RUSSIA = '+7',
  DEFAULT = '+99',
}

export const dialingCodeMask: Record<DialingCode, string> = {
  [DialingCode.USA_CANADA]: '+9 (999) 999-9999',
  [DialingCode.UK]: '+99 9999 999999',
  [DialingCode.GERMANY]: '+99 999 99999999',
  [DialingCode.BRAZIL]: '+99 (99) 9 9999-9999',
  [DialingCode.PORTUGAL]: '+999 999 999 999',
  [DialingCode.FRANCE]: '+99 9 99 99 99 99',
  [DialingCode.JAPAN]: '+99 99-9999-9999',
  [DialingCode.INDIA]: '+99 99999-99999',
  [DialingCode.RUSSIA]: '+9 (999) 999-99-99',
  [DialingCode.DEFAULT]: '+99 (99) 9 9999-9999',
};

export function detectCountryCodeMask(value = ''): string {
  const cleaned = value?.replace(/\D/g, ''); // Remove não numéricos

  // Ordena os códigos por tamanho decrescente para evitar conflitos (ex: +351 antes de +35)
  const possibleCodes = Object.values(DialingCode).sort(
    (a, b) => b.length - a.length,
  );

  for (const code of possibleCodes) {
    if (cleaned?.startsWith(code.replace(/\D/g, ''))) {
      return dialingCodeMask[code];
    }
  }

  return dialingCodeMask[DialingCode.DEFAULT];
}

export function formatPhoneNumberByCountryCode(value = ''): string {
  if (!value) return '';
  
  const cleaned = value.replace(/\D/g, ''); // Remove tudo que não for número

  // Detecta a máscara correta com base no código do país
  const mask = detectCountryCodeMask(value);
  const digits = cleaned.split('');

  let formatted = '';
  let digitIndex = 0;

  for (const char of mask) {
    if (char === '9') {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex++];
      } else {
        break;
      }
    } else {
      formatted += char;
    }
  }

  return formatted;
}
