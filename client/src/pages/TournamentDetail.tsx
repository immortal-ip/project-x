import { useParams, Link } from "wouter";
import { useTournament } from "@/hooks/use-tournaments";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, Users, Share2, ArrowLeft, Gamepad2, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function TournamentDetail() {
  const { id } = useParams();
  const { data: tournament, isLoading } = useTournament(Number(id));

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-bold text-red-500">TOURNAMENT NOT FOUND</h1>
        <Link href="/tournaments">
          <Button variant="link" className="text-white mt-4">Return to Arena</Button>
        </Link>
      </div>
    );
  }

  const isRegistrationOpen = tournament.status === "upcoming";

  return (
    <div className="min-h-screen bg-background text-white font-body selection:bg-primary">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-background z-10" />
        <img 
          src={tournament.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"} 
          alt={tournament.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-32 bg-gradient-to-t from-background to-transparent">
          <div className="container mx-auto px-4">
            <Link href="/tournaments">
              <Button variant="ghost" className="text-zinc-400 hover:text-white mb-6 p-0 hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO LIST
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary hover:bg-red-600 text-white font-bold tracking-widest px-3 py-1">
                    {tournament.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white font-gaming tracking-widest">
                    {tournament.game}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-none text-glow uppercase">
                  {tournament.title}
                </h1>
              </div>

              {/* Action Box */}
              <div className="md:text-right">
                {isRegistrationOpen && tournament.registrationLink ? (
                   <a href={tournament.registrationLink} target="_blank" rel="noopener noreferrer">
                     <Button size="lg" className="bg-primary hover:bg-red-600 text-white font-display text-2xl px-10 py-8 clip-path-button shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-pulse hover:animate-none transition-all">
                       REGISTER NOW
                     </Button>
                   </a>
                ) : (
                  <Button size="lg" disabled className="bg-zinc-800 text-zinc-500 font-display text-xl px-10 py-8 cursor-not-allowed">
                    REGISTRATION CLOSED
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-xs font-gaming tracking-widest uppercase">Prize Pool</span>
              <div className="flex items-center gap-2 text-xl font-bold font-display text-yellow-500">
                <Trophy size={20} /> {tournament.prizePool}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-xs font-gaming tracking-widest uppercase">Start Date</span>
              <div className="flex items-center gap-2 text-xl font-bold font-display text-white">
                <Calendar size={20} /> {format(new Date(tournament.startDate), "dd MMM")}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-xs font-gaming tracking-widest uppercase">Time</span>
              <div className="flex items-center gap-2 text-xl font-bold font-display text-white">
                <Clock size={20} /> {format(new Date(tournament.startDate), "HH:mm")}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-xs font-gaming tracking-widest uppercase">Format</span>
              <div className="flex items-center gap-2 text-xl font-bold font-display text-white">
                <Users size={20} /> {tournament.format}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-display font-bold mb-4 border-l-4 border-primary pl-4">ABOUT THIS EVENT</h3>
            <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
              <p className="whitespace-pre-wrap leading-relaxed">{tournament.description}</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-display font-bold mb-4 border-l-4 border-primary pl-4">RULES & FORMAT</h3>
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 space-y-4 text-zinc-400">
              <p>• All participants must be present 15 minutes before start time.</p>
              <p>• Use of hacks, scripts, or third-party tools will result in immediate disqualification.</p>
              <p>• Screenshots of final scores must be submitted in the Discord server.</p>
              <p>• {tournament.format} mode - standard competitive ruleset applies.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
             <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
               <Share2 size={18} className="text-primary" /> SHARE EVENT
             </h3>
             <div className="flex gap-2">
               <Button variant="outline" className="flex-1 bg-transparent border-zinc-700 hover:bg-white/5">Copy Link</Button>
               <Button variant="outline" className="flex-1 bg-transparent border-zinc-700 hover:bg-white/5">Twitter</Button>
             </div>
           </div>

           <div className="bg-gradient-to-br from-primary/20 to-zinc-900 border border-primary/30 p-6 rounded-xl relative overflow-hidden">
             <div className="absolute -right-10 -top-10 text-primary/10 rotate-12">
               <Gamepad2 size={150} />
             </div>
             <h3 className="text-xl font-display font-bold mb-2 relative z-10">NEED A SQUAD?</h3>
             <p className="text-sm text-zinc-300 mb-4 relative z-10">Join our Discord server to find teammates and scrim before the big event.</p>
             <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold relative z-10">JOIN DISCORD</Button>
           </div>
        </div>

      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="h-[50vh] bg-zinc-900 animate-pulse" />
      <div className="container mx-auto px-4 py-12">
        <div className="h-10 w-1/3 bg-zinc-800 mb-8 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-4">
             <div className="h-32 bg-zinc-800 rounded animate-pulse" />
             <div className="h-64 bg-zinc-800 rounded animate-pulse" />
           </div>
           <div className="h-64 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
