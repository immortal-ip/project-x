import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Login() {
  useEffect(() => {
    // Redirect to the Replit Auth API endpoint
    window.location.href = "/api/login";
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-6">CONNECTING TO SERVER...</h1>
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
        <p className="text-zinc-500 max-w-md mx-auto">
          Redirecting you to secure login provider. Please wait.
        </p>
      </div>
      
      {/* Fallback button if redirect fails */}
      <Button 
        onClick={() => window.location.href = "/api/login"}
        className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white"
      >
        Click here if not redirected
      </Button>
    </div>
  );
}
