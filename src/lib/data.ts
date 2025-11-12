// This file simulates a database for branches, semesters, subjects, topics, and notes.

// --- Branches ---
const branches = [
  { id: "cse", name: "Computer Science" },
  { id: "bio", name: "Biology" },
  { id: "hist", name: "History" },
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
  { id: "sem8", name: "Semester 8" },
];

// --- Subjects ---
const subjects = [
  // CSE Sem 1
  { id: "cse101", name: "Intro to Programming", branch: "cse", semester: "sem1" },
  { id: "cse102", name: "Data Structures", branch: "cse", semester: "sem1" },
  { id: "math101", name: "Calculus I", branch: "cse", semester: "sem1" },
  // BIO Sem 1
  { id: "bio101", name: "Intro to Biology", branch: "bio", semester: "sem1" },
  { id: "chem101", name: "General Chemistry", branch: "bio", semester: "sem1" },
  // HIST Sem 1
  { id: "hist101", name: "World History I", branch: "hist", semester: "sem1" },
];

// --- Data Fetching Functions ---

export const getBranches = () => branches;
export const getBranch = (id: string) => branches.find((b) => b.id === id);

export const getSemesters = () => semesters;
export const getSemester = (id: string) => semesters.find((s) => s.id === id);

export const getSubjects = (branchId: string, semesterId: string) => {
  return subjects.filter((s) => s.branch === branchId && s.semester === semesterId);
};