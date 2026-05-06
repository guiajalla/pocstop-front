import { useState, useEffect } from 'react'
import { Global } from '@emotion/react'
import { useAuth } from '../context/AuthContext'
import { globalStyles, pageStyles, headerStyles, titleStyles, newBtnStyles, layoutStyles } from '../components/establishments/establishmentStyles'
import { emptyForm } from '../components/establishments/establishmentConstants'
import { FeedbackToast } from '../components/establishments/FeedbackToast'
import { EstablishmentTable } from '../components/establishments/EstablishmentTable'
import { EstablishmentForm } from '../components/establishments/EstablishmentForm'

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL
const OBRIGATORIOS = ['nome', 'cidade', 'redeSocial', 'endereco', 'bairro', 'latitude', 'longitude', 'categoriaPrincipal']

export const AdminEstabelecimentosPage = () => {
  const { user } = useAuth()

  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const [isNovo, setIsNovo] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => { carregarLista() }, [])

  const carregarLista = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/estabelecimentos`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setEstabelecimentos(data.items || [])
    } catch {
      setEstabelecimentos([])
    } finally {
      setLoading(false)
    }
  }

  const mostrarFeedback = (msg, tipo = 'ok') => {
    setFeedback({ msg, tipo })
    setTimeout(() => setFeedback(null), 3000)
  }

  const selecionarItem = (item) => {
    setIsNovo(false)
    setSelecionado(item)
  }

  const novoEstabelecimento = () => {
    setIsNovo(true)
    setSelecionado(null)
  }

  const salvar = async (status, form) => {
    if (status === 'aprovado' && !OBRIGATORIOS.every((f) => form[f]?.toString().trim())) {
      mostrarFeedback('Preencha todos os campos obrigatórios para aprovar.', 'erro')
      return
    }

    setSaving(true)
    try {
      const payload = {
        nome:                form.nome,
        cidade:              form.cidade,
        rede_social:         form.redeSocial,
        link_rede_social:    form.linkRedeSocial,
        sugerido_por:        form.sugeridoPor || user?.signInDetails?.loginId || '',
        endereco:            form.endereco,
        bairro:              form.bairro,
        pais:                form.pais,
        latitude:            parseFloat(form.latitude),
        longitude:           parseFloat(form.longitude),
        categoria_principal: form.categoriaPrincipal,
        categoria_secundaria:form.categoriaSecundaria,
        dono_lgbt:           form.donoLGBT,
        status,
        atualizado_por:      user?.signInDetails?.loginId || user?.username,
        updated_at:          new Date().toISOString(),
        ...(isNovo && { created_at: new Date().toISOString() }),
      }

      const method = selecionado ? 'PUT' : 'POST'
      const url = selecionado
        ? `${BASE_URL}/estabelecimentos/${selecionado.estabelecimento_id}`
        : `${BASE_URL}/estabelecimentos`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      const msgs = { aprovado: 'Estabelecimento aprovado e publicado!', rascunho: 'Rascunho salvo.', rejeitado: 'Estabelecimento rejeitado.' }
      mostrarFeedback(msgs[status] || 'Salvo.')
      await carregarLista()
      setSelecionado(null)
      setIsNovo(false)
    } catch {
      mostrarFeedback('Erro ao salvar. Tente novamente.', 'erro')
    } finally {
      setSaving(false)
    }
  }

  const listagem = estabelecimentos.filter((e) => {
    const matchFiltro = filtro === 'todos' || e.status === filtro
    const matchBusca  = !busca || [e.nome, e.cidade, e.sugerido_por].some((v) => v?.toLowerCase().includes(busca.toLowerCase()))
    return matchFiltro && matchBusca
  })

  const contagem = {
    todos:     estabelecimentos.length,
    pendente:  estabelecimentos.filter((e) => e.status === 'pendente').length,
    aprovado:  estabelecimentos.filter((e) => e.status === 'aprovado').length,
    rejeitado: estabelecimentos.filter((e) => e.status === 'rejeitado').length,
  }

  const initialFormValues = selecionado ? {
    nome:                selecionado.nome || '',
    cidade:              selecionado.cidade || '',
    redeSocial:          selecionado.rede_social || '',
    linkRedeSocial:      selecionado.link_rede_social || '',
    sugeridoPor:         selecionado.sugerido_por || '',
    endereco:            selecionado.endereco || '',
    bairro:              selecionado.bairro || '',
    pais:                selecionado.pais || 'Brasil',
    latitude:            selecionado.latitude || '',
    longitude:           selecionado.longitude || '',
    categoriaPrincipal:  selecionado.categoria_principal || '',
    categoriaSecundaria: selecionado.categoria_secundaria || '',
    donoLGBT:            selecionado.dono_lgbt || false,
  } : emptyForm()

  return (
    <>
      <Global styles={globalStyles} />
      <div css={pageStyles}>
        <FeedbackToast feedback={feedback} />

        <div css={headerStyles}>
          <h1 css={titleStyles}>Gerenciar Estabelecimentos</h1>
          <button css={newBtnStyles} onClick={novoEstabelecimento}>+ Novo estabelecimento</button>
        </div>

        <div css={layoutStyles}>
          <EstablishmentTable
            listagem={listagem}
            contagem={contagem}
            selecionado={selecionado}
            loading={loading}
            busca={busca}
            filtro={filtro}
            onBusca={setBusca}
            onFiltro={setFiltro}
            onSelect={selecionarItem}
          />
          <EstablishmentForm
            key={selecionado?.estabelecimento_id ?? (isNovo ? 'novo' : 'vazio')}
            initialValues={initialFormValues}
            isNovo={isNovo}
            selecionado={selecionado}
            saving={saving}
            onSave={salvar}
          />
        </div>
      </div>
    </>
  )
}
