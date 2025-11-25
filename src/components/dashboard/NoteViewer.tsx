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
  pdfUrl: string // This is the B2 key, not the full URL
}

const fetchNotes = async (topicId: string): Promise<Note[]> => {
  // This existing route returns notes with the B2 key in pdfUrl
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${topicId}`)
  return data
}

interface NoteViewerProps {
  topicId: string | null
}

// --- UPDATED PDFVIEWER COMPONENT ---
interface PdfViewerComponentProps {
    id: number; // Pass the note ID for the signed URL API call
    title: string;
    pdfKey: string; // The B2 key (note.pdfUrl)
}

const PdfViewer = ({ id, title, pdfKey }: PdfViewerComponentProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isError, setIsError] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [isUrlLoading, setIsUrlLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsError(false)
  }

  function onDocumentLoadError(error: any) {
    console.error(`Failed to load PDF: ${title}`, error);
    setIsError(true);
  }

  useEffect(() => {
  if (!id || !pdfKey) return;

  let cancelled = false;
  let createdObjectUrl: string | null = null;

  const fetchSignedUrlAndBlob = async () => {
    setIsUrlLoading(true);
    setSignedPdfUrl(null);
    try {
      // Try including pdfKey as query param (many backends expect either id or key)
      const signedResp = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/content/note/signed-url/${id}`,
        { params: { key: pdfKey } }
      );

      console.log("signed-url response", signedResp.data);
      // Support several possible response shapes:
      const url =
        signedResp.data?.signedUrl ||
        signedResp.data?.url ||
        (typeof signedResp.data === "string" ? signedResp.data : null);

      if (!url) {
        throw new Error("No signed URL returned from the server");
      }

      // Fetch the PDF as a blob (avoid CORS/display issues)
      const pdfResp = await axios.get(url, { responseType: "blob" });
      createdObjectUrl = URL.createObjectURL(pdfResp.data);

      if (!cancelled) {
        setSignedPdfUrl(createdObjectUrl);
        setIsError(false);
      }
    } catch (err) {
      console.error("Error fetching signed URL or PDF blob:", err);
      setIsError(true);
    } finally {
      if (!cancelled) setIsUrlLoading(false);
    }
  };

  fetchSignedUrlAndBlob();

  return () => {
    cancelled = true;
    if (createdObjectUrl) {
      URL.revokeObjectURL(createdObjectUrl);
    }
  };
}, [id, pdfKey]);

  // Handle Resizing
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Immediate measurement to ensure we don't start at 0
    const initialWidth = containerRef.current.getBoundingClientRect().width;
    if (initialWidth > 0) {
      setContainerWidth(initialWidth);
    }

    // 2. Setup Observer for updates
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Use contentRect.width for accuracy
        // Subtracting a small buffer (e.g. 1px) can sometimes help prevent sub-pixel rounding loops
        const width = entry.contentRect.width; 
        setContainerWidth(width > 0 ? width : 0);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (isUrlLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <Separator className="mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  
  if (!signedPdfUrl) {
    return (
        <article className="prose dark:prose-invert max-w-none mb-8">
             <h2>{title}</h2>
             <Separator />
             <p className="text-red-500">Failed to retrieve PDF link securely.</p>
        </article>
    )
  }

  return (
    <article className="prose dark:prose-invert max-w-none w-full mb-8">
      <style>{`
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 0 auto;
        }
      `}</style>

      <h2>{title}</h2>
      <Separator />
      {isError ? (
        <p className="text-red-500">Failed to load this PDF.</p>
      ) : (
        <div 
            onContextMenu={(e) => e.preventDefault()} 
            ref={containerRef} 
            // Added min-h-[200px] to ensure the container has height for the observer to catch
            className="w-full overflow-hidden min-h-[200px] flex flex-col items-center"
        >
          <Document
            file={signedPdfUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Skeleton className="h-48 w-full" />}
            className="w-full flex flex-col items-center"
          >
            {/* Show skeleton if we have pages but haven't calculated width yet */}
            {numPages && containerWidth === 0 && (
               <Skeleton className="h-screen w-full" />
            )}

            {numPages && containerWidth > 0 && Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth}
                className="mb-4 shadow-sm"
                loading={<Skeleton className="h-96 w-full mb-4" />}
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
      </div>
    )
  }

  if (isError) {
    return <p>Error loading notes.</p>
  }

  if (notes && notes.length > 0) {
    return (
      <div className="space-y-6 w-full">
        {notes.map((note) => (
          <PdfViewer
            key={note.id}
            id={note.id}
            title={note.title}
            pdfKey={note.pdfUrl}
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