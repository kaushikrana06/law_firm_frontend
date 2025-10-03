import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scale, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"
import { signup } from "@/auth/api/authApi"
import { toast } from "sonner"
import Logo from "@/components/Logo"

const MIN_PASSWORD = 8

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const handleSubmit = async (e) => {
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
      await signup({
        username,
        email,
        password,
        password_confirm,
        first_name,
        last_name,
      })

      toast.success("Account created! Please check your email to verify.")
      navigate("/attorney/signup", {
        replace: true,
        state: { message: "Please check your email and verify your account." },
      })
    } catch (err) {
      console.error("Signup failed:", err)
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Signup failed. Please try again."
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
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="h-12"
                    autoComplete="given-name"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Stone"
                    className="h-12"
                    autoComplete="family-name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alex"
                  autoComplete="username"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lawyer@firm.com"
                    className="pl-11 h-12"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={`Enter Password`}
                    className="pl-11 pr-10 h-12"
                    autoComplete="new-password"
                    disabled={isLoading}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="password_confirm">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={password_confirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="pl-11 pr-10 h-12"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Form Error */}
              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}

              {/* Submit Button */}
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

            {/* Footer */}
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
