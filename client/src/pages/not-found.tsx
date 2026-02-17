import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white font-display">404 - LOST CONNECTION</h1>
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            The requested page has been disconnected from the server.
          </p>
          
          <div className="mt-6">
             <Link href="/">
               <Button className="w-full bg-primary hover:bg-red-600 font-bold tracking-widest text-white">
                 RETURN TO BASE
               </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
