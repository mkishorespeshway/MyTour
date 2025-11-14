import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight, Search } from "lucide-react";
import beachImg from "@/assets/destination-beach.jpg";
import mountainImg from "@/assets/destination-mountain.jpg";
import safariImg from "@/assets/destination-safari.jpg";
import culturalImg from "@/assets/destination-cultural.jpg";
import { supabase } from "@/integrations/supabase/client";

interface Destination {
  id: string;
  name: string;
  location?: string;
  image_url?: string;
  category?: string;
  description?: string;
  featured?: boolean;
}

const fallbackByCategory: Record<string, string> = {
  Beach: beachImg,
  Mountain: mountainImg,
  Safari: safariImg,
  Cultural: culturalImg,
}

import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const location = useLocation()
  const [items, setItems] = useState<Destination[]>([])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) setSearchTerm(q)
  }, [location.search])

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .order("created_at", { ascending: false })
        if (error) return
        setItems((data as Destination[]) || [])
      } catch {
        // keep empty
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((d) => {
      const matchesSearch = (d.name + " " + d.location + " " + d.description).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = !selectedCategory || d.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
  }, [items, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Explore Amazing <span className="text-accent">Destinations</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From tropical paradises to mountain peaks, discover your perfect getaway
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-strong p-3">
            <div className="flex items-center gap-3 px-4 py-2">
              <Search className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={() => { /* no-op */ }}>Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge onClick={() => setSelectedCategory(null)} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              All Destinations
            </Badge>
            <Badge onClick={() => setSelectedCategory("Beach")} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Beach
            </Badge>
            <Badge onClick={() => setSelectedCategory("Mountain")} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Mountain
            </Badge>
            <Badge onClick={() => setSelectedCategory("Safari")} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Safari
            </Badge>
            <Badge onClick={() => setSelectedCategory("Cultural")} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Cultural
            </Badge>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((destination, index) => (
              <Card
                key={destination.id}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  {destination.image_url ? (
                    <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <img src={fallbackByCategory[destination.category || "Cultural"] || culturalImg} alt={destination.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-foreground">{destination.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">Explore</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        {destination.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {destination.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trips available</span>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      Explore
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;
