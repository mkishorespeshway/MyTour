import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "@/integrations/api/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
type User = { email: string, role: string };
import DestinationsManager from "@/components/admin/DestinationsManager";
import TripsManager from "@/components/admin/TripsManager";
import HomeContentManager from "@/components/admin/HomeContentManager";
import AboutContentManager from "@/components/admin/AboutContentManager";
import ContactSubmissionsManager from "@/components/admin/ContactSubmissionsManager";
import ClientPhotosManager from "@/components/admin/ClientPhotosManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import BlogsManager from "@/components/admin/BlogsManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import TripDestinationsManager from "@/components/admin/TripDestinationsManager";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setLoading(false); navigate("/auth"); return }
    setSession({ token });
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error("Unauthorized")
        const json: User = await res.json()
        setUser(json)
        if (json.role !== "admin") { throw new Error("Not admin") }
        setIsAdmin(true)
      } catch {
        navigate("/auth")
      } finally {
        setLoading(false)
      }
    })()
  }, [navigate])

  const checkAdminRole = async (_userId: string) => {};

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-primary">
              GoVenture Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button onClick={() => navigate("/")} variant="outline" size="sm">
                Back to Site
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-1">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="trip-destinations">Trip Destinations</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="photos">Client Photos</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations">
            <DestinationsManager />
          </TabsContent>

          <TabsContent value="trip-destinations">
            <TripDestinationsManager />
          </TabsContent>

          <TabsContent value="trips">
            <TripsManager />
          </TabsContent>

          <TabsContent value="home">
            <HomeContentManager />
          </TabsContent>

          <TabsContent value="about">
            <AboutContentManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactSubmissionsManager />
          </TabsContent>

          <TabsContent value="photos">
            <ClientPhotosManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="blogs">
            <BlogsManager />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
