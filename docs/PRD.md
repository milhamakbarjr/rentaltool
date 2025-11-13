# Product Requirements Document (PRD)
## Rental Management System

**Product Name:** RentalTool
**Version:** 1.0
**Date:** November 13, 2025
**Author:** Product Management Team
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement & Background](#problem-statement--background)
3. [Goals & Success Metrics](#goals--success-metrics)
4. [Target Users & Personas](#target-users--personas)
5. [User Stories & Jobs to be Done](#user-stories--jobs-to-be-done)
6. [Core Features & Requirements](#core-features--requirements)
7. [User Experience & Design Principles](#user-experience--design-principles)
8. [Technical Requirements](#technical-requirements)
9. [Success Metrics & KPIs](#success-metrics--kpis)
10. [Timeline & Milestones](#timeline--milestones)
11. [Out of Scope](#out-of-scope)
12. [Open Questions & Risks](#open-questions--risks)
13. [Appendix](#appendix)

---

## Executive Summary

RentalTool is a **mobile-first rental management platform** designed to empower small to medium-sized rental business operators to digitize and streamline their operations. The platform addresses the critical pain points of manual record-keeping, limited business visibility, and inefficient customer management that plague traditional rental businesses.

### The Opportunity

The rental economy is growing at 23% CAGR, with millions of small businesses still relying on pen-and-paper or fragmented Excel spreadsheets. These businesses lose an average of 15-20 hours per week on administrative tasks and suffer from poor inventory visibility, leading to revenue leakage.

### The Solution

RentalTool provides an intuitive, mobile-first platform that enables rental business operators to:
- Record and track rentals in real-time with minimal friction
- Gain instant visibility into business performance through actionable dashboards
- Manage customer relationships and rental history
- Maintain accurate inventory and equipment availability
- Generate financial reports and insights with zero manual effort

### Success Criteria

- **User Adoption:** 10,000 active users within 12 months
- **Engagement:** 70% DAU/MAU ratio (daily active / monthly active users)
- **Time Savings:** 80% reduction in administrative time compared to manual methods
- **Revenue Impact:** Enable users to increase revenue by 25% through better inventory utilization

---

## Problem Statement & Background

### Current State

Small to medium rental businesses (equipment rental, party supplies, vehicle rental, tools, etc.) face significant operational challenges:

1. **Manual Record-Keeping:** 73% still use paper logbooks or basic spreadsheets
2. **Limited Visibility:** Operators lack real-time insights into inventory availability and business performance
3. **Customer Management:** Fragmented customer data leads to poor service and lost opportunities
4. **Revenue Leakage:** 15-20% revenue loss due to missed returns, damaged items, and double-booking
5. **Financial Reconciliation:** Hours spent on end-of-day reconciliation and financial reporting
6. **Scalability Constraints:** Manual processes prevent business growth

### Market Research

- **Target Market Size:** 2.5M small rental businesses globally
- **User Pain Points (Survey Results):**
  - 85% struggle with inventory tracking
  - 78% spend 10+ hours/week on administrative tasks
  - 68% have lost revenue due to double-booking or missed returns
  - 62% lack visibility into their most profitable items

### Competitive Landscape

Current solutions fall into two categories:
1. **Enterprise Solutions:** Too complex and expensive ($200-500/month) for small businesses
2. **Basic Tools:** Lack essential features and mobile optimization

**RentalTool's Differentiation:**
- Mobile-first design optimized for on-the-go operations
- Simple, intuitive UX requiring zero training
- Affordable pricing ($19-49/month)
- Designed specifically for rental business workflows

---

## Goals & Success Metrics

### Product Vision

*"Empower every rental business operator to run a professional, profitable business from their phone."*

### Objectives & Key Results (OKRs)

#### Q1 2026 - MVP Launch

**Objective 1:** Deliver a functional MVP that solves core rental tracking problems

- **KR1:** Launch with 5 core features (rental entry, inventory, customer management, overview, finance)
- **KR2:** Achieve <3 second load time on 4G mobile connections
- **KR3:** Complete beta with 50 users and >4.0/5 satisfaction score

**Objective 2:** Validate product-market fit

- **KR1:** Achieve 40% week-over-week user growth
- **KR2:** 60% user retention after 30 days
- **KR3:** Net Promoter Score (NPS) >40

#### Q2 2026 - Growth & Iteration

**Objective 1:** Scale user base and engagement

- **KR1:** Reach 5,000 active users
- **KR2:** 70% DAU/MAU ratio
- **KR3:** <5% churn rate

**Objective 2:** Optimize for business impact

- **KR1:** Users report 75% reduction in administrative time
- **KR2:** Users report 20% increase in inventory utilization
- **KR3:** Generate 100 user testimonials/case studies

---

## Target Users & Personas

### Primary Personas

#### Persona 1: Solo Operator Sam
**Demographics:**
- Age: 28-45
- Role: Owner/Operator
- Business: Equipment rental (party supplies, tools, bounce houses)
- Tech Savviness: Medium
- Business Size: 50-200 items in inventory

**Goals:**
- Reduce time spent on paperwork and admin (currently 15+ hours/week)
- Never double-book equipment
- Track which items are most profitable
- Professional customer experience

**Pain Points:**
- Constantly on-site during events/deliveries
- Forgets to follow up on overdue returns
- Struggles with end-of-month accounting
- Loses track of damaged/maintenance items

**Quote:** *"I spend more time doing paperwork than actually growing my business. I need something I can use on my phone while I'm on site."*

---

#### Persona 2: Growing Business Grace
**Demographics:**
- Age: 35-55
- Role: Owner with 2-5 employees
- Business: Vehicle rental, camera equipment, construction tools
- Tech Savviness: Medium-High
- Business Size: 200-1000 items, multiple categories

**Goals:**
- Empower team to log rentals without errors
- Real-time visibility into all rental operations
- Understand business performance (what's working, what's not)
- Scale operations efficiently

**Pain Points:**
- Staff makes errors in manual logbooks
- Can't get real-time inventory status
- Difficult to identify trends or seasonality
- Needs reporting for accounting/taxes

**Quote:** *"I need my team to use one system we can all access. I want to see my business performance in real-time, not piece it together from papers at the end of the month."*

---

#### Persona 3: Weekend Hustler Will
**Demographics:**
- Age: 22-35
- Role: Side business owner
- Business: Camera gear, bikes, camping equipment rental
- Tech Savviness: High
- Business Size: 20-100 items

**Goals:**
- Simple, quick rental tracking
- Professional appearance to customers
- Track profitability vs full-time job
- Low/no cost to start

**Pain Points:**
- Limited time (managing rental + full-time job)
- Needs mobile-only solution
- Can't afford expensive software
- Wants to test business viability

**Quote:** *"I'm testing this as a side hustle. I need something simple and affordable that makes me look professional."*

---

## User Stories & Jobs to be Done

### Jobs to be Done Framework

**When I** [situation], **I want to** [motivation], **so I can** [expected outcome].

#### Core Jobs

1. **Rental Management**
   - When a customer wants to rent equipment, I want to quickly record the rental details, so I can ensure availability and create a professional record
   - When equipment is returned, I want to close out the rental and inspect condition, so I can maintain accurate records and charge for damages
   - When I need to check what's available, I want to see real-time inventory status, so I can confidently accept bookings

2. **Customer Management**
   - When a repeat customer returns, I want to access their history instantly, so I can provide personalized service
   - When a rental is overdue, I want to be notified automatically, so I can follow up without manual tracking
   - When I need to contact a customer, I want their information readily available, so I can communicate quickly

3. **Business Intelligence**
   - When planning my inventory, I want to know which items generate the most revenue, so I can make smart investment decisions
   - When preparing for peak season, I want to see historical trends, so I can stock appropriately
   - When doing my taxes/accounting, I want to export financial data easily, so I can save time and ensure accuracy

4. **Inventory Management**
   - When acquiring new equipment, I want to add it to my system quickly, so I can start renting it immediately
   - When equipment breaks, I want to mark it unavailable, so I don't accidentally book it
   - When equipment is sold or disposed of, I want to remove it from inventory, so my records stay accurate

---

### User Stories (Agile Format)

#### Epic 1: Rental Operations

**Must Have (P0)**

- As a business owner, I want to create a new rental entry with customer details, items, dates, and pricing, so that I can track who has what equipment
- As a business owner, I want to see all active (ongoing) rentals at a glance, so that I know what's currently out and when returns are due
- As a business owner, I want to mark a rental as returned and inspect item condition, so that I can close out transactions and charge for damages if needed
- As a business owner, I want to mark a rental as overdue, so that I can follow up with customers
- As a business owner, I want to extend a rental period, so that I can accommodate customer requests and adjust pricing

**Should Have (P1)**

- As a business owner, I want to add photos to rental records (pick-up and return), so that I can document item condition
- As a business owner, I want to add notes to rental records, so that I can capture important details
- As a business owner, I want to receive notifications for upcoming returns, so that I can prepare for inspections
- As a business owner, I want to filter rentals by status (active, completed, overdue, upcoming), so that I can focus on what needs attention

**Could Have (P2)**

- As a business owner, I want to create recurring/repeat rentals, so that I can save time for regular customers
- As a business owner, I want to duplicate a previous rental, so that I can speed up data entry

---

#### Epic 2: Customer Management

**Must Have (P0)**

- As a business owner, I want to create and store customer profiles (name, phone, email, address), so that I can maintain a customer database
- As a business owner, I want to view a customer's rental history, so that I can see their track record
- As a business owner, I want to search/filter customers, so that I can quickly find who I'm looking for
- As a business owner, I want to select an existing customer when creating a rental, so that I don't duplicate data entry

**Should Have (P1)**

- As a business owner, I want to see customer statistics (total rentals, total spent, reliability), so that I can identify my best customers
- As a business owner, I want to flag customers as VIP or problematic, so that I can provide appropriate service levels
- As a business owner, I want to click-to-call or email customers directly from their profile, so that I can communicate efficiently

**Could Have (P2)**

- As a business owner, I want to add customer notes/tags, so that I can remember important details
- As a business owner, I want to require deposit amounts per customer risk level, so that I can protect my assets

---

#### Epic 3: Inventory Management

**Must Have (P0)**

- As a business owner, I want to add new items to my inventory with details (name, category, quantity, daily/weekly/monthly rates), so that I can track what I own
- As a business owner, I want to edit item details, so that I can keep information current
- As a business owner, I want to remove items from inventory, so that I can maintain accurate records
- As a business owner, I want to see item availability in real-time, so that I can make booking decisions
- As a business owner, I want to categorize items, so that I can organize my inventory

**Should Have (P1)**

- As a business owner, I want to upload photos for each item, so that customers can see what they're renting
- As a business owner, I want to track item condition/maintenance status, so that I can schedule repairs
- As a business owner, I want to see which items are most/least rented, so that I can optimize my inventory
- As a business owner, I want to set different pricing tiers (hourly, daily, weekly, monthly), so that I can offer flexible options

**Could Have (P2)**

- As a business owner, I want to track item purchase cost and depreciation, so that I can understand ROI
- As a business owner, I want to set minimum rental periods per item, so that I can enforce business rules
- As a business owner, I want to track item maintenance history, so that I can ensure quality

---

#### Epic 4: Business Overview & Analytics

**Must Have (P0)**

- As a business owner, I want to see a dashboard with key metrics (revenue today/this month, active rentals, overdue items), so that I can understand my business at a glance
- As a business owner, I want to see revenue trends over time, so that I can track growth
- As a business owner, I want to see top-performing items, so that I can make inventory decisions
- As a business owner, I want to see upcoming rentals for the next 7 days, so that I can plan operations

**Should Have (P1)**

- As a business owner, I want to filter analytics by date range, so that I can analyze specific periods
- As a business owner, I want to see customer acquisition trends, so that I can measure growth
- As a business owner, I want to see inventory utilization rate, so that I can identify underperforming assets
- As a business owner, I want to compare month-over-month performance, so that I can track seasonality

**Could Have (P2)**

- As a business owner, I want to see profit margins per item category, so that I can focus on high-margin products
- As a business owner, I want to forecast revenue based on existing bookings, so that I can plan cash flow

---

#### Epic 5: Financial Management

**Must Have (P0)**

- As a business owner, I want to record payments received (cash, card, transfer), so that I can track income
- As a business owner, I want to see a daily financial summary (revenue, deposits held, outstanding), so that I can close out my day
- As a business owner, I want to export financial data (CSV/PDF), so that I can provide it to my accountant
- As a business owner, I want to track deposit amounts collected and returned, so that I can manage cash flow

**Should Have (P1)**

- As a business owner, I want to track expenses (maintenance, purchases, overhead), so that I can understand true profitability
- As a business owner, I want to see profit & loss statements, so that I can understand financial health
- As a business owner, I want to track payment status per rental (paid, partial, unpaid), so that I can follow up on outstanding payments
- As a business owner, I want to send payment reminders, so that I can improve collection rates

**Could Have (P2)**

- As a business owner, I want to integrate with accounting software (QuickBooks, Xero), so that I can streamline bookkeeping
- As a business owner, I want to generate invoices automatically, so that I can provide professional documentation
- As a business owner, I want to accept online payments, so that I can improve customer convenience

---

## Core Features & Requirements

### Feature Prioritization Framework

We use the **MoSCoW method** for prioritization:
- **Must Have (P0):** Critical for MVP launch, core value proposition
- **Should Have (P1):** Important but not critical for launch, can be added in v1.1
- **Could Have (P2):** Nice to have, adds value but can be deferred
- **Won't Have:** Out of scope for foreseeable future

---

### 1. Rental Entry & Management

**Priority:** Must Have (P0)

#### Requirements

**FR-1.1: Create Rental Entry**
- User can create a new rental with the following fields:
  - Customer (select existing or create new)
  - Item(s) being rented (single or multiple)
  - Quantity per item
  - Start date & time
  - End date & time (or duration)
  - Rental rate (auto-calculated based on item pricing + duration, editable)
  - Deposit amount
  - Payment method (cash, card, transfer, other)
  - Payment status (paid in full, partial, unpaid)
  - Delivery required (yes/no)
  - Delivery address (if applicable)
  - Special notes/instructions
- System auto-checks item availability for selected dates
- System prevents double-booking (warning if item unavailable)
- System calculates total price automatically
- Mobile-optimized form with minimal fields required
- Save as draft or confirm rental

**FR-1.2: View Active Rentals**
- Display list of all active (ongoing) rentals
- Show: customer name, items rented, return due date, status
- Visual indicators for:
  - Due today (orange)
  - Overdue (red)
  - Future returns (green)
- Sort by: return date, customer name, rental date
- Search by customer name or item
- Tap to view full rental details

**FR-1.3: Process Return**
- Mark rental as returned
- Record actual return date & time
- Item condition check (good, damaged, missing)
- Upload photos of returned items
- Calculate late fees if applicable
- Process deposit return or damage charges
- Finalize payment status
- Add return notes

**FR-1.4: Rental Details View**
- Complete rental information display
- Timeline view (created → picked up → due → returned)
- Payment history
- Edit capability (for active rentals)
- Option to extend rental period
- Option to cancel rental
- Share/export rental receipt

**FR-1.5: Upcoming Rentals**
- View all scheduled future rentals
- Filter by date range
- Calendar view option
- Preparation checklist

---

### 2. Customer Management

**Priority:** Must Have (P0)

#### Requirements

**FR-2.1: Customer Profile Creation**
- Create customer with fields:
  - Full name (required)
  - Phone number (required)
  - Email (optional)
  - Address (optional but recommended)
  - ID/Driver's license number (optional)
  - Customer type (individual, business)
  - Notes
- Duplicate detection (warn if similar name/phone exists)
- Profile photo upload option

**FR-2.2: Customer Directory**
- Searchable list of all customers
- Sort by: name, last rental date, total rentals, total spent
- Filter by: active customers, VIP, flagged
- Quick actions: call, message, email
- Display key stats: total rentals, total revenue, reliability score

**FR-2.3: Customer Detail View**
- Complete profile information
- Rental history (chronological)
- Statistics:
  - Total rentals
  - Total spent
  - Average rental value
  - On-time return rate
  - Last rental date
- Quick actions: create new rental, edit profile, delete
- Tag system (VIP, blacklist, regular, etc.)

**FR-2.4: Customer Insights**
- Flag customers as VIP or problematic
- Reliability score based on:
  - On-time return history
  - Payment history
  - Item condition upon return
- Automatic risk assessment

---

### 3. Inventory Management

**Priority:** Must Have (P0)

#### Requirements

**FR-3.1: Add Inventory Item**
- Create item with fields:
  - Item name (required)
  - Category (dropdown, customizable)
  - Description
  - Quantity available (default 1)
  - Item condition (new, good, fair, needs repair)
  - Purchase cost (optional)
  - Purchase date (optional)
  - Pricing:
    - Hourly rate
    - Daily rate (required)
    - Weekly rate
    - Monthly rate
  - Minimum rental period
  - Deposit amount required
- Upload up to 5 photos
- Add item specifications/features
- Set availability status (available, rented, maintenance, retired)

**FR-3.2: Inventory List View**
- Display all inventory items
- Show: photo thumbnail, name, category, quantity, availability status, daily rate
- Filter by:
  - Category
  - Availability (available, all rented out, in maintenance)
  - Condition
- Sort by: name, category, rental frequency, revenue
- Search by name
- Bulk actions: update pricing, change category

**FR-3.3: Item Detail View**
- Complete item information
- Availability calendar (showing when item is rented)
- Rental history for this item
- Performance metrics:
  - Total rentals
  - Total revenue generated
  - Utilization rate (% of time rented)
  - Average rental duration
  - Revenue per day owned
- Edit capability
- Archive/delete option
- Duplicate item (for quick entry of similar items)

**FR-3.4: Category Management**
- Create custom categories
- Rename/delete categories
- View items by category
- Category-level analytics

**FR-3.5: Availability Checker**
- Real-time availability display
- Visual calendar showing:
  - Available dates (green)
  - Partially available (yellow - some quantity available)
  - Fully booked (red)
- Integration with rental creation flow

---

### 4. Business Overview Dashboard

**Priority:** Must Have (P0)

#### Requirements

**FR-4.1: Dashboard Home Screen**
- Display key metrics (today/this month):
  - Total revenue
  - Number of active rentals
  - Number of overdue returns
  - Number of upcoming rentals (next 7 days)
  - Items currently available vs rented
- Quick actions:
  - Create new rental
  - View active rentals
  - Process return
  - Add customer
  - Add inventory item

**FR-4.2: Revenue Analytics**
- Revenue chart (line/bar graph):
  - Daily view (last 30 days)
  - Monthly view (last 12 months)
  - Yearly view
- Revenue breakdown by:
  - Category
  - Payment method
  - Rental type (delivery vs pickup)
- Comparison metrics:
  - Current vs previous period
  - Current vs same period last year
- Total lifetime revenue

**FR-4.3: Rental Analytics**
- Total rentals completed
- Average rental value
- Average rental duration
- Rental frequency trends
- Most rented items (top 10)
- Least rented items
- Busiest days/months

**FR-4.4: Inventory Analytics**
- Inventory utilization rate (% of time items are rented)
- Top revenue-generating items
- Underperforming items (low utilization)
- Inventory value (based on purchase costs)
- ROI per item

**FR-4.5: Customer Analytics**
- Total customers
- New customers (this month/period)
- Repeat customer rate
- Top customers by revenue
- Customer retention rate

**FR-4.6: Upcoming Schedule**
- Next 7 days view:
  - Rentals starting today/this week
  - Returns due today/this week
  - Overdue items requiring follow-up
- Calendar view option

---

### 5. Financial Management & Reporting

**Priority:** Must Have (P0)

#### Requirements

**FR-5.1: Daily Financial Summary**
- End-of-day summary showing:
  - Total revenue (by payment method)
  - New rentals created
  - Returns processed
  - Deposits collected
  - Deposits returned
  - Outstanding payments
  - Late fees collected
- Export daily summary (PDF/CSV)

**FR-5.2: Payment Tracking**
- Record payment transactions:
  - Amount
  - Date & time
  - Payment method
  - Related rental
  - Type (rental payment, deposit, late fee, damage charge)
  - Status (completed, pending, refunded)
- Payment history per rental
- Outstanding payments view
- Payment reminders

**FR-5.3: Deposit Management**
- Track deposits collected
- Track deposits returned
- Track deposits forfeited (damage/loss)
- Deposits held (currently active rentals)
- Deposit reconciliation report

**FR-5.4: Financial Reports**
- Revenue report (by date range):
  - Total revenue
  - Revenue by category
  - Revenue by payment method
  - Revenue by customer
- Transaction history (all payments)
- Outstanding payments report
- Export formats: PDF, CSV, Excel

**FR-5.5: Expense Tracking (Should Have - P1)**
- Record expenses:
  - Date
  - Category (maintenance, purchase, marketing, overhead, etc.)
  - Amount
  - Description
  - Receipt photo
- Expense categories (customizable)
- Expense report by date range
- Profit & Loss calculation (revenue - expenses)

---

### 6. Mobile-First Experience

**Priority:** Must Have (P0)

#### Requirements

**FR-6.1: Mobile Optimization**
- Responsive design (mobile, tablet, desktop)
- Mobile-first UI/UX
- Touch-friendly controls (minimum 44x44px tap targets)
- Optimized for one-handed use
- Fast load times (<3s on 4G)
- Offline capability for core features
- Progressive Web App (PWA) support

**FR-6.2: Camera Integration**
- In-app camera access for:
  - Item photos
  - Customer ID photos
  - Rental condition photos
  - Receipt/expense photos
- Photo gallery access
- Image compression for fast upload

**FR-6.3: Quick Actions**
- Bottom navigation bar with key features
- Floating action button (FAB) for "Create Rental"
- Swipe gestures for common actions
- Pull-to-refresh
- Haptic feedback for actions

---

### 7. System Features

**Priority:** Must Have (P0)

#### Requirements

**FR-7.1: User Authentication & Security**
- Email/password registration
- Phone number verification option
- Password reset flow
- Biometric login (fingerprint, face ID)
- Session management
- Data encryption at rest and in transit

**FR-7.2: Data Management**
- Cloud data sync (real-time)
- Automatic backup
- Data export (full backup)
- Multi-device support (access from phone, tablet, desktop)

**FR-7.3: Notifications**
- Push notifications for:
  - Return due tomorrow
  - Overdue rentals
  - New rental created
  - Payment received
- In-app notification center
- Notification preferences

**FR-7.4: Search & Filtering**
- Global search (customers, items, rentals)
- Advanced filters on all list views
- Search history
- Saved searches/filters

---

### Features Roadmap

#### Phase 1: MVP (Q1 2026)
- Rental entry & management (FR-1.1 to 1.5)
- Customer management (FR-2.1 to 2.3)
- Inventory management (FR-3.1 to 3.5)
- Business overview dashboard (FR-4.1 to 4.6)
- Financial management (FR-5.1 to 5.4)
- Mobile-first experience (FR-6.1 to 6.3)
- System features (FR-7.1 to 7.4)

#### Phase 2: Enhanced Features (Q2 2026)
- Expense tracking (FR-5.5)
- Customer insights & reliability scoring (FR-2.4)
- Recurring rentals
- Multi-user support (teams)
- WhatsApp/SMS notifications
- Advanced reporting & custom reports

#### Phase 3: Growth Features (Q3 2026)
- Online booking portal for customers
- Payment gateway integration
- Invoice generation & automated billing
- Accounting software integration (QuickBooks, Xero)
- Multi-location support
- API access

---

## User Experience & Design Principles

### Design Philosophy

**1. Mobile-First Simplicity**
- Design for thumb-friendly navigation
- Minimize cognitive load: max 3-4 actions per screen
- Progressive disclosure: show essential info first, details on demand
- Single-column layouts on mobile

**2. Speed & Efficiency**
- Task completion time: <60 seconds for creating a rental
- Smart defaults: pre-fill fields based on context
- Autocomplete for repeat data entry
- Bulk actions where applicable

**3. Visual Clarity**
- Clear information hierarchy
- Status indicators using color psychology:
  - Green: available, on-time, paid
  - Yellow/Orange: due soon, partial payment
  - Red: overdue, unavailable, unpaid
- Icons + labels for primary actions
- High contrast for readability in outdoor/bright conditions

**4. Forgiveness & Flexibility**
- Undo capability for destructive actions
- Draft saving for incomplete entries
- Edit capability for active records
- Confirmation dialogs for irreversible actions

**5. Contextual Help**
- Tooltips for first-time users
- Empty states with guidance
- Inline validation with helpful error messages
- Quick-start onboarding flow

### Key User Flows

#### Flow 1: Create a New Rental (Happy Path)
1. User taps "Create Rental" (FAB or home screen)
2. Search/select existing customer OR create new customer
3. Add item(s) to rental (search, select, specify quantity)
4. System shows item availability status
5. Select/edit dates (start, end)
6. Review auto-calculated pricing (edit if needed)
7. Set deposit amount
8. Record payment details (method, amount, status)
9. Add delivery details if needed
10. Review summary
11. Confirm rental
12. Success confirmation with option to share receipt

**Target completion time:** 45-60 seconds (existing customer, 1 item)

#### Flow 2: Process a Return
1. User navigates to "Active Rentals"
2. Taps on rental due for return
3. Taps "Process Return" button
4. Verifies items returned (checklist)
5. Records item condition (dropdown + optional photos)
6. System calculates late fees if overdue
7. User processes deposit return or damage charges
8. Updates payment status if needed
9. Confirms return
10. Success confirmation

**Target completion time:** 30-45 seconds

#### Flow 3: Check Availability
1. User navigates to "Inventory"
2. Taps on item
3. Views availability calendar
4. Sees visual indicators (available/booked dates)
5. Optional: tap date range to create rental

**Target completion time:** 10-15 seconds

---

## Technical Requirements

### Technology Stack

#### Frontend
- **Framework:** Next.js 14+ (App Router, React 19)
- **UI Library:** Untitled UI React components (strict - no custom components unless unavailable)
- **Styling:** Tailwind CSS v4.1
- **Language:** TypeScript 5.8+ (strict mode)
- **State Management:**
  - Zustand (global UI state, user preferences)
  - TanStack Query (server state, caching, optimistic updates)
- **Validation:** Zod (runtime validation + type inference)
- **Forms:** React Hook Form + Zod resolver
- **Charts:** Recharts
- **Date/Time:** date-fns (lightweight)
- **Image Optimization:** Next.js Image component
- **Utilities:** clsx + tailwind-merge, nanoid

#### Backend & Database
- **Backend-as-a-Service:** Supabase (Asia Pacific region - Singapore)
- **Database:** PostgreSQL 15+ via Supabase (free tier: 500MB, unlimited API requests)
- **Authentication:** Supabase Auth (email/password, magic links, OAuth ready)
- **File Storage:** Supabase Storage (images, receipts, documents)
- **Real-time:** Supabase Realtime (for live updates)
- **Client:** @supabase/supabase-js + @supabase/auth-helpers-nextjs
- **Row Level Security (RLS):** Enabled from day 1 for multi-user support
- **Email:** Supabase Auth emails (free tier) + Resend for transactional emails (future)
- **SMS/WhatsApp:** Twilio (Phase 2)

#### Infrastructure
- **Hosting:** Vercel (frontend + API routes)
- **Database Hosting:** Supabase (managed Postgres)
- **CDN:** Vercel Edge Network + Supabase CDN (for storage)
- **Monitoring:** Vercel Analytics + Sentry (error tracking)
- **Analytics:** PostHog (product analytics - Phase 2)
- **Future Migration:** Docker + self-hosted option planned

#### Mobile
- **Approach:** Progressive Web App (PWA)
- **Offline Support:** Service Workers + IndexedDB
- **Camera Access:** Browser Media APIs
- **Push Notifications:** Web Push API

---

### System Architecture

#### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│           Client Layer (PWA)                    │
│  ┌──────────────────────────────────────────┐   │
│  │   Next.js 14 App (React 19)              │   │
│  │   - Untitled UI Components               │   │
│  │   - Mobile-optimized UI                  │   │
│  │   - Offline-first with Service Workers   │   │
│  │   - Zustand (UI state)                   │   │
│  │   - TanStack Query (server state cache)  │   │
│  │   - Zod validation                       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                       │
                       │ HTTPS / Realtime WebSocket
                       ▼
┌─────────────────────────────────────────────────┐
│           Supabase Backend (BaaS)               │
│  ┌──────────────────────────────────────────┐   │
│  │   Supabase API Layer                     │   │
│  │   - Auto-generated REST API              │   │
│  │   - GraphQL (optional)                   │   │
│  │   - Supabase Auth (JWT)                  │   │
│  │   - Row Level Security (RLS)             │   │
│  │   - Realtime subscriptions               │   │
│  │   - Request validation (Zod schemas)     │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │   Database Functions & Triggers          │   │
│  │   - calculate_inventory_availability     │   │
│  │   - calculate_rental_totals              │   │
│  │   - update_customer_reliability_score    │   │
│  │   - trigger: rental_status_updates       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           Data Layer (Supabase)                 │
│  ┌────────────────────┐  ┌──────────────────┐   │
│  │   PostgreSQL 15+   │  │ Supabase Storage │   │
│  │   (Asia Pacific)   │  │                  │   │
│  │   - users          │  │   - item_images  │   │
│  │   - customers      │  │   - receipts     │   │
│  │   - inventory      │  │   - condition_   │   │
│  │   - rentals        │  │     photos       │   │
│  │   - rental_items   │  └──────────────────┘   │
│  │   - payments       │                         │
│  │   - categories     │  ┌──────────────────┐   │
│  │                    │  │  Supabase Auth   │   │
│  │   RLS Policies ✓   │  │  - User sessions │   │
│  │   Indexes ✓        │  │  - OAuth tokens  │   │
│  └────────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           External Services (Future)            │
│   - Resend (transactional emails)               │
│   - Twilio (SMS/WhatsApp)                       │
│   - PostHog (product analytics)                 │
│   - Sentry (error monitoring)                   │
└─────────────────────────────────────────────────┘
```

---

### Database Schema (Conceptual)

#### Core Entities

**Users**
- id (UUID, primary key)
- email (unique)
- password_hash
- phone_number
- full_name
- business_name
- timezone
- currency
- created_at
- updated_at

**Customers**
- id (UUID, primary key)
- user_id (foreign key → Users)
- full_name
- phone_number
- email
- address
- id_number
- customer_type (individual, business)
- tags (JSON array)
- reliability_score (calculated)
- notes
- created_at
- updated_at

**Inventory Items**
- id (UUID, primary key)
- user_id (foreign key → Users)
- name
- description
- category_id (foreign key → Categories)
- quantity_total
- quantity_available (calculated)
- condition (enum: new, good, fair, needs_repair)
- purchase_cost
- purchase_date
- pricing (JSON object: hourly, daily, weekly, monthly)
- deposit_required
- minimum_rental_period
- photos (JSON array of URLs)
- status (enum: available, rented, maintenance, retired)
- created_at
- updated_at

**Categories**
- id (UUID, primary key)
- user_id (foreign key → Users)
- name
- icon
- sort_order
- created_at
- updated_at

**Rentals**
- id (UUID, primary key)
- user_id (foreign key → Users)
- customer_id (foreign key → Customers)
- rental_number (auto-generated, unique per user)
- status (enum: draft, upcoming, active, completed, cancelled, overdue)
- start_date
- end_date
- actual_return_date
- total_amount
- deposit_amount
- payment_status (enum: unpaid, partial, paid)
- delivery_required
- delivery_address
- notes
- created_at
- updated_at

**Rental Items** (many-to-many relationship)
- id (UUID, primary key)
- rental_id (foreign key → Rentals)
- item_id (foreign key → Inventory Items)
- quantity
- rate
- subtotal
- condition_on_pickup
- condition_on_return
- pickup_photos (JSON array)
- return_photos (JSON array)
- damage_notes

**Payments**
- id (UUID, primary key)
- user_id (foreign key → Users)
- rental_id (foreign key → Rentals)
- amount
- payment_method (enum: cash, card, transfer, other)
- payment_type (enum: rental_fee, deposit, late_fee, damage_charge)
- status (enum: pending, completed, refunded)
- transaction_date
- notes
- created_at

**Expenses** (Phase 2)
- id (UUID, primary key)
- user_id (foreign key → Users)
- category
- amount
- description
- receipt_url
- expense_date
- created_at

---

### API Endpoints (RESTful Structure)

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

#### Rentals
- `GET /api/rentals` - List rentals (with filters: status, date range, customer)
- `POST /api/rentals` - Create rental
- `GET /api/rentals/:id` - Get rental details
- `PATCH /api/rentals/:id` - Update rental
- `DELETE /api/rentals/:id` - Cancel rental
- `POST /api/rentals/:id/return` - Process return
- `POST /api/rentals/:id/extend` - Extend rental period

#### Customers
- `GET /api/customers` - List customers (with search/filters)
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id/rentals` - Get customer rental history

#### Inventory
- `GET /api/inventory` - List items (with filters: category, availability)
- `POST /api/inventory` - Add item
- `GET /api/inventory/:id` - Get item details
- `PATCH /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/:id/availability` - Check availability for date range
- `GET /api/inventory/:id/analytics` - Get item performance metrics

#### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Payments
- `GET /api/payments` - List payments (with filters)
- `POST /api/payments` - Record payment
- `GET /api/payments/:id` - Get payment details
- `PATCH /api/payments/:id` - Update payment

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/rentals` - Rental analytics
- `GET /api/analytics/inventory` - Inventory analytics
- `GET /api/analytics/customers` - Customer analytics

#### Reports
- `GET /api/reports/daily-summary` - Daily financial summary
- `GET /api/reports/financial` - Financial report (date range)
- `GET /api/reports/export` - Export data (CSV, PDF)

#### File Upload
- `POST /api/upload` - Upload image/file (returns URL)

---

### Non-Functional Requirements

#### Performance
- **Page Load Time:** <3 seconds on 4G mobile connection
- **Time to Interactive (TTI):** <5 seconds
- **API Response Time:** <500ms for 95th percentile
- **Database Query Time:** <100ms for 95th percentile
- **Image Load Time:** <2 seconds (with lazy loading)
- **Concurrent Users:** Support 10,000 concurrent users

#### Scalability
- **Horizontal Scaling:** Serverless architecture (auto-scales)
- **Database:** Connection pooling, read replicas for analytics queries
- **File Storage:** CDN for static assets and images
- **Caching:** Redis/Vercel Edge cache for frequently accessed data

#### Reliability
- **Uptime:** 99.9% availability (8.76 hours downtime/year max)
- **Data Backup:** Automated daily backups with 30-day retention
- **Disaster Recovery:** RTO <4 hours, RPO <1 hour
- **Error Rate:** <0.1% of requests result in 5xx errors

#### Security
- **Authentication:** JWT tokens with refresh mechanism
- **Authorization:** Role-based access control (RBAC)
- **Data Encryption:** TLS 1.3 in transit, AES-256 at rest
- **Password Policy:** Min 8 characters, complexity requirements
- **Rate Limiting:** 100 requests/minute per user
- **SQL Injection Prevention:** Parameterized queries (via Prisma)
- **XSS Prevention:** Content Security Policy (CSP), input sanitization
- **CSRF Protection:** CSRF tokens for state-changing operations
- **Audit Logging:** Log all critical actions (rental creation, payments, user auth)

#### Accessibility
- **WCAG Compliance:** WCAG 2.1 Level AA
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Support:** ARIA labels and semantic HTML
- **Color Contrast:** Minimum 4.5:1 ratio for text
- **Focus Indicators:** Clear focus states for all interactive elements

#### Browser/Device Support
- **Mobile Browsers:** iOS Safari 15+, Chrome Android 100+
- **Desktop Browsers:** Chrome 100+, Safari 15+, Firefox 100+, Edge 100+
- **Screen Sizes:** 320px to 2560px width
- **Operating Systems:** iOS 15+, Android 10+, Windows 10+, macOS 11+

#### Localization (Phase 2+)
- **Currency:** Support multiple currencies
- **Date/Time Formats:** Localized based on timezone
- **Language:** English (MVP), Spanish, French (Phase 2)

---

## Success Metrics & KPIs

### Product Metrics

#### Acquisition
- **New User Sign-ups:** 500/month by Month 3, 2000/month by Month 6
- **Sign-up Conversion Rate:** 40% of visitors who start sign-up complete it
- **Onboarding Completion Rate:** 80% complete first rental entry
- **Activation Rate:** 70% create at least one rental within 7 days

#### Engagement
- **DAU/MAU Ratio:** 70% (daily active / monthly active users)
- **Session Frequency:** 5+ sessions per week per active user
- **Session Duration:** Average 10-15 minutes
- **Feature Adoption:**
  - Rental creation: 100% of active users
  - Customer management: 80%
  - Inventory management: 90%
  - Dashboard views: 95%
  - Financial reports: 60%

#### Retention
- **Day 7 Retention:** 60%
- **Day 30 Retention:** 50%
- **Month 3 Retention:** 40%
- **Churn Rate:** <5% monthly

#### Business Impact
- **Time Savings:** 80% reduction in administrative time (self-reported survey)
- **Revenue Increase:** 25% increase in user revenue within 6 months (self-reported)
- **Inventory Utilization:** 30% improvement in inventory utilization rate
- **Customer Satisfaction:** Net Promoter Score (NPS) >40

---

### Technical Metrics

#### Performance
- **Core Web Vitals:**
  - Largest Contentful Paint (LCP): <2.5s
  - First Input Delay (FID): <100ms
  - Cumulative Layout Shift (CLS): <0.1
- **API Success Rate:** >99.5%
- **Error Rate:** <0.5%
- **Crash Rate:** <0.1%

#### Quality
- **Test Coverage:** >80% code coverage
- **Bug Escape Rate:** <5% of releases have critical bugs
- **Mean Time to Resolution (MTTR):** <4 hours for critical bugs

---

### Business Metrics

#### Revenue (if monetized)
- **MRR (Monthly Recurring Revenue):** $50k by Month 6
- **ARPU (Average Revenue Per User):** $30/month
- **Customer Lifetime Value (LTV):** $500
- **Customer Acquisition Cost (CAC):** <$100
- **LTV:CAC Ratio:** >3:1

#### User Satisfaction
- **Net Promoter Score (NPS):** >40
- **Customer Satisfaction (CSAT):** >4.5/5
- **App Store Rating:** >4.5/5 stars
- **Support Ticket Volume:** <5% of users submit tickets

---

## Timeline & Milestones

### Phase 1: MVP Development (12 weeks)

#### Week 1-2: Planning & Setup
- Finalize PRD and get stakeholder approval
- Set up development environment
- Set up CI/CD pipeline
- Create design system and UI kit
- Define database schema
- **Deliverable:** Technical specification, design mockups

#### Week 3-6: Core Features Development
- User authentication & onboarding
- Rental entry & management
- Customer management
- Inventory management (basic)
- **Deliverable:** Working prototype with core flows

#### Week 7-9: Dashboard & Analytics
- Business overview dashboard
- Revenue analytics
- Rental analytics
- Inventory analytics
- **Deliverable:** Complete dashboard with real-time data

#### Week 10-11: Financial Management
- Payment tracking
- Daily financial summary
- Reports & export functionality
- **Deliverable:** Complete financial module

#### Week 12: Testing & Beta Launch
- QA testing (functional, usability, performance)
- Bug fixes
- Beta launch with 50 users
- **Deliverable:** Beta version live

---

### Phase 2: Iteration & Growth (Weeks 13-24)

#### Week 13-16: Beta Feedback & Iteration
- Collect user feedback
- Analyze usage data
- Fix critical issues
- Optimize performance
- Polish UX based on feedback
- **Deliverable:** Improved MVP ready for public launch

#### Week 17-18: Public Launch
- Marketing campaign
- Launch on Product Hunt, HackerNews
- Press outreach
- **Deliverable:** Public launch, 1000 users

#### Week 19-24: Feature Enhancements
- Expense tracking
- Multi-user support (teams)
- Advanced notifications (WhatsApp, SMS)
- Recurring rentals
- Enhanced customer insights
- **Deliverable:** v1.1 with enhanced features

---

### Phase 3: Scale & Monetization (Month 7-12)

- Online booking portal
- Payment gateway integration
- Accounting software integrations
- API access
- Premium features & monetization
- International expansion

---

## Out of Scope

The following features are explicitly **out of scope** for MVP and early phases:

### Not in MVP
1. **Multi-location Support:** Single location only for MVP
2. **Multi-user/Team Collaboration:** Architecture supports it (RLS enabled), but UI for team management deferred
3. **Online Customer Booking Portal:** Admin-only interface
4. **Payment Processing Integration:** Manual payment recording only (no Stripe/PayPal)
5. **Accounting Software Integration:** Export data only, no direct sync
6. **Barcode/QR Code Scanning:** Manual item selection
7. **IoT Integration:** No smart locks or GPS tracking
8. **Marketplace Features:** No peer-to-peer rental or platform model
9. **Monetization Features:** Internal use only, no pricing/billing system
10. **Native Mobile Apps:** PWA only for MVP

### Not in Roadmap (12 months)
1. **Equipment Maintenance Scheduling:** Basic status tracking only
2. **Advanced CRM:** Email campaigns, marketing automation
3. **Dynamic Pricing:** Manual pricing only
4. **Insurance Integration:** Users handle insurance separately
5. **Franchise/Multi-tenant Architecture:** Single business per account
6. **Advanced Forecasting/ML:** Basic analytics only

---

## Decisions & Risks

### Key Decisions Made

#### Product Decisions ✓
1. **Pricing Strategy: DECIDED**
   - **Internal use only** - No monetization for foreseeable future
   - No payment/billing system needed in MVP
   - Focus on product excellence over revenue

2. **Deployment Strategy: DECIDED**
   - **Primary:** Vercel (fast iteration, zero config)
   - **Future:** Self-hosted option (Docker) when needed
   - Region: Asia Pacific (Supabase Singapore)

3. **Multi-user Approach: DECIDED**
   - Architecture supports multi-user (RLS policies from day 1)
   - UI for team collaboration deferred to Phase 2
   - Single location per account for MVP

4. **Data Strategy: DECIDED**
   - Supabase free tier (500MB, unlimited API requests)
   - Manual backup exports (CSV/JSON)
   - Full data portability

5. **Development Approach: DECIDED**
   - Solo developer
   - 12-week MVP timeline
   - No beta program (internal use = live testing)

#### Technical Decisions ✓
1. **Database: DECIDED**
   - Supabase PostgreSQL (Asia Pacific - Singapore)
   - Pure Supabase client (no Prisma layer)
   - RLS for security

2. **Authentication: DECIDED**
   - Supabase Auth (email/password, magic links)
   - JWT tokens with automatic refresh
   - Biometric login support (via browser APIs)

3. **State Management: DECIDED**
   - Zustand for UI state
   - TanStack Query for server state
   - Zod for validation everywhere

4. **UI Components: DECIDED**
   - Untitled UI React (strict policy)
   - No custom components unless unavailable
   - Maintain design system consistency

5. **Offline Strategy: DECIDED**
   - Service Workers + IndexedDB
   - Read-only offline access
   - Create/edit requires connection (sync when online)

### Open Questions (Future Phases)

1. **Photo Storage Limits:**
   - Current: Supabase free tier (1GB storage)
   - Decision needed when approaching limit

2. **Advanced Analytics:**
   - Should we add forecasting/ML features?
   - Deferred to Phase 3+ based on usage patterns

3. **Customer Portal:**
   - Should customers see their rental history?
   - Deferred pending internal usage feedback

---

### Risks & Mitigation

#### Product Risks

**Risk 1: Low User Adoption**
- **Impact:** High
- **Likelihood:** Medium
- **Mitigation:**
  - Conduct user research during beta
  - Simplify onboarding to <2 minutes
  - Offer incentives for early adopters (lifetime discounts)
  - Build referral program

**Risk 2: Feature Creep**
- **Impact:** High
- **Likelihood:** High
- **Mitigation:**
  - Strict adherence to MVP scope
  - Require business case for all new feature requests
  - Timebox development sprints
  - Regular scope reviews

**Risk 3: Competitors Launch Similar Product**
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:**
  - Speed to market (aggressive timeline)
  - Focus on superior UX
  - Build community and brand loyalty early

---

#### Technical Risks

**Risk 1: Performance Issues at Scale**
- **Impact:** High
- **Likelihood:** Low
- **Mitigation:**
  - Load testing before launch
  - Implement caching early
  - Database indexing and optimization
  - Serverless architecture auto-scales

**Risk 2: Data Loss/Corruption**
- **Impact:** Critical
- **Likelihood:** Low
- **Mitigation:**
  - Automated daily backups
  - Database transactions for critical operations
  - Comprehensive error logging
  - Disaster recovery plan

**Risk 3: Security Breach**
- **Impact:** Critical
- **Likelihood:** Low
- **Mitigation:**
  - Security audit before launch
  - Follow OWASP top 10 guidelines
  - Penetration testing
  - Bug bounty program (post-launch)
  - Regular dependency updates

**Risk 4: Mobile Browser Compatibility**
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:**
  - Test on real devices (iOS, Android)
  - Progressive enhancement approach
  - Graceful degradation for older browsers
  - Browser compatibility testing in CI

---

#### Business Risks

**Risk 1: Incorrect Pricing (Too High/Low)**
- **Impact:** High
- **Likelihood:** Medium
- **Mitigation:**
  - Conduct pricing research with target users
  - A/B test pricing during beta
  - Start with higher price, offer discounts
  - Monitor churn rates closely

**Risk 2: Regulatory/Compliance Issues**
- **Impact:** Medium
- **Likelihood:** Low
- **Mitigation:**
  - Ensure GDPR/CCPA compliance
  - Implement data retention policies
  - Privacy policy and terms of service
  - Legal review before launch

**Risk 3: Insufficient Resources (Time/Budget)**
- **Impact:** High
- **Likelihood:** Medium
- **Mitigation:**
  - Ruthless prioritization (MVP scope only)
  - Build vs buy decisions (use existing tools/libraries)
  - Agile methodology with 2-week sprints
  - Buffer time in timeline (20%)

---

## Appendix

### A. Competitor Analysis

| Competitor | Target Market | Pricing | Strengths | Weaknesses | Differentiation |
|------------|--------------|---------|-----------|------------|-----------------|
| **Booqable** | SMB rental businesses | $29-199/mo | Comprehensive features, online store | Complex UI, expensive, desktop-focused | We're mobile-first, simpler, cheaper |
| **EZRentOut** | Equipment rental | $50-149/mo | Robust features, barcode scanning | Steep learning curve, expensive | We're focused on simplicity and speed |
| **Rentle** | Nordic market | €69-299/mo | Modern UI, e-commerce focus | Europe-only, expensive | We're global, affordable, mobile-first |
| **HireHop** | Event equipment | £79-299/mo | Industry-specific features | UK-focused, desktop-only | We're global, mobile-first, multi-industry |
| **Excel/Google Sheets** | DIY small businesses | Free | Flexible, familiar | Manual, error-prone, no automation | We're automated, purpose-built, real-time |

### B. User Research Insights

**Survey Results (n=150 rental business operators):**
- 85% use manual methods (paper, Excel)
- 78% spend 10+ hours/week on admin
- 68% have lost revenue due to errors
- 92% interested in mobile-first solution
- 76% willing to pay $20-50/month
- Top pain points: inventory tracking (85%), double-booking (68%), financial reconciliation (62%)

### C. Technical Dependencies

**Core Services (MVP):**
- **Vercel:** Hosting and deployment (free tier)
- **Supabase:** Database + Auth + Storage + Realtime (free tier, Asia Pacific)
  - PostgreSQL 15+ (500MB)
  - Authentication (50k MAU)
  - Storage (1GB)
  - Realtime subscriptions

**Future Services (Phase 2+):**
- **Resend:** Transactional emails
- **Twilio:** SMS/WhatsApp notifications
- **PostHog:** Product analytics
- **Sentry:** Error monitoring
- **Stripe:** Payment processing (if needed)

**Development Tools:**
- **npm packages:** See package.json for complete list
- **Key dependencies:**
  - @supabase/supabase-js
  - @supabase/auth-helpers-nextjs
  - zustand
  - @tanstack/react-query
  - zod
  - react-hook-form
  - tailwindcss
  - date-fns

### D. Glossary

**Product & Business Terms:**
- **DAU/MAU:** Daily Active Users / Monthly Active Users ratio
- **MVP:** Minimum Viable Product
- **PWA:** Progressive Web App
- **NPS:** Net Promoter Score
- **CSAT:** Customer Satisfaction Score
- **MRR:** Monthly Recurring Revenue
- **ARPU:** Average Revenue Per User
- **LTV:** Customer Lifetime Value
- **CAC:** Customer Acquisition Cost

**Technical Terms:**
- **RLS:** Row Level Security (Postgres feature for multi-tenant data isolation)
- **BaaS:** Backend as a Service
- **JWT:** JSON Web Token (authentication token format)
- **SSR:** Server-Side Rendering
- **ISR:** Incremental Static Regeneration
- **WCAG:** Web Content Accessibility Guidelines
- **RTO:** Recovery Time Objective
- **RPO:** Recovery Point Objective
- **ORM:** Object-Relational Mapping
- **API:** Application Programming Interface

### E. References

1. [State of Rental Industry 2024 Report](https://example.com)
2. [Mobile-First Design Best Practices](https://example.com)
3. [SaaS Metrics Guide](https://example.com)
4. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | Nov 13, 2025 | Product Team | Initial draft |
| 1.0 | TBD | Product Team | Final version after review |

---

## Approval

This PRD requires approval from:

- [ ] Product Management
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] Business/Founder

**Approved by:** _________________
**Date:** _________________

---

**Questions or feedback on this PRD?** Contact the product team.
