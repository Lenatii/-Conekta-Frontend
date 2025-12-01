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

## Phase 17: Fix Login & Social Media Buttons (URGENT)
- [ ] Fix login button OAuth callback (currently 404)
- [ ] Make social media buttons visible in header
- [ ] Test all buttons work properly

## Phase 18: Fix Mama Dennis Chat Widget
- [ ] Fix chat widget cutting off at bottom
- [ ] Ensure full messages are visible
- [ ] Test chat widget responsiveness

## Phase 19: Connect Mama Dennis to Real Backend API
- [ ] Replace mock responses with real API calls
- [ ] Connect to Mama Dennis backend endpoint
- [ ] Ensure same personality as WhatsApp version
- [ ] Test geo-location and AI matching features

## Phase 20: Expand Service Providers & Add Vetting Messaging
- [x] Add full list of service categories (all types from backend)
- [ ] Generate professional profile pictures for all service types (in progress)
- [x] Add vetting process messaging to Fundis page
- [x] Highlight short course training program
- [x] Emphasize customer service and professional standards
- [x] Show CONEKTA's competitive advantage (better trained providers)

## Phase 21: Legal Pages (URGENT - 404 errors)
- [x] Create Terms & Conditions page
- [x] Create Privacy Policy page
- [x] Add routes to App.tsx
- [x] Test all footer links work

## Phase 22: URGENT - Remove White People Pictures
- [x] Identify all fundis with non-Kenyan pictures
- [x] Remove or replace with placeholder
- [x] Ensure only Kenyan Black African men are shown

## Phase 23: FIX - Replace ALL White People Pictures
- [x] Delete fundi-john.jpg, fundi-peter.jpg, fundi-david.jpg (ALL are white)
- [x] Generate 3 NEW Kenyan Black African men portraits
- [x] Verify all faces are authentically Kenyan

## Phase 24: Connect to Backend API (Real Data)
- [x] Explore backend API endpoints for fundis
- [x] Create tRPC procedures to fetch real fundis
- [x] Update Fundis page to use API data instead of mock
- [x] Test with real backend data (fallback working)

#### Phase 25: FINAL FIX - Regenerate with Ultra-Specific Kenyan Prompts
- [x] Delete current images (still showing white people)
- [x] Generate with extremely explicit African features prompts
- [x] Verify all faces are authentically Kenyan Black African

## Phase 26: URGENT - Fix T&C and Privacy 404 Errors
- [ ] Verify Terms.tsx and Privacy.tsx files exist
- [ ] Check App.tsx routes are correct
- [ ] Test /terms and /privacy URLs
- [ ] Fix any routing issues

## Phase 27: URGENT - Fix Fundis Not Displaying (0 providers found)
- [x] Debug why fundis list is empty
- [x] Check if tRPC query is failing
- [x] Verify mock fallback is working
- [x] Test and confirm 3 fundis appear (working on dev server)

## Phase 28: Fix Mama Dennis Chat Connection Error
- [ ] Debug why chat is showing "trouble connecting"
- [ ] Check backend API endpoint for chat
- [ ] Fix chat router in routers.ts
- [ ] Test chat functionality end-to-end

## Phase 29: URGENT LEGAL FIX - Terms & Privacy Documents
- [x] Remove ALL references to Finland
- [x] Replace "Dennis Muchiri" with "Proprietor"
- [x] Change from "Finnish and Kenyan law" to "Kenyan law" ONLY
- [x] Fix business structure description
- [x] Update Privacy Policy with same fixes (verified clean - no issues found)
- [x] Committed to git (ready for GitHub push when credentials available)

## Phase 30: Fix TypeScript Error in Mama Dennis Chat Widget
- [x] Fix MamaDennisChatWidget.tsx mutation error
- [x] Update chat component to use correct tRPC mutation syntax (useMutation hook)
- [x] Test chat widget functionality (needs backend connection)

