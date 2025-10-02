import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProfile } from "../store/authSlice"
import { loadRefresh } from "../lib/api"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const { user, status } = useSelector(s => s.auth)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      // If we already have a user, we're good.
      if (user) {
        setBootstrapped(true)
        return
      }

      // If there’s a refresh token, try to recover the session via /auth/profile
      if (loadRefresh()) {
        try {
          await dispatch(fetchProfile()).unwrap()
        } catch {
          // ignore — redirect will happen below if still no user
        }
      }

      if (!cancelled) setBootstrapped(true)
    }

    bootstrap()
    return () => {
      cancelled = true
    }
    // run once on mount; fetching happens only if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Show a tiny "checking session" state while we try to hydrate
  if (!bootstrapped || status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Checking session…</span>
        </div>
      </div>
    )
  }

  // If, after bootstrapping, we still don't have a user → go to login
  if (!user) {
    return <Navigate to="/attorney/login" replace />
  }

  return children
}
