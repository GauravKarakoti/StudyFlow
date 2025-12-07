import { Button } from "@/components/ui/button";
import heroImage from "@/assets/cosmic-hero.jpg";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import HeroBackground from "./HeroBackground";
import HeroParticles from "./HeroParticles";

const Hero = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "Unlock Your Potential",
    "Ace Your Exams",
    "Master Your Subjects",
    "Learn Smarter",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      <HeroBackground />
      <HeroParticles />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-bounce-slow hover:bg-primary/20 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Revolutionize your study routine</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Organize Your Learning,{" "}
              <span
                className="block min-h-[2.5em] md:min-h-[1.3em] text-glow bg-gradient-to-r 
                from-primary via-secondary to-accent
                bg-clip-text text-transparent animate-gradient-x"
              >
                {text}
                <span className="animate-pulse text-primary">|</span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Your syllabus, sorted. Your prep, powered.{" "}
              <br className="hidden md:block" />
              Join thousands of students mastering their subjects with
              StudyFlow.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Link to="/select-course">
                <Button
                  size="lg"
                  className="cosmic-glow hover-glow text-lg px-8 h-14 rounded-full w-full sm:w-auto group transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0"
                >
                  Start Learning Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full w-full sm:w-auto border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-scale-in mt-10 lg:mt-0 group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-70 transition duration-1000 animate-pulse" />
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 pointer-events-none mix-blend-overlay" />
              <img
                src={heroImage}
                alt="Cosmic learning environment"
                className="w-full h-auto object-cover hover:scale-110 transition-transform duration-[2s]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