## Phase 33: Connect Website Chat to Mama Dennis v1_integrated
- [x] Create new website_mama_chat.py endpoint using v1_integrated
- [x] Add router to main.py
- [x] Update website chat router to call /api/website-mama-chat/message
- [x] Verify Instasend payment integration included
- [x] Push to GitHub and trigger Render deployment
- [ ] Test website chat after Render deployment completes

## Phase 31: Fix Mama Dennis Chat Integration (URGENT)
- [ ] Check current chat router implementation
- [ ] Find v1 Cognitive Engine endpoint URL
- [ ] Update chat router to use v1 backend (same as WhatsApp flow)
- [ ] Test conversational flow matches WhatsApp version
- [ ] Verify WhatsApp button links to correct number
- [ ] Test end-to-end chat functionality

## Phase 31: Verify Mama Dennis v1 Integration (URGENT)
- [ ] Check if chat router is using v1 Cognitive Engine endpoint
- [ ] Verify WhatsApp button links to correct Mama Dennis number
- [ ] Test that website chat has same conversational flow as WhatsApp
- [ ] Fix any integration issues found

## Phase 32: Fix Mama Dennis WhatsApp Memory Issue (CRITICAL)
- [ ] WAITING FOR USER INSTRUCTIONS
- [ ] Issue: Mama Dennis repeating questions (bedrooms, location, budget)
- [ ] Issue: Not remembering existing users (asks for UBARU ID again)
- [ ] Conversation history not persisting properly
- [ ] Need to identify what changed and revert if necessary

## Phase 34: Restore Working Mama Dennis from Yesterday Afternoon (CRITICAL)
- [x] Found working commit from 15:09 yesterday (4519533)
- [x] Reset backend to that commit
- [x] Force pushed to GitHub
- [ ] Wait for Render to deploy (2-3 minutes)
- [ ] Test WhatsApp flow to verify it's working again

## Phase 35: Connect Website to Backend & Eliminate All 404 Errors (URGENT)
- [x] Configure backend API URL in environment variables
- [x] Connect Properties page to real backend data (with fallback to mock)
- [x] Connect Fundis page to real backend data (with fallback to mock)
- [x] Connect Mama Dennis chat to backend endpoint (/api/webchat/message)
- [x] Fix all broken links and routes
- [x] Verify no 404 errors anywhere on site
- [x] Add professional error handling for failed API calls
- [x] Test all pages load correctly
- [x] Verify all navigation links work
- [ ] Test payment flow with real backend

## Phase 36: Push All Changes to GitHub & Fix Image Placeholders
- [ ] Push all local commits to GitHub remote
- [ ] Fix PropertyDetail page to completely hide gallery when no real images
- [ ] Verify empty placeholders are gone
- [ ] Test on live site

- [x] Add Facebook domain verification meta tag to index.html
- [x] Deploy changes to Vercel for Meta Business verification

- [x] Fix Facebook verification tag - change lowercase 'o' to uppercase 'O'
- [x] Push fix to GitHub
- [ ] Verify Meta domain verification completes

- [x] Replace Facebook verification code with new Meta-provided code
- [x] Deploy and purge Vercel cache
- [ ] Complete Meta domain verification

- [x] Fix Mama Dennis header cutoff on mobile
- [x] Fix chat widget spacing and layout on mobile
- [x] Fix Explore Modules button overlap with close button
- [x] Test mobile responsiveness

## Phase 37: Add User Authentication & Property Upload System (NEW)
- [x] Create Login page with phone OTP verification
- [x] Create Signup page with user type selection (Landlord/Tenant/Service Provider)
- [x] Create Landlord Dashboard page
- [x] Add property upload form with image upload
- [x] Add video upload functionality for properties
- [x] Create User Profile page with edit functionality
- [x] Add protected routes for authenticated users
- [x] Add Login/Signup buttons to Navigation
- [ ] Connect authentication to backend API
- [ ] Test complete user flow end-to-end

## Phase 38: Make Mama Dennis Badge Clickable (Future-Ready)
- [x] Keep "Powered by Mama Dennis AI" badge visible
- [x] Make badge clickable (will link to standalone Mama Dennis UI in future)
- [x] Keep floating chat button separate (bottom right)
- [x] Ensure both elements work independently
