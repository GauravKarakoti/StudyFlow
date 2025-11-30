import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Check, Star, Lock, Loader2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// --- Components ---

const DotPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" 
    style={{
      backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
      backgroundSize: '24px 24px'
    }}
  />
);

const Connector = ({ 
  startX, 
  endX, 
  height, 
  status 
}: { 
  startX: number; 
  endX: number; 
  height: number; 
  status: 'completed' | 'active' | 'locked' 
}) => {
  // Calculate control points for a smooth Bezier curve
  const midY = height / 2;
  
  return (
    <svg 
      className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none overflow-visible"
      width="100%" // Use wide container to accommodate curves
      height={height}
      style={{ zIndex: 0 }}
    >
      <path
        d={`M ${startX} 0 C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${height}`}
        fill="none"
        strokeWidth="4"
        className={cn(
          "transition-colors duration-500",
          status === 'completed' ? "stroke-primary" : "stroke-muted"
        )}
        strokeLinecap="round"
        strokeDasharray={status === 'locked' ? "8 4" : "none"}
      />
    </svg>
  );
};

export default function LearnMap() {
  const [units, setUnits] = useState<any[]>([]);
  const navigate = useNavigate();

  // 1. Fetch User Progress
  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ["learn-progress"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/progress`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  // 2. Fetch Units
  useEffect(() => {
    if (!loadingProgress) {
      if (!progress?.activeCourseId) {
        navigate("/learn/courses");
      } else {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/courses/${progress.activeCourseId}/units`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setUnits(res.data));
      }
    }
  }, [progress, loadingProgress, navigate]);

  if (loadingProgress) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!progress?.activeCourseId) return null;

  // Flatten logic could be added here if we want a continuous map across units.
  // For now, we render unit by unit.
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center w-full">
      <DotPattern />
      
      <div className="relative z-10 w-full max-w-lg pb-32 px-4">
        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="mb-20">
            <div className="bg-cosmic-deep/50 p-6 rounded-2xl border border-cosmic-glow/20 mb-10">
              <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
              <p className="text-muted-foreground">{unit.description}</p>
            </div>
            
            <div className="flex flex-col items-center relative gap-4">
              {unit.lessons.map((lesson: any, index: number) => {
                const isFirst = index === 0;
                const prevLesson = index > 0 ? unit.lessons[index - 1] : null;
                const nextLesson = index < unit.lessons.length - 1 ? unit.lessons[index + 1] : null;
                
                // Determine Status
                const isCompleted = lesson.completed;
                const isLocked = !lesson.completed && (prevLesson ? !prevLesson.completed : false);
                const isCurrent = !isCompleted && !isLocked;

                // Snake Path Logic
                // We use Sine wave to calculate X offset
                // Amplitude 80px, Frequency roughly every 4 items returns to center
                const xOffset = Math.sin(index * 0.8) * 70;
                const nextXOffset = nextLesson ? Math.sin((index + 1) * 0.8) * 70 : xOffset;
                
                const gap = 100; // Vertical gap between nodes

                return (
                  <div 
                    key={lesson.id} 
                    className="relative flex justify-center items-center"
                    style={{ 
                      transform: `translateX(${xOffset}px)`,
                      marginBottom: nextLesson ? `${gap - 64}px` : 0 // 64 is approx button height
                    }}
                  >
                    {/* Connector Line to Next Node */}
                    {nextLesson && (
                       // We need to pass relative coordinates. 
                       // Since the next node is shifted by (nextX - currentX),
                       // The SVG draws from (0,0) [current center] to (diffX, gap)
                       <Connector 
                         startX={0} 
                         endX={nextXOffset - xOffset} 
                         height={gap} 
                         status={isCompleted ? 'completed' : 'locked'}
                       />
                    )}

                    {/* Lesson Node */}
                    <div className="relative z-10 group">
                        {/* Pulse effect for current lesson */}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping" />
                        )}
                        
                        <Button
                          variant="ghost"
                          className={cn(
                            "relative transition-all duration-300 border-b-4 active:border-b-0 active:translate-y-1",
                            // Shape
                            isCurrent ? "w-20 h-20 rounded-2xl" : "w-16 h-16 rounded-xl",
                            // Colors
                            isCompleted 
                                ? "bg-green-500 hover:bg-green-600 border-green-700 text-white" 
                                : isCurrent
                                    ? "bg-background border-4 border-primary text-primary hover:bg-primary/5 shadow-lg shadow-primary/20"
                                    : "bg-muted hover:bg-muted/80 border-border text-muted-foreground opacity-80",
                          )}
                          disabled={isLocked}
                          onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                        >
                            <div className="flex flex-col items-center justify-center gap-1">
                                {isCompleted ? (
                                    <Check className="w-8 h-8 stroke-[3]" />
                                ) : isCurrent ? (
                                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                                ) : (
                                    <Lock className="w-6 h-6" />
                                )}
                            </div>
                        </Button>

                        {/* Star Rating / Score Bubble (Optional decoration) */}
                        {isCompleted && (
                            <div className="absolute -top-2 -right-2">
                                <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-600 flex items-center gap-0.5 shadow-sm">
                                    <Star className="w-2 h-2 fill-current" />
                                    <span>100</span>
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}