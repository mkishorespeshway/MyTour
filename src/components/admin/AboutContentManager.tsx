import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
    const { data } = await supabase
      .from("about_content")
      .select("*")
      .eq("section", "main")
      .maybeSingle();

    if (data) {
      setAboutData({
        title: data.title || "",
        content: data.content || "",
        image_url: data.image_url || "",
      });
    }
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

          <div className="space-y-2">
            <Label htmlFor="about-image">Featured Image URL</Label>
            <Input
              id="about-image"
              value={aboutData.image_url}
              onChange={(e) => setAboutData({ ...aboutData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutContentManager;
