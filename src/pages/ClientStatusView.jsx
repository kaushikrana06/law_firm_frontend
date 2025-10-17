import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Scale,
  ArrowLeft,
  Calendar,
  FileText,
  Phone,
  Mail,
  Building2,
  ClipboardList
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"
import { Badge } from "../components/ui/badge"
import Logo from "@/components/Logo"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import { axiosPublic } from "@/auth/api/axios"
import { toast } from "sonner"

const ClientStatusView = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const res = await axiosPublic.post(`/client/lookup`, { code })
        setClientData(res.data)
      } catch (err) {
        toast.error(err.response.data.detail)
      } finally {
        setLoading(false)
      }
    }
    fetchClientData()
  }, [code])

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

      {/* Main */}
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Client Overview */}
          <Card className="p-8 shadow-elegant relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-r from-primary to-secondary" />

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {clientData?.name || "N/A"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  Client Code:{" "}
                  <span className="font-semibold">{clientData?.code}</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{clientData?.email || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{clientData?.phone || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium line-clamp-2">
                        {clientData?.notes || "No notes available"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Case Details */}
          <Card className="p-8 shadow-elegant">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" /> Case Details
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : clientData?.cases?.length > 0 ? (
              <div className="grid gap-6">
                {clientData.cases.map((c, i) => (
                  <Card
                    key={i}
                    className="p-6 border-l-4 border-primary transition hover:shadow-lg bg-card/60 backdrop-blur"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-xl mb-2">
                          {c.case_type}
                        </h4>
                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> {c.firm_name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />{" "}
                            Opened:{" "}
                            {c.date_opened
                              ? new Date(c.date_opened).toLocaleDateString()
                              : "—"}
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />{" "}
                            Last Update:{" "}
                            {c.last_update
                              ? new Date(c.last_update).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="gradient-secondary text-secondary-foreground px-4 py-2 text-sm font-semibold flext items-center cursor-default"
                      >
                        {c.case_status}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No case records available.
              </p>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ClientStatusView
