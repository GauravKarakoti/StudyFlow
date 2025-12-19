import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef } from "react" 
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button"
import { Maximize, Minimize } from "lucide-react"
import { createPortal } from "react-dom"

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

type Note = {
  id: number
  title: string
  pdfUrl: string // This is the B2 key, not the full URL
}

const fetchNotes = async (topicId: string): Promise<Note[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${topicId}`)
  return data
}

interface NoteViewerProps {
  topicId: string | null
}

interface PdfViewerComponentProps {
    id: number;
    title: string;
    pdfKey: string;
}

const PdfViewer = ({ id, title, pdfKey }: PdfViewerComponentProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isError, setIsError] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

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

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev)
  }

  // Body scroll lock
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullScreen]);

  // Fetch Signed URL
  useEffect(() => {
    if (!id || !pdfKey) return;

    let cancelled = false;
    let createdObjectUrl: string | null = null;

    const fetchSignedUrlAndBlob = async () => {
      setIsUrlLoading(true);
      setSignedPdfUrl(null);
      try {
        const signedResp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/content/note/signed-url/${id}`,
          { params: { key: pdfKey } }
        );

        const url =
          signedResp.data?.signedUrl ||
          signedResp.data?.url ||
          (typeof signedResp.data === "string" ? signedResp.data : null);

        if (!url) {
          throw new Error("No signed URL returned from the server");
        }

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

  // Measure Container Width
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
           setContainerWidth(width); 
        }
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [isUrlLoading, isFullScreen]); 

  useEffect(() => {
    if (!isFullScreen) return;

    const el = containerRef.current;
    if (!el) return;

    if (!window.matchMedia("(pointer: fine)").matches) {
      console.log("Mobile device detected, skipping wheel event hijack.");
      // still focus for keyboard users on some laptops, but skip wheel hijack
      try { el.focus({ preventScroll: true }); } catch {}
      return;
    }

    try {
      el.focus({ preventScroll: true });
    } catch {}

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      const delta = e.deltaY;
      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;
      const atTop = scrollTop <= 0;
      const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      // If scrolling up when already at top OR scrolling down when already at bottom:
      // let the event bubble so the page can scroll.
      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        return;
      }

      // Otherwise, this container can scroll — prevent body/page scroll and stop propagation.
      // passive: false is required in addEventListener so preventDefault works.
      e.stopPropagation();
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel as EventListener, { passive: true, capture: true });

    return () => {
      el.removeEventListener("wheel", onWheel as EventListener, true);
    };
  }, [isFullScreen]);

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

  // PDF Document
  const PdfDocument = (
    <Document
      file={signedPdfUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      loading={<Skeleton className="h-48 w-full" />}
      className="flex flex-col items-center"
    >
      {numPages && containerWidth <= 0 && <Skeleton className="h-screen w-full" />}

      {numPages && containerWidth > 0 && Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={containerWidth}
          className="mb-4 shadow-sm bg-white"
          loading={<Skeleton className="h-96 w-full mb-4" />}
        />
      ))}
    </Document>
  );

  // Fullscreen portal
  if (isFullScreen) {
    return createPortal(
      <div
        className="fixed inset-0 z-[100] bg-background flex flex-col h-[100dvh] w-screen pointer-events-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex-none h-14 flex items-center justify-between px-4 md:px-6 border-b bg-background z-[110] shadow-sm pointer-events-auto">
          {/* Hide title on mobile */}
          <h2 className="text-lg font-semibold truncate pr-4 hidden md:block">{title}</h2>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            title="Exit Full Screen"
            className="cursor-pointer ml-auto"
          >
            <Minimize className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-2 md:p-6 w-full bg-gray-100/50 dark:bg-gray-900/50 pdf-fullscreen-scroll"
          tabIndex={0}
          // The critical mobile scroll fixes:
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          <div className="min-h-full flex flex-col items-center pb-20 pointer-events-auto">
            {PdfDocument}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Default render
  return (
    <article className="prose dark:prose-invert max-w-none w-full mb-8">
      <div className="flex items-center justify-between">
        <h2 className="my-0">{title}</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleFullScreen} 
          title="Toggle Full Screen" 
          className="cursor-pointer"
        >
            <Maximize className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="my-4" />

      {isError ? (
        <p className="text-red-500">Failed to load this PDF.</p>
      ) : (
        <div 
            onContextMenu={(e) => e.preventDefault()} 
            ref={containerRef} 
            className="w-full overflow-hidden min-h-[200px] flex flex-col items-center"
        >
          {PdfDocument}
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