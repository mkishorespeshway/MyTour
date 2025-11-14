import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, Phone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiBaseUrl } from "@/integrations/api/client";
import { toast } from "sonner";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
      }
    } catch (error) {
      console.error("Failed to check user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getNavLinks = () => {
    const baseLinks = [
      { name: "Home", path: "/" },
      { name: "Destinations", path: "/destinations" },
      { name: "Trips", path: "/trips" },
      { name: "Blog", path: "/blogs" },
      { name: "Gallery", path: "/gallery" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ];

    if (user) {
      if (user.role === 'admin') {
        return [...baseLinks, { name: "Admin", path: "/admin" }];
      } else {
        return [...baseLinks, { name: "Dashboard", path: "/dashboard" }];
      }
    }

    return [...baseLinks, { name: "Login", path: "/auth" }];
  };

  const navLinks = getNavLinks();

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <MapPin className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="font-serif text-2xl font-bold bg-gradient-adventure bg-clip-text text-transparent">
                GoVenture
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-muted rounded h-8 w-20"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <MapPin className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="font-serif text-2xl font-bold bg-gradient-adventure bg-clip-text text-transparent">
              GoVenture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" className="shadow-soft" onClick={() => navigate('/auth')}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={() => navigate('/auth')}>
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;