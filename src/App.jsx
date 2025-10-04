
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import ClientCodeEntry from "./pages/ClientCodeEntry";
import ClientStatusView from "./pages/ClientStatusView";
import AttorneyLogin from "./pages/AttorneyLogin";
import AttorneySignup from "./pages/AttorneySignup";
import AttorneyDashboard from "./pages/AttorneyDashboard";
import NotFound from "./pages/NotFound";
import RequireAuth from "./routes/RequireAuth";
import useBootstrapAuth from "./hooks/useBootstrapAuth";
import { Toaster } from "./components/ui/sonner";
import AttorneySuccessVerify from "./pages/AttorneySuccessVerify";
import AttorneyInvalidVerify from "./pages/AttorneyInvalidVerify";
import SignupSuccess from "./pages/SignupSuccess";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useBootstrapAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/client" element={<ClientCodeEntry />} />
            <Route path="/client/status/:code" element={<ClientStatusView />} />
            <Route path="/attorney/login" element={<AttorneyLogin />} />
            <Route path="/success" element={<AttorneySuccessVerify />} />
            <Route path="/invalid" element={<AttorneyInvalidVerify />} />
            <Route path="/attorney/signup-success" element={<SignupSuccess />} />
            <Route path="/attorney/signup" element={<AttorneySignup />} />
            <Route element={<RequireAuth />}>
              <Route path="/attorney/dashboard" element={<AttorneyDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;