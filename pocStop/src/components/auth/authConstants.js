export const GENEROS = [
  'Homem cisgênero', 'Mulher cisgênero', 'Homem transgênero',
  'Mulher transgênero', 'Não-binário', 'Gênero fluido',
  'Agênero', 'Prefiro não informar', 'Outro',
]

export const ORIENTACOES = [
  'Heterossexual', 'Gay', 'Lésbica', 'Bissexual',
  'Pansexual', 'Assexual', 'Prefiro não informar', 'Outro',
]

export const checkPassword = (pwd) => ({
  length:  pwd.length >= 8,
  upper:   /[A-Z]/.test(pwd),
  lower:   /[a-z]/.test(pwd),
  number:  /[0-9]/.test(pwd),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
})
