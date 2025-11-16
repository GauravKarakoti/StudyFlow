import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth(); // Get auth state and functions
  const navigate = useNavigate(); // Get navigate function

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.PNG" alt="Logo" className="h-16 w-auto" />
            <span className="text-2xl font-bold text-glow">STUDYFLOW</span>
          </Link>

          <div className="flex items-center gap-4"> {/* Group for buttons */}
            {isAuthenticated() ? (
              <>
                {isAdmin() && ( // Conditionally show Admin button
                  <Button
                    onClick={() => navigate("/admin")}
                    className="cosmic-glow hover-glow"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  onClick={logout} // Logout button
                  className="cosmic-glow hover-glow"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")} // Login button
                className="cosmic-glow hover-glow"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;