import { z } from 'zod';
import { insertTournamentSchema, tournaments, tournamentStatusEnum } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  tournaments: {
    list: {
      method: 'GET' as const,
      path: '/api/tournaments' as const,
      input: z.object({
        status: tournamentStatusEnum.optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof tournaments.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tournaments/:id' as const,
      responses: {
        200: z.custom<typeof tournaments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tournaments' as const,
      input: insertTournamentSchema,
      responses: {
        201: z.custom<typeof tournaments.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tournaments/:id' as const,
      input: insertTournamentSchema.partial(),
      responses: {
        200: z.custom<typeof tournaments.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tournaments/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TournamentInput = z.infer<typeof api.tournaments.create.input>;
export type TournamentUpdateInput = z.infer<typeof api.tournaments.update.input>;
