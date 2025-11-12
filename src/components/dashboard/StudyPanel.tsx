import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, Share2 } from "lucide-react";

interface StudyPanelProps {
  topicId: string | null;
}

const StudyPanel = ({ topicId }: StudyPanelProps) => {
  if (!topicId) {
    return (
      <div className="space-y-6">
        <Card className="cosmic-card border-cosmic-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-cosmic-glow flex items-center gap-2">
              <BookMarked className="w-5 h-5" />
              Select a Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-10">
              Please select a topic from the list to view the notes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const note = [];

  return (
    <div className="space-y-6">
      <Card className="cosmic-card border-cosmic-accent/20">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg text-cosmic-glow flex items-center gap-2">
            <BookMarked className="w-5 h-5" />
            {/* {note.title} */}
            Title
          </CardTitle>
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="prose prose-invert prose-sm max-w-none no-download"
            // dangerouslySetInnerHTML={{ __html: note.content }}
            dangerouslySetInnerHTML={{ __html: '' }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPanel;