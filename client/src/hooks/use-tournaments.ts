import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TournamentInput, type TournamentUpdateInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTournaments(status?: "upcoming" | "live" | "ended") {
  return useQuery({
    queryKey: [api.tournaments.list.path, status],
    queryFn: async () => {
      const url = status 
        ? `${api.tournaments.list.path}?status=${status}` 
        : api.tournaments.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return api.tournaments.list.responses[200].parse(await res.json());
    },
  });
}

export function useTournament(id: number) {
  return useQuery({
    queryKey: [api.tournaments.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tournaments.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch tournament");
      return api.tournaments.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: TournamentInput) => {
      const res = await fetch(api.tournaments.create.path, {
        method: api.tournaments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) {
           const error = api.tournaments.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create tournament");
      }
      return api.tournaments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({
        title: "Success",
        description: "Tournament created successfully!",
        className: "bg-green-900 border-green-700 text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & TournamentUpdateInput) => {
      const url = buildUrl(api.tournaments.update.path, { id });
      const res = await fetch(url, {
        method: api.tournaments.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 404) throw new Error("Tournament not found");
        throw new Error("Failed to update tournament");
      }
      return api.tournaments.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({
        title: "Updated",
        description: "Tournament details updated.",
        className: "bg-blue-900 border-blue-700 text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tournaments.delete.path, { id });
      const res = await fetch(url, { 
        method: api.tournaments.delete.method,
        credentials: "include" 
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to delete tournament");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({
        title: "Deleted",
        description: "Tournament removed permanently.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
