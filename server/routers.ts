import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Import API client
const API_BASE_URL = "https://conekta-complete-system.onrender.com";

async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend API Error: ${response.status}`);
  }

  return response.json();
}

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Properties router
  properties: router({
    search: publicProcedure
      .input(z.object({
        location: z.string().optional(),
        property_type: z.string().optional(),
        bedrooms: z.number().optional(),
        min_price: z.number().optional(),
        max_price: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const params = new URLSearchParams();
        if (input.location) params.append("location", input.location);
        if (input.property_type) params.append("property_type", input.property_type);
        if (input.bedrooms) params.append("bedrooms", input.bedrooms.toString());
        if (input.min_price) params.append("min_price", input.min_price.toString());
        if (input.max_price) params.append("max_price", input.max_price.toString());

        return fetchFromBackend(`/api/properties?${params.toString()}`);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return fetchFromBackend(`/api/properties/${input.id}`);
      }),
  }),

  // Fundis router
  fundis: router({
    search: publicProcedure
      .input(z.object({
        service_type: z.string().optional(),
        location: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const params = new URLSearchParams();
        if (input.service_type) params.append("service_type", input.service_type);
        if (input.location) params.append("location", input.location);

        return fetchFromBackend(`/api/fundis?${params.toString()}`);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return fetchFromBackend(`/api/fundis/${input.id}`);
      }),
  }),

  // Mama Dennis chat router
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string(),
        session_id: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return fetchFromBackend("/api/website-chat/message", {
          method: "POST",
          body: JSON.stringify(input),
        });
      }),
  }),

  // Payment router
  payment: router({
    revealContact: publicProcedure
      .input(z.object({
        entity_id: z.string(),
        entity_type: z.string(), // "fundi" or "property"
        phone_number: z.string(),
        amount: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return fetchFromBackend("/api/v1/payments/initiate", {
          method: "POST",
          body: JSON.stringify({
            user_phone: input.phone_number,
            entity_id: input.entity_id,
            entity_type: input.entity_type,
            amount: input.amount || 150,
          }),
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
