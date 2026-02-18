"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "@/styles/PropertyMap.module.css";

// Fix default icon paths for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function MapSelector({ latitude, longitude, address, onChange }) {
  const [marker, setMarker] = useState(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude) setMarker([latitude, longitude]);
  }, [latitude, longitude]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const key = process.env.NEXT_PUBLIC_NESHAN_API_KEY;
      let addr = "";
      if (key) {
        // try Neshan reverse
        const res = await fetch(`https://api.neshan.org/v2/reverse?lat=${lat}&lng=${lng}`, {
          headers: { "Api-Key": key },
        });
        if (res.ok) {
          const data = await res.json();
          addr = data?.formatted_address || data?.address || "";
        }
      }

      if (!addr) {
        // fallback to Nominatim
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fa`
        );
        if (res.ok) {
          const data = await res.json();
          addr = data.display_name || "";
        }
      }
      return addr;
    } catch (err) {
      return "";
    }
  };

  const geocode = async (q) => {
    setLoading(true);
    try {
      const key = process.env.NEXT_PUBLIC_NESHAN_API_KEY;
      let res;
      if (key) {
        res = await fetch(`https://api.neshan.org/v2/search?term=${encodeURIComponent(q)}`, {
          headers: { "Api-Key": key },
        });
        if (res.ok) {
          const data = await res.json();
          // Neshan returns features with geometry
          const mapped = (data?.features || []).map((f) => ({
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            display_name: f.properties?.formatted || f.properties?.name || JSON.stringify(f.properties),
          }));
          setResults(mapped);
          setLoading(false);
          return;
        }
      }

      // fallback to Nominatim
      const nom = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1&accept-language=fa`
      );
      if (nom.ok) {
        const data = await nom.json();
        const mapped = (data || []).map((r) => ({
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          display_name: r.display_name,
        }));
        setResults(mapped);
      }
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (latlng) => {
    const [lat, lng] = [latlng.lat, latlng.lng];
    setMarker([lat, lng]);
    const addr = await reverseGeocode(lat, lng);
    if (onChange) onChange({ address: addr, latitude: lat, longitude: lng });
  };

  const handleSelectResult = (r) => {
    setMarker([r.lat, r.lng]);
    setResults([]);
    if (mapRef.current) {
      try {
        mapRef.current.setView([r.lat, r.lng], 15);
      } catch (e) {}
    }
    if (onChange) onChange({ address: r.display_name, latitude: r.lat, longitude: r.lng });
  };

  return (
    <div className={styles.mapSelector}>
      <div style={{ marginBottom: "0.5rem" }}>
        <input
          placeholder="جستجوی آدرس (مثال: تهران، فلان خیابان)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => geocode(query)}
            disabled={loading}
          >
            جستجو
          </button>
          <button
            type="button"
            className={styles.submitButton}
            onClick={async () => {
              if (!marker) return;
              const addr = await reverseGeocode(marker[0], marker[1]);
              if (onChange) onChange({ address: addr, latitude: marker[0], longitude: marker[1] });
            }}
          >
            ثبت از نشانگر
          </button>
        </div>
        {results.length > 0 && (
          <div className={styles.searchResults} style={{ marginTop: "0.5rem" }}>
            {results.map((r, i) => (
              <div key={i} className={styles.searchResult} onClick={() => handleSelectResult(r)}>
                {r.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.map} style={{ height: 300, borderRadius: 8, overflow: "hidden" }}>
        <MapContainer
          center={marker || [35.6892, 51.3890]}
          zoom={marker ? 15 : 12}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(m) => (mapRef.current = m)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onMapClick={handleMapClick} />
          {marker && (
            <Marker position={marker}>
              <Popup>{address || "موقعیت انتخاب‌شده"}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
