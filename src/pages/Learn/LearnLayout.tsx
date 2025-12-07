import { Link, useLocation } from "react-router-dom";
import { BookOpen, Trophy, MessageSquare, Library } from "lucide-react"; // Import Library icon
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Courses", href: "/learn/courses", icon: Library }, // Add Courses item
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Leaderboard", href: "/learn/leaderboard", icon: Trophy },
  { label: "Forum", href: "/learn/forum", icon: MessageSquare },
];

export const LearnLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 border-r border-border flex flex-col p-4 gap-4">
        <Link to="/">
            <div className="font-bold text-2xl text-cosmic-glow hidden lg:block mb-6">StudyFlow Learn</div>
        </Link>
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-muted",
              // Highlight if pathname matches exactly OR if browsing courses
              location.pathname === item.href && "bg-cosmic-mid/20 text-cosmic-glow border border-cosmic-glow/30"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};