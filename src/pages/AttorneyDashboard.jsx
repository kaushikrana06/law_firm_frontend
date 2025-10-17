import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LogOut,
  FileText,
  Clock,
  Search,
} from "lucide-react"
import { ImSpinner2 } from "react-icons/im"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ThemeToggle } from "../components/ThemeToggle"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../components/ui/dialog"
import { Skeleton } from "../components/ui/skeleton"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { clearAuth } from "@/features/auth/authSlice"
import Logo from "@/components/Logo"
import Footer from "@/components/Footer"
import { logoutApi } from "@/auth/api/authApi"
import { axiosProtected } from "@/auth/api/axios"

const AttorneyDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [cases, setCases] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const refresh = useSelector((state) => state.auth.refreshToken)

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true)
      try {
        const response = await axiosProtected.get("/attorney/bootstrap")
        setCases(response.data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to load cases")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [])

  const handleLogout = async () => {
    if (logoutLoading) return
    setLogoutLoading(true)
    try {
      await logoutApi(refresh)
      dispatch(clearAuth())
      toast.success("Logged out successfully")
      navigate("/attorney/login", { replace: true })
    } catch {
      dispatch(clearAuth())
      navigate("/attorney/login", { replace: true })
    } finally {
      setLogoutLoading(false)
      setLogoutOpen(false)
    }
  }

  const filteredCases = cases.filter(
    (c) =>
      c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    const map = {
      "Court Date Scheduled": "default",
      "Under Review": "secondary",
      "Discovery Phase": "outline",
    }
    return map[status] || "secondary"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    You will be logged out of your account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="action"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    {logoutLoading ? (
                      <ImSpinner2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Log out"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
            Attorney Case Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor, manage, and track your ongoing cases in real-time.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client name or case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-md" />
              </Card>
            ))}
          </div>
        ) : filteredCases.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <Card
                key={case_.case_id}
                className="p-6 shadow-elegant hover:shadow-lg transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {case_.client_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Case #{case_.client_code}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(case_.case_status)}>
                    {case_.case_status}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-medium">{case_.case_type}</span>
                  </p>
                  <p>
                    <Clock className="inline w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Last update: </span>
                    <span className="font-medium">
                      {new Date(case_.last_update).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-1 line-clamp-2">
                    Notes: {case_.notes || "No notes added."}
                  </p>
                </div>
                <Button
                  variant="default"
                  className="mt-5 w-full"
                  onClick={() => navigate(`/attorney/case/${case_.case_id}`)}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center shadow-elegant">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No cases found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or come back later.
            </p>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default AttorneyDashboard
