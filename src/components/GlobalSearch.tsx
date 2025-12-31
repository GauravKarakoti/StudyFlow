import { useEffect, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Book, 
  CircuitBoard, 
  Loader2 
} from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GlobalSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Types for our search items
type SearchItem = {
  id: string;
  type: "course" | "branch" | "subject" | "learn-course";
  title: string;
  subtitle?: string;
  metadata?: any;
};

// Fetcher for Learn Courses
const fetchLearnCourses = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learn/courses`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return data;
  } catch (error) {
    return [];
  }
};

// Fetcher for University Data (Database)
const fetchUniversityData = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search-data`);
  return data;
};

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch Learn Courses
  const { data: learnCourses, isLoading: isLoadingLearn } = useQuery({
    queryKey: ["learn-courses-search"],
    queryFn: fetchLearnCourses,
    enabled: open,
  });

  // 2. Fetch University Data from DB
  const { data: dbData, isLoading: isLoadingDb } = useQuery({
    queryKey: ["university-search-data"],
    queryFn: fetchUniversityData,
    enabled: open,
  });

  // 3. Aggregate University Data
  const universityData = useMemo(() => {
    if (!dbData) return [];
    
    const items: SearchItem[] = [];
    const { courses, branches, subjects } = dbData;

    // Add Courses
    courses.forEach((course: any) => {
      items.push({
        id: course.id,
        type: "course",
        title: course.name,
        subtitle: "University Course"
      });
    });

    // Add Branches
    branches.forEach((branch: any) => {
      items.push({
        id: branch.id,
        type: "branch",
        title: branch.name,
        subtitle: `Branch in ${branch.course.name}`,
        metadata: { courseId: branch.courseId }
      });
    });

    // Add Subjects
    subjects.forEach((subject: any) => {
      items.push({
        id: subject.id,
        type: "subject",
        title: subject.name,
        // Using Branch ID + Semester Name for clarity
        subtitle: `${subject.branchId.toUpperCase()} - ${subject.semester.name}`,
        metadata: { 
          courseId: subject.branch.course.id,
          branchId: subject.branchId,
          semesterId: subject.semesterId
        }
      });
    });

    return items;
  }, [dbData]);

  // 4. Toggle Logic (Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  // 5. Handle Selection
  const selectLearnCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/learn/courses/select`,
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learn-progress"] });
      setOpen(false);
      navigate("/learn");
      toast.success("Course selected successfully");
    },
  });

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    
    switch (item.type) {
      case "course":
        navigate(`/select-branch/${item.id}`);
        break;
      case "branch":
        navigate(`/select-semester/${item.metadata.courseId}/${item.id}`);
        break;
      case "subject":
        navigate(`/dashboard/${item.metadata.courseId}/${item.metadata.branchId}/${item.metadata.semesterId}`);
        break;
      case "learn-course":
        selectLearnCourseMutation.mutate(item.id);
        break;
    }
  };

  const isLoading = isLoadingLearn || isLoadingDb;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search courses, branches, subjects..." />
      <CommandList>
        <CommandEmpty>
          {isLoading ? (
             <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Loading data...
             </div>
          ) : (
             "No results found."
          )}
        </CommandEmpty>
        
        {/* University Courses Group */}
        {!isLoading && universityData.some(i => i.type === "course") && (
          <>
            <CommandGroup heading="University Courses">
              {universityData
                .filter(i => i.type === "course")
                .map(item => (
                  <CommandItem key={item.id} value={item.title} onSelect={() => handleSelect(item)}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Learn Courses Group */}
        {!isLoading && learnCourses && learnCourses.length > 0 && (
          <>
            <CommandGroup heading="Learn Courses">
              {learnCourses.map((course: any) => (
                <CommandItem 
                  key={course.id} 
                  value={course.name} 
                  onSelect={() => handleSelect({ id: course.id, type: "learn-course", title: course.name })}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{course.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Branches Group */}
        {!isLoading && universityData.some(i => i.type === "branch") && (
          <>
            <CommandGroup heading="Branches">
              {universityData
                .filter(i => i.type === "branch")
                .map(item => (
                  <CommandItem 
                    key={item.id} 
                    // Using title + subtitle for uniqueness
                    value={`${item.title} ${item.subtitle}`} 
                    onSelect={() => handleSelect(item)}
                  >
                    <CircuitBoard className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{item.subtitle}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Subjects Group */}
        {!isLoading && universityData.some(i => i.type === "subject") && (
          <CommandGroup heading="Subjects">
            {universityData
              .filter(i => i.type === "subject")
              .map(item => (
                <CommandItem 
                  key={`${item.metadata.branchId}-${item.id}`} 
                  // Combining Title + Subtitle helps resolve duplicate subject names
                  value={`${item.title} ${item.subtitle}`} 
                  onSelect={() => handleSelect(item)}
                >
                  <Book className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{item.subtitle}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}

      </CommandList>
    </CommandDialog>
  );
}