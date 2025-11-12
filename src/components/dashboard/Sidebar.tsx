import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSubjects } from "@/lib/data";
import { Book, Beaker, Clock, Calculator, Laptop, FileText } from "lucide-react"; // Import icons

// A helper to map icons, you can expand this
const iconMap: Record<string, React.ElementType> = {
  cse101: Laptop,
  cse102: Calculator,
  math101: Calculator,
  bio101: Book,
  chem101: Beaker,
  hist101: Clock,
  default: FileText,
};

interface SidebarProps {
  branchId: string;
  semesterId: string;
  activeSubjectId: string | null;
  onSubjectSelect: (id: string) => void;
}

const Sidebar = ({
  branchId,
  semesterId,
  activeSubjectId,
  onSubjectSelect,
}: SidebarProps) => {
  const notebooks = getSubjects(branchId, semesterId);

  return (
    <Card className="cosmic-card border-cosmic-accent/20">
      <CardHeader>
        <CardTitle className="text-lg text-cosmic-glow">MY SUBJECTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {notebooks.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 text-center">
            No subjects found for this selection.
          </p>
        ) : (
          notebooks.map((notebook) => {
            const Icon = iconMap[notebook.id] || iconMap.default;
            return (
              <button
                key={notebook.id}
                onClick={() => onSubjectSelect(notebook.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  "hover-glow",
                  activeSubjectId === notebook.id
                    ? "bg-primary text-primary-foreground cosmic-glow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{notebook.name}</span>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default Sidebar;