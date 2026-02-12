"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "@/styles/PropertyMap.module.css";

// رفع مشکل آیکون در Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PropertyMap({ latitude, longitude, address }) {
  if (!latitude || !longitude) {
    return <div className={styles.placeholder}>موقعیت مکانی برای این ملک ثبت نشده است</div>;
  }

  const position = [latitude, longitude];

  return (
    <div className={styles.container}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{address || "موقعیت ملک"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}