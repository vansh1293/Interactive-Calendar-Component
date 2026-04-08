# 🗓️ Indian Climate Calendar — Immersive Wall Calendar Component

A world-class, responsive, and seasonal calendar dashboard built with **Next.js 15**, **React**, and **Framer Motion**. This component is designed to feel like a premium physical wall calendar, featuring hyper-localized Indian climate transitions and a professional aesthetic.

---

## 🌟 Key Features

### 1. 🏗️ Precision Grid Architecture
This component is built on a **High-Fidelity Grid System** designed for maximum clarity and pixel perfection.
- **Sub-Pixel Precision**: Every element uses native CSS units for razor-sharp rendering on all display types.
- **Optimized Footprint**: The component is balanced at a **940px** baseline to provide a high-density, professional dashboard experience.

### 2. 🌫️ Immersive Indian Climate Engine
The calendar isn't just a grid—it's an atmosphere. It dynamically adapts to the Indian seasonal cycle:
- **Visual Overlays**: Contextual particles like **Monsoon Mist**, **Dust Haze**, and **Spring Blossoms**.
- **Climate Alerts**: Integrated localized alerts (e.g., "Heatwave Warning" or "Monsoon Onset") that update based on the selected month.
- **Glassmorphic Hero**: High-fidelity seasonal imagery with smooth crossfade transitions.

### 3. 🎯 Advanced Interaction Model
- **Multi-Drag Range Selection**: A custom-built selection engine that supports single clicks, range completions, and drag-to-select functionality.
- **Immersive Focus Mode**: A dedicated "Focus" tool that dims the background atmosphere, allowing users to concentrate purely on the selected date range and its associated notes.
- **Vertical Stability Guard**: Implements a strict **6-row height lock (317px)**. This ensures that the global layout never "jitters" or jumps when switching between months with 4, 5, or 6 weeks.
- **Smart Year Navigation**: An integrated scroll-to-view year selector covering a 50-year range (2000–2050) with automated centering of the active selection.
- **Contextual Memos**: Persistent side panel for monthly summaries and daily task tracking.

### 4. 📱 Responsive Master System
Fully fluid architecture that adapts to any device:
- **Mobile Stacking**: Stacks the dashboard into a vertical flow with scaled row heights (44px) and optimized typography.
- **Desktop Dashboard**: A sleek, horizontal dashboard with integrated breadcrumb-style navigation.
- **Inclusive Design**: Built with a focus on **A11y**, featuring semantic HTML5, ARIA grid roles, and live regions to announce selection changes to assistive technologies.

---

## 🛠️ Technical Choices & Design Philosophy

> **Why Native CSS Units?**  
> Every padding, font-size, and atomic grid unit (52px) is meticulously defined to ensure a high-precision look that feels intentional and robust across all resolutions.

- **Next.js 15 (App Router)**: Leveraged for its robust state management across the dashboard layout and `next/image` for high-performance, layout-stable hero transitions.
- **Framer Motion Sync**: Used for the hero image and grid transitions to ensure zero "blank frames" between UI states.
- **Lucide Icon Parity**: Icons are sized using Tailwind's `w/h` classes to ensure they maintain perfect visual weight alongside typography.
- **Display Typography**: Leverages **Playfair Display** (Serif) for months to add a "magazine-style" premium touch, balanced by **Geist/Inter** for functional numerical data.
- **Intelligent Asset Pre-fetching**: The header implements background pre-loading of neighboring month images to ensure instant, "snap-to" visual transitions without loading flickers.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm**

### Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd interactive-calendar-component
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to experience the calendar.

---

## 📂 Project Architecture
```text
├── app/                  # Next.js 15 App Router (entry point)
├── components/
│   ├── Calendar/         # Grid, Header, DateCell, Card
│   ├── Notes/            # Sidebar memo system
│   ├── Providers/        # Global Calendar State Management
│   └── UI/               # Climate alerts and atomics
├── lib/                  # Date math, constants, and climate logic
├── public/               # High-res seasonal assets
└── types/                # Strict TypeScript definitions
```

---

## 🌊 Roadmap
- [ ] **Data Persistence**: LocalStorage/DB integration for permanent notes.
- [ ] **Category Tags**: Work/Personal/Holiday tags for daily items.
- [ ] **Swipe Gestures**: Touch support for mobile month switching.

---
*Developed with a focus on immersive UX and technical precision.* 🚣‍♂️🇮🇳✨
