import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Menu, X, Trophy, Home, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/", icon: Home },
    { name: "TOURNAMENTS", path: "/tournaments", icon: Trophy },
    { name: "ABOUT", path: "/about", icon: Info },
  ];

  const isAdmin = isAuthenticated && user; // In a real app, check user role

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5",
        isScrolled ? "bg-black/90 backdrop-blur-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-10 h-10 bg-primary skew-x-[-10deg] flex items-center justify-center border-2 border-white group-hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all">
              <span className="text-white font-display font-bold text-2xl skew-x-[10deg]">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold text-white leading-none tracking-wider group-hover:text-primary transition-colors">
                MAX <span className="text-primary">ESPORTS</span>
              </span>
              <span className="text-[10px] font-gaming tracking-[0.3em] text-white/60">DOMINATE THE ARENA</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={cn(
                  "font-gaming font-bold text-sm tracking-widest cursor-pointer transition-all hover:text-primary relative group py-2",
                  location === link.path ? "text-primary" : "text-white/80"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300",
                  location === link.path ? "w-full shadow-[0_0_8px_rgba(255,0,0,0.8)]" : "w-0 group-hover:w-full"
                )} />
              </div>
            </Link>
          ))}
          
          {isAdmin && (
             <Link href="/admin">
              <div className={cn(
                  "font-gaming font-bold text-sm tracking-widest cursor-pointer transition-all hover:text-primary text-red-500",
                  location === "/admin" ? "text-primary text-glow" : ""
                )}>
                ADMIN DASHBOARD
              </div>
             </Link>
          )}
        </div>

        {/* Auth / Mobile Toggle */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all p-0 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-zinc-800 text-primary font-bold">
                      {(user?.firstName?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-white" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-primary cursor-pointer" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button 
                className="hidden md:flex bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-gaming font-bold tracking-wider clip-path-button transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
              >
                LOGIN / JOIN
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div 
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-white/5 text-white font-gaming text-lg tracking-widest cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="text-primary" size={20} />
                  {link.name}
                </div>
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin">
                 <div 
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-white/5 text-red-500 font-gaming text-lg tracking-widest cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="text-primary" size={20} />
                  ADMIN PANEL
                </div>
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-red-600 text-white font-bold tracking-widest mt-2">
                  LOGIN NOW
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
