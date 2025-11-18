import { Instagram, Youtube } from "lucide-react";
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
    <footer className="border-t border-border/50 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Updated Links Section */}
          <div className="flex gap-6 text-sm text-foreground/60 items-center">
            
            {/* About Us Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-foreground transition-colors">About Us</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About StudyFlow</DialogTitle>
                  <DialogDescription>
                    StudyFlow is a comprehensive platform designed to streamline your academic journey...
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Help Link (Mailto) */}
            <a href="mailto:studyflowteams@gmail.com" className="hover:text-foreground transition-colors">
              Help
            </a>

            {/* Terms & Conditions Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-foreground transition-colors">Terms</button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Terms and Conditions</DialogTitle>
                  <DialogDescription>
                    By using this platform, you agree to the following terms...
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

             {/* Privacy Policy Modal */}
             <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-foreground transition-colors">Privacy Policy</button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription>
                    We value your privacy. This policy outlines how we handle your data...
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

          </div>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://youtube.com/@studyflow-7" className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors cosmic-glow">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/studyflow.in" className="p-2 rounded-lg bg-card hover:bg-primary/20 transition-colors cosmic-glow">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center py-4 text-gray-500 text-sm">
          © 2025 • Created by <a href="https://github.com/GauravKarakoti" className="font-semibold text-white-700">Gaurav Karakoti</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;