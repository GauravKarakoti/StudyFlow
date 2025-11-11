import { Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-sm text-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">About Us</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors cosmic-glow">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors cosmic-glow">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors cosmic-glow">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-foreground/40">
          © 2025 StudyFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
