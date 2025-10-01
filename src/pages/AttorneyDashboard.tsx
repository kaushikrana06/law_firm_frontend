import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, LogOut, Plus, Search, Filter, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ThemeToggle } from "../components/ThemeToggle";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const AttorneyDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock cases data
  const [cases] = useState([
    {
      id: "CASE001",
      clientName: "John Doe",
      caseType: "Civil Litigation",
      status: "Discovery Phase",
      lastUpdated: "2025-03-15",
      nextAction: "Deposition scheduled",
    },
    {
      id: "CASE002",
      clientName: "Jane Smith",
      caseType: "Family Law",
      status: "Mediation",
      lastUpdated: "2025-03-14",
      nextAction: "Settlement review",
    },
    {
      id: "CASE003",
      clientName: "Robert Johnson",
      caseType: "Criminal Defense",
      status: "Trial Preparation",
      lastUpdated: "2025-03-13",
      nextAction: "Witness prep",
    },
    {
      id: "CASE004",
      clientName: "Maria Garcia",
      caseType: "Immigration",
      status: "Document Review",
      lastUpdated: "2025-03-12",
      nextAction: "File submission",
    },
  ]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/attorney/login");
  };

  const getStatusColor = (status: string): "default" | "secondary" | "outline" => {
    const colors: Record<string, "default" | "secondary" | "outline"> = {
      "Discovery Phase": "secondary",
      "Mediation": "default",
      "Trial Preparation": "default",
      "Document Review": "secondary",
    };
    return colors[status] || "outline";
  };

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif tracking-tight">LAW</h1>
                <p className="text-xs text-muted-foreground">Attorney Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold mb-2">Case Dashboard</h2>
          <p className="text-muted-foreground">Manage and track all your active cases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
                <p className="text-3xl font-bold">{cases.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6 shadow-elegant">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by case number or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Discovery Phase">Discovery Phase</SelectItem>
                <SelectItem value="Mediation">Mediation</SelectItem>
                <SelectItem value="Trial Preparation">Trial Preparation</SelectItem>
                <SelectItem value="Document Review">Document Review</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="action" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif">Create New Case</DialogTitle>
                  <DialogDescription>
                    Add a new case to your dashboard
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" placeholder="Enter client name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseType">Case Type</Label>
                    <Input id="caseType" placeholder="e.g., Civil Litigation" />
                  </div>
                  <Button variant="legal" className="w-full" onClick={() => toast.success("Case created successfully!")}>
                    Create Case
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.map((case_) => (
            <Card key={case_.id} className="p-6 shadow-elegant hover:shadow-lg transition-smooth cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-1">{case_.clientName}</h3>
                      <p className="text-sm text-muted-foreground">Case #{case_.id}</p>
                    </div>
                    <Badge variant={getStatusColor(case_.status)} className="ml-2">
                      {case_.status}
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{case_.caseType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="font-medium">{case_.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Next action:</span>
                    <span className="text-sm font-medium text-primary">{case_.nextAction}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="default" size="sm">Update Status</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <Card className="p-12 text-center shadow-elegant">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">No cases found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AttorneyDashboard;
