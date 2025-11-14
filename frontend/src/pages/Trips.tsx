import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, Calendar, Search, SlidersHorizontal } from "lucide-react";
import beachImg from "@/assets/destination-beach.jpg";
import mountainImg from "@/assets/destination-mountain.jpg";
import safariImg from "@/assets/destination-safari.jpg";
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Trip {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price?: number | string;
  image_url?: string;
  destination_id?: string;
  featured?: boolean;
}

const tripsImages: Record<string, string> = {
  beach: beachImg,
  mountain: mountainImg,
  safari: safariImg,
}

const Trips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const location = useLocation()

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .order("created_at", { ascending: false })
        if (error) return
        setTrips((data as Trip[]) || [])
      } catch {
        // keep empty
      }
    })();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) setSearchTerm(q)
  }, [location.search])

  const filtered = useMemo(() => {
    return trips.filter(t => {
      const hay = `${t.title} ${t.description ?? ""}`.toLowerCase()
      return hay.includes(searchTerm.toLowerCase())
    })
  }, [trips, searchTerm])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-adventure text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Your Next <span className="text-accent">Adventure</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of unforgettable travel experiences
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-strong p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                <Search className="h-5 w-5 text-primary" />
                <input
                  type="text"
                  placeholder="Search trips..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="lg" className="bg-white">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
              <Button size="lg">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              All Trips
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Adventure
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Relaxation
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Cultural
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Wildlife
            </Badge>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <p className="text-muted-foreground">Showing {filtered.length} trips</p>
            <select className="px-4 py-2 border border-border rounded-lg bg-background">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration: Shortest</option>
              <option>Duration: Longest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((trip, index) => (
              <Card
                key={trip.id}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-56 overflow-hidden">
                  {trip.image_url ? (
                    <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <img src={tripsImages.beach} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Dates available
                    </div>
                  </div>

                  <Link to={`/trips/${trip.id}`} className="w-full">
                    <Button className="w-full shadow-soft">
                    View Details
                  </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Trips
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trips;
