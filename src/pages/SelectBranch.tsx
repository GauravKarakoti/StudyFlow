import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getBranches } from "@/lib/data";
import Header from "@/components/Header";
import { ChevronRight } from "lucide-react";

const SelectBranch = () => {
  const branches = getBranches();

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="cosmic-card border-cosmic-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl text-cosmic-glow text-center">
              Choose Your Branch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {branches.map((branch) => (
              <Button
                key={branch.id}
                asChild
                variant="outline"
                className="w-full justify-between h-14 text-lg hover-glow"
                size="lg"
              >
                <Link to={`/select-semester/${branch.id}`}>
                  {branch.name}
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

export default SelectBranch;