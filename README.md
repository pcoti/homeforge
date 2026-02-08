# HomeForge

A comprehensive React app for planning a custom home build. Track finances, requirements, timelines, research locations, and get AI-powered advice through Ollama integration.

## Features

- **Dashboard** — Overview of finances, timeline progress, and budget breakdown
- **Financial Planning** — Budget categories, savings projections, gap analysis
- **Requirements** — Must-haves, nice-to-haves, and dream features with priority filtering
- **Timeline** — 6-phase milestone tracking with overdue indicators
- **Location Research** — Compare potential build sites with detailed property info
- **AI Assistant** — Chat with Ollama for budget advice, location research, and planning help
- **Settings** — Theme toggle, AI configuration, data import/export

## Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- React Router v7
- React Context + useReducer (state management)
- localStorage (persistence)
- Ollama REST API (AI chat)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## AI Assistant Setup

The AI chat requires [Ollama](https://ollama.com) running locally:

```bash
# Install Ollama, then:
ollama pull llama3.2
ollama serve
```

Configure the Ollama URL and model in Settings if using non-default values.

## Docker

```bash
# Build and run (includes Ollama service)
docker compose up --build
```

App available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── chat/           # AI chat interface
│   ├── dashboard/      # Overview dashboard
│   ├── finances/       # Budget & savings planning
│   ├── layout/         # Shell, Sidebar, TopBar
│   ├── locations/      # Location research
│   ├── requirements/   # Requirements & wishlist
│   ├── settings/       # App settings
│   ├── shared/         # Reusable UI components
│   └── timeline/       # Milestone tracking
├── hooks/              # useOllama, useLocalStorage
├── store/              # AppContext, reducer, defaults, persistence
├── theme/              # ThemeProvider, theme tokens
├── utils/              # formatCurrency, generateId
├── App.jsx
├── main.jsx
└── index.css
```

## Data Persistence

All data is stored in `localStorage` under the key `homeforge-data`. Use Settings to export/import backups as JSON.
