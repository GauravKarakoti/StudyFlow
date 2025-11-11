import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <Card className="cosmic-card p-12 max-w-3xl mx-auto cosmic-glow border-border/50">
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Quote className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold">Testimonial</h3>
            
            <blockquote className="text-xl text-foreground/80 italic">
              "StudyFlow transformed how I study. My grades grades improved dramatically 
              and I actually enjoy learning now!"
            </blockquote>
            
            <div className="pt-4">
              <p className="font-semibold text-primary">— Sarah Johnson</p>
              <p className="text-sm text-foreground/60">Medical Student</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Testimonial;
