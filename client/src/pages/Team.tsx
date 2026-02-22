import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTeamMembers } from "@/hooks/use-team";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { Loader2 } from "lucide-react";

export default function Team() {
  const { data: members, isLoading } = useTeamMembers();

  const management = members?.filter(m => m.isManagement) || [];
  const roster = members?.filter(m => !m.isManagement) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-display text-white mb-4 uppercase">
            Meet the <span className="text-primary">Squad</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The minds and players behind Max Esports. Dedicated to excellence and community growth.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-20">
            {/* Management Section */}
            {management.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-grow" />
                  <h2 className="text-2xl font-bold font-display text-primary uppercase tracking-wider px-4 border border-primary/20 rounded py-1 bg-primary/5">
                    Management
                  </h2>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {management.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            )}

            {/* Roster Section */}
            {roster.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-grow" />
                  <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wider px-4">
                    Active Roster
                  </h2>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {roster.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            )}

            {members?.length === 0 && (
              <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-white/10">
                <p className="text-gray-500">No team members found yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
