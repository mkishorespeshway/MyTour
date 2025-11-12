import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import PopularTrips from "@/components/PopularTrips";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedDestinations />
      <PopularTrips />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
