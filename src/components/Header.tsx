import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/20 cosmic-glow">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-glow">STUDYFLOW</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Notes
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Flashcards
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Profile
            </a>
          </nav>
          
          <Button className="cosmic-glow hover-glow">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
