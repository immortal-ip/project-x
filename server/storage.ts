import { users, tournaments, type User, type InsertUser, type Tournament, type InsertTournament } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage"; // Import auth storage

export interface IStorage {
  // Auth methods (delegated to authStorage or implemented here if needed)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;

  // Tournament methods
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: Partial<InsertTournament>): Promise<Tournament>;
  deleteTournament(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Delegate auth methods
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }

  async upsertUser(user: InsertUser): Promise<User> {
    return authStorage.upsertUser(user);
  }

  // Tournament methods
  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments).orderBy(desc(tournaments.startDate));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const [tournament] = await db.insert(tournaments).values(insertTournament).returning();
    return tournament;
  }

  async updateTournament(id: number, updateData: Partial<InsertTournament>): Promise<Tournament> {
    const [tournament] = await db
      .update(tournaments)
      .set(updateData)
      .where(eq(tournaments.id, id))
      .returning();
    return tournament;
  }

  async deleteTournament(id: number): Promise<void> {
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }
}

export const storage = new DatabaseStorage();
