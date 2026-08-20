# 🏡 RentNest — 100% Direct Owner Rental & Map-First Housing Platform

**Zero Brokerage • Direct Landlord Connections • Real-Time Interactive Map Search**

---

## 📌 1. Project Overview

**RentNest** is a rental housing web application designed to connect **Home Seekers (Tenants)** and **House Owners (Landlords)** directly without any middlemen or broker commissions. 

By combining **interactive map exploration (with Leaflet & OpenStreetMap)**, **neighborhood distance measuring**, **instant verification flows**, and **role-based portals**, RentNest makes renting homes transparent, fast, and cost-effective.

---

## 🚀 2. Core Value Proposition: How RentNest Helps Users Find & List Homes

| For Home Seekers / Rent Persons 🔑 | For House Owners / Landlords 🏠 |
| :--- | :--- |
| **0% Brokerage & Hidden Fees**: Connect directly with verified homeowners via phone or in-app inquiry. | **Direct Tenant Reach**: Post listings with high-res photos, amenities, advance deposit, and terms. |
| **Interactive Map Explorer**: View homes pinned on Clean, Street, or Satellite tiles with price badges. | **Tenant Inquiry Dashboard**: Receive and review direct inquiry messages in real-time. |
| **Live Distance Calculator**: Measure exact walking & driving distance from any property to work, metro, or college. | **Zero Broker Intermediaries**: Retain full control over screening and tenant agreements. |
| **Smart Filtering**: Filter by Rent range, BHK type (1 RK, 1 BHK, 2 BHK, 3 BHK+), Furnishing, and Bachelors/Family allowed. | **Instant Publishing**: Automatic geolocation coordinates conversion from neighborhood addresses. |

---

## 👥 3. User Roles & Account Types

RentNest accommodates two primary user personas with specialized interfaces:

### 🏠 A. House Owner (Landlord)
- **Permissions**: Post new rental properties, upload photos, set monthly rent and security deposits, view inquiries sent by interested tenants.
- **Workflow**:
  1. Register as **House Owner**.
  2. Click **List Property** / **Post New Property**.
  3. Fill out location, BHK type, rent, furnishing, and amenities.
  4. Manage property listings and inquiries from the **Owner Dashboard**.

### 🔑 B. Rent Person (Tenant / Seeker)
- **Permissions**: Search listings with multi-attribute filters, use the interactive spatial map, calculate distances to daily commute points, and send direct inquiry messages to owners.
- **Workflow**:
  1. Register as **Rent Person** or use **1-Click Guest Login**.
  2. Search by city, area, rent budget, or map bounding box.
  3. Inspect property specs, neighborhood highlights, and owner contact details.
  4. Send direct messages or call owners directly.

---

## 🔐 4. Interactive Authentication Suite

RentNest provides an authentication system supporting three flexible sign-in mechanisms:

1. **📧 Email & Password Authentication**
   - Direct registration with full legal validation (Age must be **≥ 18 years**).
   - Instant sign-in with password visibility toggling and demo auto-fill for testing.

2. **📱 Phone Number Login (Simulated OTP)**
   - Country code selector (`+91`, `+1`, `+44`, `+971`).
   - Interactive 6-digit OTP verification interface with auto-advancing digit boxes, 30s countdown timer, and 1-click test auto-fill.

3. **✨ 1-Click Guest Access (No Password Required)**
   - **Guest Rent Person**: Instant exploration of listings, map pins, and filters.
   - **Guest House Owner**: Instant demo access to the listing wizard and owner dashboard.

4. **🌐 Google 1-Click Sign-In**
   - Integrated with graceful error handling and popup cancellation resilience.

---

## 🗺️ 5. Key Interactive Features

- **Interactive Map Explorer (`/map`)**:
  - Full-screen Leaflet map integration with price markers.
  - Multi-style switcher: **Clean**, **Street**, and **Satellite** views.
  - Interactive property preview cards upon marker click.
- **Commute & Distance Calculator**:
  - Pinpoints distance in kilometers and estimated commute time to popular landmarks, IT parks, and transit hubs.
- **Advanced Filtering Suite (`/search`)**:
  - Filter by City (*Bangalore, Mumbai, Mysuru, Delhi, Hyderabad, Pune, Chennai*).
  - Price slider with min/max budget.
  - BHK configuration & furnishing status (*Furnished, Semi-Furnished, Unfurnished*).
  - Tenant preferences (*Bachelors Allowed, Family Only, Any*).
- **Direct Tenant-Owner Inquiries (`/dashboard`)**:
  - Message landlords directly from any listing page; landlords receive organized requests in their inbox.

---

## 💻 6. How to Run & Use the Application

### Step 1: Open the Application
Navigate to the root URL `/` in your browser.

### Step 2: Choose Your Mode
- **Looking for a Home?**
  - Click **"Find Homes"** or **"Map Explorer"** in the top navigation.
  - Adjust your city and budget filters.
  - Click on any property card to view high-resolution photos, exact amenities, and owner contact buttons.
- **Listing a House for Rent?**
  - Click **"Sign In"** or **"Register"** and choose **"House Owner"**.
  - Head to **"List Property"**, enter your apartment address, rent, and photos, and hit **Publish**. Your listing immediately appears on the search page and map.

### Step 3: Managing Profile & Settings
- Visit `/dashboard` to review your active listings and tenant messages.
- Visit `/profile` to update your age, phone number, residential address, or switch roles.

---

## 🛠️ 7. Tech Stack Architecture

- **Frontend**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS (clean, responsive, anti-slop design).
- **Mapping & Geolocation**: Leaflet & React-Leaflet with OpenStreetMap tiles.
- **Backend & API**: Express.js REST API with full-stack Node runtime.
- **Database**: Cloud SQL (PostgreSQL) managed via Drizzle ORM.
- **Authentication**: Firebase Authentication with resilient multi-provider fallback.
- **State Management**: TanStack React Query for smooth caching and synchronization.

---

## 📄 8. License & Notice
Developed for zero-brokerage transparent house hunting. All rights reserved.
