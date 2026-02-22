import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTournaments } from "@/hooks/use-tournaments";
import { TournamentCard } from "@/components/TournamentCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Tournaments() {
  const { data: tournaments, isLoading } = useTournaments();
  const [filter, setFilter] = useState<"All" | "Upcoming" | "Ongoing" | "Completed">("All");

  const filteredTournaments = tournaments?.filter(t => 
    filter === "All" ? true : t.status === filter
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-4 uppercase">
              Tournaments
            </h1>
            <p className="text-gray-400 max-w-xl">
              Compete in high-stakes tournaments. Prove your skills and win big.
            </p>
          </div>
          
          <div className="flex gap-2">
            {["All", "Upcoming", "Ongoing", "Completed"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status as any)}
                className={`uppercase tracking-wider font-bold text-xs ${
                  filter === status 
                    ? "bg-primary text-white border-primary" 
                    : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
            
            {filteredTournaments.length === 0 && (
              <div className="col-span-full py-20 text-center bg-secondary/20 rounded-xl border border-dashed border-white/10">
                <p className="text-gray-500">No tournaments found in this category.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
