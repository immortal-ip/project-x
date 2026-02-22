import { Navbar } from "@/components/Navbar";
import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamMemberSchema, insertTournamentSchema, type TeamMember, type Tournament } from "@shared/schema";
import { useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from "@/hooks/use-team";
import { useTournaments, useCreateTournament, useUpdateTournament, useDeleteTournament } from "@/hooks/use-tournaments";
import { Plus, Pencil, Trash2, Loader2, Link as LinkIcon, Calendar } from "lucide-react";
import { z } from "zod";

export default function Admin() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);

  if (userLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Dashboard</h1>
          <p className="text-gray-400">Manage your team and tournaments</p>
        </div>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="bg-secondary border border-white/5 p-1 mb-8 w-full sm:w-auto">
            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-white">Team Management</TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-primary data-[state=active]:text-white">Tournaments</TabsTrigger>
          </TabsList>

          <TabsContent value="team">
            <TeamManager />
          </TabsContent>
          <TabsContent value="tournaments">
            <TournamentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// === TEAM MANAGER COMPONENT ===
function TeamManager() {
  const { data: members, isLoading } = useTeamMembers();
  const { mutate: deleteMember } = useDeleteTeamMember();
  
  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Roster List</h2>
        <TeamMemberDialog />
      </div>

      <div className="grid gap-4">
        {members?.map((member) => (
          <div key={member.id} className="bg-secondary p-4 rounded-lg border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded bg-black/50 object-cover" />
              <div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {member.role} {member.isManagement && "• Management"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TeamMemberDialog member={member} />
              <Button variant="destructive" size="icon" onClick={() => deleteMember(member.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {members?.length === 0 && <p className="text-gray-500 text-center py-8">No members found.</p>}
      </div>
    </div>
  );
}

// === TOURNAMENT MANAGER COMPONENT ===
function TournamentManager() {
  const { data: tournaments, isLoading } = useTournaments();
  const { mutate: deleteTournament } = useDeleteTournament();

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Tournament List</h2>
        <TournamentDialog />
      </div>

      <div className="grid gap-4">
        {tournaments?.map((t) => (
          <div key={t.id} className="bg-secondary p-4 rounded-lg border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/50 rounded flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">{t.title}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {t.game} • {t.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TournamentDialog tournament={t} />
              <Button variant="destructive" size="icon" onClick={() => deleteTournament(t.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {tournaments?.length === 0 && <p className="text-gray-500 text-center py-8">No tournaments found.</p>}
      </div>
    </div>
  );
}

// === DIALOGS ===

function TeamMemberDialog({ member }: { member?: TeamMember }) {
  const { mutate: create } = useCreateTeamMember();
  const { mutate: update } = useUpdateTeamMember();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertTeamMemberSchema>>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: member || {
      name: "",
      role: "Player",
      game: "BGMI",
      imageUrl: "",
      instagram: "",
      discord: "",
      email: "",
      twitter: "",
      youtube: "",
      isManagement: false,
    },
  });

  function onSubmit(values: z.infer<typeof insertTeamMemberSchema>) {
    if (member) {
      update({ id: member.id, ...values }, { onSuccess: () => setOpen(false) });
    } else {
      create(values, { onSuccess: () => { setOpen(false); form.reset(); } });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={member ? "outline" : "default"} size={member ? "icon" : "default"}>
          {member ? <Pencil className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-2" /> Add Member</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-white/10">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. IGL" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="game"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isManagement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Management / Staff
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check if this member is owner or management staff.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{member ? "Update" : "Create"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TournamentDialog({ tournament }: { tournament?: Tournament }) {
  const { mutate: create } = useCreateTournament();
  const { mutate: update } = useUpdateTournament();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertTournamentSchema>>({
    resolver: zodResolver(insertTournamentSchema),
    defaultValues: tournament || {
      title: "",
      description: "",
      game: "BGMI",
      date: "",
      status: "Upcoming",
      registrationLink: "",
      thumbnailUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof insertTournamentSchema>) {
    if (tournament) {
      update({ id: tournament.id, ...values }, { onSuccess: () => setOpen(false) });
    } else {
      create(values, { onSuccess: () => { setOpen(false); form.reset(); } });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={tournament ? "outline" : "default"} size={tournament ? "icon" : "default"}>
          {tournament ? <Pencil className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-2" /> Add Tournament</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-white/10">
        <DialogHeader>
          <DialogTitle>{tournament ? "Edit Tournament" : "Add Tournament"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="game"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. 24th Oct" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value || "Upcoming"}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Link</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL (Optional)</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{tournament ? "Update" : "Create"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
