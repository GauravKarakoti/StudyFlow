import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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

// Existing University Fetch functions
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- University State ---
  const [courseId, setCourseId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [semesterId, setSemesterId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState('')
  const [newTopicName, setNewTopicName] = useState('')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteFile, setNewNoteFile] = useState<File | null>(null)

  // --- Learn State ---
  const [learnCourseId, setLearnCourseId] = useState('')
  const [learnUnitId, setLearnUnitId] = useState('')
  const [learnLessonId, setLearnLessonId] = useState('')
  
  // Create Learn Course Inputs
  const [newLearnCourseId, setNewLearnCourseId] = useState('')
  const [newLearnCourseName, setNewLearnCourseName] = useState('')

  // Create Unit Inputs
  const [newUnitTitle, setNewUnitTitle] = useState('')
  const [newUnitDesc, setNewUnitDesc] = useState('')
  const [newUnitOrder, setNewUnitOrder] = useState('')

  // Create Lesson Inputs
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonOrder, setNewLessonOrder] = useState('')

  // Create Challenge Inputs
  const [newChallengeQuestion, setNewChallengeQuestion] = useState('')
  const [newChallengeType, setNewChallengeType] = useState('SELECT')
  const [newChallengeOrder, setNewChallengeOrder] = useState('')

  // Create Option Inputs
  const [selectedChallengeId, setSelectedChallengeId] = useState('')
  const [newOptionText, setNewOptionText] = useState('')
  const [newOptionCorrect, setNewOptionCorrect] = useState(false)

  // --- University Queries ---
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

  // --- Learn Queries ---
  // Must use 'api' instance for authentication
  const { data: learnCourses } = useQuery({
    queryKey: ['learnCourses'],
    queryFn: async () => (await api.get('/learn/courses')).data
  })
  
  // This fetches Units > Lessons > Challenges
  const { data: learnUnits } = useQuery({
    queryKey: ['learnUnits', learnCourseId],
    queryFn: async () => (await api.get(`/learn/courses/${learnCourseId}/units`)).data,
    enabled: !!learnCourseId
  })

  // Derived State for Selects
  const selectedUnit = learnUnits?.find((u: any) => u.id.toString() === learnUnitId)
  const availableLessons = selectedUnit?.lessons || []
  
  const selectedLesson = availableLessons.find((l: any) => l.id.toString() === learnLessonId)
  const availableChallenges = selectedLesson?.challenges || []

  // --- Mutations ---

  // University Mutations
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
    mutationFn: () => {
      if (!newNoteFile) return Promise.reject(new Error("No file selected"))
      const formData = new FormData()
      formData.append('title', newNoteTitle)
      formData.append('topicId', topicId)
      formData.append('pdfFile', newNoteFile)
      return api.post('/admin/note', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => {
      toast({ title: "Note uploaded!" })
      setNewNoteTitle('')
      setNewNoteFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Error uploading note"
      toast({ title: message, variant: "destructive" })
    },
  })

  // Learn Mutations
  const createLearnCourse = useMutation({
    mutationFn: () => api.post('/admin/course', { 
      id: newLearnCourseId, 
      name: newLearnCourseName, 
      type: 'LEARN' 
    }),
    onSuccess: () => {
      toast({ title: "Learn Course created!" })
      setNewLearnCourseId('')
      setNewLearnCourseName('')
      queryClient.invalidateQueries({ queryKey: ['learnCourses'] })
    },
    onError: () => toast({ title: "Error creating course", variant: "destructive" })
  })

  const createUnit = useMutation({
    mutationFn: () => api.post('/admin/unit', {
      title: newUnitTitle,
      description: newUnitDesc,
      order: newUnitOrder,
      courseId: learnCourseId
    }),
    onSuccess: () => {
      toast({ title: "Unit created!" })
      setNewUnitTitle('')
      setNewUnitDesc('')
      setNewUnitOrder('')
      queryClient.invalidateQueries({ queryKey: ['learnUnits', learnCourseId] })
    },
    onError: () => toast({ title: "Error creating unit", variant: "destructive" })
  })

  const createLesson = useMutation({
    mutationFn: () => api.post('/admin/lesson', {
      title: newLessonTitle,
      order: newLessonOrder,
      unitId: learnUnitId
    }),
    onSuccess: () => {
      toast({ title: "Lesson created!" })
      setNewLessonTitle('')
      setNewLessonOrder('')
      // Invalidate units to refresh structure
      queryClient.invalidateQueries({ queryKey: ['learnUnits', learnCourseId] })
    },
    onError: () => toast({ title: "Error creating lesson", variant: "destructive" })
  })

  const createChallenge = useMutation({
    mutationFn: () => api.post('/admin/challenge', {
      question: newChallengeQuestion,
      type: newChallengeType,
      order: newChallengeOrder,
      lessonId: learnLessonId
    }),
    onSuccess: () => {
      toast({ title: "Challenge created!" })
      setNewChallengeQuestion('')
      setNewChallengeOrder('')
      queryClient.invalidateQueries({ queryKey: ['learnUnits', learnCourseId] })
    },
    onError: () => toast({ title: "Error creating challenge", variant: "destructive" })
  })

  const createOption = useMutation({
    mutationFn: () => api.post('/admin/challenge-option', {
      text: newOptionText,
      correct: newOptionCorrect,
      challengeId: selectedChallengeId
    }),
    onSuccess: () => {
      toast({ title: "Option added!" })
      setNewOptionText('')
      setNewOptionCorrect(false)
      // Refresh to see the options or at least keep data consistent
      queryClient.invalidateQueries({ queryKey: ['learnUnits', learnCourseId] })
    },
    onError: () => toast({ title: "Error adding option", variant: "destructive" })
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setNewNoteFile(file)
      } else {
        toast({ title: "Invalid file type", description: "Please upload a PDF file.", variant: "destructive" })
        setNewNoteFile(null)
        e.target.value = ''
      }
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <Tabs defaultValue="university" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="university">University</TabsTrigger>
          <TabsTrigger value="learn">Learn (Gamified)</TabsTrigger>
        </TabsList>

        {/* --- UNIVERSITY TAB --- */}
        <TabsContent value="university" className="space-y-8 mt-6">
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
                    <Label htmlFor="noteFile">Note PDF</Label>
                    <Input 
                      id="noteFile"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createNote.isPending || !newNoteTitle || !newNoteFile}>
                    {createNote.isPending ? "Uploading..." : "Upload Note"}
                  </Button>
                </form>
              )}
            </div>
          )}
        </TabsContent>

        {/* --- LEARN TAB --- */}
        <TabsContent value="learn" className="space-y-8 mt-6">
          
          {/* 1. Create Course */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">1. Create Learn Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Course ID (e.g., 'dsa-learn')" 
                value={newLearnCourseId}
                onChange={(e) => setNewLearnCourseId(e.target.value)}
              />
              <Input 
                placeholder="Course Name (e.g., 'DSA Masterclass')" 
                value={newLearnCourseName}
                onChange={(e) => setNewLearnCourseName(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => createLearnCourse.mutate()} 
              disabled={!newLearnCourseId || !newLearnCourseName || createLearnCourse.isPending}
            >
              Create Course
            </Button>
          </div>

          {/* 2. Select Course & Create Unit */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">2. Create Unit</h2>
            <Label>Select Learn Course</Label>
            <Select onValueChange={setLearnCourseId} value={learnCourseId}>
              <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
              <SelectContent>
                {learnCourses?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            {learnCourseId && (
              <div className="space-y-4 mt-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Unit Title" 
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                  />
                  <Input 
                    type="number"
                    placeholder="Order (e.g. 1)" 
                    value={newUnitOrder}
                    onChange={(e) => setNewUnitOrder(e.target.value)}
                  />
                </div>
                <Textarea 
                  placeholder="Unit Description"
                  value={newUnitDesc}
                  onChange={(e) => setNewUnitDesc(e.target.value)}
                />
                <Button 
                  onClick={() => createUnit.mutate()} 
                  disabled={!newUnitTitle || !newUnitOrder || createUnit.isPending}
                >
                  Create Unit
                </Button>
              </div>
            )}
          </div>

          {/* 3. Select Unit & Create Lesson */}
          {learnCourseId && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">3. Create Lesson</h2>
              <Label>Select Unit</Label>
              <Select onValueChange={(val) => { setLearnUnitId(val); setLearnLessonId(''); }} value={learnUnitId}>
                <SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger>
                <SelectContent>
                  {learnUnits?.map((u: any) => <SelectItem key={u.id} value={u.id.toString()}>{u.order}. {u.title}</SelectItem>)}
                </SelectContent>
              </Select>

              {learnUnitId && (
                <div className="space-y-4 mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Lesson Title" 
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                    />
                    <Input 
                      type="number"
                      placeholder="Order (e.g. 1)" 
                      value={newLessonOrder}
                      onChange={(e) => setNewLessonOrder(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => createLesson.mutate()} 
                    disabled={!newLessonTitle || !newLessonOrder || createLesson.isPending}
                  >
                    Create Lesson
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 4. Select Lesson & Create Challenge */}
          {learnUnitId && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">4. Create Challenge</h2>
              <Label>Select Lesson</Label>
              <Select onValueChange={setLearnLessonId} value={learnLessonId}>
                <SelectTrigger><SelectValue placeholder="Select Lesson" /></SelectTrigger>
                <SelectContent>
                  {availableLessons.map((l: any) => (
                    <SelectItem key={l.id} value={l.id.toString()}>{l.order}. {l.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {learnLessonId && (
                <div className="space-y-4 mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={setNewChallengeType} value={newChallengeType}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SELECT">Select</SelectItem>
                            <SelectItem value="ASSIST">Assist</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input 
                      type="number"
                      placeholder="Order (e.g. 1)" 
                      value={newChallengeOrder}
                      onChange={(e) => setNewChallengeOrder(e.target.value)}
                    />
                  </div>
                  <Textarea 
                      placeholder="Question Text" 
                      value={newChallengeQuestion}
                      onChange={(e) => setNewChallengeQuestion(e.target.value)}
                  />
                  <Button 
                    onClick={() => createChallenge.mutate()} 
                    disabled={!newChallengeQuestion || !newChallengeOrder || createChallenge.isPending}
                  >
                    Create Challenge
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 5. Add Options to Challenge */}
          {learnLessonId && availableChallenges.length > 0 && (
             <div className="space-y-4 p-4 border rounded-lg">
               <h2 className="text-xl font-semibold">5. Add Options to Challenge</h2>
               <Label>Select Challenge</Label>
               <Select onValueChange={setSelectedChallengeId} value={selectedChallengeId}>
                 <SelectTrigger><SelectValue placeholder="Select Challenge" /></SelectTrigger>
                 <SelectContent>
                   {availableChallenges.map((c: any) => (
                     <SelectItem key={c.id} value={c.id.toString()}>
                       {c.order}. {c.question.substring(0, 50)}...
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>

               {selectedChallengeId && (
                 <div className="space-y-4 mt-4 border-t pt-4">
                    <Input 
                      placeholder="Option Text" 
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="correct" 
                        checked={newOptionCorrect}
                        onCheckedChange={(checked) => setNewOptionCorrect(checked as boolean)}
                      />
                      <label
                        htmlFor="correct"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is Correct Answer?
                      </label>
                    </div>
                    <Button 
                      onClick={() => createOption.mutate()}
                      disabled={!newOptionText || createOption.isPending}
                    >
                      Add Option
                    </Button>
                 </div>
               )}
             </div>
          )}

        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard