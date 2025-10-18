import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LogOut,
  FileText,
  Clock,
  Search,
  XCircle,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Share2,
  PencilLine,
  NotebookPen,
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
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="h-6 w-px bg-border/60 mx-2"></div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-8 w-px bg-border/40"></div>
            <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/95 backdrop-blur-md border-border/50 sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Confirm Logout
                  </DialogTitle>
                  <DialogDescription>
                    You will be logged out of your account and redirected to the login page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setLogoutOpen(false)}>
                    Cancel
                  </Button>
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

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Premium Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Case Management</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Attorney Case Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Monitor, manage, and track your ongoing cases with precision and clarity.
          </p>
        </div>

        {/* Enhanced Search & Filter Bar */}
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

        {/* Enhanced Cases Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4 rounded-2xl border-border/40 overflow-hidden">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                  <Skeleton className="h-4 w-2/3 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl mt-4" />
              </Card>
            ))}
          </div>
        ) : filteredCases.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <Card
                key={case_.case_id}
                className="group relative p-6 rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm cursor-pointer overflow-hidden"
              >
                {/* Background accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {case_.client_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      #{case_.client_code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-lg px-2 py-1 text-xs">
                      {case_.case_status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium text-foreground">Type:</span>
                    <span>{case_.case_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-foreground">Updated:</span>
                    <span>{new Date(case_.last_update).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <NotebookPen className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    <p className="font-normal text-foreground">Notes:</p>
                    <div className="flex-1">
                      <p
                        className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all"
                        title={case_.notes || "No notes added for this case."}
                      >
                        {case_.notes || "No notes added for this case."}
                      </p>
                    </div>
                  </div>
                </div>


                <Button
                  variant="default" className="mt-5 w-full"
                  onClick={() => handleViewDetails(case_)}
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No cases found</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Try adjusting your search criteria or check back later for new cases.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchTerm(''); setFilteredCases(cases) }}
              className="rounded-xl gap-2 border-border/50"
            >
              <XCircle className="w-4 h-4" />
              Clear search
            </Button>
          </Card>
        )}
      </main>

      <Footer />

      {/* Enhanced Case Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] bg-background/95 backdrop-blur-md border-border/50 rounded-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Case Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Review and update case information with real-time synchronization.
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <div className="space-y-6 mt-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Client Name</label>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <p className="font-medium">{selectedCase.client_name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Client Code</label>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30 font-mono">
                    <p>{selectedCase.client_code}</p>
                  </div>
                </div>
              </div>

              {/* Case Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Case Type</label>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="font-medium">{selectedCase.case_type}</p>
                </div>
              </div>

              {/* Case Status Select */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Case Status</label>
                <Select
                  value={editStatus}
                  onValueChange={(value) => setEditStatus(value)}
                >
                  <SelectTrigger className="w-full h-12 rounded-xl border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Select case status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="Case Approved" className="rounded-lg">Case Approved</SelectItem>
                    <SelectItem value="Case Signed" className="rounded-lg">Case Signed</SelectItem>
                    <SelectItem value="Court Date Scheduled" className="rounded-lg">Court Date Scheduled</SelectItem>
                    <SelectItem value="Documents Received" className="rounded-lg">Documents Received</SelectItem>
                    <SelectItem value="Hearing Scheduled" className="rounded-lg">Hearing Scheduled</SelectItem>
                    <SelectItem value="Insurance Contacted" className="rounded-lg">Insurance Contacted</SelectItem>
                    <SelectItem value="Mediation Scheduled" className="rounded-lg">Mediation Scheduled</SelectItem>
                    <SelectItem value="Pending Insurance Response" className="rounded-lg">Pending Insurance Response</SelectItem>
                    <SelectItem value="Settlement Approved" className="rounded-lg">Settlement Approved</SelectItem>
                    <SelectItem value="Treatment Scheduled" className="rounded-lg">Treatment Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Field */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Case Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full min-h-[120px] border border-border/50 rounded-xl p-4 bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Add case notes, observations, or important details..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl h-12 px-6 border-border/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCase}
              disabled={updating}
              variant="default"
              className="rounded-xl h-12 px-8 gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {updating ? (
                <>
                  <ImSpinner2 className="animate-spin h-4 w-4" />
                  Updating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Update Case
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttorneyDashboard