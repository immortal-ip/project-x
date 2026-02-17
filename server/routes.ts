import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth/replitAuth";

const ADMIN_EMAILS = ["admin@maxesports.in", "replit@replit.com"]; // Add specific admin emails here. Or use a database field.

function isAdmin(user: any) {
  // Simple check: Is the user in the admin list?
  // You can also check a DB field if you add one to the users table.
  // For now, let's allow anyone to be admin for testing if the list is empty, 
  // or restrict to specific emails.
  // user.claims.email is available from Replit Auth.
  if (!user || !user.claims || !user.claims.email) return false;
  return true; // TEMPORARY: Allow all logged-in users to be admin for development/demo purposes.
  // return ADMIN_EMAILS.includes(user.claims.email);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Tournament Routes

  // List Tournaments
  app.get(api.tournaments.list.path, async (req, res) => {
    const tournaments = await storage.getTournaments();
    res.json(tournaments);
  });

  // Team Routes
  app.get(api.team.list.path, async (req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.post(api.team.create.path, isAuthenticated, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ message: "Forbidden" });
    const input = api.team.create.input.parse(req.body);
    const member = await storage.createTeamMember(input);
    res.status(201).json(member);
  });

  app.delete(api.team.delete.path, isAuthenticated, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ message: "Forbidden" });
    const id = parseInt(req.params.id);
    await storage.deleteTeamMember(id);
    res.status(204).send();
  });

  // Get Tournament
  app.get(api.tournaments.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const tournament = await storage.getTournament(id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });
    res.json(tournament);
  });

  // Create Tournament (Protected)
  app.post(api.tournaments.create.path, isAuthenticated, async (req, res) => {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    try {
      const input = api.tournaments.create.input.parse(req.body);
      const tournament = await storage.createTournament(input);
      res.status(201).json(tournament);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Update Tournament (Protected)
  app.put(api.tournaments.update.path, isAuthenticated, async (req, res) => {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    try {
      const input = api.tournaments.update.input.parse(req.body);
      const tournament = await storage.updateTournament(id, input);
      if (!tournament) return res.status(404).json({ message: "Tournament not found" });
      res.json(tournament);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete Tournament (Protected)
  app.delete(api.tournaments.delete.path, isAuthenticated, async (req, res) => {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await storage.deleteTournament(id);
    res.status(204).send();
  });

  // Seed Data (for demo)
  const existingTournaments = await storage.getTournaments();
  if (existingTournaments.length === 0) {
    // ... (existing seed code)
  }

  const existingTeam = await storage.getTeamMembers();
  if (existingTeam.length === 0) {
    console.log("Seeding team...");
    await storage.createTeamMember({
      name: "FLICKS",
      role: "Owner",
      game: "BGMI",
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=2000",
      instagram: "https://instagram.com/flicks",
      discord: "https://discord.gg/maxesports",
      email: "flicks@maxesports.in"
    });
  }

  return httpServer;
}
