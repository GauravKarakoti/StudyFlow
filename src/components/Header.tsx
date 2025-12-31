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
import { Settings, LogOut, Sun, Moon, Search } from "lucide-react"; 
import { useState, useEffect } from "react";
import { NotificationBell } from "./NotificationBell";
import { GlobalSearch } from "./GlobalSearch"; // Import the new component

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
  const [searchOpen, setSearchOpen] = useState(false); // State for search dialog
  
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
    <>
      {/* Global Search Dialog Component */}
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />

      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <div className="border-b border-white/10 backdrop-blur-xl bg-background/60 w-full supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img src="/Logo.PNG" alt="Logo" className="h-16 w-auto" />
                <span className="text-2xl font-bold text-glow">STUDYFLOW</span>
              </Link>

              <div className="flex items-center gap-4">
                
                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-foreground/80 hover:bg-primary/10 transition-colors"
                  title="Search (Cmd+K)"
                >
                  <Search className="h-5 w-5" />
                </Button>

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

                    <Popover 
                      open={showProfileHint} 
                      onOpenChange={(open) => {
                        if (!open) setShowProfileHint(false);
                      }}
                    >
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
    </>
  );
};

export default Header;