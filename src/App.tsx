import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ClientCodeEntry from "./pages/ClientCodeEntry";
import ClientStatusView from "./pages/ClientStatusView";
import AttorneyLogin from "./pages/AttorneyLogin";
import AttorneyDashboard from "./pages/AttorneyDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protectedRoute";
import AttorneySignup from "./pages/AttorneySignup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/client" element={<ClientCodeEntry />} />
          <Route path="/client/status/:code" element={<ClientStatusView />} />
          <Route path="/attorney/login" element={<AttorneyLogin />} />
          <Route path="/attorney/signup" element={<AttorneySignup />} />
          <Route path="/attorney/dashboard" element={<ProtectedRoute>
            <AttorneyDashboard />
          </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
