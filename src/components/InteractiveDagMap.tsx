import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TripItinerary, DisruptionEvent, TripNode } from '../types';

interface InteractiveDagMapProps {
  trip: TripItinerary;
  disruption: DisruptionEvent | null;
  onNodeSelect?: (node: TripNode) => void;
  onSimulateDisruption?: () => void;
  onApplyPlan?: (planId: string) => void;
}

// Coordinate lookup for Paris locations
const NODE_COORDINATES: { [key: string]: [number, number] } = {
  cdg: [49.0097, 2.5479],
  crillon: [48.8672, 2.3214],
  louvre: [48.8606, 2.3376],
  gabriel: [48.8698, 2.3128],
  default_1: [48.8566, 2.3522],
  default_2: [48.8738, 2.2950],
};

const getLatGap = (index: number): [number, number] => {
  const base: [number, number] = [48.86, 2.33];
  const offset = index * 0.018;
  return [base[0] + (index % 2 === 0 ? offset : -offset * 0.5), base[1] + offset * 0.8];
};

export const InteractiveDagMap: React.FC<InteractiveDagMapProps> = ({
  trip,
  disruption,
  onNodeSelect,
  onSimulateDisruption,
  onApplyPlan,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'satellite' | 'dark' | 'street'>('satellite');
  const [selectedNode, setSelectedNode] = useState<TripNode | null>(trip.nodes[0] || null);

  // Map Tile Providers
  const TILE_URLS = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const ATTRIBUTIONS = {
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    street: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [48.865, 2.335],
      zoom: 12,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(TILE_URLS.satellite, {
      maxZoom: 19,
      attribution: ATTRIBUTIONS.satellite,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);

    tileLayerRef.current = tileLayer;
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when map style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const newTileLayer = L.tileLayer(TILE_URLS[mapStyle], {
      maxZoom: 19,
      attribution: ATTRIBUTIONS[mapStyle],
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  // Render Leaflet Markers, Polyline, and Polygons when trip or disruption updates
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const latLngs: [number, number][] = [];

    trip.nodes.forEach((node, index) => {
      let coords: [number, number];
      if (node.title.toLowerCase().includes('airport') || node.title.toLowerCase().includes('cdg')) {
        coords = NODE_COORDINATES.cdg;
      } else if (node.title.toLowerCase().includes('crillon') || node.title.toLowerCase().includes('check-in')) {
        coords = NODE_COORDINATES.crillon;
      } else if (node.title.toLowerCase().includes('louvre') || node.title.toLowerCase().includes('curator')) {
        coords = NODE_COORDINATES.louvre;
      } else if (node.title.toLowerCase().includes('gabriel') || node.title.toLowerCase().includes('michelin')) {
        coords = NODE_COORDINATES.gabriel;
      } else {
        coords = getLatGap(index);
      }

      latLngs.push(coords);

      const isConflict = node.status === 'conflict';
      const isAutoHealed = node.status === 'auto_healed';
      const pinColor = isConflict ? '#ff6b6b' : isAutoHealed ? '#7bd0ff' : '#f59e0b';

      // Custom DivIcon for high-visibility dark/satellite theme
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(7, 9, 15, 0.9);
            border: 2px solid ${pinColor};
            box-shadow: 0 0 15px ${pinColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease;
          " class="hover:scale-110">
            ${node.nodeIndex}
            ${isConflict ? `<span style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #ff6b6b; border-radius: 50%; border: 2px solid #07090f; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker(coords, { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="background: #13161f; color: #e1e2ec; padding: 12px; border-radius: 12px; font-family: sans-serif; border: 1px solid #2a2e39; min-width: 200px;">
          <div style="font-size: 10px; color: ${pinColor}; font-weight: bold; font-family: monospace; text-transform: uppercase; margin-bottom: 4px;">
            ${node.nodeIndex} • ${node.statusText}
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 2px;">
            ${node.title}
          </div>
          <div style="font-size: 11px; color: #b8a896; margin-bottom: 8px;">
            ${node.timeSlot} • Slack: ${node.slackMargin}
          </div>
          <div style="font-size: 11px; color: #ffc174; background: #202532; padding: 4px 8px; border-radius: 6px; font-family: monospace;">
            Vector: ${node.transitInfo}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup',
        closeButton: false,
      });

      marker.on('click', () => {
        setSelectedNode(node);
        if (onNodeSelect) onNodeSelect(node);
      });

      layerGroup.addLayer(marker);
    });

    // Draw Route Polyline
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: trip.isSimulatingDisruption ? '#f59e0b' : '#ffc174',
        weight: 3.5,
        dashArray: trip.isSimulatingDisruption ? '8, 8' : undefined,
        opacity: 0.9,
      });
      layerGroup.addLayer(polyline);

      // Buffer Convex Hull Polygon overlay
      if (latLngs.length >= 3) {
        const polygon = L.polygon(latLngs, {
          color: trip.isSimulatingDisruption ? '#ff6b6b' : '#f59e0b',
          weight: 1.5,
          fillColor: trip.isSimulatingDisruption ? '#ff6b6b' : '#f59e0b',
          fillOpacity: 0.12,
          dashArray: '4, 4',
        });
        layerGroup.addLayer(polygon);
      }

      // Auto Fit Map Bounds to show all trip points
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
  }, [trip, disruption]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([48.865, 2.335], 12);
    }
  };

  return (
    <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col gap-5 w-full max-w-full overflow-hidden">
      {/* MAP HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39]/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174] shrink-0">
            <span className="material-symbols-outlined text-2xl">map</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-telemetry text-[10px] text-[#ffc174] font-bold uppercase tracking-wider">
                Geospatial Leaflet Vector Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30 font-telemetry text-[9px] font-extrabold uppercase">
                Satellite / Hybrid Ready
              </span>
            </div>
            <h2 className="font-display text-xl text-[#e1e2ec] font-bold">
              Interactive TW-VRP Route & Disruption Map
            </h2>
          </div>
        </div>

        {/* MAP LAYER SELECTOR SWITCHER */}
        <div className="flex items-center gap-1.5 bg-[#07090f] p-1 rounded-xl border border-[#2a2e39]/60 shrink-0">
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mapStyle === 'satellite'
                ? 'bg-[#f59e0b] text-[#3d2400] shadow'
                : 'text-[#b8a896] hover:text-[#e1e2ec]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">satellite_alt</span>
            <span>Satellite</span>
          </button>

          <button
            onClick={() => setMapStyle('dark')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mapStyle === 'dark'
                ? 'bg-[#f59e0b] text-[#3d2400] shadow'
                : 'text-[#b8a896] hover:text-[#e1e2ec]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dark_mode</span>
            <span>Dark Vector</span>
          </button>

          <button
            onClick={() => setMapStyle('street')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mapStyle === 'street'
                ? 'bg-[#f59e0b] text-[#3d2400] shadow'
                : 'text-[#b8a896] hover:text-[#e1e2ec]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>Street</span>
          </button>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-[#2a2e39]/60 bg-[#07090f] shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* FLOATING MAP NAVIGATION ZOOM CONTROLS */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-[#07090f]/90 hover:bg-[#13161f] text-[#e1e2ec] border border-[#2a2e39]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>

          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-[#07090f]/90 hover:bg-[#13161f] text-[#e1e2ec] border border-[#2a2e39]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>

          <button
            onClick={handleResetView}
            className="w-9 h-9 rounded-xl bg-[#07090f]/90 hover:bg-[#13161f] text-[#ffc174] border border-[#f59e0b]/50 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Reset Map Bounds"
          >
            <span className="material-symbols-outlined text-lg">center_focus_strong</span>
          </button>
        </div>

        {/* MAP OVERLAY STATS BAR */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#07090f]/90 backdrop-blur-md border border-[#2a2e39]/80 px-4 py-2 rounded-xl flex items-center gap-4 text-xs font-telemetry shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping"></span>
            <span className="text-[#ffc174] font-bold">Paris Cluster Center: 48.865° N, 2.335° E</span>
          </div>
          <div className="hidden sm:block text-[#b8a896]">• {trip.nodes.length} Active Nodes</div>
          <div className="hidden md:block text-[#7bd0ff]">• Convex Hull Active</div>
        </div>
      </div>

      {/* SELECTED NODE INSPECTOR PANEL */}
      {selectedNode && (
        <div className="bg-[#07090f] border border-[#2a2e39]/60 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-telemetry font-bold text-sm shrink-0 ${
                selectedNode.status === 'conflict'
                  ? 'bg-[#ff6b6b]/20 border border-[#ff6b6b] text-[#ff6b6b]'
                  : selectedNode.status === 'auto_healed'
                  ? 'bg-[#7bd0ff]/20 border border-[#7bd0ff] text-[#7bd0ff]'
                  : 'bg-[#f59e0b]/20 border border-[#f59e0b] text-[#ffc174]'
              }`}
            >
              {selectedNode.nodeIndex}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-telemetry text-xs text-[#ffc174] font-bold">{selectedNode.timeSlot}</span>
                <span className="text-[#b8a896] text-xs">• {selectedNode.statusText}</span>
              </div>
              <h4 className="font-display text-base text-[#e1e2ec] font-bold">{selectedNode.title}</h4>
              <p className="font-sans text-xs text-[#b8a896]">{selectedNode.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <div className="flex flex-col items-end font-telemetry text-xs">
              <span className="text-[#b8a896]">Slack Margin</span>
              <span className="text-[#ffc174] font-bold">{selectedNode.slackMargin}</span>
            </div>
            <div className="w-px h-8 bg-[#2a2e39]" />
            <div className="flex flex-col items-end font-telemetry text-xs">
              <span className="text-[#b8a896]">Transit Vector</span>
              <span className="text-[#7bd0ff] font-bold">{selectedNode.transitInfo}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
