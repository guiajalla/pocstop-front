import { useState, useEffect, useCallback } from 'react'
import { buscarSugestoesUsuario } from '../services/api'

const STATUS_MAP = {
  pendente:  'aguardando',
  rascunho:  'em_analise',
  aprovado:  'aprovada',
  rejeitado: 'recusada',
}

const normalizar = (item) => ({
  estabelecimento_id: item.estabelecimento_id,
  nome:               item.nome,
  cidade:             item.cidade,
  bairro:             item.bairro,
  tipo:               item.categoria_principal,
  status:             STATUS_MAP[item.status] || item.status,
  created_at:         item.created_at,
  observacao:         item.observacao ?? null,
})

const fetchCompleto = async (userId, cacheKey) => {
  const result = await buscarSugestoesUsuario(userId, false)
  const rawItems = result.sugestoes || []
  const maxUpdatedAt = rawItems.reduce(
    (max, s) => (s.updated_at > max ? s.updated_at : max),
    ''
  )
  const data = rawItems.map(normalizar)
  localStorage.setItem(cacheKey, JSON.stringify({ data, maxUpdatedAt }))
  return data
}

export const useSugestoesUsuario = (userId) => {
  const [sugestoes, setSugestoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!userId) return

    const cacheKey = `pocstop_sugestoes_${userId}`

    if (!forceRefresh) {
      const raw = localStorage.getItem(cacheKey)
      if (raw) {
        try {
          const cached = JSON.parse(raw)

          // Chamada leve: só o updated_at mais recente do servidor
          try {
            const check = await buscarSugestoesUsuario(userId, true)
            if (check.latest_updated_at <= (cached.maxUpdatedAt || '')) {
              // Nenhuma atualização desde o último cache
              setSugestoes(cached.data)
              return
            }
            // Há atualizações — busca lista completa silenciosamente (sem spinner)
            const data = await fetchCompleto(userId, cacheKey)
            setSugestoes(data)
            return
          } catch {
            // Falha na verificação — usa cache sem expor erro ao usuário
            setSugestoes(cached.data)
            return
          }
        } catch { /* cache corrompido, prossegue para fetch completo */ }
      }
    }

    // Sem cache ou forceRefresh: fetch completo com estado de loading
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCompleto(userId, cacheKey)
      setSugestoes(data)
    } catch {
      setError('Erro ao carregar sugestões. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => fetchData(true), [fetchData])

  return { sugestoes, loading, error, refresh }
}
