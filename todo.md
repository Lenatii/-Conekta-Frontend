# CONEKTA Website Development TODO

## Phase 1: Base Setup & Design
- [x] Setup dark theme with teal accents (matching conekta.co.ke)
- [x] Configure color palette in index.css
- [x] Add Google Fonts (Inter or similar modern font)
- [x] Create navigation header
- [x] Create footer with links
- [ ] Update APP_LOGO and APP_TITLE

## Phase 2: Database Schema
- [x] Properties table
- [x] Property images table
- [x] Bookings table
- [x] Contact reveals table (payment tracking)
- [x] Guest sessions table
- [x] Service providers (fundis) table
- [x] Reviews table

## Phase 3: Backend API Connection
- [ ] Create API client for Render backend
- [ ] Property search endpoint integration
- [ ] User registration/OTP endpoint
- [ ] Payment endpoint integration
- [ ] Mama Dennis chat endpoint

## Phase 4: Property Features
- [x] Property listing page with search and filters
- [x] Property detail page with photo gallery
- [x] Contact reveal button (KES 150)
- [ ] Similar properties section
- [x] Property card component
- [x] Search bar component

## Phase 5: User Authentication
- [ ] User registration page with phone OTP
- [ ] Login page with OTP verification
- [ ] User dashboard/profile page
- [ ] T&C acceptance checkbox
- [ ] Auth state management

## Phase 6: Payment Integration
- [x] Instasend M-Pesa STK Push integration (UI ready, needs API)
- [x] Payment modal for contact reveal
- [x] Payment confirmation flow
- [ ] Receipt generation
- [ ] Payment history page

## Phase 7: Additional Features
- [x] Mama Dennis chat widget (floating bottom-right)
- [ ] Guest mode banner (search limit tracking)
- [x] Service provider (Fundi) listing page
- [x] Fundi detail page (URGENT - currently 404 error)
- [x] Restore purple + teal gradient colors from original HTML
- [x] Apply glass morphism effects from original design
- [x] Add floating animations from original design
- [ ] Update all components to match original beautiful styling (Home page needs update)
- [ ] Short-stay booking page
- [ ] UBARU verification page

## Phase 8: Polish & Testing
- [ ] Mobile responsiveness
- [ ] Loading states
- [ ] Error handling
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] SEO optimization

## Phase 9: Backend Integration (In Progress)
- [x] Create API client for Render backend
- [x] Add tRPC routers for backend
- [ ] Connect property listing to real data
- [ ] Connect property detail to real data
- [ ] Connect Mama Dennis chat to backend AI
- [ ] Connect payment flow to Instasend
- [ ] Test full integration

## Phase 10: SEO Optimization
- [x] Add meta tags for Google indexing
- [x] Add structured data (JSON-LD)
- [x] Add sitemap.xml
- [x] Add robots.txt
- [x] Optimize page titles and descriptions
- [x] Add Open Graph tags for social sharing

## Phase 11: Logo and Branding
- [x] Generate CONEKTA logo with purple+teal gradient
- [x] Add logo to Navigation component
- [x] Make logo visible and prominent
- [x] Update APP_LOGO constant in const.ts

## Phase 12: Button Functionality & WhatsApp Integration
- [x] Test Contact Us button functionality
- [x] Test WhatsApp buttons (header, footer, chat widget)
- [x] Test social media buttons (Facebook, Instagram, Twitter, LinkedIn)
- [x] Style WhatsApp button with green color (#25D366)
- [x] Make WhatsApp button more inviting and prominent
- [x] Add proper WhatsApp links with pre-filled messages

## Phase 13: Pay-to-Reveal Contact Flow (Business Model)
- [x] Remove direct WhatsApp links from fundi profiles
- [x] Add payment modal for KES 150 M-Pesa payment
- [ ] Integrate with backend payment API (TODO: Connect to Render backend)
- [x] Show contact after successful payment
- [ ] Store payment records in database (TODO: Backend integration)
- [ ] Prevent duplicate payments for same fundi (TODO: Backend integration)
- [ ] Add "Already purchased" indicator for paid contacts (TODO: Backend integration)

## Phase 14: Backend Integration (Render)
- [x] Test backend endpoints at https://conekta-complete-system.onrender.com
- [x] Create API client utility for backend calls (tRPC configured)
- [x] Integrate M-Pesa payment API for pay-to-reveal (Intasend)
- [ ] Connect Properties page to backend API (using mock data for now)
- [ ] Connect Fundis page to backend API (using mock data for now)
- [ ] Deploy backend with all API routes to Render
- [ ] Add real data to backend database
- [ ] Add authentication headers to API calls
- [ ] Handle loading and error states
- [ ] Test all backend connections end-to-end

## Phase 15: Fix Missing Pages (URGENT)
- [x] Create Short-Stay page (currently 404)
- [x] Create UBARU verification page (currently 404)
- [x] Add WhatsApp Chat button to navigation (gradient purple-to-teal)
- [x] Fix any other broken navigation links
- [x] Test all pages work without 404 errors

## Phase 16: Short-Stay Availability Calendar
- [x] Add calendar component to Short-Stay page
- [x] Implement date selection (check-in/check-out)
- [x] Show availability status on calendar
- [x] Calculate total price based on selected dates
- [x] Implement pay-to-reveal flow (KES 150)
- [ ] Connect to backend availability API
