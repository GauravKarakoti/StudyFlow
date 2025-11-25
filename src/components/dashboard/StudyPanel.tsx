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
import { useState, useEffect, useRef } from "react"
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

interface StudyPanelProps {
  topicId: string | null
}

const PdfViewer = ({ title, url }: { title: string; url: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isError, setIsError] = useState(false)
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

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // We use contentRect.width for the most accurate inner width
        // and subtract a small buffer to prevent rounding errors causing overflow
        const width = entry.contentRect.width - 10;
        setContainerWidth(width > 0 ? width : 0);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const fullPdfUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`

  return (
    <div className="w-full mb-8 border rounded-lg bg-background/50 p-2 sm:p-4">
      {/* Corrected CSS:
        1. We DO NOT force .react-pdf__Page to width: 100%. We let the 'width' prop handle that.
        2. We only force the CANVAS to be responsive (max-width: 100%) so it shrinks if needed.
      */}
      <style>{`
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 0 auto;
        }
      `}</style>

      <h2 className="text-xl font-semibold mb-2 px-2">{title}</h2>
      <Separator className="mb-4" />
      
      {isError ? (
        <p className="text-red-500">Failed to load this PDF.</p>
      ) : (
        <div 
          ref={containerRef} 
          onContextMenu={(e) => e.preventDefault()} 
          // 'w-full' ensures this container fills the parent padding box
          className="w-full flex flex-col items-center overflow-hidden"
        >
          <Document
            file={fullPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Skeleton className="h-48 w-full" />}
            className="w-full flex flex-col items-center"
          >
            {/* Only render Page when we have a valid width to prevent initial large render */}
            {numPages && containerWidth > 0 && Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth}
                className="mb-4 shadow-lg"
                loading=""
              />
            ))}
          </Document>
        </div>
      )}
    </div>
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
    enabled: !!topicId,
  })

  return (
    <Card className="cosmic-card h-full sticky top-20 flex flex-col min-w-0">
      <CardHeader>
        <CardTitle>Study Notes</CardTitle>
      </CardHeader>
      {/* px-2 adds a small internal gutter, preventing content from touching edges */}
      <CardContent className="h-[70vh] overflow-y-auto min-w-0 w-full px-2">
        {!topicId ? (
          <p className="text-muted-foreground p-4">
            Select a topic to start studying.
          </p>
        ) : isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : isError ? (
          <p className="p-4">Error loading notes.</p>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-6 w-full min-w-0">
            {notes.map((note) => (
              <PdfViewer
                key={note.id}
                title={note.title}
                url={note.pdfUrl}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground p-4">
            No notes have been uploaded for this topic yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default StudyPanel