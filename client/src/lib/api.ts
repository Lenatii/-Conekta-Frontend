/**
 * API Client for Render Backend
 * Connects to: https://conekta-complete-system.onrender.com
 */

const API_BASE_URL = "https://conekta-complete-system.onrender.com";

export interface Property {
  id: number;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  city: string;
  amenities: string[];
  images: string[];
  landlord_name?: string;
  landlord_phone?: string;
  landlord_email?: string;
  is_ubaru_verified: boolean;
  is_active: boolean;
}

export interface ServiceProvider {
  id: number;
  name: string;
  service_type: string;
  description: string;
  location: string;
  city: string;
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  is_verified: boolean;
  phone: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  response: string;
  session_id?: string;
}

export interface Job {
  id: number;
  title: string;
  status: string;
  price: number;
  scheduled_date: string;
  created_at: string;
  fundi_name?: string;
  service_type?: string;
  completion_status?: {
    user_confirmed?: boolean;
    rating_submitted?: boolean;
    rating?: number;
  };
}

export interface JobCompletionResponse {
  success: boolean;
  message: string;
  job_id: number;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  rating_id: number;
  trust_score_updated: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Property APIs
  async searchProperties(params: {
    location?: string;
    property_type?: string;
    bedrooms?: number;
    min_price?: number;
    max_price?: number;
  }): Promise<Property[]> {
    const queryParams = new URLSearchParams();
    
    if (params.location) queryParams.append("location", params.location);
    if (params.property_type) queryParams.append("property_type", params.property_type);
    if (params.bedrooms) queryParams.append("bedrooms", params.bedrooms.toString());
    if (params.min_price) queryParams.append("min_price", params.min_price.toString());
    if (params.max_price) queryParams.append("max_price", params.max_price.toString());

    return this.request<Property[]>(`/api/properties?${queryParams.toString()}`);
  }

  async getProperty(id: number): Promise<Property> {
    return this.request<Property>(`/api/properties/${id}`);
  }

  // Service Provider APIs
  async searchFundis(params: {
    service_type?: string;
    location?: string;
  }): Promise<ServiceProvider[]> {
    const queryParams = new URLSearchParams();
    
    if (params.service_type) queryParams.append("service_type", params.service_type);
    if (params.location) queryParams.append("location", params.location);

    return this.request<ServiceProvider[]>(`/api/fundis?${queryParams.toString()}`);
  }

  async getFundi(id: number): Promise<ServiceProvider> {
    return this.request<ServiceProvider>(`/api/fundis/${id}`);
  }

  // Mama Dennis Chat API
  async chat(message: string, sessionId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>("/api/website-chat/message", {
      method: "POST",
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });
  }

  // Payment API (Instasend)
  async revealContact(propertyId: number, phoneNumber: string): Promise<{
    success: boolean;
    landlord_name?: string;
    landlord_phone?: string;
    landlord_email?: string;
    message?: string;
  }> {
    return this.request("/api/payments/reveal-contact", {
      method: "POST",
      body: JSON.stringify({
        property_id: propertyId,
        phone_number: phoneNumber,
      }),
    });
  }

  // Job Completion APIs
  async markJobComplete(jobId: number, notes: string): Promise<JobCompletionResponse> {
    return this.request(`/api/jobs/${jobId}/mark-complete`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async confirmJobCompletion(jobId: number, confirmed: boolean, notes?: string): Promise<JobCompletionResponse> {
    return this.request(`/api/jobs/${jobId}/confirm-completion`, {
      method: "POST",
      body: JSON.stringify({ confirmed, notes }),
    });
  }

  async submitJobRating(jobId: number, rating: number, comment: string): Promise<RatingResponse> {
    return this.request(`/api/jobs/${jobId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
  }

  async logCallAttempt(jobId: number): Promise<JobCompletionResponse> {
    return this.request(`/api/jobs/${jobId}/log-call`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  async reportFundiCancellation(jobId: number, reason: string): Promise<JobCompletionResponse> {
    return this.request(`/api/jobs/${jobId}/report-cancellation`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async reportFundiNoShow(jobId: number, reason: string): Promise<JobCompletionResponse> {
    return this.request(`/api/jobs/${jobId}/report-no-show`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  // OTP APIs
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    return this.request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
  }> {
    return this.request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        phone_number: phoneNumber,
        otp,
      }),
    });
  }
}

export const api = new APIClient(API_BASE_URL);
