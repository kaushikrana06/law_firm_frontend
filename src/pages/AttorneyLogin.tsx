// src/pages/AttorneyLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/ThemeToggle";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { attorneyLogin } from "../store/authSlice"; // thunk that handles tokens & user
import { extractApiError } from "../lib/extractApiError";

const AttorneyLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // or useDispatch<AppDispatch>()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      const msg = "Please fill in all fields";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    try {
      const action = await (dispatch as any)(attorneyLogin({ email, password }));

      if (attorneyLogin.fulfilled.match(action)) {
        toast.success("Login successful");
        navigate("/attorney/dashboard");
      } else {
        const msg =
          action.payload ||
          action.error?.message ||
          "Login failed";
        setFormError(String(msg));
        toast.error(String(msg));
      }
    } catch (err: any) {
      const msg = extractApiError(err) ? extractApiError(err) : "Login failed";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight">LAW</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">Attorney Login</h2>
              <p className="text-muted-foreground">Access your dashboard to manage cases</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

              <Button
                type="submit"
                variant="legal"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Forgot your password?{" "}
                <button
                  onClick={() => toast.info("Please contact your administrator")}
                  className="text-primary hover:underline font-medium"
                >
                  Contact admin
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AttorneyLogin;
