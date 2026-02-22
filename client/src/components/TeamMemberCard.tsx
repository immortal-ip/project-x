import { TeamMember } from "@shared/schema";
import { Instagram, Youtube, Twitter, Disc } from "lucide-react";
import { motion } from "framer-motion";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-secondary/50 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
        <img 
          src={member.imageUrl} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Role Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-primary/20">
            {member.role}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <h3 className="text-xl font-bold text-white font-display mb-1 group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        {member.game && (
          <p className="text-gray-400 text-sm mb-4 font-mono uppercase tracking-wide">
            {member.game}
          </p>
        )}

        {/* Social Links */}
        <div className="flex gap-3 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {member.instagram && (
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {member.youtube && (
            <a href={member.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          )}
          {member.discord && (
            <a href={member.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Disc className="w-5 h-5" />
            </a>
          )}
          {member.twitter && (
            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
