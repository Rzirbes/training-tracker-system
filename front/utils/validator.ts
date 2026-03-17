export const validator = { cpf, password, name, zipCode }

function password(password: string) {
  const minLength = /.{8,}/ // Pelo menos 8 caracteres
  const hasLetter = /[A-Za-z]/ // Pelo menos uma letra
  const hasDigit = /\d/ // Pelo menos um número
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/ // Pelo menos um caractere especial, incluindo ponto e vírgula

  if (!minLength.test(password)) return false
  if (!hasLetter.test(password)) return false
  if (!hasDigit.test(password)) return false
  if (!hasSpecialChar.test(password)) return false

  return password
}

function name(name: string) {
  if (!/\s+/.test(name)) return false
  if (name.split(' ').length < 2) false
  return name
}

function zipCode(zipCode: string): boolean {
  const regex = /^\d{5}-\d{3}$/
  return regex.test(zipCode)
}

function cpf(v: string): boolean {
  const value = v.replace(/\D/g, '')

  if (value.toString().length !== 11 || /^(\d)\1{10}$/.test(value)) return false

  let result = true

  ;[9, 10].forEach((d) => {
    let sum = 0
    let calc

    value
      .split(/(?=)/)
      .splice(0, d)
      .forEach(function (e, i) {
        sum += parseInt(e) * (d + 2 - (i + 1))
      })

    calc = sum % 11
    calc = calc < 2 ? 0 : 11 - calc

    if (calc !== parseInt(value.substring(d, d + 1))) result = false
  })

  return result
}
