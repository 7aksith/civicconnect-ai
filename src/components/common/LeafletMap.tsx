import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Challenge, ChallengeLocation } from '../../types';

interface LeafletMapProps {
  challenges?: Challenge[];
  selectedChallengeId?: string | null;
  onSelectChallenge?: (challenge: Challenge) => void;
  // Picker mode props
  isPickerMode?: boolean;
  pickerLocation?: { lat: number; lng: number };
  onLocationPick?: (coords: { lat: number; lng: number }) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  challenges = [],
  selectedChallengeId,
  onSelectChallenge,
  isPickerMode = false,
  pickerLocation,
  onLocationPick,
  center = [28.6139, 77.2090], // Default New Delhi
  zoom = 12,
  height = '420px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Helper for custom SVG pin marker
  const createPinIcon = (severity: string, isSelected: boolean) => {
    const color =
      severity === 'Critical'
        ? '#ef4444'
        : severity === 'High'
        ? '#f59e0b'
        : severity === 'Medium'
        ? '#2563eb'
        : '#10b981';

    const pulseRing =
      severity === 'Critical'
        ? `<span style="position:absolute; top:-4px; left:-4px; width:36px; height:36px; border-radius:9999px; background:${color}; opacity:0.3; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>`
        : '';

    const html = `
      <div style="position:relative; display:flex; align-items:center; justify-content:center;">
        ${pulseRing}
        <div style="
          background:${color};
          width: 28px;
          height: 28px;
          border-radius: 9999px 9999px 0 9999px;
          transform: rotate(45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          ${isSelected ? 'transform: rotate(45deg) scale(1.25); border-color:#000;' : ''}
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #ffffff;
            border-radius: 9999px;
            transform: rotate(-45deg);
          "></div>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-map-pin',
      html,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });
  };

  // Helper for picker pin
  const createPickerIcon = () => {
    const html = `
      <div style="position:relative; display:flex; align-items:center; justify-content:center;">
        <span style="position:absolute; top:-6px; left:-6px; width:44px; height:44px; border-radius:9999px; background:#2563eb; opacity:0.25; animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="
          background: #2563eb;
          width: 32px;
          height: 32px;
          border-radius: 9999px 9999px 0 9999px;
          transform: rotate(45deg);
          box-shadow: 0 4px 16px rgba(37,99,235,0.5);
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #ffffff;
            border-radius: 9999px;
            transform: rotate(-45deg);
          "></div>
        </div>
      </div>
    `;
    return L.divIcon({
      className: 'custom-picker-pin',
      html,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const initialCenter: L.LatLngTuple = pickerLocation
      ? [pickerLocation.lat, pickerLocation.lng]
      : [center[0], center[1]];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // Clean OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Layer group for pins
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Handle map clicks in picker mode
    if (isPickerMode) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onLocationPick) {
          onLocationPick({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });
    }

    // Force map to adapt to container after short delay
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update picker marker if in picker mode
  useEffect(() => {
    if (!isPickerMode || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (pickerLocation) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([pickerLocation.lat, pickerLocation.lng]);
      } else {
        const marker = L.marker([pickerLocation.lat, pickerLocation.lng], {
          icon: createPickerIcon(),
          draggable: true,
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onLocationPick) {
            onLocationPick({ lat: pos.lat, lng: pos.lng });
          }
        });

        pickerMarkerRef.current = marker;
      }

      // Pan to new coordinate
      map.panTo([pickerLocation.lat, pickerLocation.lng], { animate: true });
    }
  }, [pickerLocation, isPickerMode]);

  // 3. Update Challenge Markers in viewer mode
  useEffect(() => {
    if (isPickerMode || !mapInstanceRef.current || !markersGroupRef.current) return;
    const markersGroup = markersGroupRef.current;
    const map = mapInstanceRef.current;

    markersGroup.clearLayers();

    challenges.forEach((ch) => {
      if (!ch.location || typeof ch.location.lat !== 'number' || typeof ch.location.lng !== 'number') {
        return;
      }

      const isSelected = ch.id === selectedChallengeId;
      const marker = L.marker([ch.location.lat, ch.location.lng], {
        icon: createPinIcon(ch.severity, isSelected),
      });

      // Custom Popup HTML
      const popupHtml = `
        <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px; max-width:240px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="font-size:10px; font-weight:800; text-transform:uppercase; padding:2px 6px; border-radius:4px; background:${
              ch.severity === 'Critical' ? '#fee2e2; color:#b91c1c;' : '#fef3c7; color:#b45309;'
            }">${ch.severity}</span>
            <span style="font-size:10px; font-weight:700; color:#2563eb;">${ch.category}</span>
          </div>
          <h4 style="font-size:13px; font-weight:700; color:#0f172a; margin:0 0 4px 0; line-height:1.3;">
            ${ch.title}
          </h4>
          <p style="font-size:11px; color:#64748b; margin:0 0 6px 0; line-height:1.3;">
            📍 ${ch.location.address || ch.location.city}
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; border-top:1px solid #e2e8f0; padding-top:4px;">
            <span style="font-weight:700; color:#0f172a;">Priority: ${ch.priorityScore}/100</span>
            <span style="color:#059669; font-weight:600;">👥 ~${ch.aiAnalysis.affectedPopulationEstimate.toLocaleString()} affected</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        if (onSelectChallenge) {
          onSelectChallenge(ch);
        }
      });

      markersGroup.addLayer(marker);
    });

    // If selected challenge changes, center on it
    if (selectedChallengeId) {
      const selected = challenges.find((c) => c.id === selectedChallengeId);
      if (selected && selected.location) {
        map.flyTo([selected.location.lat, selected.location.lng], 14, { duration: 1 });
      }
    }
  }, [challenges, selectedChallengeId, isPickerMode]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height }}
      className={`w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative ${className}`}
    />
  );
};
