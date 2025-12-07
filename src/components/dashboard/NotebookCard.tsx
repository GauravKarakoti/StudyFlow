import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBranch, getSemester, getCourse } from "@/lib/data";

interface NotebookCardProps {
  courseId: string;
  branchId: string;
  semesterId: string;
}

const NotebookCard = ({
  courseId,
  branchId,
  semesterId,
}: NotebookCardProps) => {
  const course = getCourse(courseId);
  const branch = getBranch(branchId);
  const semester = getSemester(semesterId);

  const title = [course?.name, branch?.name, semester?.name]
    .filter(Boolean)
    .join(" / ");

  return (
    <Card className="cosmic-card border-cosmic-accent/20 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl text-cosmic-glow">
          {title || "Dashboard"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Welcome! Select a subject to view its topics.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotebookCard;