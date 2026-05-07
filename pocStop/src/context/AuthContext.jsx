// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { Amplify } from 'aws-amplify'
import { signIn, signOut, signUp, confirmSignUp, resendSignUpCode, getCurrentUser, deleteUser } from 'aws-amplify/auth'
import { buscarDadosUsuario, atualizarDadosUsuario } from '../services/api'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? '',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? '',
      region: import.meta.env.VITE_AWS_REGION ?? 'sa-east-1',
    },
  },
})

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(async (u) => {
        setUser(u)

        // Tenta carregar perfil do localStorage antes de chamar a API
        const cached = localStorage.getItem('perfil')
        if (cached) {
          setPerfil(JSON.parse(cached))
        } else {
          try {
            const dados = await buscarDadosUsuario(u.userId)
            setPerfil(dados)
            localStorage.setItem('perfil', JSON.stringify(dados))
          } catch {
            setPerfil(null)
          }
        }
      })
      .catch(() => { setUser(null); setPerfil(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    await signIn({ username: email, password })
    const u = await getCurrentUser()
    setUser(u)
    try {
      const dados = await buscarDadosUsuario(u.userId)
      setPerfil(dados)
      localStorage.setItem('perfil', JSON.stringify(dados))
    } catch {
      setPerfil(null)
    }
  }

  const register = async (email, password) => {
    // Cognito recebe APENAS email e senha
    return signUp({
      username: email,
      password,
      options: {
        userAttributes: { email },
      },
    })
  }

  // Chamado se salvarDadosUsuario falhar — remove o usuário do Cognito
  // para manter consistência com o DynamoDB
  const confirm = async (email, code) => {
    return confirmSignUp({ username: email, confirmationCode: code })
  }

  const resendCode = async (email) => {
    return resendSignUpCode({ username: email })
  }

  const rollbackRegister = async (email, password) => {
    try {
      await signIn({ username: email, password })
      await deleteUser()
    } catch (e) {
      console.error('Erro no rollback do Cognito:', e)
    }
  }

  const atualizarPerfil = async (dados) => {
    await atualizarDadosUsuario(user.userId, dados)
    const atualizado = {
      ...perfil,
      name:               dados.nome,
      city:               dados.cidade,
      gender:             dados.genero,
      sexual_orientation: dados.orientacaoSexual,
      birth_date:         dados.dataNascimento,
      last_update:        new Date().toISOString(),
    }
    setPerfil(atualizado)
    localStorage.setItem('perfil', JSON.stringify(atualizado))
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setPerfil(null)
    localStorage.removeItem('perfil')
  }

  // Admin é identificado pelo user_type 'poc_admin' no DynamoDB
  const isAdmin = perfil?.user_type === 'poc_admin'

  return (
    <AuthContext.Provider value={{ user, perfil, loading, isAdmin, login, register, confirm, resendCode, rollbackRegister, logout, atualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}