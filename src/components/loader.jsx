import { useState, useEffect } from "react"
import { Scale, Shield, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"
import { useNavigate } from "react-router-dom"
import LawLoader from "./lawLoader"

const Landing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500) // simulate loading
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LawLoader />

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              Case Status Tracking
              <span className="block text-primary mt-2">Made Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure, efficient case management for law firms. Update case
              phases instantly, keep clients informed without the constant
              calls.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              variant="legal"
              size="lg"
              onClick={() => navigate("/client")}
              className="w-full sm:w-auto min-w-[240px]"
            >
              <Shield className="w-5 h-5" />
              Client Code Entry
            </Button>
            <Button
              variant="action"
              size="lg"
              onClick={() => navigate("/attorney/login")}
              className="w-full sm:w-auto min-w-[240px]"
            >
              <Scale className="w-5 h-5" />
              Attorney Login
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <Card className="p-6 shadow-elegant hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                Secure Access
              </h3>
              <p className="text-muted-foreground text-sm">
                Role-based authentication ensures only authorized personnel can
                update case information.
              </p>
            </Card>

            <Card className="p-6 shadow-elegant hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                Real-Time Updates
              </h3>
              <p className="text-muted-foreground text-sm">
                Clients receive instant status updates without lengthy phone
                calls or email chains.
              </p>
            </Card>

            <Card className="p-6 shadow-elegant hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                Case Tracking
              </h3>
              <p className="text-muted-foreground text-sm">
                Track all case phases from filing to resolution with complete
                transparency.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LAW Legal. All rights reserved.</p>
            <p className="mt-2">Secure case management for modern law firms.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
