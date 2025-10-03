import { useEffect, useState } from "react";

const Loader = ({ fullScreen = true }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 -m-4 rounded-full border-4 border-primary/20 animate-spin" 
               style={{ animationDuration: "3s" }} />
          
          {/* Inner pulsing ring */}
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-accent/30 animate-pulse" />
          
          {/* Logo text */}
          <div className="relative">
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              GIDES
            </h1>
          </div>
          
          {/* Center glow effect */}
          <div className="absolute inset-0 -z-10 blur-xl opacity-30 bg-gradient-to-br from-primary to-accent animate-pulse" />
        </div>

        {/* Loading text */}
        <div className="flex items-center space-x-1 text-muted-foreground">
          <span className="text-sm font-medium">Loading</span>
          <span className="text-sm font-medium w-6">{dots}</span>
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-[slide-in-right_1.5s_ease-in-out_infinite]" 
               style={{ width: "40%" }} />
        </div>
      </div>
    </div>
  );
};

export default Loader;