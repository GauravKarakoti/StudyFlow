import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type Subject = {
  id: string
  name: string
}

const fetchSubjects = async (
  branchId: string,
  semesterId: string
): Promise<Subject[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/subjects/${branchId}/${semesterId}`
  )
  return data
}

interface SidebarProps {
  branchId: string
  semesterId: string
  activeSubjectId: string | null
  onSubjectSelect: (id: string) => void
}

const Sidebar = ({
  branchId,
  semesterId,
  activeSubjectId,
  onSubjectSelect,
}: SidebarProps) => {
  const {
    data: subjects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subjects", branchId, semesterId],
    queryFn: () => fetchSubjects(branchId, semesterId),
    enabled: !!branchId && !!semesterId,
  })

  return (
    <Card className="cosmic-card h-full">
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
        <CardDescription>Select a subject to see topics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {isLoading && (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          )}
          {isError && <p>Error loading subjects.</p>}
          {subjects?.map((subject) => (
            <Button
              key={subject.id}
              variant={activeSubjectId === subject.id ? "default" : "ghost"}
              className="justify-start w-full"
              onClick={() => onSubjectSelect(subject.id)}
            >
              {subject.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Sidebar