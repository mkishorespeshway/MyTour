import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Card } from "./ui/card";

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

const WeatherWidget = ({ latitude, longitude, locationName }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m`
        );
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weathercode,
          windSpeed: Math.round(data.current.windspeed_10m),
          humidity: data.current.relativehumidity_2m,
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-8 w-8 text-accent" />;
    if (code <= 3) return <Cloud className="h-8 w-8 text-muted-foreground" />;
    if (code <= 67) return <CloudRain className="h-8 w-8 text-primary" />;
    return <Wind className="h-8 w-8 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-24 bg-muted rounded" />
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="p-4 shadow-soft hover:shadow-strong transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Weather</p>
          <p className="font-semibold text-lg">{locationName}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold">{weather.temperature}°C</span>
            {getWeatherIcon(weather.weatherCode)}
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <Wind className="h-4 w-4" />
            {weather.windSpeed} km/h
          </div>
          <div>Humidity: {weather.humidity}%</div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
