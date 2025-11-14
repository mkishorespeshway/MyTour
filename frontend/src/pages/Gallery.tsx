import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin } from "lucide-react";

interface ClientPhoto {
  id: string;
  title: string;
  description: string;
  image_url: string;
  client_name: string;
  location: string;
  featured: boolean;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<ClientPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("client_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-up">
                Client Adventures Gallery
              </h1>
              <p className="text-lg text-muted-foreground animate-slide-up animation-delay-100">
                See the amazing moments our travelers have experienced around the world
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No photos yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <Card 
                    key={photo.id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={photo.image_url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {photo.featured && (
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        {photo.title && (
                          <h3 className="font-semibold text-lg">{photo.title}</h3>
                        )}
                        {photo.description && (
                          <p className="text-sm text-muted-foreground">{photo.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          {photo.client_name && (
                            <span className="text-muted-foreground">by {photo.client_name}</span>
                          )}
                          {photo.location && (
                            <div className="flex items-center gap-1 text-primary">
                              <MapPin className="h-3 w-3" />
                              <span>{photo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
