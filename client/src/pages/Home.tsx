import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Users, Globe, ChevronRight } from "lucide-react";
import { useTournaments } from "@/hooks/use-tournaments";
import { TournamentCard } from "@/components/TournamentCard";

export default function Home() {
  const { data: tournaments, isLoading } = useTournaments();
  const featuredTournaments = tournaments?.slice(0, 3); // Get first 3 as featured

  return (
    <div className="min-h-screen bg-background text-white font-body selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh (CSS-only approximation) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black opacity-80 z-0"></div>
        
        {/* Dynamic Scanlines Overlay */}
        <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="container relative z-20 px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <h2 className="text-primary font-gaming tracking-[0.5em] text-sm md:text-xl font-bold mb-4 uppercase">
               The Ultimate Esports Platform
             </h2>
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-none mb-6 text-glow">
               MAX <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">ESPORTS</span>
             </h1>
             <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-light mb-10 leading-relaxed">
               Compete in daily tournaments, climb the leaderboards, and prove you are the 
               <span className="text-primary font-bold mx-1">CHAMPION</span> 
               of the arena.
             </p>

             <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
               <Link href="/tournaments">
                 <Button size="lg" className="bg-primary hover:bg-red-600 text-white font-display text-xl px-10 py-8 clip-path-button shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all transform hover:-translate-y-1">
                   JOIN TOURNAMENT
                 </Button>
               </Link>
               <Link href="/login">
                 <Button variant="outline" size="lg" className="bg-transparent border-white/20 text-white hover:bg-white/10 font-display text-xl px-10 py-8 clip-path-button">
                   CREATE TEAM
                 </Button>
               </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* STATS TICKER */}
      <div className="border-y border-white/10 bg-black/50 backdrop-blur-sm py-8 relative z-20">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Trophy, label: "Prize Pool Paid", value: "₹10L+" },
            { icon: Users, label: "Active Players", value: "50K+" },
            { icon: Globe, label: "Tournaments Hosted", value: "500+" },
            { icon: Users, label: "Teams Registered", value: "1200+" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-display font-bold">{stat.value}</h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED TOURNAMENTS */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                <span className="text-primary">LIVE</span> ACTION
              </h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/tournaments">
              <Button variant="link" className="text-white hover:text-primary font-gaming tracking-widest text-lg group">
                VIEW ALL <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-zinc-500 font-gaming animate-pulse">Initializing Arena Data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTournaments?.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} index={i} />
              ))}
              {!featuredTournaments?.length && (
                 <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-lg">
                   <h3 className="text-2xl font-display text-zinc-400">No Active Tournaments</h3>
                   <p className="text-zinc-500 mt-2">Check back later for new events.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-display font-bold mb-6">
                MAX <span className="text-primary">ESPORTS</span>
              </h2>
              <p className="text-zinc-400 max-w-md leading-relaxed">
                The premier destination for competitive mobile gaming. 
                We host high-stakes tournaments for BGMI, Free Fire, and more.
                Join the revolution.
              </p>
            </div>
            <div>
              <h4 className="font-gaming font-bold tracking-widest text-white mb-6">PLATFORM</h4>
              <ul className="space-y-4 text-zinc-400">
                <li className="hover:text-primary transition-colors cursor-pointer">Tournaments</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Leaderboards</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Rules & Guidelines</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-gaming font-bold tracking-widest text-white mb-6">LEGAL</h4>
              <ul className="space-y-4 text-zinc-400">
                <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
            <p>© 2024 MAX ESPORTS. All rights reserved.</p>
            <p className="font-gaming tracking-widest mt-4 md:mt-0">DESIGNED FOR GAMERS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
