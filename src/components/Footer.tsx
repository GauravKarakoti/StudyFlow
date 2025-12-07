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
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Made with{" "}
                <Heart className="w-3 h-3 text-red-500 fill-current" /> by
                Freakooh
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              <span>
                Powered by{" "}
                <a
                  href="https://github.com/abhaykanojia16"
                  className="hover:text-primary transition-colors"
                >
                  Freakooh
                </a>
              </span>
              <span>
                Created by{" "}
                <a
                  href="https://github.com/GauravKarakoti"
                  className="hover:text-primary transition-colors"
                >
                  Gaurav Karakoti
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
