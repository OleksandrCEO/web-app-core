import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth'

/** Wraps protected routes. Redirects to `/login` when no access token. */
export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
