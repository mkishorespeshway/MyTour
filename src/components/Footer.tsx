import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold bg-gradient-adventure bg-clip-text text-transparent">
                GoVenture
              </span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Discover breathtaking destinations and create unforgettable memories with our expertly curated travel experiences.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/destinations" className="text-muted-foreground hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link to="/trips" className="text-muted-foreground hover:text-primary transition-colors">Trips</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Travel Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Travel Blog</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">Travel Guides</Link></li>
              <li><Link to="/reviews" className="text-muted-foreground hover:text-primary transition-colors">Reviews</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Call Us</p>
                  <a href="tel:+1234567890" className="hover:text-primary transition-colors">+1 (234) 567-890</a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:info@goventure.com" className="hover:text-primary transition-colors">info@goventure.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 GoVenture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
