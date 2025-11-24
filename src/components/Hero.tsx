import { Button } from "@/components/ui/button";
import heroImage from "@/assets/cosmic-hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-[120px]" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="pt-6 lg:pt-0 text-5xl md:text-7xl font-bold leading-tight">
              Organize Your Learning,{" "}
              <span className="text-glow bg-gradient-to-r 
                from-[hsl(var(--gradient-start))]
                via-[hsl(var(--gradient-mid))]
                to-[hsl(var(--gradient-end))]
                bg-clip-text text-transparent"
              >
                Unlock Your Potential
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-lg">
              Your syllabus, sorted. Your prep, powered. <br/>
              Just click ‘Start Taking Notes Free’ and begin the glow-up.
            </p>
            
            <Link to="/select-course">
              <Button size="lg" className="cosmic-glow hover-glow text-lg mx-8 my-6">
                Start Taking Notes Free
              </Button>
            </Link>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Cosmic learning environment" 
              className="relative rounded-3xl border border-border/50 cosmic-glow w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cosmic-glow rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;