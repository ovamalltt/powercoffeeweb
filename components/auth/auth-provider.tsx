"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { Karyawan } from "@/lib/supabase/types"

interface AuthContextType {
  user: User | null
  karyawan: Karyawan | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  karyawan: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchKaryawan(session.user.id)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchKaryawan(session.user.id)
      } else {
        setKaryawan(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchKaryawan = async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("karyawan")
      .select(
        `
        *,
        jabatan:jabatan(*)
      `,
      )
      .eq("user_id", userId)
      .single()

    setKaryawan(data)
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setKaryawan(null)
  }

  return <AuthContext.Provider value={{ user, karyawan, isLoading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
