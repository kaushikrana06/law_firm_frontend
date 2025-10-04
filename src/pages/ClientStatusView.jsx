import { useParams, useNavigate } from "react-router-dom"
import {
  Scale,
  ArrowLeft,
  Calendar,
  FileText,
  User,
  CheckCircle2
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"
import { Badge } from "../components/ui/badge"
import Logo from "@/components/Logo"
import Footer from "@/components/Footer"

const ClientStatusView = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  const caseData = {
    caseNumber: code,
    clientName: "John Doe",
    caseType: "Civil Litigation",
    filingDate: "January 15, 2025",
    currentStatus: "Discovery Phase",
    lastUpdated: "March 15, 2025",
    attorney: "Sarah Johnson, Esq.",
    phases: [
      { name: "Case Filed", status: "completed", date: "Jan 15, 2025" },
      { name: "Initial Review", status: "completed", date: "Jan 22, 2025" },
      { name: "Discovery Phase", status: "active", date: "Feb 1, 2025" },
      { name: "Mediation", status: "pending", date: "TBD" },
      { name: "Trial", status: "pending", date: "TBD" }
    ]
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/client")}
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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Case Header */}
          <Card className="p-6 shadow-elegant">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl  font-bold mb-2">
                  Case Status
                </h2>
                <p className="text-muted-foreground">
                  Case #{caseData.caseNumber}
                </p>
              </div>
              <Badge className="w-fit gradient-secondary text-secondary-foreground font-semibold px-4 py-2 text-sm">
                {caseData.currentStatus}
              </Badge>
            </div>
          </Card>

          {/* Case Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 shadow-elegant">
              <div className="flex md:flex-row flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Client Name</h3>
                  <p className="text-muted-foreground">{caseData.clientName}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-elegant">
              <div className="flex md:flex-row flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Case Type</h3>
                  <p className="text-muted-foreground">{caseData.caseType}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-elegant">
              <div className="flex md:flex-row flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Filing Date</h3>
                  <p className="text-muted-foreground">{caseData.filingDate}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-elegant">
              <div className="flex md:flex-row flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Attorney</h3>
                  <p className="text-muted-foreground">{caseData.attorney}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Case Timeline */}
          <Card className="p-6 shadow-elegant">
            <h3 className="text-2xl font-bold mb-6">
              Case Progress
            </h3>
            <div className="space-y-4">
              {caseData.phases.map((phase, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {phase.status === "completed" ? (
                      <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    ) : phase.status === "active" ? (
                      <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full gradient-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-border bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 pb-8 border-l-2 border-border ml-4 pl-6 -mt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-lg">{phase.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {phase.date}
                        </p>
                      </div>
                      <Badge
                        variant={
                          phase.status === "completed"
                            ? "secondary"
                            : phase.status === "active"
                              ? "default"
                              : "outline"
                        }
                        className="w-fit"
                      >
                        {phase.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted-foreground">
            Last updated: {caseData.lastUpdated}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ClientStatusView
