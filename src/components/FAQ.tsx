import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqData = [
    {
      question: "What is Studyflow?",
      answer:
        "Studyflow is an educational platform providing notes, PYQs, assignments, PDFs, short learning videos, community guidance, internships, and skill-based learning opportunities for students.",
    },
    {
      question: "Is StudyFlow free to use?",
      answer:
        "Yes, many resources like basic notes and guidance are free. Some premium materials and courses may be paid.",
    },
    {
      question: "Which subjects & semesters are available?",
      answer:
        "We provide content for Engineering (IPU / B.Tech / Diploma / CS / IT / ECE etc.)",
    },
    {
      question: "Are the notes handwritten or typed?",
      answer:
        "We provide both handwritten and fully typed formatted notes depending on availability and subject requirement.",
    },
    {
      question: "How can I request new notes or report an issue?",
      answer:
        "You can contact us through 📧 Email:studyflowteams@gmail.com and 📱 Instagram: @studyflow.in",
    },
    {
      question: "Will Studyflow launch an app?",
      answer:
        "Yes, the Studyflow mobile app is under development and will launch soon.",
    },
    {
      question: "Is my personal data safe with Studyflow?",
      answer:
        "Yes, we do not sell or share your personal information. All user data is protected and used only to improve services.",
    },
    {
      question: "Who are the founders of Studyflow?",
      answer:
        "Studyflow is founded by Abhay Kanojia (Founder & CEO) and supported by Riya (Content & Data Head) and Gaurav (Technical Lead/Web Developer).",
    },
  ];

  return (
    <section className="py-20 bg-background/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h2 className="text-3xl font-bold text-glow bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/50 rounded-lg px-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left hover:text-primary transition-colors hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
