// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export const salvarDadosUsuario = ({ userId, nome, dataNascimento, cidade, genero, orientacaoSexual }) => {
  const agora = new Date().toISOString()
  return req('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      name:               nome,
      gender:             genero,
      city:               cidade,
      sexual_orientation: orientacaoSexual,
      birth_date:         dataNascimento,
      user_type:          'user',
      created_at:         agora,
      last_update:        agora,
    }),
  })
}

export const buscarDadosUsuario = (userId) =>
  req(`/usuarios/${userId}`, { method: 'GET' })

export const criarEstabelecimento = (payload) =>
  req('/estabelecimentos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const atualizarEstabelecimento = (id, payload) =>
  req(`/estabelecimentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const listarEstabelecimentos = (status = 'todos') => {
  const qs = status !== 'todos' ? `?status=${status}` : ''
  return req(`/estabelecimentos${qs}`, { method: 'GET' })
}