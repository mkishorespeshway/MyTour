import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  client_name: string;
  client_image?: string;
  rating: number;
  review: string;
  featured?: boolean;
  location?: string;
  trip?: string;
}

const Testimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
      setItems((data as Testimonial[]) || [])
    })()
  }, [])

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
          {items.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="p-6 border-none bg-white/95 backdrop-blur-sm shadow-strong hover:shadow-glow transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="h-10 w-10 text-secondary mb-4" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.review}"
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.client_name}</p>
                {testimonial.location && (
                  <p className="text-sm text-muted-foreground mb-2">{testimonial.location}</p>
                )}
                {testimonial.trip && (
                  <p className="text-xs text-primary font-medium">{testimonial.trip}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
