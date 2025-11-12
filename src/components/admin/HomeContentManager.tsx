import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface HomeContent {
  section: string;
  title: string;
  subtitle: string;
  image_url: string;
}

const HomeContentManager = () => {
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
  });

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    const { data } = await supabase
      .from("home_content")
      .select("*")
      .eq("section", "hero")
      .maybeSingle();

    if (data) {
      setHeroData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        image_url: data.image_url || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("home_content")
      .upsert({
        section: "hero",
        ...heroData,
      }, {
        onConflict: "section",
      });

    if (error) {
      toast.error("Failed to update home content");
    } else {
      toast.success("Home content updated successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Page Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            
            <div className="space-y-2">
              <Label htmlFor="hero-title">Main Title</Label>
              <Input
                id="hero-title"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Discover Your Next Adventure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                placeholder="Explore breathtaking destinations around the world"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-image">Background Image URL</Label>
              <Input
                id="hero-image"
                value={heroData.image_url}
                onChange={(e) => setHeroData({ ...heroData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeContentManager;
