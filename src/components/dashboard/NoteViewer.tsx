import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef } from "react" // Added useEffect, useRef
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

type Note = {
  id: number
  title: string
  pdfUrl: string
}

const fetchNotes = async (topicId: string): Promise<Note[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${topicId}`)
  return data
}

interface NoteViewerProps {
  topicId: string | null
}

const PdfViewer = ({ title, url }: { title: string; url: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isError, setIsError] = useState(false)
  // State to track container width
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsError(false)
  }

  function onDocumentLoadError() {
    console.error(`Failed to load PDF: ${title}`)
    setIsError(true)
  }

  // Effect to handle resizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Subtracting a small amount (e.g., 32px for padding) ensures it doesn't touch edges
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    // Initial measure
    updateWidth()
    
    // Add resize listener
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const fullPdfUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`

  return (
    <article className="prose dark:prose-invert max-w-none" ref={containerRef}>
      <h2>{title}</h2>
      <Separator />
      {isError ? (
        <p className="text-red-500">Failed to load this PDF.</p>
      ) : (
        <div onContextMenu={(e) => e.preventDefault()}>
          <Document
            file={fullPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            renderMode="canvas"
            loading={<Skeleton className="h-48 w-full" />}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                // Pass the calculated width to resize the page
                width={containerWidth > 0 ? containerWidth : undefined}
              />
            ))}
          </Document>
        </div>
      )}
    </article>
  )
}

const NoteViewer = ({ topicId }: NoteViewerProps) => {
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", topicId],
    queryFn: () => fetchNotes(topicId!),
    enabled: !!topicId,
  })

  if (!topicId) {
    return <p className="text-muted-foreground">Please select a topic.</p>
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (isError) {
    return <p>Error loading notes.</p>
  }

  if (notes && notes.length > 0) {
    return (
      <div className="space-y-6">
        {notes.map((note) => (
          <PdfViewer
            key={note.id}
            title={note.title}
            url={note.pdfUrl}
          />
        ))}
      </div>
    )
  }

  return (
    <p className="text-muted-foreground">
      No notes have been uploaded for this topic yet.
    </p>
  )
}

export default NoteViewer