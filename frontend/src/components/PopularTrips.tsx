import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import beachImg from "@/assets/destination-beach.jpg";
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

const PopularTrips = () => {
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Popular <span className="text-primary">Trips</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our most loved adventures and create unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((trip, index) => (
            <Card
              key={trip.id}
              className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                {trip.image_url ? (
                  <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <img src={beachImg} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    Adventure
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-primary">
                  {typeof trip.price === 'number' ? `$${trip.price}` : (trip.price || '$')}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {trip.title}
                </h3>
                <p className="text-muted-foreground mb-4">{trip.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {trip.duration || 'Flexible'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Small groups
                  </div>
                </div>

                <Button className="w-full shadow-soft">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="shadow-glow">
            Explore All Trips
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularTrips;
