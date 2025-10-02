import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scale, ArrowLeft, Mail, Lock, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"
import { toast } from "sonner"
import { api } from "../lib/api"
import { extractApiError } from "../lib/extractApiError"

const MIN_PASSWORD = 12 // mirrors backend minimumLength validator

const AttorneySignup = () => {
  const navigate = useNavigate()
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password_confirm, setPasswordConfirm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const validate = () => {
    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      !password_confirm
    ) {
      return "Please fill in all fields."
    }
    if (password.length < MIN_PASSWORD) {
      return `Password must be at least ${MIN_PASSWORD} characters.`
    }
    if (password !== password_confirm) {
      return "Passwords do not match."
    }
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError("")
    const v = validate()
    if (v) {
      setFormError(v)
      toast.error(v)
      return
    }

    setIsLoading(true)
    try {
      await api.post("/auth/register/", {
        username,
        email,
        password,
        password_confirm,
        first_name,
        last_name
      })

      toast.success("Account created. Please check your email to verify.")
      // Send them back to login so they can sign in after verifying
      navigate("/attorney/login", { replace: true })
    } catch (err) {
      const msg = extractApiError(err)
      setFormError(msg)
      toast.error(msg)
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight">
              LAW
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">
                Create Attorney Account
              </h2>
              <p className="text-muted-foreground">
                Sign up to access your attorney dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-base font-medium">
                    First name
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="Alex"
                    value={first_name}
                    onChange={e => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-base font-medium">
                    Last name
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Stone"
                    value={last_name}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="alex"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="lawyer@firm.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-11"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={`Min ${MIN_PASSWORD} characters`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-11"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password_confirm"
                  className="text-base font-medium"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password_confirm"
                    type="password"
                    placeholder="Re-enter password"
                    value={password_confirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="pl-11"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {formError ? (
                <p className="text-sm text-red-500">{formError}</p>
              ) : null}

              <Button
                type="submit"
                variant="legal"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/attorney/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Back to login
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AttorneySignup
