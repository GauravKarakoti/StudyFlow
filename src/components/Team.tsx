import { Card } from "@/components/ui/card";
import team from "@/assets/Team.jpg";

export default function Team() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Meet The Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals behind StudyFlow, dedicated to
            transforming your learning experience.
          </p>
        </div>

        <Card className="cosmic-card p-0 overflow-hidden max-w-4xl mx-auto cosmic-glow border-border/50 group relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-x" />

          <figure className="w-full relative z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
              <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 animate-bounce-slow">
                Building the future of education together
              </p>
            </div>
            <img
              src={team}
              alt="Our team"
              loading="lazy"
              draggable={false}
              className="w-full h-auto object-contain block transition-transform duration-700 group-hover:scale-105"
            />
          </figure>
        </Card>
      </div>
    </section>
  );
}
