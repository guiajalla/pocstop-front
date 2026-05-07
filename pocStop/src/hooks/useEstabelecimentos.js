import { useState, useEffect, useCallback } from 'react'
import { listarEstabelecimentos } from '../services/api'

const CACHE_KEY = 'pocstop_estabelecimentos'
const CACHE_TTL_MS = 5 * 60 * 1000

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null
    return cache
  } catch {
    return null
  }
}

function saveCache(estabelecimentos, lastUpdate) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ estabelecimentos, lastUpdate, fetchedAt: Date.now() }))
  } catch {}
}

export function clearEstabelecimentosCache() {
  localStorage.removeItem(CACHE_KEY)
}

export function useEstabelecimentos() {
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (force = false) => {
    if (!force) {
      const cache = loadCache()
      if (cache) {
        setEstabelecimentos(cache.estabelecimentos)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    try {
      const data = await listarEstabelecimentos()
      setEstabelecimentos(data.estabelecimentos ?? [])
      saveCache(data.estabelecimentos ?? [], data.lastUpdate ?? null)
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const refresh = useCallback(() => {
    clearEstabelecimentosCache()
    return fetchData(true)
  }, [fetchData])

  return { estabelecimentos, loading, error, refresh }
}
