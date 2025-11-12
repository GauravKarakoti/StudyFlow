import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBranch, getSemester } from "@/lib/data";

interface NotebookCardProps {
  branchId: string;
  semesterId: string;
}

const NotebookCard = ({ branchId, semesterId }: NotebookCardProps) => {
  const branch = getBranch(branchId);
  const semester = getSemester(semesterId);

  return (
    <Card className="cosmic-card border-cosmic-accent/20 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl text-cosmic-glow">
          {branch?.name || "Branch"} - {semester?.name || "Semester"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Welcome! Select a subject from the left to view its topics.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotebookCard;