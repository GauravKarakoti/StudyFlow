import { Card } from "@/components/ui/card";
import team from "@/assets/Team.jpg";

export default function Team() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <Card className="cosmic-card p-12 max-w-3xl mx-auto cosmic-glow border-border/50">
          <figure className="w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5 transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={team}
                alt="Our team"
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover object-center block"
              />

            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-4">
              <figcaption className="text-white text-sm sm:text-base font-medium">
                The Team — Building awesome stuff together
              </figcaption>
            </div>
          </figure>
        </Card>
      </div>
    </section>
  );
}