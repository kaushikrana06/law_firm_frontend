import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const AttorneyInvalidVerify = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
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
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-red-600 text-muted-foreground">
                Sorry, the email verification token has expired. Please register and try again.
              </h3>
        
              <Button
                onClick={() => navigate("/attorney/signup")}
                variant="legal"
                className="w-full"
              >
                Go to Signup
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AttorneyInvalidVerify;
