import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
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

// Fetch functions
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
  
  const [courseId, setCourseId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [semesterId, setSemesterId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState('')

  // New Topic State
  const [newTopicName, setNewTopicName] = useState('')
  
  // New Note State
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')

  // Queries
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

  const createNote = useMutation({
    mutationFn: () => api.post('/admin/note', { title: newNoteTitle, content: newNoteContent, topicId }),
    onSuccess: () => {
      toast({ title: "Note uploaded!" })
      setNewNoteTitle('')
      setNewNoteContent('')
      // You might want to invalidate notes query if you display them
    },
    onError: () => toast({ title: "Error uploading note", variant: "destructive" }),
  })

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel - Upload</h1>
      
      {/* 1. Selectors */}
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
      
      {/* 2. Create Topic */}
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
      
      {/* 3. Upload Note */}
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
              <div>
                <Label htmlFor="noteContent">Note Content (Markdown supported)</Label>
                <Textarea 
                  id="noteContent"
                  placeholder="Start writing your notes here..."
                  className="min-h-[300px]"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={createNote.isPending || !newNoteTitle || !newNoteContent}>
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