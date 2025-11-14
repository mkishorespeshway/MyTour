import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight, Calendar, DollarSign } from "lucide-react";
import beachImg from "@/assets/destination-beach.jpg";
import mountainImg from "@/assets/destination-mountain.jpg";
import safariImg from "@/assets/destination-safari.jpg";
import culturalImg from "@/assets/destination-cultural.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Trip {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price?: number | string;
  image_url?: string;
  featured?: boolean;
}

const fallbackByCategory: Record<string, string> = {
  Beach: beachImg,
  Mountain: mountainImg,
  Safari: safariImg,
  Cultural: culturalImg,
};

const FeaturedDestinations = () => {
  const [items, setItems] = useState<Trip[]>([])

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
      setItems((data as Trip[]) || [])
    })()
  }, [])

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-primary">Trips</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of the world's most breathtaking locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {items.map((trip, index) => (
            <Card
              key={trip.id}
              className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                {trip.image_url ? (
                  <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <img src={fallbackByCategory["Cultural"]} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-xs">{trip.duration || "Flexible"}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {trip.title}
                    </h3>
                    {typeof trip.price !== 'undefined' && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <DollarSign className="h-4 w-4" />
                        {String(trip.price)}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {trip.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Explore trip details</span>
                  <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="shadow-soft">
            View All Trips
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
