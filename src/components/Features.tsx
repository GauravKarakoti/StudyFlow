import { Lightbulb, GraduationCap, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const features = [
  {
    icon: Lightbulb,
    title: "Smart Notes",
    description: "AI-powered summaries",
    detail: "Turn your research",
    extra: "Tagging & search"
  },
  {
    icon: GraduationCap,
    title: "Course Hub",
    description: "Track progress",
    detail: "Resource integration",
    extra: "Organize by subject"
  },
  {
    icon: Brain,
    title: "Active Recall Tools",
    description: "Flashcards & quizzes",
    detail: "Spaced repetition",
    extra: "Test yourself"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card 
                    className="cosmic-card p-8 hover-glow group cursor-pointer animate-fade-in border-border/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="space-y-4 text-center">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center cosmic-glow group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      
                      <div className="space-y-2 text-foreground/70">
                        <p>{feature.description}</p>
                        <p>{feature.detail}</p>
                        <p className="text-sm">{feature.extra}</p>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Feature Under Maintenance</DialogTitle>
                    <DialogDescription className="pt-2">
                      This feature is currently under maintenance. We are working hard to bring it back online soon!
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;