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

const destinations = [
  {
    id: 1,
    name: "Tropical Paradise",
    location: "Maldives",
    image: beachImg,
    rating: 4.9,
    trips: 45,
    description: "Crystal clear waters, pristine beaches, and luxurious resorts",
    category: "Beach",
  },
  {
    id: 2,
    name: "Mountain Escape",
    location: "Swiss Alps",
    image: mountainImg,
    rating: 4.8,
    trips: 38,
    description: "Majestic peaks, alpine villages, and world-class hiking",
    category: "Mountain",
  },
  {
    id: 3,
    name: "Wildlife Safari",
    location: "Kenya",
    image: safariImg,
    rating: 4.9,
    trips: 52,
    description: "Unforgettable wildlife encounters and vast savannas",
    category: "Safari",
  },
  {
    id: 4,
    name: "Cultural Heritage",
    location: "Nepal",
    image: culturalImg,
    rating: 4.7,
    trips: 41,
    description: "Ancient temples, monasteries, and spiritual journeys",
    category: "Cultural",
  },
];

const Destinations = () => {
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
              />
              <Button>Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              All Destinations
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Beach
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Mountain
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Safari
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Cultural
            </Badge>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card
                key={destination.id}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-foreground">{destination.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">{destination.rating}</span>
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
                    <span className="text-sm text-muted-foreground">
                      {destination.trips} trips available
                    </span>
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
