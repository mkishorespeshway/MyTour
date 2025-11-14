import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";

const AboutContentManager = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select<{ title: string; content: string; image_url: string }>("*")
        .eq("section", "main")
        .maybeSingle();
      if (error) return;
      const item = data as { title: string; content: string; image_url: string } | null;
      if (item) {
        setAboutData({
          title: item.title || "",
          content: item.content || "",
          image_url: item.image_url || "",
        });
      }
    } catch (e) { console.error(e) }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("about_content")
      .upsert({
        section: "main",
        ...aboutData,
      }, {
        onConflict: "section",
      });

    if (error) {
      toast.error("Failed to update about content");
    } else {
      toast.success("About content updated successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about-title">Page Title</Label>
            <Input
              id="about-title"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              placeholder="About GoVenture"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about-content">Content</Label>
            <Textarea
              id="about-content"
              value={aboutData.content}
              onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
              placeholder="Tell your story..."
              rows={10}
            />
          </div>

          <ImageUpload
            label="Featured Image"
            value={aboutData.image_url}
            onChange={(url) => setAboutData({ ...aboutData, image_url: url })}
            placeholder="Upload a featured image for the about page"
            folder="about"
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutContentManager;
