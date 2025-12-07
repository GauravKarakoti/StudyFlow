import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, XCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Option {
  id: number;
  text: string;
}

interface Challenge {
  id: number;
  question: string;
  type: "SELECT" | "ASSIST";
  options: Option[];
}

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [hearts, setHearts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionXP, setSessionXP] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // [UPDATED] Destructure response to get lesson AND hearts
        setLesson(res.data.lesson);
        setHearts(res.data.userHearts);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load lesson", variant: "destructive" });
        navigate('/learn');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleCheck = async () => {
    if (selectedOption === null || !lesson) return;

    const challenge = lesson.challenges[currentIndex];
    const option = challenge.options.find((o: Option) => o.id === selectedOption);
    // In a real app, you might validate client-side for speed, but here we ask the server
    // For this demo, let's assume the server validates or we check against a 'correct' flag if exposed.
    // Based on your schema, options have a 'correct' boolean. 
    // If the API returns it (it should for the frontend to render logic), we use it.
    
    // However, the secure way is hitting the /progress endpoint:
    const isCorrect = option?.correct; // Assuming API returns this field

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/learn/progress`,
        { challengeId: challenge.id, isCorrect },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (isCorrect) {
        setStatus("correct");
        
        // [ADD THIS] Accumulate XP if the backend says we earned it
        if (res.data.pointsAdded > 0) {
          setSessionXP(prev => prev + res.data.pointsAdded);
        }
        
      } else {
        setStatus("wrong");
        setHearts(res.data.heartsLeft);
      }
    } catch (error) {
      console.error(error);
      // Handle "No hearts left" error specifically if needed
      if (axios.isAxiosError(error) && error.response?.status === 403) {
         toast({ title: "Out of Hearts!", description: "Wait for them to refill.", variant: "destructive" });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStatus("idle");
      setSelectedOption(null);
    } else {
      toast({ 
        title: "Lesson Complete!", 
        description: `You've earned ${sessionXP} XP in this lesson.` 
      });
      navigate('/learn');
    }
  };

  if (loading || !lesson) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const currentChallenge = lesson.challenges[currentIndex];
  const progressPercent = ((currentIndex) / lesson.challenges.length) * 100;

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/learn')}>
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </Button>
        <Progress value={progressPercent} className="h-4" />
        <div className="flex items-center text-red-500 font-bold">
          <Heart className="w-6 h-6 fill-current mr-2" />
          {hearts}
        </div>
      </div>

      {/* Challenge Content */}
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <h1 className="text-3xl font-bold text-center">{currentChallenge.question}</h1>
        
        <div className="grid grid-cols-1 gap-4">
          {currentChallenge.options.map((option: any) => (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer hover:bg-muted transition-all border-2 ${
                selectedOption === option.id 
                  ? "border-cosmic-glow bg-cosmic-glow/10" 
                  : "border-border"
              }`}
              onClick={() => status === "idle" && setSelectedOption(option.id)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-md border mr-4 flex items-center justify-center ${
                  selectedOption === option.id ? "bg-cosmic-glow text-white border-cosmic-glow" : "border-muted-foreground"
                }`}>
                  {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-lg">{option.text}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer / Feedback Area */}
      <div className={`mt-8 p-4 -mx-4 md:-mx-8 border-t ${
        status === "correct" ? "bg-green-100 dark:bg-green-900/20 border-green-500" :
        status === "wrong" ? "bg-red-100 dark:bg-red-900/20 border-red-500" :
        "border-transparent"
      }`}>
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {status === "correct" && (
              <>
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="font-bold text-green-700">Nicely done!</div>
              </>
            )}
            {status === "wrong" && (
              <>
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="font-bold text-red-700">Correct answer: {currentChallenge.options.find((o:any) => o.correct)?.text}</div>
              </>
            )}
          </div>
          
          <Button 
            size="lg" 
            className={`min-w-[150px] ${
              status === "correct" ? "bg-green-600 hover:bg-green-700" :
              status === "wrong" ? "bg-red-600 hover:bg-red-700" :
              "bg-cosmic-glow hover:bg-cosmic-mid text-purple-600"
            }`}
            onClick={status === "idle" ? handleCheck : handleNext}
            disabled={!selectedOption && status === "idle"}
          >
            {status === "idle" ? "Check" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}