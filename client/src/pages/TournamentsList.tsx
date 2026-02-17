import { Navbar } from "@/components/Navbar";
import { useTournaments } from "@/hooks/use-tournaments";
import { TournamentCard } from "@/components/TournamentCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type FilterStatus = "all" | "upcoming" | "live" | "ended";

export default function TournamentsList() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  
  // Pass filter to hook if it's not "all"
  const apiFilter = filter === "all" ? undefined : filter;
  const { data: tournaments, isLoading } = useTournaments(apiFilter);

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "ALL EVENTS", value: "all" },
    { label: "UPCOMING", value: "upcoming" },
    { label: "LIVE NOW", value: "live" },
    { label: "COMPLETED", value: "ended" },
  ];

  return (
    <div className="min-h-screen bg-background text-white font-body">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 text-glow">
            TOURNAMENT <span className="text-primary">ARENA</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Choose your battleground. Register for upcoming events and compete for massive prize pools.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((f) => (
            <Button
              key={f.value}
              onClick={() => setFilter(f.value)}
              variant="outline"
              className={cn(
                "border-white/10 font-gaming tracking-widest text-lg px-8 py-6 clip-path-button transition-all duration-300",
                filter === f.value 
                  ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]" 
                  : "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-zinc-500 font-gaming tracking-widest animate-pulse">SYNCING BATTLE DATA...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments?.map((t, i) => (
              <TournamentCard key={t.id} tournament={t} index={i} />
            ))}
            
            {!tournaments?.length && (
              <div className="col-span-full py-20 text-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg">
                <h3 className="text-2xl font-display text-zinc-500">No tournaments found</h3>
                <p className="text-zinc-600 mt-2">Try changing the filter or check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
