import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "../ui/button"
import { FileText } from "lucide-react" // Import Icon

type Topic = {
  id: string
  name: string
}

const fetchTopics = async (subjectId: string): Promise<Topic[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${subjectId}`)
  console.log("Fetched topics data:", data, subjectId)
  return data
}

interface TopicListProps {
  subjectId: string | null
  activeTopicId: string | null
  onTopicSelect: (id: string) => void
}

const TopicList = ({
  subjectId,
  activeTopicId,
  onTopicSelect,
}: TopicListProps) => {
  const {
    data: topics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => fetchTopics(subjectId!),
    enabled: !!subjectId, 
  })

  // --- ADDED: Sorting Logic ---
  // Create a sorted copy of the topics array
  const sortedTopics = topics 
    ? [...topics].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    : [];

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent>
        {!subjectId ? (
          <p className="text-muted-foreground">
            Please select a subject to see its topics.
          </p>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isError ? (
          <p>Error loading topics.</p>
        ) : sortedTopics.length > 0 ? ( // Use sortedTopics here
          <div className="flex flex-col space-y-1">
            {sortedTopics.map((topic) => ( // Map over sortedTopics
              <Button
                key={topic.id}
                variant={activeTopicId === topic.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => onTopicSelect(topic.id)}
              >
                {/* Render Icon */}
                <FileText className="mr-2 h-4 w-4" />
                {topic.name}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No topics found for this subject.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default TopicList