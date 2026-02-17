import { Tournament } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, ChevronRight, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
}

export function TournamentCard({ tournament, index }: TournamentCardProps) {
  const statusColors = {
    upcoming: "bg-blue-600",
    live: "bg-red-600 animate-pulse",
    ended: "bg-zinc-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,0,0,0.2)]">
        {/* Image Area */}
        <div className="relative h-48 overflow-hidden bg-zinc-950">
          <div className="absolute top-0 right-0 z-10 p-3">
             <Badge className={`${statusColors[tournament.status as keyof typeof statusColors]} font-bold tracking-widest uppercase border-0 shadow-lg`}>
               {tournament.status}
             </Badge>
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-80" />
          
          <img 
            src={tournament.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"} 
            alt={tournament.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          />
          
          {/* Game Badge Floating */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-sm border-l-2 border-primary">
              <span className="text-white text-xs font-bold font-gaming tracking-widest uppercase flex items-center gap-1">
                <Gamepad2 size={12} className="text-primary" />
                {tournament.game}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
              {tournament.title}
            </h3>
            <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
              {tournament.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded">
              <Trophy className="text-yellow-500 w-4 h-4" />
              <span className="font-gaming font-bold tracking-wider">{tournament.prizePool}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded">
              <Calendar className="text-primary w-4 h-4" />
              <span className="font-gaming">{format(new Date(tournament.startDate), "MMM d, HH:mm")}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Link href={`/tournaments/${tournament.id}`} className="w-full">
            <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-white border border-white/10 hover:border-primary group-hover:bg-primary transition-all duration-300 font-bold tracking-widest clip-path-slant">
              ENTER ARENA <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
