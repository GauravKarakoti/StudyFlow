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
import { useState } from "react" // +++ Import useState

// +++ Import react-pdf +++
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// +++ Setup PDF.js worker (points to a public CDN) +++
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`


// --- Updated Note type ---
type Note = {
  id: number
  title: string
  // content: string // No longer exists
  pdfUrl: string // The new field
}

const fetchNotes = async (topicId: string): Promise<Note[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${topicId}`)
  return data
}

interface StudyPanelProps {
  topicId: string | null
}

// +++ Helper component for a single PDF viewer +++
// This manages the page state for each PDF document
const PdfViewer = ({ title, url }: { title: string; url: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isError, setIsError] = useState(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsError(false)
  }

  function onDocumentLoadError() {
    console.error(`Failed to load PDF: ${title}`)
    setIsError(true)
  }

  // Construct the full URL to the PDF file on the backend
  const fullPdfUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h2>{title}</h2>
      <Separator />
      {isError ? (
        <p className="text-red-500">Failed to load this PDF.</p>
      ) : (
        // This div disables right-click to discourage downloading
        <div onContextMenu={(e) => e.preventDefault()}>
          <Document
            file={fullPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            // renderMode="canvas" makes it harder to download/select
            renderMode="canvas"
            loading={<Skeleton className="h-48 w-full" />}
          >
            {/* Render all pages of the PDF */}
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                // These props also help prevent downloading/copying
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}
    </article>
  )
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
            
            {/* --- Updated rendering logic --- */}
            {notes.map((note) => (
              <PdfViewer
                key={note.id}
                title={note.title}
                url={note.pdfUrl}
              />
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