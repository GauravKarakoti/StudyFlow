import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Sun, Moon, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { useState, useEffect } from "react";
import { NotificationBell } from "./NotificationBell";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
  // State for onboarding popup
  const [showProfileHint, setShowProfileHint] = useState(false);

  // Check for signup redirect
  useEffect(() => {
    if (location.state?.showProfileSetup) {
      setShowProfileHint(true);
      // Clear state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Default to dark if no preference stored
    const initialTheme = storedTheme || "dark";

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Persist to localStorage
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* <div className="bg-orange-600/90 text-white py-1.5 overflow-hidden relative shadow-sm z-50">
        <div className="animate-marquee whitespace-nowrap font-medium text-sm flex items-center gap-4">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 fill-white text-orange-600" />
            Due to unusually high traffic, document previews and pfp uploads are
            temporarily limited. Please check back in 24 hours.
          </span>
          <span className="flex items-center gap-2">•</span>
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 fill-white text-orange-600" />
            Due to unusually high traffic, document previews and pfp uploads are
            temporarily limited. Please check back in 24 hours.
          </span>
        </div>
      </div> */}

      <div className="border-b border-white/10 backdrop-blur-xl bg-background/60 w-full supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Logo.PNG" alt="Logo" className="h-16 w-auto" />
              <span className="text-2xl font-bold text-glow">STUDYFLOW</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* <div className="flex items-center gap-2 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80 hover:text-[#25D366] hover:bg-primary/10 transition-colors"
                >
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80 hover:text-[#FF0000] hover:bg-primary/10 transition-colors"
                >
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
                    <Youtube className="h-5 w-5" />
                  </a>
                </Button>
              </div> */}

              {isAuthenticated() ? (
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  {isAdmin() && (
                    <Button
                      onClick={() => navigate("/admin")}
                      className="cosmic-glow hover-glow"
                    >
                      Admin
                    </Button>
                  )}

                  <Popover open={showProfileHint} onOpenChange={setShowProfileHint}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/50 transition-all"
                            >
                              <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage
                                  src={
                                    user?.avatarUrl
                                      ? user.avatarUrl
                                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                                  }
                                  alt={user?.email || "User"}
                                />
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {user?.email?.substring(0, 2).toUpperCase() || "US"}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-56 backdrop-blur-xl bg-background/95 border-border/50"
                            align="end"
                            forceMount
                          >
                            <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  My Account
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                  {user?.name ?? user?.email}
                                </p>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/50" />

                            <DropdownMenuItem
                              onClick={() => navigate("/settings")}
                              className="cursor-pointer focus:bg-primary/20"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={toggleTheme}
                              className="cursor-pointer focus:bg-primary/20"
                            >
                              {theme === "light" ? (
                                <Moon className="mr-2 h-4 w-4" />
                              ) : (
                                <Sun className="mr-2 h-4 w-4" />
                              )}
                              <span>
                                {theme === "light" ? "Dark Mode" : "Light Mode"}
                              </span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-border/50" />

                            <DropdownMenuItem
                              onClick={logout}
                              className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Log out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </PopoverTrigger>

                    <PopoverContent 
                      side="bottom" 
                      align="end" 
                      className="w-64 bg-primary text-primary-foreground border-none shadow-xl z-[60]"
                    >
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-lg">Welcome aboard! 🎉</h4>
                        <p className="text-sm text-primary-foreground/90">
                          Complete your profile here to get the most out of StudyFlow.
                        </p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => {
                            setShowProfileHint(false);
                            navigate('/settings');
                          }}
                        >
                          Go to Settings
                        </Button>
                      </div>
                      {/* Arrow/Triangle decoration */}
                      <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-primary" /> 
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="cosmic-glow hover-glow"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
