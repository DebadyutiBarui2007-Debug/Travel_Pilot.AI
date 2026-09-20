export type ActivityType = 'flight' | 'transfer' | 'hotel' | 'activity' | 'gastronomy' | 'coffee';

export type NodeStatus = 'nominal' | 'delayed' | 'auto_healed' | 'conflict' | 'confirmed' | 'locked';

export interface TripNode {
  id: string;
  nodeIndex: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  timeSlot: string;
  durationMinutes: number;
  location: string;
  coordinates: { lat: number; lng: number };
  isHardAnchor: boolean;
  slackMargin: string;
  status: NodeStatus;
  statusText: string;
  transitInfo: string;
  type: ActivityType;
  downstreamNodeIds: string[];
}

export interface TripItinerary {
  id: string;
  title: string;
  dates: string;
  destinations: string[];
  travelerArchetype: string;
  transitMode: string;
  pacingDensity: number;
  nodes: TripNode[];
  totalSlackMinutes: number;
  collisionCount: number;
  resiliencePercent: number;
  isSimulatingDisruption: boolean;
}

export interface ContingencyPlan {
  id: string;
  rank: number;
  rankTitle: string;
  type: 'minimal_shift' | 'poi_swap' | 'prune_spa';
  title: string;
  description: string;
  matchPercent: number;
  costVariance: string;
  dropStopsCount: string;
  bufferInfo: string;
  bulletPoints: string[];
  executionNote: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  flightNumber: string;
  delayMinutes: number;
  reason: string;
  newArrivalTime: string;
  affectedNodeTitle: string;
  plans: ContingencyPlan[];
  activePlanId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: string;
  avatarUrl: string;
  encryptionKeyHash: string;
}

export interface ActiveDevice {
  id: string;
  deviceName: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  inAppEnabled: boolean;
  flightDelays: boolean;
  weatherAlerts: boolean;
  slackBufferBreaches: boolean;
  soundAlerts: boolean;
  vibrationAlerts: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
}

export interface TelemetryMetrics {
  latencyMs: number;
  syncDelayMs: number;
  dagCollisions: number;
  twvrpStatus: string;
  activeMemoryMb: number;
  dbQueryTimeMs: number;
  throughputRps: number;
  cipherAlgorithm: string;
  activeAgents: number;
  resiliencePercent: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  senderName?: string;
  slackAudit?: {
    calculationTimeMs: number;
    safetyMargin: string;
    note: string;
  };
}
