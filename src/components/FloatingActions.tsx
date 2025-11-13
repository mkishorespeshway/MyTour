import { Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const FloatingActions = () => {
  const phoneNumber = "+1234567890"; // Admin can configure this
  const whatsappNumber = "+1234567890"; // Admin can configure this

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-slide-in-right">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-glow bg-[#25D366] hover:bg-[#20BA59] text-white border-none transition-all duration-300 hover:scale-110 animate-float"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>

      {/* Call Button */}
      <a href={`tel:${phoneNumber}`} className="group">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-strong bg-gradient-adventure hover:opacity-90 text-white border-none transition-all duration-300 hover:scale-110"
          style={{ animationDelay: "0.2s" }}
        >
          <Phone className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
};

export default FloatingActions;
