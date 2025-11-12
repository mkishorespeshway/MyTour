import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, Calendar, Search, SlidersHorizontal } from "lucide-react";
import beachImg from "@/assets/destination-beach.jpg";
import mountainImg from "@/assets/destination-mountain.jpg";
import safariImg from "@/assets/destination-safari.jpg";

const trips = [
  {
    id: 1,
    title: "Island Hopping Adventure",
    destination: "Maldives",
    image: beachImg,
    duration: "7 Days",
    groupSize: "12 people",
    price: "$2,499",
    rating: 4.9,
    difficulty: "Easy",
    startDate: "May 15, 2024",
  },
  {
    id: 2,
    title: "Alpine Trekking Experience",
    destination: "Swiss Alps",
    image: mountainImg,
    duration: "10 Days",
    groupSize: "8 people",
    price: "$3,299",
    rating: 4.8,
    difficulty: "Moderate",
    startDate: "June 10, 2024",
  },
  {
    id: 3,
    title: "Wildlife Safari Expedition",
    destination: "Kenya",
    image: safariImg,
    duration: "12 Days",
    groupSize: "10 people",
    price: "$3,999",
    rating: 4.9,
    difficulty: "Easy",
    startDate: "July 5, 2024",
  },
];

const Trips = () => {
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
            <p className="text-muted-foreground">Showing {trips.length} trips</p>
            <select className="px-4 py-2 border border-border rounded-lg bg-background">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration: Shortest</option>
              <option>Duration: Longest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip, index) => (
              <Card
                key={trip.id}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {trip.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-primary">
                    {trip.price}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{trip.destination}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Up to {trip.groupSize}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Starts {trip.startDate}
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
