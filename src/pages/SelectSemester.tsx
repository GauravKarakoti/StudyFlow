import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { getSemesters, getBranch } from "@/lib/data";
import Header from "@/components/Header";
import { ChevronRight } from "lucide-react";

const SelectSemester = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const branch = getBranch(branchId!);
  const semesters = getSemesters();

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="cosmic-card border-cosmic-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl text-cosmic-glow text-center">
              {branch?.name || "Select Semester"}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Choose Your Semester
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {semesters.map((semester) => (
              <Button
                key={semester.id}
                asChild
                variant="outline"
                className="w-full justify-between h-14 text-lg hover-glow"
                size="lg"
              >
                <Link to={`/dashboard/${branchId}/${semester.id}`}>
                  {semester.name}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectSemester;