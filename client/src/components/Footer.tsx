import { Link } from "wouter";
import { Youtube, Instagram, Twitter, Disc } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-display text-white">
              MAX <span className="text-primary">ESPORTS</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Shaping the future of Indian esports with competitive integrity, 
              innovation, and community growth.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/team" className="text-gray-400 hover:text-primary transition-colors">Meet the Team</Link>
              <Link href="/tournaments" className="text-gray-400 hover:text-primary transition-colors">Tournaments</Link>
              <Link href="/login" className="text-gray-400 hover:text-primary transition-colors">Admin Login</Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Disc className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Max Esports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
