# ✈️ TravelPilot — Autonomous Avionics & TW-VRP Itinerary Resiliency Engine

[![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19.0.1-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Cloud Run](https://img.shields.io/badge/Deploy-Google_Cloud_Run-4285f4?style=for-the-badge&logo=googlecloud)](https://cloud.google.com/run)
[![AWS Ready](https://img.shields.io/badge/Deploy-AWS_App_Runner-ff9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

> **Deterministic Geo-Temporal Routing meets Autonomous Directed Acyclic Graph (DAG) Disruption Recovery.**
> TravelPilot is an executive-grade avionics platform for travel orchestration, combining Time-Window Vehicle Routing Problem (TW-VRP) algorithms, real-time spatial Leaflet visualization, and server-side Gemini GenAI intelligence.

---

## 📑 Table of Contents
1. [Overview & Value Proposition](#-overview--value-proposition)
2. [Key Capabilities & Feature Matrix](#-key-capabilities--feature-matrix)
3. [System Architecture](#-system-architecture)
4. [Workflow & Decision Pipelines](#-workflow--decision-pipelines)
5. [Local Development Setup (Localhost)](#-local-development-setup-localhost)
6. [Deployment Guide](#-deployment-guide)
   - [Google AI Studio (Published Link)](#1-google-ai-studio-published-link)
   - [Google Cloud Run](#2-google-cloud-run)
   - [AWS App Runner / ECS](#3-aws-app-runner--ecs)
   - [Vercel & Netlify](#4-vercel--netlify)
   - [Docker Containerization](#5-docker-containerization)
7. [Environment Variables](#-environment-variables)
8. [API Endpoint Specifications](#-api-endpoint-specifications)
9. [License & Acknowledgments](#-license--acknowledgments)

---

## 🌐 Overview & Value Proposition

High-velocity executive itineraries are fragile. A single 45-minute flight delay or weather bottleneck can trigger a cascading failure across hotel check-ins, VIP museum reservations, and Michelin dinner slots.

**TravelPilot** solves this by modeling itineraries as **Directed Acyclic Graphs (DAGs)** bound by temporal slack margins and physical transit vectors. When disruptions occur, TravelPilot calculates counterfactual remediation pathways in real-time, executing auto-healing algorithms to shift downstream nodes with zero cognitive load for the traveler.

---

## 🚀 Key Capabilities & Feature Matrix

- 📍 **Geospatial Leaflet Vector & Satellite Map**: Real-time Leaflet map integration with a **Layer Switcher** supporting **'Satellite'**, **'Topographic'**, and **'Dark Mode'** tile layers. Features custom glowing node pins, dynamic polyline route vectors, convex hull buffer overlays, interactive hover tooltips, and an automated **fit-bounds fly-to animation** targeting active disruption points.
- ⚡ **Time-Window Vehicle Routing Problem (TW-VRP) Compiler**: Solves topological travel constraints, calculating buffer slack margins, hard vs. flexible time windows, and transit vectors across multimodal travel networks.
- 🛡️ **Autonomous Disruption Auto-Healing**: Real-time disruption simulation engine that detects buffer violations and proposes zero-collision counterfactual plans (e.g. Plan A: Minimal Shift, Plan B: Swap Sequence).
- 🤖 **Server-Side Gemini 3.8 Flash Copilot**: Natural language conversational terminal backed by the server-side `@google/genai` SDK for asking complex itinerary feasibility queries without exposing API secrets to the client browser.
- 🔄 **Real-Time Telemetry & SSE Stream**: Server-Sent Events (SSE) streaming live telemetry heartbeats (~12ms sync latency, memory metrics, active collisions, and agent status).
- 🎙️ **Voice Command Controller**: Native browser Web Speech API integration allowing users to trigger *"Emergency Override"* or *"Re-route Plan"* via voice commands or `Alt+V` shortcuts.
- 📱 **Cross-Device Sync & Granular Notification Center**: Device session tracking, passbook file exports (`.pkpass`), and granular notification management with push/in-app alert toggles.

---

## 🏗️ System Architecture

```
                                  +-------------------------------------------------------+
                                  |                 CLIENT / BROWSER                      |
                                  |  React 19 + Vite + Tailwind CSS + Leaflet + D3.js     |
                                  +---------------------------+---------------------------+
                                                              |
                                                    HTTP / REST + SSE Stream
                                                              |
                                  v                           v                           v
                      +------------------------+  +------------------------+  +------------------------+
                      |   Express Server API   |  |  SSE Telemetry Engine  |  | State Sync Repository  |
                      |   (Node.js / CJS)      |  |  (/api/sync/events)    |  | (In-Memory / Database) |
                      +-----------+------------+  +------------------------+  +------------------------+
                                  |
                                  | Server-Side SDK
                                  v
                      +----------------------------------------------------+
                      |            Google GenAI SDK (Gemini API)           |
                      |       (Gemini 3.8 Flash / Natural Language NLP)    |
                      +----------------------------------------------------+
```

### Stack Components:
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Leaflet Maps, D3.js, Motion, TanStack React Query.
- **Backend / API**: Node.js Express Server, Server-Sent Events (SSE), `@google/genai` TypeScript SDK, `esbuild` CommonJS bundling.
- **Containerization**: Alpine Docker runtime image (`Dockerfile`), multi-stage builder.

---

## 🔄 Workflow & Decision Pipelines

```
[1. Mission Control Gate] 
        |
        v
[Verify & Confirm Mission Info] ---> (Curtain Opening Animation Transition)
        |
        v
[2. Autonomous Workspace] <---> [Geospatial Leaflet Satellite Map View]
        |
        +---> [TW-VRP DAG Route Graph Engine]
        |
        +---> [Real-Time SSE Telemetry Stream]
        |
        v
[3. Disruption Event Flagged] ---> (Auto Fly-To Animation Centers Map on Conflict)
        |
        v
[4. Counterfactual Remediation Engine]
        |
        +---> Plan A: Minimal Time Shift (Auto-Heal)
        +---> Plan B: Sequence Swap
        |
        v
[5. Apply Plan & Synchronize] ---> [0 Collisions • Passbook Export Generated]
```

---

## 💻 Local Development Setup (Localhost)

Follow these steps to run TravelPilot locally on your computer (Windows, macOS, Linux):

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v20+ recommended) — verify via `node -v`
- **npm**: v9.0.0 or higher — verify via `npm -v`

### ⚡ Quick Automated Setup (macOS / Linux / WSL):
You can run the automated initialization script which handles node checks, `.env` generation, dependency installation, and type validation:
```bash
chmod +x setup.sh
./setup.sh
# Or alternatively:
npm run setup
```

### 📋 Manual Step-by-Step Instructions:

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/travelpilot.git
   cd travelpilot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   - **macOS / Linux**: `cp .env.example .env`
   - **Windows PowerShell**: `Copy-Item .env.example .env`
   - **Windows CMD**: `copy .env.example .env`

   *(Optional)* Add your Gemini API key in `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The app will run seamlessly even without an API key using built-in high-precision heuristics).*

4. **Start the Unified Full-Stack Dev Server**:
   ```bash
   npm run dev
   ```
   This launches Express + Vite together with hot reload and server-side API support on:
   ```
   http://localhost:3000
   ```

5. **Test the Production Build Locally**:
   To test the exact production bundle locally before cloud deployment:
   ```bash
   npm run build
   npm start
   ```

### 🛠️ Localhost Troubleshooting:
- **Port 3000 already in use**:
  - macOS/Linux: `PORT=3001 npm run dev`
  - Windows PowerShell: `$env:PORT=3001; npm run dev`
  - Windows CMD: `set PORT=3001 && npm run dev`
- **Node Version Mismatch**: If you are on Node 16 or older, please upgrade to Node 20 LTS using [nvm](https://github.com/nvm-sh/nvm) or from [nodejs.org](https://nodejs.org).
- **Clean Reinstall**: If dependencies are corrupted, run `npm run clean && npm install`.

---

## 🚀 Deployment Guide

TravelPilot is built to be turnkey deployable on any Cloud container or serverless hosting provider.

---

### 1. Google AI Studio (Published Link)
If accessing TravelPilot via Google AI Studio:
- **Development URL**: `https://ais-dev-h7yfp6rlwdfoqx6t4zg2pb-102563679351.asia-east1.run.app`
- **Shared Production Link**: `https://ais-pre-h7yfp6rlwdfoqx6t4zg2pb-102563679351.asia-east1.run.app`

Simply open the shared URL in any modern web browser. No additional installation required!

---

### 2. Google Cloud Run

Google Cloud Run is the recommended platform for containerized full-stack deployment.

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID

# 2. Build and push image to Artifact Registry or GCR
gcloud builds submit --tag gcr.io/YOUR_GCP_PROJECT_ID/travelpilot:latest

# 3. Deploy to Cloud Run
gcloud run deploy travelpilot \
  --image gcr.io/YOUR_GCP_PROJECT_ID/travelpilot:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY=your_gemini_api_key,NODE_ENV=production
```

---

### 3. AWS Amplify & AWS App Runner / ECS

#### Option A: AWS Amplify
1. Connect your GitHub repository in the **AWS Amplify Console**.
2. Set Build Settings (or use `amplify.yml`):
   - **Build Command**: `npm run build`
   - **Base Directory**: `dist`
3. Configure Environment Variables:
   - `PORT`: `3000`
   - `GEMINI_API_KEY`: your API key

#### Option B: AWS App Runner (Containerized):
1. Push your Docker image to AWS Elastic Container Registry (ECR).
2. Create an App Runner service selecting the ECR container image.
3. Set Environment Variable `GEMINI_API_KEY` and Port `3000`.

#### Option C: AWS ECS (Elastic Container Service):
Use the provided `Dockerfile` with Fargate launch type on Port `3000`.

---

### 4. Vercel & Netlify

This project includes a `vercel.json` descriptor for instant Vercel integration.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy directly
vercel --prod
```

Ensure you configure `GEMINI_API_KEY` under **Vercel Project Settings -> Environment Variables**.

---

### 5. Docker Containerization

Run TravelPilot inside a self-contained Docker container anywhere:

```bash
# Build Docker image
docker build -t travelpilot:latest .

# Run Docker container locally
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  --name travelpilot_app \
  travelpilot:latest
```

Verify status by opening `http://localhost:3000/api/health`.

---

## 🔑 Environment Variables

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | Optional | `3000` | Network port for Express server listener |
| `NODE_ENV` | Optional | `production` | Runtime mode (`development` or `production`) |
| `GEMINI_API_KEY` | Recommended | `""` | Google Gemini API key for server-side AI Copilot |

---

## 🔌 API Endpoint Specifications

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | System health check & telemetry metrics (~12ms latency) |
| `/api/auth/login` | `POST` | Authenticate user session & retrieve active device profiles |
| `/api/trips` | `GET` | Fetch active trip itinerary & disruption graph state |
| `/api/trips/compile` | `POST` | Compile custom NLP itinerary into topological DAG |
| `/api/disruption/simulate` | `POST` | Inject disruption event & flag buffer violations |
| `/api/disruption/apply` | `POST` | Execute selected counterfactual remediation plan |
| `/api/disruption/reset` | `POST` | Reset itinerary graph to baseline state |
| `/api/copilot` | `POST` | Query Gemini 3.8 Flash copilot for feasibility analysis |
| `/api/sync/events` | `GET` | Server-Sent Events (SSE) telemetry heartbeat stream |
| `/api/synthetic/generate` | `POST` | Generate synthetic test datasets for stress testing |

---

## 📄 License & Acknowledgments

This project is licensed under the **MIT License**.

Designed and built with modern industry standards for high-resilience executive travel orchestration.
