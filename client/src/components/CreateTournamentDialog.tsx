import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTournamentSchema, type InsertTournament } from "@shared/schema";
import { useCreateTournament } from "@/hooks/use-tournaments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export function CreateTournamentDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTournament();

  const form = useForm<InsertTournament>({
    resolver: zodResolver(insertTournamentSchema.extend({
      // Coerce dates and numbers since inputs return strings
      startDate: z.coerce.date(),
    })),
    defaultValues: {
      title: "",
      description: "",
      game: "",
      format: "Squad",
      status: "upcoming",
      prizePool: "",
      registrationLink: "",
      imageUrl: "",
      startDate: new Date(),
      isFeatured: false,
    },
  });

  const onSubmit = (data: InsertTournament) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-red-600 text-white font-bold tracking-wider gap-2">
          <Plus size={18} /> CREATE TOURNAMENT
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display uppercase tracking-wider text-primary">New Tournament</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Winter Royale 2024" {...field} className="bg-zinc-900 border-zinc-700" />
                  </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-700">
                          <SelectValue placeholder="Select Game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="BGMI">BGMI</SelectItem>
                        <SelectItem value="Free Fire">Free Fire</SelectItem>
                        <SelectItem value="COD Mobile">COD Mobile</SelectItem>
                        <SelectItem value="Valorant">Valorant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-700">
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="Solo">Solo</SelectItem>
                        <SelectItem value="Duo">Duo</SelectItem>
                        <SelectItem value="Squad">Squad</SelectItem>
                        <SelectItem value="5v5">5v5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prizePool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Pool</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ₹50,000" {...field} className="bg-zinc-900 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      className="bg-zinc-900 border-zinc-700 block w-full" 
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
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
                  <FormLabel>Google Form Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://forms.google.com/..." {...field} value={field.value || ""} className="bg-zinc-900 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ""} className="bg-zinc-900 border-zinc-700" />
                  </FormControl>
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
                  <FormControl>
                    <Textarea placeholder="Tournament details..." {...field} className="bg-zinc-900 border-zinc-700 min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-red-600 font-bold tracking-wider"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "CREATING..." : "PUBLISH TOURNAMENT"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
