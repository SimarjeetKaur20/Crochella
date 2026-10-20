import { Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = localStorage.getItem('crochella-admin-auth') === 'true'
  if (!isAuth) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
