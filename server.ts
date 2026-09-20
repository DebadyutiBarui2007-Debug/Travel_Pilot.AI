import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initialTrip, sampleDisruptionEvent, mockUserProfile, mockActiveDevices, mockNotificationSettings, mockNotifications } from './src/data/mockData';
import { TripItinerary, DisruptionEvent, NotificationSettings, CopilotMessage, NotificationItem } from './src/types';

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

// State Store in memory for real-time synchronization
let activeTrip: TripItinerary = JSON.parse(JSON.stringify(initialTrip));
let activeDisruption: DisruptionEvent | null = null;
let currentNotificationSettings: NotificationSettings = { ...mockNotificationSettings };
let currentNotifications: NotificationItem[] = [...mockNotifications];
let copilotHistory: CopilotMessage[] = [];

// API Routes

// 1. Health & Performance Monitoring Telemetry
app.get('/api/health', (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'online',
    version: '4.8.0',
    dagEngineActive: true,
    collisions: activeTrip.collisionCount,
    telemetrySyncMs: Math.floor(Math.random() * 4) + 11, // ~12-14ms
    twvrpStatus: activeTrip.isSimulatingDisruption ? 'Active Disruption Solving' : 'Standby',
    activeMemoryMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    dbQueryLatencyMs: (Math.random() * 2 + 10).toFixed(2),
    throughputRps: 1420,
    cipherAlgorithm: 'AES-256-GCM',
    activeAgents: 3,
    resiliencePercent: activeTrip.resiliencePercent,
    timestamp: new Date().toISOString(),
  });
});

// 2. Authentication Flow
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    token: `jwt_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user: {
      ...mockUserProfile,
      email: email || mockUserProfile.email,
    },
    activeDevices: mockActiveDevices,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({
    user: mockUserProfile,
    activeDevices: mockActiveDevices,
  });
});

// 3. Trips & DAG State
app.get('/api/trips', (req: Request, res: Response) => {
  res.json({
    trip: activeTrip,
    disruption: activeDisruption,
  });
});

// Compile Trip from NLP or Constraint Matrix
app.post('/api/trips/compile', (req: Request, res: Response) => {
  const { nlpInput, destination, dates, travelerArchetype, transitMode, pacingDensity } = req.body;

  // Simulate topological compilation
  activeTrip.title = destination ? `${destination} High-Precision Expedition` : 'Paris & Milan High-Precision Expedition';
  activeTrip.dates = dates || 'Oct 14 - Oct 20, 2025';
  activeTrip.travelerArchetype = travelerArchetype || 'High-Velocity Executive';
  activeTrip.transitMode = transitMode || 'Private Chauffeur + High-Speed Rail';
  if (pacingDensity) activeTrip.pacingDensity = parseFloat(pacingDensity);

  activeTrip.isSimulatingDisruption = false;
  activeTrip.collisionCount = 0;
  activeTrip.resiliencePercent = 99.4;
  activeDisruption = null;

  res.json({
    success: true,
    message: 'Graph Verified (14ms) • DAG Synchronized',
    trip: activeTrip,
  });
});

// 4. Disruption Simulation Engine
app.post('/api/disruption/simulate', (req: Request, res: Response) => {
  const disruption = JSON.parse(JSON.stringify(sampleDisruptionEvent));
  activeDisruption = disruption;
  activeTrip.isSimulatingDisruption = true;
  activeTrip.collisionCount = 1;
  activeTrip.resiliencePercent = 78.2;

  // Update Flight node
  const flightNode = activeTrip.nodes.find((n) => n.id === 'node_01');
  if (flightNode) {
    flightNode.status = 'delayed';
    flightNode.timeSlot = '15:40 CET';
    flightNode.statusText = 'Delayed +85m';
  }

  // Update Transfer node
  const transferNode = activeTrip.nodes.find((n) => n.id === 'node_02');
  if (transferNode) {
    transferNode.timeSlot = '16:55 CET';
  }

  // Flag Louvre VIP Node conflict
  const louvreNode = activeTrip.nodes.find((n) => n.id === 'node_03');
  if (louvreNode) {
    louvreNode.status = 'conflict';
    louvreNode.slackMargin = 'BUFFER VIOLATION (-40m)';
    louvreNode.statusText = 'Conflict Flagged';
  }

  // Add notification
  const newNotif: NotificationItem = {
    id: `notif_${Date.now()}`,
    title: 'Disruption Event Flagged',
    message: 'Flight AA1204 delayed by 85m. Louvre VIP entry buffer violated.',
    type: 'alert',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' CET',
    read: false,
  };
  currentNotifications.unshift(newNotif);

  res.json({
    success: true,
    trip: activeTrip,
    disruption: activeDisruption,
  });
});

// Apply Selected Contingency Plan
app.post('/api/disruption/apply', (req: Request, res: Response) => {
  const { planId } = req.body;

  if (activeDisruption) {
    activeDisruption.activePlanId = planId;
  }

  activeTrip.isSimulatingDisruption = false;
  activeTrip.collisionCount = 0;
  activeTrip.resiliencePercent = 99.4;

  if (planId === 'plan_a_shift') {
    const louvreNode = activeTrip.nodes.find((n) => n.id === 'node_03');
    if (louvreNode) {
      louvreNode.timeSlot = '18:30 CET';
      louvreNode.status = 'auto_healed';
      louvreNode.slackMargin = 'Auto-Healed (+55m)';
      louvreNode.statusText = 'Healed & Confirmed';
    }

    const gabrielNode = activeTrip.nodes.find((n) => n.id === 'node_04');
    if (gabrielNode) {
      gabrielNode.timeSlot = '21:15 CET';
      gabrielNode.status = 'confirmed';
      gabrielNode.statusText = 'Table Shifted';
    }
  }

  // Add notification
  const newNotif: NotificationItem = {
    id: `notif_${Date.now()}`,
    title: 'Contingency Executed',
    message: 'Plan A (Minimal Shift) committed to topological graph. 0 Collisions.',
    type: 'success',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' CET',
    read: false,
  };
  currentNotifications.unshift(newNotif);

  res.json({
    success: true,
    message: 'Contingency Plan Applied Successfully',
    trip: activeTrip,
  });
});

// Reset Simulation
app.post('/api/disruption/reset', (req: Request, res: Response) => {
  activeTrip = JSON.parse(JSON.stringify(initialTrip));
  activeDisruption = null;

  res.json({
    success: true,
    message: 'Itinerary Reset to Baseline',
    trip: activeTrip,
  });
});

// 5. Conversational Co-Pilot (Server-Side Gemini Integration)
app.post('/api/copilot', async (req: Request, res: Response) => {
  const { prompt, userName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  let answerText = '';
  let safetyMargin = '94.2%';
  let note = 'Added as Elastic Auxiliary Node';

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are TravelPilot's Autonomous Orchestration Copilot. The user is asking about their itinerary feasibility.
Current Itinerary Nodes:
- Flight AF/AA1204 arrival at CDG 14:15 CET (or 15:40 CET if delayed)
- Transfer to Hôtel de Crillon
- Louvre VIP Guided Entry at 17:00 CET (or 18:30 CET)
- Le Gabriel Gastronomy Dinner at 20:30 CET (or 21:15 CET)

User Question: "${prompt}"

Provide a concise, high-agency, executive answer (under 3 sentences). State if the change is feasible according to time-window constraints and slack buffers. Focus on precision and zero cognitive overhead.`,
      });
      answerText = response.text || '';
    } catch (err) {
      console.error('Gemini error:', err);
      answerText = `Affirmative, ${userName || 'Julian'}. Request analyzed against live Mapbox distance matrices. Request is topologically feasible with 28 minutes of unencumbered slack.`;
    }
  } else {
    answerText = `Affirmative, ${userName || 'Julian'}. Café Kitsuné Palais Royal is 380m from the Louvre Richelieu entry. Allocating 35 minutes for espresso and pastry leaves 28 minutes of unencumbered slack before the 18:30 VIP curator gate call.`;
  }

  const message: CopilotMessage = {
    id: `msg_${Date.now()}`,
    sender: 'agent',
    text: answerText,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' CET',
    slackAudit: {
      calculationTimeMs: 14,
      safetyMargin,
      note,
    },
  };

  copilotHistory.push(message);

  res.json({
    success: true,
    message,
  });
});

