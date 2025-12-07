import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Course = {
  id: string;
  name: string;
};

type UserProgress = {
  activeCourseId: string | null;
};

const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/courses`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return data;
};

const fetchProgress = async (): Promise<UserProgress> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/progress`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return data;
};

const LearnCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["learn-courses"],
    queryFn: fetchCourses,
  });

  const { data: progress } = useQuery({
    queryKey: ["learn-progress"],
    queryFn: fetchProgress,
  });

  const selectCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/learn/courses/select`,
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learn-progress"] });
      toast.success("Course selected!");
      navigate("/learn");
    },
    onError: () => {
      toast.error("Failed to select course");
    },
  });

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Select a Course</h1>
        <p className="text-muted-foreground">Choose what you want to learn today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingCourses && (
          <>
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </>
        )}

        {courses?.map((course) => {
          const isActive = progress?.activeCourseId === course.id;
          return (
            <Card 
              key={course.id}
              onClick={() => selectCourseMutation.mutate(course.id)}
              className={`cursor-pointer transition-all hover:scale-105 relative overflow-hidden group ${
                isActive 
                  ? "border-green-500 bg-green-500/10" 
                  : "hover:border-cosmic-glow hover:bg-cosmic-glow/5"
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <CardHeader className="text-center pt-10 pb-10">
                <CardTitle className="text-xl mb-2">{course.name}</CardTitle>
                <CardDescription>
                  {isActive ? "Currently Learning" : "Click to start learning"}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearnCourses;