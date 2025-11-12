import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicListProps {
  subjectId: string | null;
  activeTopicId: string | null;
  onTopicSelect: (id: string) => void;
}

const TopicList = ({
  subjectId,
  activeTopicId,
  onTopicSelect,
}: TopicListProps) => {
  if (!subjectId) {
    return (
      <Card className="cosmic-card border-cosmic-accent/20">
        <CardHeader>
          <CardTitle className="text-lg text-cosmic-glow">Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Please select a subject to see its topics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const topics = [];

  return (
    <Card className="cosmic-card border-cosmic-accent/20">
      <CardHeader>
        <CardTitle className="text-lg text-cosmic-glow">Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 text-center">
            No topics found for this subject.
          </p>
        ) : (
          topics.map((topic) => {
            const Icon = FileText; // You can customize this later
            return (
              <button
                key={topic.id}
                onClick={() => onTopicSelect(topic.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  "hover-glow",
                  activeTopicId === topic.id
                    ? "bg-primary/20 text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{topic.name}</span>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TopicList;