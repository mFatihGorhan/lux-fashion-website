import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UserWithRole {
  id: string
  email: string
  name: string
  role: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user as UserWithRole | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAdmin: (session?.user as UserWithRole)?.role === 'ADMIN',
  }
}

export function useRequireAuth(redirectTo = '/admin/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}

export function useRequireAdmin(redirectTo = '/') {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push(redirectTo)
    }
  }, [isAdmin, isLoading, router, redirectTo])

  return { isAdmin: isAdmin as boolean, isLoading }
}