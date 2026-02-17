"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
    center: [number, number];
    onLocationSelect?: (lat: number, lng: number) => void;
    onAddressFound?: (address: any) => void;
}

export default function LeafletMap({ center, onLocationSelect, onAddressFound }: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Keep references to latest callbacks to avoid stale closures in event listeners
    const callbacksRef = useRef({ onLocationSelect, onAddressFound });

    useEffect(() => {
        callbacksRef.current = { onLocationSelect, onAddressFound };
    }, [onLocationSelect, onAddressFound]);

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Check if map already initialized on this container (strict mode check)
        // If we have a ref but the container is empty, re-init.
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(mapContainerRef.current).setView(center, 13);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const marker = L.marker(center, { draggable: true }).addTo(map);
        markerRef.current = marker;

        const handlePositionChange = (lat: number, lng: number) => {
            // Call parent callback
            callbacksRef.current.onLocationSelect?.(lat, lng);

            // Simple reverse geocode
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.address) {
                        callbacksRef.current.onAddressFound?.(data.address);
                    }
                })
                .catch(err => console.error("Reverse geocoding failed", err));
        }

        // Click handler
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            handlePositionChange(lat, lng);
        });

        // Drag handler
        marker.on('dragend', () => {
            const { lat, lng } = marker.getLatLng();
            handlePositionChange(lat, lng);
        });

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Run once on mount (and cleanup on unmount)

    // Update center when prop changes
    useEffect(() => {
        if (!mapRef.current || !markerRef.current) return;

        // Only update if significantly moved to avoid loops
        const currentCenter = mapRef.current.getCenter();
        const dist = Math.sqrt(Math.pow(currentCenter.lat - center[0], 2) + Math.pow(currentCenter.lng - center[1], 2));

        if (dist > 0.0001) { // Threshold
            mapRef.current.setView(center, mapRef.current.getZoom());
            markerRef.current.setLatLng(center);
        }
    }, [center[0], center[1]]);

    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
}
