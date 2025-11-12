import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United States",
    rating: 5,
    text: "GoVenture made our dream vacation a reality! The attention to detail and personalized service exceeded all expectations. We can't wait to book our next adventure!",
    trip: "Maldives Island Hopping",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    text: "The Alpine trekking experience was absolutely phenomenal. Professional guides, stunning views, and perfectly organized itinerary. Highly recommended!",
    trip: "Swiss Alps Adventure",
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "United Kingdom",
    rating: 5,
    text: "An unforgettable safari experience! Seeing wildlife in their natural habitat was magical. GoVenture's expertise made everything seamless and stress-free.",
    trip: "Kenya Wildlife Safari",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in text-white">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-accent">Travelers</span> Say
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Read real experiences from adventurers who've traveled with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="p-6 border-none bg-white/95 backdrop-blur-sm shadow-strong hover:shadow-glow transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="h-10 w-10 text-secondary mb-4" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground mb-2">{testimonial.location}</p>
                <p className="text-xs text-primary font-medium">{testimonial.trip}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
