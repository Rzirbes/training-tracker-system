export const mask = {
  name(value: string) {
    return value.replace(/[^\p{L}\s]/gu, '')
  },

  cpf(value: string) {
    return value
      .replace(/\D/g, '') // remove tudo que não for número
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  },

  time(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1:$2') 
      .slice(0, 5) 
  }
}
