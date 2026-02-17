import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export auth models so they are included in the schema
export * from "./models/auth";

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  game: text("game").notNull(), // e.g., "BGMI", "Free Fire"
  status: text("status", { enum: ["upcoming", "live", "ended"] }).notNull().default("upcoming"),
  startDate: timestamp("start_date").notNull(),
  prizePool: text("prize_pool").notNull(), // Text to allow "₹20,000" formatting
  format: text("format").notNull(), // "Squad", "Duo", "Solo"
  registrationLink: text("registration_link"), // Google Form URL
  imageUrl: text("image_url"), // For tournament banner
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({ 
  id: true, 
  createdAt: true 
});

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

// Request Types
export type CreateTournamentRequest = InsertTournament;
export type UpdateTournamentRequest = Partial<InsertTournament>;

// Response Types
export type TournamentResponse = Tournament;
export type TournamentListResponse = Tournament[];

// API Types
export const tournamentStatusEnum = z.enum(["upcoming", "live", "ended"]);
