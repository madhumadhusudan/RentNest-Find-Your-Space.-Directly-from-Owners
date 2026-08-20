import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Layers, Crosshair, Sparkles, MapPin, Building, Phone, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PropertyMarkerData {
  id: number;
  title: string;
  rent: number;
  propertyType: string;
  furnishing: string;
  allowedMembers?: number | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[] | null;
  amenities?: string[] | null;
  owner?: {
    id: number;
    name: string;
    phoneVerified?: boolean;
  } | null;
}

interface InteractiveMapProps {
  properties?: PropertyMarkerData[];
  selectedPropertyId?: number | null;
  onSelectProperty?: (property: PropertyMarkerData | null) => void;
  hoveredPropertyId?: number | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showControls?: boolean;
  singleMarkerMode?: boolean;
  singleMarkerTitle?: string;
}

// Format currency in Indian standard shorthand
function formatRent(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `₹${amount}`;
}

export function InteractiveMap({
  properties = [],
  selectedPropertyId,
  onSelectProperty,
  hoveredPropertyId,
  center = { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore/Mysuru region
  zoom = 12,
  height = '100%',
  showControls = true,
  singleMarkerMode = false,
  singleMarkerTitle = '',
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'clean'>('clean');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [activeProperty, setActiveProperty] = useState<PropertyMarkerData | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid multiple initializations
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Add default tile layer (CartoDB Positron for clean SaaS aesthetic)
      const tileLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      // Add markers layer
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Add attribution in a clean minimalist corner
      L.control
        .attribution({ position: 'bottomright', prefix: 'RentNest Maps' })
        .addTo(map);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapStyle === 'streets') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
  }, [mapStyle]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const validProps = properties.filter((p) => p.latitude && p.longitude);

    if (validProps.length === 0 && !singleMarkerMode) return;

    const bounds = L.latLngBounds([]);

    validProps.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      const isSelected = selectedPropertyId === prop.id || activeProperty?.id === prop.id;
      const isHovered = hoveredPropertyId === prop.id;

      // Custom HTML Price Pill Marker
      const pillHtml = `
        <div class="custom-price-pill ${isSelected || isHovered ? 'active' : ''}" id="marker-prop-${prop.id}">
          <span>🏠</span>
          <span>${formatRent(prop.rent)}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-price-marker',
        html: pillHtml,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([prop.latitude, prop.longitude], {
        icon: customIcon,
        riseOnHover: true,
      });

      marker.on('click', () => {
        setActiveProperty(prop);
        if (onSelectProperty) onSelectProperty(prop);
        if (mapInstanceRef.current && prop.latitude && prop.longitude) {
          mapInstanceRef.current.flyTo([prop.latitude, prop.longitude], 14, { duration: 0.8 });
        }
      });

      markersLayer.addLayer(marker);
      bounds.extend([prop.latitude, prop.longitude]);
    });

    // If single marker mode (for PropertyDetails)
    if (singleMarkerMode && center.lat && center.lng) {
      const pinHtml = `
        <div style="background: #4f46e5; color: white; padding: 8px 12px; border-radius: 20px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); display: flex; align-items: center; gap: 6px; border: 2px solid white;">
          <span>📍</span>
          <span>${singleMarkerTitle || 'Property Location'}</span>
        </div>
      `;
      const customIcon = L.divIcon({
        className: 'custom-price-marker',
        html: pinHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });
      const singleMarker = L.marker([center.lat, center.lng], { icon: customIcon });
      markersLayer.addLayer(singleMarker);
    } else if (validProps.length > 1 && !selectedPropertyId) {
      // Auto fit bounds if multiple properties
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, selectedPropertyId, hoveredPropertyId, activeProperty, singleMarkerMode, center]);

  // Locate User
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocating(false);

        if (mapInstanceRef.current && markersLayerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1 });

          // Add user pin
          const userPinHtml = `
            <div style="background: #10b981; color: white; padding: 6px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              🎯 You are here
            </div>
          `;
          const userIcon = L.divIcon({
            className: 'custom-price-marker',
            html: userPinHtml,
            iconSize: [90, 26],
            iconAnchor: [45, 13],
          });
          L.marker([latitude, longitude], { icon: userIcon }).addTo(markersLayerRef.current);
        }
      },
      () => {
        setLocating(false);
        alert('Could not retrieve your location. Please check browser permissions.');
      },
      { timeout: 8000 }
    );
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Top Right Controls: Map Layer Switcher */}
          <div className="absolute top-4 right-4 z-[400] flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1">
            <button
              onClick={() => setMapStyle('clean')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mapStyle === 'clean' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clean
            </button>
            <button
              onClick={() => setMapStyle('streets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mapStyle === 'streets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mapStyle === 'satellite' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Bottom Right Controls: Zoom & Locate */}
          <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-2">
            <button
              onClick={handleLocateMe}
              disabled={locating}
              title="Find homes near me"
              className="w-10 h-10 bg-white/95 backdrop-blur-md text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Crosshair className={`w-5 h-5 ${locating ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex items-center justify-center font-bold text-lg border-b border-slate-100 transition-colors"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex items-center justify-center font-bold text-lg transition-colors"
              >
                −
              </button>
            </div>
          </div>
        </>
      )}

      {/* Floating Property Preview Card when Marker is clicked */}
      {activeProperty && !singleMarkerMode && (
        <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-84 z-[400] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/9] bg-slate-100 relative">
              {activeProperty.images?.[0] ? (
                <img
                  src={activeProperty.images[0]}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No Image Available
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-900 shadow-sm">
                {activeProperty.propertyType}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-xl font-extrabold text-indigo-700">
                  ₹{activeProperty.rent.toLocaleString()}
                  <span className="text-xs text-slate-500 font-medium">/mo</span>
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {activeProperty.furnishing}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm truncate mb-1">{activeProperty.title}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                {activeProperty.area ? `${activeProperty.area}, ` : ''}{activeProperty.city}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/property/${activeProperty.id}`}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeProperty.latitude},${activeProperty.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
