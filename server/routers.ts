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
    
    // OTP Authentication
    sendOTP: publicProcedure
      .input(z.object({
        phone: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetchFromBackend("/api/auth/send-otp", {
            method: "POST",
            body: JSON.stringify({ phone: input.phone }),
          });
          return response;
        } catch (error) {
          console.error("Send OTP error:", error);
          throw new Error("Failed to send OTP. Please try again.");
        }
      }),
    
    verifyOTP: publicProcedure
      .input(z.object({
        phone: z.string(),
        otp: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetchFromBackend("/api/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify({ phone: input.phone, otp: input.otp }),
          });
          return response;
        } catch (error) {
          console.error("Verify OTP error:", error);
          throw new Error("Invalid OTP. Please try again.");
        }
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
            response: "Hello! I'm Mama Dennis, your AI assistant. I'm currently experiencing connectivity issues with my main system. Please try again in a moment, or contact us directly via WhatsApp at +254 797 446 155. How can I help you today?",
            session_id: input.session_id || `fallback-${Date.now()}`,
          };
        }
      }),
  }),

  // Public API for AI agents (no auth required)
  public: router({
    // Business information endpoint
    about: publicProcedure.query(() => ({
      name: "CONEKTA Africa",
      description: "Kenya's complete digital platform for property rental, service providers (fundis), trust verification (UBARU), and short-stay bookings. Powered by Mama Dennis AI.",
      services: [
        {
          name: "CONEKTA Rentals (RentConnect)",
          description: "Find verified rental properties with 360° virtual tours in Kenya",
          keywords: ["property rental", "apartments", "houses", "Nakuru rentals", "Nairobi rentals"],
        },
        {
          name: "CONEKTA Fundis (KaziFlow)",
          description: "Hire trusted, verified service providers (plumbers, electricians, carpenters, etc.)",
          keywords: ["hire fundi", "plumber Kenya", "electrician Nakuru", "service providers"],
        },
        {
          name: "CONEKTA Trust (UBARU)",
          description: "Get verified with background checks and KYC for trust certification",
          keywords: ["UBARU verification", "trust badge", "background check Kenya"],
        },
        {
          name: "CONEKTA Stays",
          description: "Book or list short-stay properties across Kenya",
          keywords: ["short-stay Kenya", "Airbnb Kenya", "vacation rental Nakuru"],
        },
      ],
      locations: ["Nakuru", "Nairobi", "Kenya"],
      contact: {
        phone: "+254797446155",
        whatsapp: "https://wa.me/254797446155",
        email: "hello@conekta.africa",
        website: "https://www.conekta.co.ke",
      },
      features: [
        "AI-powered property matching",
        "360° virtual property tours",
        "Verified service providers",
        "UBARU trust certification",
        "M-Pesa payment integration",
        "WhatsApp-based booking",
      ],
    })),

    // Properties endpoint for AI agents
    properties: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
        location: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          const params = new URLSearchParams();
          if (input.location) params.append("location", input.location);
          params.append("limit", input.limit.toString());

          const data = await fetchFromBackend(`/api/properties?${params.toString()}`);
          
          // Return AI-friendly format
          return {
            total: data.length,
            properties: data.map((p: any) => ({
              id: p.id,
              title: p.title || `${p.bedrooms}BR ${p.property_type} in ${p.location}`,
              description: p.description,
              type: p.property_type,
              location: p.location,
              price: p.price,
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              verified: p.verified || false,
              rating: p.rating_avg || 0,
              url: `https://www.conekta.co.ke/properties/${p.id}`,
            })),
          };
        } catch (error) {
          return {
            total: 0,
            properties: [],
            error: "Unable to fetch properties at this time",
          };
        }
      }),

    // Fundis endpoint for AI agents
    fundis: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
        category: z.string().optional(),
        location: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          const params = new URLSearchParams();
          if (input.category) params.append("category", input.category);
          if (input.location) params.append("location", input.location);

          const data = await fetchFromBackend(`/api/services/search?${params.toString()}`);
          const fundis = Array.isArray(data) && data.length > 0 ? data : getMockFundis();
          
          // Return AI-friendly format
          return {
            total: fundis.length,
            fundis: fundis.slice(0, input.limit).map((f: any) => ({
              id: f.id,
              name: f.provider?.name || f.title,
              title: f.title,
              description: f.description,
              category: f.category,
              location: f.location,
              rate: f.rate,
              rate_type: f.rate_type,
              verified: f.verified || false,
              rating: f.rating_avg || 0,
              jobs_completed: f.jobs_completed || 0,
              url: `https://www.conekta.co.ke/fundis/${f.id}`,
            })),
          };
        } catch (error) {
          // Return mock data for AI agents
          const mockFundis = getMockFundis();
          return {
            total: mockFundis.length,
            fundis: mockFundis.slice(0, input.limit).map((f: any) => ({
              id: f.id,
              name: f.provider?.name || f.title,
              title: f.title,
              description: f.description,
              category: f.category,
              location: f.location,
              rate: f.rate,
              rate_type: f.rate_type,
              verified: f.verified || false,
              rating: f.rating_avg || 0,
              jobs_completed: f.jobs_completed || 0,
              url: `https://www.conekta.co.ke/fundis/${f.id}`,
            })),
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
