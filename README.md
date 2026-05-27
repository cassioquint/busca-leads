# BuscaLeads 🎯

**BuscaLeads** is a high-performance, visual sales intelligence and CRM platform designed specifically for independent sales professionals, representatives, and high-velocity outbound teams (such as insurance, consortium, and healthcare plan brokers). 

Instead of dealing with empty dashboards or complex corporate workflows, **BuscaLeads** acts as a "hunting tool," allowing salespeople to scan local regions for businesses, qualify prospects visually using Google Maps imagery, instantly initiate personalized WhatsApp approaches, and manage their sales pipeline in one seamless interface.

---

## 🚀 Key Features

*   **Prospecção Radar (Lead Prospecting Radar):** Search for business niches (e.g., bakeries, auto centers, beauty salons) in specific cities/regions with instant data extraction.
*   **Visual Qualification:** Each lead card displays a high-quality storefront image, enabling brokers to gauge the size and potential of a business before reaching out.
*   **HOT Ribbon - Grand Openings Detector:** A dedicated intelligence feed tracking newly issued CNPJs/registrations. Salespeople can find brand-new businesses that haven't even registered on Google Maps yet, ensuring they are the first to pitch.
*   **One-Click WhatsApp Approach:** Instantly opens WhatsApp Web or mobile apps with automated, dynamic message templates custom-tailored to the prospect's name and region—reducing outreach time from minutes to seconds.
*   **Customizable Kanban Pipeline:** A highly flexible, drag-and-drop pipeline (similar to Trello) with pre-configured sales stages (*To Approach, Contacted, Proposal Sent, In Negotiation*) that can be personalized by the user.
*   **Follow-up & Timing Alerts:** Set exact recall dates for lukewarm leads. When the moment of purchase arrives, the lead card visually flags the salesperson with critical alerts (e.g., *"🔔 Re-engage Today"*).

---

## 🛠️ Tech Stack & Architecture

This repository contains the interactive frontend MVP built on a modern, responsive, and blazing-fast stack:

*   **Frontend Framework:** React with TypeScript
*   **Styling & UI:** Tailwind CSS (Clean, sleek, and highly responsive dark/light accent layout)
*   **Icons:** Lucide React
*   **Build Tool / Environment:** Vite (originally bootstrapped via Lovable.dev)

### Architecture Strategy (Production Blueprint)
To keep third-party API costs at a minimum, the production backend relies on a **Lazy-Loading Cache-Aside** strategy. Common search terms and regional queries are cached in a local database for 15 days, ensuring instantaneous local query performance and drastic infrastructure cost reductions.

---

## 📦 Getting Started Locally

To run the frontend interactive prototype on your machine:

1. Clone the repository:
```bash
   git clone [https://github.com/YOUR_USERNAME/buscaleads.git](https://github.com/YOUR_USERNAME/buscaleads.git)
