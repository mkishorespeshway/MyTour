import { MapPin } from "lucide-react";
import { Card } from "./ui/card";

interface MapEmbedProps {
  latitude: number;
  longitude: number;
  locationName: string;
  zoom?: number;
}

const MapEmbed = ({ latitude, longitude, locationName, zoom = 13 }: MapEmbedProps) => {
  return (
    <Card className="overflow-hidden shadow-soft animate-fade-in">
      <div className="bg-primary/10 p-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-semibold">{locationName}</span>
      </div>
      <div className="relative h-80 w-full">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
          style={{ border: 0 }}
        />
      </div>
      <div className="p-2 text-center">
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View Larger Map
        </a>
      </div>
    </Card>
  );
};

export default MapEmbed;
