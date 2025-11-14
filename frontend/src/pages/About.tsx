import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Globe, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [title, setTitle] = useState("About GoVenture")
  const [content, setContent] = useState("Passionate about creating unforgettable travel experiences that connect people with the world's most beautiful destinations")
  const [image, setImage] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("about_content")
          .select<{ title: string; content: string; image_url: string }>("*")
          .eq("section", "main")
          .maybeSingle()
        if (error) return
        const item = data as { title: string; content: string; image_url: string } | null
        if (item) {
          setTitle(item.title || "About GoVenture")
          setContent(item.content || "Passionate about creating unforgettable travel experiences that connect people with the world's most beautiful destinations")
          setImage(item.image_url || "")
        }
      } catch {
        // keep defaults
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-adventure text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            {title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {content}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{content}</p>
            {image && (
              <div className="mt-6">
                <img src={image} alt="About" className="w-full max-w-3xl mx-auto rounded-xl shadow-strong" />
              </div>
            )}
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Passion</h3>
              <p className="text-muted-foreground text-sm">
                We love what we do and it shows in every adventure we create
              </p>
            </Card>

            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-muted-foreground text-sm">
                Committed to providing the highest quality experiences
              </p>
            </Card>

            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sustainability</h3>
              <p className="text-muted-foreground text-sm">
                Protecting the planet and supporting local communities
              </p>
            </Card>

            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-muted-foreground text-sm">
                Building a global family of adventurous spirits
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-float">
              <div className="text-5xl font-bold text-accent mb-2">500+</div>
              <div className="text-white/80">Destinations</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.2s" }}>
              <div className="text-5xl font-bold text-accent mb-2">50K+</div>
              <div className="text-white/80">Happy Travelers</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.4s" }}>
              <div className="text-5xl font-bold text-accent mb-2">4.9</div>
              <div className="text-white/80">Average Rating</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.6s" }}>
              <div className="text-5xl font-bold text-accent mb-2">150+</div>
              <div className="text-white/80">Expert Guides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our passionate team of travel experts is dedicated to creating extraordinary experiences
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
