import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-adventure.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Adventure awaits"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white animate-fade-in">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Your Next
          <span className="block bg-gradient-sunset bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-white/90">
          Explore breathtaking destinations, plan unforgettable trips, and create memories that last a lifetime
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-strong p-4 animate-scale-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
              <MapPin className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
              <Calendar className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="When?"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button size="lg" className="px-8 shadow-glow">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="animate-float">
            <div className="text-4xl font-bold text-secondary">500+</div>
            <div className="text-white/80">Destinations</div>
          </div>
          <div className="animate-float" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl font-bold text-secondary">50K+</div>
            <div className="text-white/80">Happy Travelers</div>
          </div>
          <div className="animate-float" style={{ animationDelay: "0.4s" }}>
            <div className="text-4xl font-bold text-secondary">4.9</div>
            <div className="text-white/80">Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
