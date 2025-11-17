import { useState, useRef } from 'react' // <-- Import useRef
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/use-toast'

// Helper function to get auth token
const useApi = () => {
  const { token } = useAuth()
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { Authorization: `Bearer ${token}` },
  })
  return api
}

// Fetch functions (no changes here)
const fetchCourses = async () => (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses`)).data
const fetchBranches = async (courseId: string) =>
  (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/branches/${courseId}`)).data
const fetchSemesters = async () => (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/semesters`)).data
const fetchSubjects = async (branchId: string, semesterId: string) =>
  (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${branchId}/${semesterId}`)).data
const fetchTopics = async (subjectId: string) =>
  (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${subjectId}`)).data

const AdminDashboard = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null) // <-- Add ref for file input

  const [courseId, setCourseId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [semesterId, setSemesterId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState('')

  // New Topic State
  const [newTopicName, setNewTopicName] = useState('')
  
  // --- Updated Note State ---
  const [newNoteTitle, setNewNoteTitle] = useState('')
  // const [newNoteContent, setNewNoteContent] = useState('') // <-- REMOVE
  const [newNoteFile, setNewNoteFile] = useState<File | null>(null) // <-- ADD

  // Queries (no changes here)
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: fetchCourses })
  const { data: branches } = useQuery({
    queryKey: ['branches', courseId],
    queryFn: () => fetchBranches(courseId),
    enabled: !!courseId,
  })
  const { data: semesters } = useQuery({ queryKey: ['semesters'], queryFn: fetchSemesters })
  const { data: subjects } = useQuery({
    queryKey: ['subjects', branchId, semesterId],
    queryFn: () => fetchSubjects(branchId, semesterId),
    enabled: !!branchId && !!semesterId,
  })
  const { data: topics } = useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => fetchTopics(subjectId),
    enabled: !!subjectId,
  })

  // Mutations
  const createTopic = useMutation({
    mutationFn: (topicName: string) => api.post('/admin/topic', { name: topicName, subjectId }),
    onSuccess: () => {
      toast({ title: "Topic created!" })
      setNewTopicName('')
      queryClient.invalidateQueries({ queryKey: ['topics', subjectId] })
    },
    onError: () => toast({ title: "Error creating topic", variant: "destructive" }),
  })

  // --- Updated createNote Mutation ---
  const createNote = useMutation({
    mutationFn: () => {
      if (!newNoteFile) {
        return Promise.reject(new Error("No file selected"))
      }
      
      const formData = new FormData()
      formData.append('title', newNoteTitle)
      formData.append('topicId', topicId)
      formData.append('pdfFile', newNoteFile) // This name 'pdfFile' must match the backend

      // Send as 'multipart/form-data'
      return api.post('/admin/note', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: () => {
      toast({ title: "Note uploaded!" })
      setNewNoteTitle('')
      setNewNoteFile(null)
      // Reset the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      // You might want to invalidate notes query if you display them
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Error uploading note"
      toast({ title: message, variant: "destructive" })
    },
  })

  // --- ADD File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setNewNoteFile(file)
      } else {
        toast({ title: "Invalid file type", description: "Please upload a PDF file.", variant: "destructive" })
        setNewNoteFile(null)
        e.target.value = '' // Reset the input
      }
    }
  }


  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel - Upload</h1>
      
      {/* 1. Selectors (no changes here) */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">1. Select Study Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setCourseId} value={courseId}>
            <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
            <SelectContent>
              {courses?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={setBranchId} value={branchId} disabled={!courseId}>
            <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
            <SelectContent>
              {branches?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setSemesterId} value={semesterId} disabled={!branchId}>
            <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
            <SelectContent>
              {semesters?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setSubjectId} value={subjectId} disabled={!semesterId}>
            <SelectTrigger className="md:col-span-2"><SelectValue placeholder="Select Subject" /></SelectTrigger>
            <SelectContent>
              {subjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 2. Create Topic (no changes here) */}
      {subjectId && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">2. Create New Topic</h2>
          <div className="flex gap-4">
            <Input 
              placeholder="Enter new topic name" 
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
            />
            <Button onClick={() => createTopic.mutate(newTopicName)} disabled={!newTopicName || createTopic.isPending}>
              {createTopic.isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </div>
      )}
      
      {/* 3. Upload Note (UPDATED) */}
      {subjectId && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">3. Upload Note to Topic</h2>
          
          <Label>Select Topic</Label>
          <Select onValueChange={setTopicId} value={topicId} disabled={!subjectId}>
            <SelectTrigger><SelectValue placeholder="Select Topic" /></SelectTrigger>
            <SelectContent>
              {topics?.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          {topicId && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createNote.mutate(); }}>
              <div>
                <Label htmlFor="noteTitle">Note Title</Label>
                <Input 
                  id="noteTitle" 
                  placeholder="e.g., Introduction to Karnaugh Maps" 
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* --- UPDATED File Input --- */}
              <div>
                <Label htmlFor="noteFile">Note PDF</Label>
                <Input 
                  id="noteFile"
                  type="file"
                  accept="application/pdf" // Only allow PDF files
                  onChange={handleFileChange}
                  ref={fileInputRef} // Attach the ref
                  required
                />
              </div>

              {/* --- REMOVED Textarea --- */}
              
              <Button type="submit" disabled={createNote.isPending || !newNoteTitle || !newNoteFile}>
                {createNote.isPending ? "Uploading..." : "Upload Note"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard