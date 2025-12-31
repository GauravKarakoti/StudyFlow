// This file simulates a database for courses, branches, semesters, subjects, topics, and notes.

// --- Courses ---
const courses = [
  { id: "btech", name: "Bachelors of Technology" },
];

// --- Branches ---
const branches = [
  { id: "as", name: "Applied Science", courseId: "btech" },
  { id: "cse", name: "Computer Science and Engineering", courseId: "btech" },
  { id: "it", name: "Information Technology", courseId: "btech" },
  { id: "ece", name: "Electronics and Communication Engineering", courseId: "btech" },
  { id: "eee", name: "Electrical and Electronics Engineering", courseId: "btech" },
  { id: "ice", name: "Instrumentation and Control Engineering", courseId: "btech" },
  { id: "cse_aiml", name: "Computer Science and Engineering (AI/ML)", courseId: "btech" },
];

// --- Semesters ---
const semesters = [
  { id: "sem1", name: "Semester 1" },
  { id: "sem2", name: "Semester 2" },
  { id: "sem3", name: "Semester 3" },
  { id: "sem4", name: "Semester 4" },
  { id: "sem5", name: "Semester 5" },
  { id: "sem6", name: "Semester 6" },
  { id: "sem7", name: "Semester 7" },
];

// --- Data Fetching Functions ---

export const getCourses = () => courses;
export const getCourse = (id: string) => courses.find((c) => c.id === id);

export const getBranches = (courseId: string) => branches.filter((b) => b.courseId === courseId);
export const getBranch = (id: string) => branches.find((b) => b.id === id);

export const getSemesters = () => semesters;
export const getSemester = (id: string) => semesters.find((s) => s.id === id);