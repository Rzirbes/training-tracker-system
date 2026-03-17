export class Cpf {
  private readonly value: string;

  constructor(cpf: string) {
    const unmasked = cpf?.replace(/\D/g, '');

    if (!Cpf.isValid(unmasked)) {
      throw new Error('CPF inválido');
    }

    this.value = unmasked;
  }

  public static isValid(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let checkDigit1 = 11 - (sum % 11);
    checkDigit1 = checkDigit1 > 9 ? 0 : checkDigit1;

    if (checkDigit1 !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let checkDigit2 = 11 - (sum % 11);
    checkDigit2 = checkDigit2 > 9 ? 0 : checkDigit2;

    return checkDigit2 === parseInt(cpf.charAt(10));
  }

  public getValue(): string {
    return this.value;
  }

  public getMasked(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
