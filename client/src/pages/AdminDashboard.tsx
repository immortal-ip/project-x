import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useTournaments, useDeleteTournament } from "@/hooks/use-tournaments";
import { CreateTournamentDialog } from "@/components/CreateTournamentDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: tournaments, isLoading: dataLoading } = useTournaments();
  const deleteMutation = useDeleteTournament();

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary"><Loader2 className="animate-spin" /></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-display font-bold text-white mb-4">ACCESS DENIED</h1>
        <p className="text-zinc-400 mb-8">You must be logged in to view the admin dashboard.</p>
        <Link href="/login">
          <Button size="lg" className="bg-primary hover:bg-red-600 text-white font-bold tracking-widest">
            LOGIN AS ADMIN
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background text-white font-body">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">ADMIN DASHBOARD</h1>
            <p className="text-zinc-400">Welcome back, {user?.firstName}. Manage your arena.</p>
          </div>
          <CreateTournamentDialog />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
            <h3 className="text-zinc-500 font-bold text-sm tracking-widest">TOTAL TOURNAMENTS</h3>
            <p className="text-4xl font-display font-bold text-white mt-2">{tournaments?.length || 0}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
             <h3 className="text-zinc-500 font-bold text-sm tracking-widest">LIVE EVENTS</h3>
             <p className="text-4xl font-display font-bold text-primary mt-2">
               {tournaments?.filter(t => t.status === 'live').length || 0}
             </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
             <h3 className="text-zinc-500 font-bold text-sm tracking-widest">UPCOMING</h3>
             <p className="text-4xl font-display font-bold text-blue-500 mt-2">
               {tournaments?.filter(t => t.status === 'upcoming').length || 0}
             </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-950">
              <TableRow className="border-zinc-800 hover:bg-zinc-950">
                <TableHead className="text-zinc-400 font-bold">ID</TableHead>
                <TableHead className="text-zinc-400 font-bold">TITLE</TableHead>
                <TableHead className="text-zinc-400 font-bold">GAME</TableHead>
                <TableHead className="text-zinc-400 font-bold">DATE</TableHead>
                <TableHead className="text-zinc-400 font-bold">STATUS</TableHead>
                <TableHead className="text-right text-zinc-400 font-bold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-zinc-500">Loading data...</TableCell>
                </TableRow>
              ) : tournaments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-zinc-500">No tournaments created yet.</TableCell>
                </TableRow>
              ) : (
                tournaments?.map((tournament) => (
                  <TableRow key={tournament.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-mono text-zinc-500">#{tournament.id}</TableCell>
                    <TableCell className="font-bold text-white">{tournament.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-300">{tournament.game}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">{format(new Date(tournament.startDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={
                        tournament.status === 'live' ? 'bg-red-600' :
                        tournament.status === 'upcoming' ? 'bg-blue-600' :
                        'bg-zinc-600'
                      }>
                        {tournament.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit functionality would be implemented similar to Create but passing ID */}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                          <Edit size={16} />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10">
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">
                                This action cannot be undone. This will permanently delete the tournament "{tournament.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(tournament.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
