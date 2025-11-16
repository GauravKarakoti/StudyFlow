import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

type Course = {
  id: string
  name: string
}

const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses`)
  return data
}

const SelectCourse = () => {
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  })

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Select Your Course</h1>
          <p className="text-muted-foreground">
            Begin by choosing your field of study.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          )}
          {isError && (
            <p>Error loading courses. Please try again later.</p>
          )}
          {courses?.map((course) => (
            <Link to={`/select-branch/${course.id}`} key={course.id}>
              <Card className="cosmic-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>
                    Select to see branches
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectCourse