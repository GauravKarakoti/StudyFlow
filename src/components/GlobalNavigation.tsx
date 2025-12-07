import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const GlobalNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (["/login", "/signup"].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 md:bottom-10 md:right-10">
      {/* Back Button - Only show if not on root */}
      {location.pathname !== "/" && (
        <Button
          onClick={() => navigate(-1)}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg hover:scale-110 transition-transform border border-border/50"
          title="Go Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Home Button - Only show if not on root */}
      {location.pathname !== "/" && (
        <Button
          onClick={() => navigate("/")}
          variant="default"
          size="icon"
          className="rounded-full shadow-lg hover:scale-110 transition-transform cosmic-glow"
          title="Go Home"
        >
          <Home className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default GlobalNavigation;