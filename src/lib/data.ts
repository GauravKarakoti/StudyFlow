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

// --- Subjects ---
const subjects = [
{ id: "as101", name: "Applied Chemistry", branch: "as", semester: "sem1" },
{ id: "as102", name: "Programming in C", branch: "as", semester: "sem1" },
{ id: "as103", name: "Applied Physics - I", branch: "as", semester: "sem1" },
{ id: "as104", name: "Applied Mathematics - I", branch: "as", semester: "sem1" },
{ id: "as105", name: "Electrical Science", branch: "as", semester: "sem1" },
{ id: "as106", name: "Environmental Studies", branch: "as", semester: "sem1" },
{ id: "as107", name: "Communication Skills", branch: "as", semester: "sem1" },
{ id: "as109", name: "Human Values and Ethics", branch: "as", semester: "sem1" },
{ id: "as110", name: "Manufacturing Process", branch: "as", semester: "sem1" },
{ id: "as201", name: "Applied Chemistry", branch: "as", semester: "sem2" },
{ id: "as202", name: "Programming in C", branch: "as", semester: "sem2" },
{ id: "as203", name: "Applied Physics – II", branch: "as", semester: "sem2" },
{ id: "as204", name: "Applied Mathematics – II", branch: "as", semester: "sem2" },
{ id: "as205", name: "Electrical Science", branch: "as", semester: "sem2" },
{ id: "as206", name: "Environmental Studies", branch: "as", semester: "sem2" },
{ id: "as207", name: "Communication Skills", branch: "as", semester: "sem2" },
{ id: "as209", name: "Human Values and Ethics", branch: "as", semester: "sem2" },
{ id: "as210", name: "Engineering Mechanics", branch: "as", semester: "sem2" },
{ id: "ece301", name: "Analog Electronics – I", branch: "ece", semester: "sem3" },
{ id: "ece302", name: "Digital Logic and Computer Design", branch: "ece", semester: "sem3" },
{ id: "ece303", name: "Indian Knowledge System", branch: "ece", semester: "sem3" },
{ id: "ece304", name: "Signals and Systems", branch: "ece", semester: "sem3" },
{ id: "ece305", name: "Analog Communication", branch: "ece", semester: "sem3" },
{ id: "ece306", name: "Computational Methods", branch: "ece", semester: "sem3" },
{ id: "ece401", name: "Probability, Statistics and Linear Programming", branch: "ece", semester: "sem4" },
{ id: "ece402", name: "Analog Electronics – II", branch: "ece", semester: "sem4" },
{ id: "ece403", name: "Network Analysis and Synthesis", branch: "ece", semester: "sem4" },
{ id: "ece404", name: "Electromagnetic Field Theory", branch: "ece", semester: "sem4" },
{ id: "ece405", name: "Digital Communication", branch: "ece", semester: "sem4" },
{ id: "ece406", name: "Microprocessors and Microcontrollers", branch: "ece", semester: "sem4" },
{ id: "ece407", name: "Technical Writing", branch: "ece", semester: "sem4" },
{ id: "ece501", name: "Economics for Engineers", branch: "ece", semester: "sem5" },
{ id: "ece502", name: "Digital Signal Processing", branch: "ece", semester: "sem5" },
{ id: "ece503", name: "Microelectronics", branch: "ece", semester: "sem5" },
{ id: "ece504", name: "Introduction to Control Systems", branch: "ece", semester: "sem5" },
{ id: "ece505", name: "Transmission Lines, Waveguides and Antenna Design", branch: "ece", semester: "sem5" },
{ id: "ece506", name: "Data Communication and Networking", branch: "ece", semester: "sem5" },
{ id: "ece601", name: "VHDL Programming", branch: "ece", semester: "sem6" },
{ id: "ece602", name: "Information Theory and Coding", branch: "ece", semester: "sem6" },
{ id: "ece603", name: "Optical Communication System and Network", branch: "ece", semester: "sem6" },
{ id: "ece604", name: "VLSI", branch: "ece", semester: "sem6" },
{ id: "ece605", name: "Wireless Sensor Networks", branch: "ece", semester: "sem6" },
{ id: "ece606", name: "C++ Programming", branch: "ece", semester: "sem6" },
{ id: "ece607", name: "Data Structures and Algorithms", branch: "ece", semester: "sem6" },
{ id: "ece608", name: "Artificial Intelligence", branch: "ece", semester: "sem6" },
{ id: "ece609", name: "Universal Human Values", branch: "ece", semester: "sem6" },
{ id: "ece701", name: "Machine Learning", branch: "ece", semester: "sem7" },
{ id: "ece702", name: "Logic Design and Analysis using Verilog", branch: "ece", semester: "sem7" },
{ id: "ece703", name: "Mobile Computing", branch: "ece", semester: "sem7" },
{ id: "ece704", name: "Introduction to Software Engineering", branch: "ece", semester: "sem7" },
{ id: "ece705", name: "Operating Systems", branch: "ece", semester: "sem7" },
{ id: "ece706", name: "Database Management System", branch: "ece", semester: "sem7" },
{ id: "ece707", name: "Introduction to Internet of Things", branch: "ece", semester: "sem7" },
{ id: "ece708", name: "Pattern Recognition and Computer Vision", branch: "ece", semester: "sem7" },
{ id: "ece709", name: "Reinforcement Learning and Deep Learning", branch: "ece", semester: "sem7" },
{ id: "ece710", name: "Next Generation Networks", branch: "ece", semester: "sem7" },
{ id: "cse301", name: "Computational Methods", branch: "cse", semester: "sem3" },
{ id: "cse302", name: "Indian Knowledge System", branch: "cse", semester: "sem3" },
{ id: "cse303", name: "Discrete Mathematics", branch: "cse", semester: "sem3" },
{ id: "cse304", name: "Digital Logic and Computer Design", branch: "cse", semester: "sem3" },
{ id: "cse305", name: "Data Structures", branch: "cse", semester: "sem3" },
{ id: "cse306", name: "Object-Oriented Programming using C++", branch: "cse", semester: "sem3" },
{ id: "cse307", name: "Computational Methods Lab", branch: "cse", semester: "sem3" },
{ id: "cse308", name: "Digital Logic and Computer Design Lab", branch: "cse", semester: "sem3" },
{ id: "cse309", name: "Data Structures Lab", branch: "cse", semester: "sem3" },
{ id: "cse310", name: "Object-Oriented Programming using C++ Lab", branch: "cse", semester: "sem3" },
{ id: "cse401", name: "Technical Writing", branch: "cse", semester: "sem4" },
{ id: "cse402", name: "Programming in Java", branch: "cse", semester: "sem4" },
{ id: "cse403", name: "Theory of Computation", branch: "cse", semester: "sem4" },
{ id: "cse404", name: "Probability, Statistics and Linear Programming(PSL)", branch: "cse", semester: "sem4" },
{ id: "cse405", name: "Database and Management System", branch: "cse", semester: "sem4" },
{ id: "cse406", name: "Circuits and Systems(CNS)", branch: "cse", semester: "sem4" },
{ id: "cse407", name: "Java Lab", branch: "cse", semester: "sem4" },
{ id: "cse408", name: "PSL Lab", branch: "cse", semester: "sem4" },
{ id: "cse409", name: "Database and Management System Lab", branch: "cse", semester: "sem4" },
{ id: "cse410", name: "CNS Lab", branch: "cse", semester: "sem4" },
{ id: "cse501", name: "Design and Analysis of Algorithm", branch: "cse", semester: "sem5" },
{ id: "cse502", name: "Software Engineering", branch: "cse", semester: "sem5" },
{ id: "cse503", name: "Computer Networks", branch: "cse", semester: "sem5" },
{ id: "cse504", name: "Operating Systems", branch: "cse", semester: "sem5" },
{ id: "cse505", name: "Compiler Design", branch: "cse", semester: "sem5" },
{ id: "cse506", name: "Economics for Engineers", branch: "cse", semester: "sem5" },
{ id: "cse507", name: "Design and Analysis of Algorithm Lab", branch: "cse", semester: "sem5" },
{ id: "cse508", name: "Software Engineering Lab", branch: "cse", semester: "sem5" },
{ id: "cse509", name: "Operating System Lab", branch: "cse", semester: "sem5" },
{ id: "cse510", name: "Compiler Design Lab", branch: "cse", semester: "sem5" },
{ id: "cse511", name: "Computer Networks Lab", branch: "cse", semester: "sem5" },
{ id: "cse601", name: "Principles of Management for Engineers", branch: "cse", semester: "sem6" },
{ id: "cse602", name: "Programming for Python", branch: "cse", semester: "sem6" },
{ id: "cse603", name: "Statistics, Statistical Modelling & Data Analytics", branch: "cse", semester: "sem6" },
{ id: "cse604", name: "Artificial Intelligence", branch: "cse", semester: "sem6" },
{ id: "cse605", name: "Web Technologies", branch: "cse", semester: "sem6" },
{ id: "cse606", name: "Advanced Java Programming", branch: "cse", semester: "sem6" },
{ id: "cse607", name: "Programming in Python Lab", branch: "cse", semester: "sem6" },
{ id: "cse608", name: "Artificial Intelligence & Machine Learning", branch: "cse", semester: "sem6" },
{ id: "cse609", name: "Web Technology Lab", branch: "cse", semester: "sem6" },
{ id: "cse610", name: "Advanced Java Programming Lab", branch: "cse", semester: "sem6" },
{ id: "cse611", name: "Artificial Intelligence & Machine Learning Lab", branch: "cse", semester: "sem6" },
{ id: "cse612", name: "SSMD Lab", branch: "cse", semester: "sem6" },
{ id: "cse613", name: "Network Security & Cryptography", branch: "cse", semester: "sem6" },
{ id: "cse701", name: "Data Warehousing and Data Mining", branch: "cse", semester: "sem7" },
{ id: "cse702", name: "Data Science Using R", branch: "cse", semester: "sem7" },
{ id: "cse703", name: "Machine Learning", branch: "cse", semester: "sem7" },
{ id: "cse704", name: "Pattern Recognition and Computer Vision", branch: "cse", semester: "sem7" },
{ id: "cse705", name: "Machine Learning Lab", branch: "cse", semester: "sem7" },
{ id: "cse706", name: "EDA Data Visualization", branch: "cse", semester: "sem7" },
{ id: "cse707", name: "Reinforcement Learning and Deep Learning", branch: "cse", semester: "sem7" },
{ id: "cse708", name: "Distributed System and Cloud Computing", branch: "cse", semester: "sem7" },
{ id: "cse709", name: "Intelligent Expert Systems", branch: "cse", semester: "sem7" },
{ id: "cse710", name: "Intelligent Expert Systems Lab", branch: "cse", semester: "sem7" },
{ id: "cse711", name: "Supervised and Deep Learning", branch: "cse", semester: "sem7" },
{ id: "cse712", name: "Principles of Entrepreneurship Mindset", branch: "cse", semester: "sem7" },
];

// --- Data Fetching Functions ---

export const getCourses = () => courses;
export const getCourse = (id: string) => courses.find((c) => c.id === id);

export const getBranches = (courseId: string) => branches.filter((b) => b.courseId === courseId);
export const getBranch = (id: string) => branches.find((b) => b.id === id);

export const getSemesters = () => semesters;
export const getSemester = (id: string) => semesters.find((s) => s.id === id);

export const getSubjects = (branchId: string, semesterId: string) => {
  return subjects.filter((s) => s.branch === branchId && s.semester === semesterId);
};