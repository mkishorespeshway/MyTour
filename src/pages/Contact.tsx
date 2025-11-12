import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Get in <span className="text-accent">Touch</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We're here to help you plan your perfect adventure
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-2">Available 24/7</p>
              <a href="tel:+1234567890" className="text-primary hover:underline font-medium">
                +1 (234) 567-890
              </a>
            </Card>

            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">We'll respond within 24h</p>
              <a href="mailto:info@goventure.com" className="text-primary hover:underline font-medium">
                info@goventure.com
              </a>
            </Card>

            <Card className="p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
              <p className="text-muted-foreground mb-2">Chat with us</p>
              <a href="https://wa.me/1234567890" className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                Start Chat
              </a>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 shadow-strong">
              <h2 className="font-serif text-3xl font-bold mb-6 text-center">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="john.doe@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input type="tel" placeholder="+1 (234) 567-890" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us about your dream adventure..."
                    rows={6}
                  />
                </div>
                <Button className="w-full shadow-soft" size="lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <Card className="overflow-hidden shadow-strong">
              <div className="h-96 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Map integration placeholder</p>
                  <p className="text-sm text-muted-foreground mt-2">Google Maps or OpenStreetMap can be embedded here</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
