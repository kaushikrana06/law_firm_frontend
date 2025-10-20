import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scale, ArrowLeft, Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"
import { toast } from "sonner"
import Logo from "@/components/Logo"

const ClientCodeEntry = () => {
  const navigate = useNavigate()
  const [caseCode, setCaseCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!caseCode.trim()) {
      toast.error("Please enter your case code")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (caseCode.length >= 6) {
        navigate(`/client/status/${caseCode}`)
      } else {
        toast.error("Invalid case code. Please check and try again.")
      }
    }, 1000)
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Enter Your Case Code
              </h2>
              <p className="text-muted-foreground">
                Enter the unique code to view your
                case status
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="caseCode" className="text-base font-medium">
                  Case Code
                </Label>
                <Input
                  id="caseCode"
                  type="text"
                  placeholder="Enter your invite code"
                  value={caseCode}
                  onChange={e => setCaseCode(e.target.value.toUpperCase())}
                  className="h-12 text-center text-lg font-semibold tracking-widest"
                  disabled={isLoading}
                />
               
              </div>

              <Button
                type="submit"
                variant="action"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Access Case"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have a case code?{" "}
                <button
                  onClick={() =>
                    toast.info(
                      "Please contact your attorney to receive your case code"
                    )
                  }
                  className="text-primary hover:underline font-medium"
                >
                  Contact your attorney
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ClientCodeEntry
