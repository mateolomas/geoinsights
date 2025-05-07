import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import api from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import { useTheme } from "../contexts/ThemeContext";

// Fix for default marker icon
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface GeoData {
  id: number;
  name: string;
  description: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: Record<string, any>;
}

function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
}

export default function Map() {
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState<GeoData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/geo/");
        if (response.data) {
          setGeoData(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching geo data:", err);
        setError("Failed to load geographic data");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  const handleMarkerClick = (marker: GeoData) => {
    setSelectedMarker(marker);
  };

  const MapZoomToMarker = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedMarker) {
        map.flyTo(
          [selectedMarker.geometry.coordinates[1], selectedMarker.geometry.coordinates[0]],
          13,
          { duration: 1.5 }
        );
      }
    }, [selectedMarker, map]);

    return null;
  };

  if (loading) {
    return (
      <LoadingSpinner size="lg" className="h-[500px] flex items-center justify-center" />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const center: [number, number] =
    geoData.length > 0
      ? [
          geoData.reduce((sum, p) => sum + p.geometry.coordinates[1], 0) /
            geoData.length,
          geoData.reduce((sum, p) => sum + p.geometry.coordinates[0], 0) /
            geoData.length,
        ]
      : [0, 0];

  return (
    <div className="flex h-screen w-screen">
    <div className="relative flex h-[calc(100vh-4rem)] w-full  mx-auto rounded-lg overflow-hidden shadow-xl bg-white dark:bg-gray-800 transition-all duration-300">
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="bg-white dark:bg-gray-700 text-gray-700 dark:text-white p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
          </svg>
        </button>

      </div>

      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-0' : 'w-[320px]'} bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 border-r border-gray-200 dark:border-gray-700`}>
        <div className="p-4">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-white mb-4">Markers List</h2>
          <div className="space-y-2">
            {geoData.map((data) => (
              <div
                key={data.id}
                onClick={() => handleMarkerClick(data)}
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${selectedMarker?.id === data.id ? 'bg-primary-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{data.name}</h3>
                {data.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{data.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={2}
        className="flex-1 z-0 transition-all duration-300"
        scrollWheelZoom={true}
      >
        <ResizeHandler />

        <TileLayer
          url={
            isDark
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MarkerClusterGroup>
          {geoData.map((data) => (
            <Marker
              key={data.id}
              position={[
                data.geometry.coordinates[1],
                data.geometry.coordinates[0],
              ]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(data),
              }}
            >
              <Popup>
                <div className="p-4 min-w-[200px]">
                  <h3 className="font-bold text-lg text-gray-900">{data.name}</h3>
                  {data.description && (
                    <p className="text-gray-600 mt-1">{data.description}</p>
                  )}
                  {data.properties && Object.entries(data.properties).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {Object.entries(data.properties).map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-500 flex justify-between items-center py-1">
                          <span className="font-medium">{key}:</span>
                          <span>{value}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <MapZoomToMarker />
      </MapContainer>
    </div>
    </div>
  );
}