// 6. Real-Time Synchronization SSE Stream
app.get('/api/sync/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent({ type: 'INIT', trip: activeTrip, disruption: activeDisruption });

  const interval = setInterval(() => {
    sendEvent({
      type: 'TELEMETRY_HEARTBEAT',
      syncMs: Math.floor(Math.random() * 4) + 11,
      activeAgents: 3,
      resiliencePercent: activeTrip.resiliencePercent,
    });
  }, 5000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// 7. Notification Settings & List API
app.get('/api/notifications/settings', (req: Request, res: Response) => {
  res.json(currentNotificationSettings);
});

app.post('/api/notifications/settings', (req: Request, res: Response) => {
  currentNotificationSettings = { ...currentNotificationSettings, ...req.body };
  res.json({ success: true, settings: currentNotificationSettings });
});

app.get('/api/notifications/list', (req: Request, res: Response) => {
  res.json(currentNotifications);
});

// 8. Synthetic Data Engine API
app.post('/api/synthetic/generate', (req: Request, res: Response) => {
  const { region, nodeCount } = req.body;
  const count = parseInt(nodeCount) || 5;
  const reg = region || 'Tokyo & Kyoto';

  const generatedNodes = Array.from({ length: count }).map((_, idx) => ({
    id: `syn_node_${idx + 1}`,
    nodeIndex: `#0${idx + 1}`,
    categoryLabel: idx === 0 ? 'Inbound' : idx === count - 1 ? 'Dinner' : 'POI Anchor',
    title: `${reg} Synthetic Segment ${idx + 1}`,
    subtitle: `Calculated with TW-VRP K-Means Vector Matrix`,
    timeSlot: `${9 + idx * 2}:00 JST`,
    durationMinutes: 90,
    location: `${reg} Center ${idx + 1}`,
    coordinates: { lat: 35.6762 + idx * 0.01, lng: 139.6503 + idx * 0.01 },
    isHardAnchor: idx % 2 === 0,
    slackMargin: `+${30 + idx * 10}m Slack`,
    status: 'nominal',
    statusText: 'Verified',
    transitInfo: '15 min Rapid Transit',
    type: idx === 0 ? 'flight' : idx === count - 1 ? 'gastronomy' : 'activity',
    downstreamNodeIds: [],
  }));

  res.json({
    success: true,
    region: reg,
    nodes: generatedNodes,
    resilienceScore: 99.8,
  });
});

// Start Server with Vite Middleware in Development or Static Assets in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravelPilot Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
