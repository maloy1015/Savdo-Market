import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, LocateFixed, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Default marker icon fix (Vite bundles break Leaflet's default asset paths)
const pinIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/fluency/48/marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 36],
});

const TASHKENT = { lat: 41.311081, lng: 69.240562 };

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 16, { duration: 0.8 });
  }, [position]); // eslint-disable-line
  return null;
}

/**
 * Interactive OpenStreetMap picker (Leaflet-based, no API key needed).
 * value: { lat, lng, label } | null
 * onChange: (({ lat, lng, label }) => void)
 */
export default function LiveMap({ value, onChange, height = 260 }) {
  const [position, setPosition] = useState(value || TASHKENT);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz`
      );
      const data = await res.json();
      const label = data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setPosition({ lat, lng, label });
      onChange?.({ lat, lng, label });
    } catch {
      setPosition({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
      onChange?.({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    }
  }, [onChange]);

  const handlePick = (lat, lng) => reverseGeocode(lat, lng);

  const handleSearchChange = (v) => {
    setQuery(v);
    clearTimeout(debounceRef.current);
    if (!v.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(v + ", Toshkent, Uzbekiston")}&accept-language=uz&limit=5`
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
  };

  const selectResult = (r) => {
    const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
    setPosition({ lat, lng, label: r.display_name });
    onChange?.({ lat, lng, label: r.display_name });
    setResults([]);
    setQuery("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div className="relative p-3 border-b border-gray-100 bg-white flex items-center gap-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          className="flex-1 text-sm outline-none"
          placeholder="Manzilni qidirish..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <button
          type="button"
          onClick={useMyLocation}
          className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 shrink-0"
        >
          <LocateFixed size={15} /> Mening joyim
        </button>
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 mx-3 bg-white border border-gray-200 rounded-xl shadow-soft z-[1000] overflow-hidden">
            {results.map((r) => (
              <button
                type="button"
                key={r.place_id}
                onClick={() => selectResult(r)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-brand-50 flex items-start gap-2 border-b border-gray-50 last:border-0"
              >
                <MapPin size={13} className="text-brand-500 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ height }} className="relative">
        <MapContainer center={[position.lat, position.lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[position.lat, position.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                reverseGeocode(lat, lng);
              },
            }}
          />
          <ClickHandler onPick={handlePick} />
          <FlyTo position={position} />
        </MapContainer>
      </div>

      <div className="p-3 bg-gray-50 flex items-start gap-2 text-xs text-gray-600">
        <MapPin size={14} className="text-brand-600 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{position.label || "Manzilni tanlash uchun xaritani bosing yoki belgini suring"}</span>
      </div>
    </div>
  );
}
