import Header from "@/components/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import NotebookCard from "@/components/dashboard/NotebookCard";
import TopicList from "@/components/dashboard/TopicList";
import StudyPanel from "@/components/dashboard/StudyPanel";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { branchId, semesterId } = useParams<{ branchId: string; semesterId: string }>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  if (!branchId || !semesterId) {
    return (
      <div className="min-h-screen relative pt-16">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="cosmic-card p-8 text-center">
            <p>Invalid URL. Please select a branch and semester.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar
              branchId={branchId}
              semesterId={semesterId}
              activeSubjectId={selectedSubjectId}
              onSubjectSelect={(id) => {
                setSelectedSubjectId(id);
                setSelectedTopicId(null); // Reset topic when subject changes
              }}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            <NotebookCard branchId={branchId} semesterId={semesterId} />
            <TopicList
              subjectId={selectedSubjectId}
              activeTopicId={selectedTopicId}
              onTopicSelect={setSelectedTopicId}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3">
            <StudyPanel topicId={selectedTopicId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;