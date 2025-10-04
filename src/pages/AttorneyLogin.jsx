import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Scale, ArrowLeft, Mail, Lock, Info, Eye, EyeOff } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { login } from "@/auth/api/authApi"
import { setCredentials } from "@/features/auth/authSlice"
import Logo from "@/components/Logo"

const AttorneyLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const [redirectMessage, setRedirectMessage] = useState(location.state?.message || "")

  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message)

      window.history.replaceState({}, document.title)

      const timer = setTimeout(() => {
        setRedirectMessage("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!email || !password) {
      const msg = "Please fill in all fields"
      setFormError(msg)
      toast.error(msg)
      return
    }

    setIsLoading(true)
    try {
      const res = await login({ email, password })
      dispatch(setCredentials({ access: res.access, refresh: res.refresh, user: res.user || null }))
      navigate("/attorney/dashboard")
      toast.success("Login successful!")
    } catch (err) {
      console.error("Login failed:", err)
      const msg = "Something went wrong"
      setFormError(err?.response?.data?.error?.message || msg)
      toast.error(err?.response?.data?.error?.message || msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Redirect Message Banner */}
      {redirectMessage && (
        <div className="fixed top-5 right-5 animate-slide-in animate-pulse">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg w-80 relative overflow-hidden">
            <p className="font-semibold">{redirectMessage || "Please Check your mail and verify."}</p>
            <div className="absolute bottom-0 left-0 h-1 bg-yellow-400 animate-timeline"></div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">Attorney Login</h2>
              <p className="text-muted-foreground">Access your dashboard to manage cases</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email <span className="text-sm text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password <span className="text-sm text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button
                type="submit"
                variant="legal"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              {/* <p className="text-sm text-muted-foreground">
                Forgot your password?{" "}
                <button
                  onClick={() => toast.info("Please contact your administrator")}
                  className="text-primary hover:underline font-medium"
                >
                  Contact admin
                </button>
              </p> */}
              <p className="text-sm text-muted-foreground">
                New here?{" "}
                <button
                  onClick={() => navigate("/attorney/signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Create an account
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AttorneyLogin
