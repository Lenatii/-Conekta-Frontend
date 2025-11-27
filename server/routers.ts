import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Import API client
const API_BASE_URL = "https://conekta-complete-system.onrender.com";

// Mock fundis data (fallback when backend is empty)
function getMockFundis() {
  return [
    {
      id: 1,
      title: "Expert Plumber - John Mwangi",
      description: "Expert plumber with 10+ years experience. Specializing in installations, repairs, and maintenance.",
      category: "Plumber",
      rate: 800,
      rate_type: "hourly",
      location: "Nakuru CBD",
      county: "Nakuru",
      town: "Nakuru",
      availability: "available",
      verified: true,
      rating_avg: 5.0,
      rating_count: 127,
      jobs_completed: 127,
      provider: {
        name: "John Mwangi",
        phone: "+254 712 345 678",
        avatar: "/fundi-john-v2.jpg",
      },
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Licensed Electrician - Peter Ochieng",
      description: "Licensed electrician. Wiring, installations, and electrical repairs for homes and offices.",
      category: "Electrician",
      rate: 1000,
      rate_type: "hourly",
      location: "Milimani",
      county: "Nakuru",
      town: "Nakuru",
      availability: "available",
      verified: true,
      rating_avg: 5.0,
      rating_count: 89,
      jobs_completed: 89,
      provider: {
        name: "Peter Ochieng",
        phone: "+254 723 456 789",
        avatar: "/fundi-peter-v2.jpg",
      },
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Professional Carpenter - David Kimani",
      description: "Professional carpenter. Custom furniture, repairs, and installations.",
      category: "Carpenter",
      rate: 700,
      rate_type: "hourly",
      location: "Pipeline",
      county: "Nakuru",
      town: "Nakuru",
      availability: "available",
      verified: true,
      rating_avg: 4.0,
      rating_count: 56,
      jobs_completed: 56,
      provider: {
        name: "David Kimani",
        phone: "+254 734 567 890",
        avatar: "/fundi-david-v2.jpg",
      },
      created_at: new Date().toISOString(),
    },
  ];
}

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
        category: z.string().optional(),
        location: z.string().optional(),
        verified_only: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        try {
          const params = new URLSearchParams();
          if (input.category && input.category !== "all") params.append("category", input.category);
          if (input.location && input.location !== "all") params.append("location", input.location);
          if (input.verified_only) params.append("verified_only", "true");

          const data = await fetchFromBackend(`/api/services/search?${params.toString()}`);
          
          // If backend returns data, use it
          if (data && Array.isArray(data) && data.length > 0) {
            return data;
          }
          
          // Fallback to mock data if backend is empty
          return getMockFundis();
        } catch (error) {
          console.error("Backend API error, using mock data:", error);
          return getMockFundis();
        }
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          return await fetchFromBackend(`/api/services/${input.id}`);
        } catch (error) {
          // Fallback to mock data
          const mockFundis = getMockFundis();
          return mockFundis.find((f: any) => f.id === input.id) || null;
        }
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
        try {
          return await fetchFromBackend("/api/webchat/message", {
            method: "POST",
            body: JSON.stringify(input),
          });
        } catch (error) {
          console.error("Chat API error:", error);
          // Fallback response when backend is unavailable
          return {
            response: "Hello! I'm Mama Dennis, your AI assistant. I'm currently experiencing connectivity issues with my main system. Please try again in a moment, or contact us directly via WhatsApp at +254 707 446 155. How can I help you today?",
            session_id: input.session_id || `fallback-${Date.now()}`,
          };
        }
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
