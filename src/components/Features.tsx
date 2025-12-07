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
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: GraduationCap,
    title: "Tutorial",
    description: "How to Use StudyFlow",
    detail: "Resource integration",
    extra: "Organize by subject",
  },
  {
    icon: Brain,
    title: "Learn with StudyFlow",
    description: "Flashcards & quizzes",
    detail: "Spaced repetition",
    extra: "Learn and Test yourself",
  },
  {
    icon: Lightbulb,
    title: "Smart Notes",
    description: "AI-powered summaries",
    detail: "Turn your research",
    extra: "Tagging & search",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            // Check if this is the "Learn with StudyFlow" card
            if (feature.title === "Learn with StudyFlow") {
              return (
                <Card
                  key={index}
                  onClick={() => navigate("/learn")}
                  className="cosmic-card p-8 hover-glow group cursor-pointer animate-fade-in border-border/50 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:animate-pulse" />

                  <div className="space-y-4 text-center relative z-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center cosmic-glow group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                      <Icon className="h-8 w-8 text-primary group-hover:animate-bounce-slow" />
                    </div>

                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <div className="space-y-2 text-foreground/70">
                      <p>{feature.description}</p>
                      <p>{feature.detail}</p>
                      <p className="text-sm">{feature.extra}</p>
                    </div>
                  </div>
                </Card>
              );
            }

            // Check if this is the "Tutorial" card
            if (feature.title === "Tutorial") {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Card
                      className="cosmic-card p-8 hover-glow group cursor-pointer animate-fade-in border-border/50 relative overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:animate-pulse" />

                      <div className="space-y-4 text-center relative z-10">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center cosmic-glow group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                          <Icon className="h-8 w-8 text-primary group-hover:animate-bounce-slow" />
                        </div>

                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>

                        <div className="space-y-2 text-foreground/70">
                          <p>{feature.description}</p>
                          <p>{feature.detail}</p>
                          <p className="text-sm">{feature.extra}</p>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-card border-border/50">
                    <DialogHeader>
                      <DialogTitle>Tutorial Video</DialogTitle>
                      <DialogDescription>
                        Watch our guide on how to make the most of StudyFlow.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <a
                        href="https://youtu.be/cazOOgxosh8?si=THbXcFuHw0UrTSwP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block space-y-4"
                      >
                        {/* Video Thumbnail with Play Button Overlay */}
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 group-hover:border-primary/50 transition-all shadow-lg">
                          <img
                            src="https://img.youtube.com/vi/cazOOgxosh8/maxresdefault.jpg"
                            alt="StudyFlow Tutorial"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                              <svg
                                className="w-8 h-8 text-white fill-current ml-1"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Video Caption */}
                        <p className="text-lg font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
                          StudyFlow Website Is LIVE! 🚀 | Full Tutorial for
                          College Students (Must Watch!) | Notes 📝
                        </p>
                      </a>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }

            // Default behavior for other cards (Dialog)
            return (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card
                    className="cosmic-card p-8 hover-glow group cursor-pointer animate-fade-in border-border/50 relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="space-y-4 text-center relative z-10">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center cosmic-glow group-hover:scale-110 transition-transform duration-500 group-hover:animate-float">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>

                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>

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
                      This feature is currently under maintenance. We are
                      working hard to bring it back online soon!
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
