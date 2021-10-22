import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services";

interface IUser {
  id: string
  name: string
  login: string
  avatar_url: string
}

interface AuthContextData {
  user: IUser | null
  signInUrl: string
  signOut(): void
}

interface IAuthResponse {
  token: string
  user: {
    id: string
    name: string
    avatar_url: string
    login: string
  }
}

export const AuthContext = createContext({} as AuthContextData)

interface AutProvider {
  children: ReactNode
}

export function AuthProvider({ children }: AutProvider){

  const [user, setUser] = useState<IUser | null>(null)
  const signInUrl = 'https://github.com/login/oauth/authorize?scope=user&client_id=be8ad54eb2b9de2845df'

  const signIn = async (githubcode: string) => {
    try {
      const response = await api.post<IAuthResponse>('/authenticate', {
        code: githubcode
      })
  
      const { token, user } = response.data
      localStorage.setItem('@dowhile:token', token)
      api.defaults.headers.common.authorization = `Bearer ${token}`
  
      setUser(user)
    } catch (error) {
      setUser(null)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    (async function (){
      const token = localStorage.getItem('@dowhile:token')
      api.defaults.headers.common.authorization = `Bearer ${token}`

      if(token) {
        try {
          const { data } = await api.get<IUser>('/user/profile')
          setUser(data)
        } catch (error) {
          setUser(null)
          localStorage.removeItem('@dowhile:token')
        }
      }
    })()
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes('?code=')

    if(hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
    
      window.history.pushState({}, '', urlWithoutCode)
      signIn(githubCode)
    }
  }, [])

  return(
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}