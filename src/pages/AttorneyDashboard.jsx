import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LogOut,
  FileText,
  Clock,
  Search,
  XCircle,
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
  DialogFooter,
} from "../components/ui/dialog"
import { Skeleton } from "../components/ui/skeleton"
import { Input } from "../components/ui/input"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { clearAuth } from "@/features/auth/authSlice"
import Logo from "@/components/Logo"
import Footer from "@/components/Footer"
import { logoutApi } from "@/auth/api/authApi"
import { axiosProtected } from "@/auth/api/axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const AttorneyDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [cases, setCases] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCases, setFilteredCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  // For viewing case details
  const [selectedCase, setSelectedCase] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editStatus, setEditStatus] = useState("")
  const [editNotes, setEditNotes] = useState("")

  const refresh = useSelector((state) => state.auth.refreshToken)

  // Fetch cases
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true)
      try {
        const response = await axiosProtected.get("/attorney/bootstrap")
        setCases(response.data)
        setFilteredCases(response.data)
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

  // Search handler
  const handleSearch = () => {
    const filtered = cases.filter(
      (c) =>
        c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client_code?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCases(filtered)
  }

  // Open details popup
  const handleViewDetails = (case_) => {
    setSelectedCase(case_)
    setEditStatus(case_.case_status || "")
    setEditNotes(case_.notes || "")
    setIsDialogOpen(true)
  }

  // Update case
  const handleUpdateCase = async () => {
    if (!selectedCase) return
    setUpdating(true)
    try {
      const response = await axiosProtected.post(
        `/attorney/cases/${selectedCase.case_id}`,
        { case_status: editStatus, notes: editNotes }
      )
      toast.success("Case updated successfully")

      setCases((prev) =>
        prev.map((c) =>
          c.case_id === selectedCase.case_id
            ? { ...c, case_status: editStatus, notes: editNotes }
            : c
        )
      )
      setFilteredCases((prev) =>
        prev.map((c) =>
          c.case_id === selectedCase.case_id
            ? { ...c, case_status: editStatus, notes: editNotes }
            : c
        )
      )
      setIsDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update case")
    } finally {
      setUpdating(false)
    }
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
        <div className="flex justify-center gap-2 mb-10 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by client name or case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="default" className="gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
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
                className="p-6 shadow-elegant hover:shadow-lg transition-all"
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
                  <Badge variant="secondary">{case_.case_status}</Badge>
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
                  <p className="text-muted-foreground mt-1 line-clamp-2"> Notes: {case_.notes || "No notes added."} </p>
                </div>
                <Button
                  variant="default"
                  className="mt-5 w-full"
                  onClick={() => handleViewDetails(case_)}
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

      {/* Case Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>
              View and update case information.
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <div className="space-y-4 mt-4">
              <p>
                <strong>Client Name:</strong> {selectedCase.client_name}
              </p>
              <p>
                <strong>Client Code:</strong> {selectedCase.client_code}
              </p>
              <p>
                <strong>Case Type:</strong> {selectedCase.case_type}
              </p>

              {/* ✅ Case Status Select Box */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Case Status
                </label>
                <Select
                  value={editStatus}
                  onValueChange={(value) => setEditStatus(value)}
                >
                  <SelectTrigger className="w-full my-2">
                    <SelectValue placeholder="Select case status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Case Approved">Case Approved</SelectItem>
                    <SelectItem value="Case Signed">Case Signed</SelectItem>
                    <SelectItem value="Court Date Scheduled">Court Date Scheduled</SelectItem>
                    <SelectItem value="Documents Received">Documents Received</SelectItem>
                    <SelectItem value="Hearing Scheduled">Hearing Scheduled</SelectItem>
                    <SelectItem value="Insurance Contacted">Insurance Contacted</SelectItem>
                    <SelectItem value="Mediation Scheduled">Mediation Scheduled</SelectItem>
                    <SelectItem value="Pending Insurance Response">Pending Insurance Response</SelectItem>
                    <SelectItem value="Settlement Approved">Settlement Approved</SelectItem>
                    <SelectItem value="Treatment Scheduled">Treatment Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Field */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full border rounded-md p-2 bg-background my-2"
                  rows="4"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleUpdateCase}
              disabled={updating}
              variant="default"
            >
              {updating ? (
                <ImSpinner2 className="animate-spin h-5 w-5" />
              ) : (
                "Update Case"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AttorneyDashboard
