import Header from "@/components/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import NotebookCard from "@/components/dashboard/NotebookCard";
import TopicList from "@/components/dashboard/TopicList";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react"; 
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoteViewer from "@/components/dashboard/NoteViewer";

const Dashboard = () => {
  const { courseId, branchId, semesterId } = useParams<{
    courseId: string;
    branchId: string;
    semesterId: string;
  }>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isNoteViewerOpen, setIsNoteViewerOpen] = useState(false);

  // Ref for the TopicList section
  const topicListRef = useRef<HTMLDivElement>(null);

  if (!courseId || !branchId || !semesterId) {
    return (
      <div className="min-h-screen relative pt-16">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="cosmic-card p-8 text-center">
            <p>Invalid URL. Please select a course, branch, and semester.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar Section 
            - Mobile: display:contents unwraps the child so it participates in the main grid.
            - Desktop: lg:block restores the wrapper for the 3-column layout.
          */}
          <div className="contents lg:block lg:col-span-3">
            {/* Mobile Order 2: Sidebar appears second */}
            <div className="order-2 lg:order-none h-full">
              <Sidebar
                branchId={branchId}
                semesterId={semesterId}
                activeSubjectId={selectedSubjectId}
                onSubjectSelect={(id) => {
                  setSelectedSubjectId(id);
                  setSelectedTopicId(null); 
                  setIsNoteViewerOpen(false);
                  
                  // Auto-scroll to topic list on mobile
                  setTimeout(() => {
                    topicListRef.current?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
              />
            </div>
          </div>

          {/* Main Content Section
            - Mobile: display:contents unwraps children.
            - Desktop: lg:block restores wrapper and lg:space-y-6 handles internal spacing.
          */}
          <div className="contents lg:block lg:col-span-9 lg:space-y-6">
            
            {/* Mobile Order 1: NotebookCard appears first */}
            <div className="order-1 lg:order-none">
              <NotebookCard
                courseId={courseId}
                branchId={branchId}
                semesterId={semesterId}
              />
            </div>

            {/* Mobile Order 3: TopicList appears last */}
            <div 
              ref={topicListRef} 
              className="order-3 lg:order-none scroll-mt-24"
            >
              <TopicList
                subjectId={selectedSubjectId}
                activeTopicId={selectedTopicId}
                onTopicSelect={(id) => {
                  setSelectedTopicId(id);
                  setIsNoteViewerOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* PDF Viewer Dialog */}
        <Dialog open={isNoteViewerOpen} onOpenChange={setIsNoteViewerOpen}>
          <DialogContent
            className="max-w-4xl h-[90vh] flex flex-col"
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Study Notes</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4">
              {selectedTopicId && <NoteViewer topicId={selectedTopicId} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;