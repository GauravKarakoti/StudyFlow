import Header from "@/components/Header"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react" // Import useMemo

type Semester = {
  id: string
  name: string
}

const fetchSemesters = async (): Promise<Semester[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/semesters`)
  return data
}

const SelectSemester = () => {
  const { courseId, branchId } =
    useParams<{ courseId: string; branchId: string }>()

  const {
    data: semesters,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["semesters"],
    queryFn: fetchSemesters,
  })

  // NEW: Filter semesters based on branchId
  const filteredSemesters = useMemo(() => {
    if (!semesters) {
      return []
    }
    
    // If branch is 'as', only show sem1 and sem2
    if (branchId === 'as') {
      return semesters.filter(s => s.id === 'sem1' || s.id === 'sem2')
    }
    
    // For all other branches, show sem3 to sem7
    return semesters.filter(s => s.id !== 'sem1' && s.id !== 'sem2')
  }, [semesters, branchId]) // Re-filter when semesters or branchId changes

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Select Your Semester</h1>
          <p className="text-muted-foreground">
            Almost there. Choose your current semester.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          )}
          {isError && <p>Error loading semesters.</p>}
          
          {/* UPDATED: Map over filteredSemesters instead of semesters */}
          {filteredSemesters?.map((semester) => (
            <Link
              to={`/dashboard/${courseId}/${branchId}/${semester.id}`}
              key={semester.id}
            >
              <Card className="cosmic-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle>{semester.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectSemester