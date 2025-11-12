import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
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
  },
];

const PopularTrips = () => {
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
