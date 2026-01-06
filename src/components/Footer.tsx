import { Instagram, Youtube, Mail, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
              StudyFlow
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Empowering students with smart tools for a brighter future.
              Organize, learn, and excel with our comprehensive study platform.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/studyflow.in"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@studyflow-7"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="mailto:studyflowteams@gmail.com"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbBKzM21yT2FOYHJ5n38"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-primary transition-colors">
                      About Us
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>About StudyFlow</DialogTitle>
                      <DialogDescription className="pt-4">
                        Studyflow is an educational platform designed to make
                        learning easier and smarter for students.
                      </DialogDescription>
                      <DialogDescription>
                        We provide structured study materials including notes,
                        previous year questions, assignments, PDFs, project
                        guidance, internships, reels-based learning, and career
                        development opportunities.
                      </DialogDescription>
                      <DialogDescription className="pt-4">
                        Studyflow is proudly Powered by Freakooh, focusing on
                        digital learning, creativity, and technological
                        advancement in the education space.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <a
                  href="/learn"
                  className="hover:text-primary transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="/select-course"
                  className="hover:text-primary transition-colors"
                >
                  Notes
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal & Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-primary transition-colors">
                      Terms & Conditions
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Terms and Conditions</DialogTitle>
                      <DialogDescription className="pt-4">
                        By using Studyflow, you agree to our Terms & Conditions.
                      </DialogDescription>
                      <DialogDescription>
                        All study materials, notes, videos, graphics, and
                        content available on Studyflow are the intellectual
                        property of Studyflow (Powered by Freakooh) and are for
                        personal educational use only.
                      </DialogDescription>
                      <DialogDescription>
                        Unauthorized copying, distribution, or commercial use is
                        strictly prohibited.
                      </DialogDescription>
                      <DialogDescription className="pt-4">
                        Studyflow is not responsible for any academic loss,
                        technical issues, or third-party website content.
                      </DialogDescription>
                      <DialogDescription>
                        Paid services are non-refundable unless clearly stated.
                      </DialogDescription>
                      <DialogDescription>
                        We reserve the right to modify or suspend services and
                        accounts that violate policies.
                      </DialogDescription>
                      <DialogDescription className="pt-4">
                        For any support or queries, email us at:{" "}
                        <a
                          href="mailto:studyflowteams@gmail.com"
                          className="text-blue-500"
                        >
                          studyflowteams@gmail.com
                        </a>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-primary transition-colors">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                      <DialogDescription className="pt-4">
                        Studyflow values your privacy. We collect basic
                        information like name, email, and usage data to improve
                        user experience and provide services.
                      </DialogDescription>
                      <DialogDescription>
                        We do not sell or share personal data with unauthorized
                        parties.
                      </DialogDescription>
                      <DialogDescription>
                        Data is protected under secure systems and used only to
                        manage your account, communications, and service
                        improvement.
                      </DialogDescription>
                      <DialogDescription className="pt-4">
                        We use cookies to enhance site functionality.
                      </DialogDescription>
                      <DialogDescription>
                        You can request data deletion by contacting support.
                      </DialogDescription>
                      <DialogDescription className="pt-4">
                        Updates to this policy will be posted here. Continued
                        use implies acceptance.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <a
                  href="mailto:studyflowteams@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4 max-w-4xl mx-auto">
            Disclaimer: All the books and study resources hosted on StudyFlow
            are provided for informational and educational purposes only. We do
            not claim ownership of any of the resources available on the
            website.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                © {new Date().getFullYear()} StudyFlow. All rights reserved.
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              <span>
                Check the{" "}
                <a
                  href="https://github.com/GauravKarakoti/StudyFlow"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Source Code
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
