import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Check, Star, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LearnMap() {
  const [units, setUnits] = useState<any[]>([]);
  // Hardcoded for demo, normally comes from user selection
  const courseId = "java-basics"; 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch units from backend
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/courses/${courseId}/units`, {
       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setUnits(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {units.map((unit) => (
        <div key={unit.id} className="space-y-6">
          <div className="bg-cosmic-deep/50 p-6 rounded-2xl border border-cosmic-glow/20">
            <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
            <p className="text-muted-foreground">{unit.description}</p>
          </div>
          
          <div className="flex flex-col items-center gap-4 relative">
             {/* Simple Lesson Path Visualization */}
             {unit.lessons.map((lesson: any, index: number) => {
               const isLocked = !lesson.completed && index > 0 && !unit.lessons[index-1].completed;
               return (
                 <Button
                   key={lesson.id}
                   variant={lesson.completed ? "default" : "secondary"}
                   className={`h-16 w-16 rounded-full border-b-4 active:border-b-0 transition-all ${
                     lesson.completed ? "bg-green-500 hover:bg-green-600 border-green-700" : 
                     isLocked ? "bg-gray-700 border-gray-800 opacity-50" : 
                     "bg-cosmic-glow hover:bg-cosmic-mid border-cosmic-deep"
                   }`}
                   disabled={isLocked}
                   onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                 >
                   {lesson.completed ? <Check /> : isLocked ? <Lock /> : <Star fill="purple" />}
                 </Button>
               );
             })}
          </div>
        </div>
      ))}
    </div>
  );
}