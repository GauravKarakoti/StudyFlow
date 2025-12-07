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

type Branch = {
  id: string
  name: string
  courseId: string
}

const fetchBranches = async (courseId: string): Promise<Branch[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/branches/${courseId}`)
  return data
}

const SelectBranch = () => {
  const { courseId } = useParams<{ courseId: string }>()

  const {
    data: branches,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branches", courseId],
    queryFn: () => fetchBranches(courseId!),
    enabled: !!courseId, // Only run query if courseId is present
  })

  return (
    <div className="min-h-screen relative pt-16">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Select Your Branch</h1>
          <p className="text-muted-foreground">
            Choose your specialization.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          )}
          {isError && <p>Error loading branches.</p>}
          {branches?.map((branch) => (
            <Link
              to={`/select-semester/${courseId}/${branch.id}`}
              key={branch.id}
            >
              <Card className="cosmic-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle>{branch.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectBranch