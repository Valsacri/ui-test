import { MapPin } from 'lucide-react';

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description?: string;
  }>;
  height?: string;
  className?: string;
}

export function MapView({ 
  center, 
  zoom = 13, 
  markers = [],
  height = '300px',
  className = ''
}: MapViewProps) {
  // Use a static map image from OpenStreetMap
  const [lat, lng] = center;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  
  return (
    <div className={className} style={{ height, width: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          src={mapUrl}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            borderRadius: '8px'
          }}
          title="Location Map"
        />
      </div>
      
      {/* Overlay with marker info */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-[#003C66] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {markers[0].description && (
                <p className="text-sm text-muted-foreground truncate">{markers[0].description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}