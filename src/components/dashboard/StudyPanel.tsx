import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Separator } from "@/components/ui/separator"
// You'll want a markdown renderer
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Note = {
  id: number
  title: string
  content: string
}

const fetchNotes = async (topicId: string): Promise<Note[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${topicId}`)
  return data
}

interface StudyPanelProps {
  topicId: string | null
}

const StudyPanel = ({ topicId }: StudyPanelProps) => {
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", topicId],
    queryFn: () => fetchNotes(topicId!),
    enabled: !!topicId, // Only run if a topic is selected
  })

  return (
    <Card className="cosmic-card h-full sticky top-20">
      <CardHeader>
        <CardTitle>Study Notes</CardTitle>
      </CardHeader>
      <CardContent className="h-[70vh] overflow-y-auto">
        {!topicId ? (
          <p className="text-muted-foreground">
            Select a topic to start studying.
          </p>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : isError ? (
          <p>Error loading notes.</p>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map((note) => (
              <article key={note.id} className="prose dark:prose-invert max-w-none">
                <h2>{note.title}</h2>
                <Separator />
                {/* Render markdown content */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.content}
                </ReactMarkdown>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No notes have been uploaded for this topic yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default StudyPanel