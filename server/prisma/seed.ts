import { ChallengeType, CourseType, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
{ id: "it301", name: "Discrete Maths", branch: "it", semester: "sem3" },
{ id: "it302", name: "Computational Methods", branch: "it", semester: "sem3" },
{ id: "it303", name: "Data Structure", branch: "it", semester: "sem3" },
{ id: "it304", name: "Digital Logic and Computer Design", branch: "it", semester: "sem3" },
{ id: "it305", name: "Indian Knowledge System", branch: "it", semester: "sem3" },
{ id: "it306", name: "Object Oriented Programming using C++", branch: "it", semester: "sem3" },
{ id: "it307", name: "Computational Methods Lab", branch: "it", semester: "sem3" },
{ id: "it308", name: "Data Structure Lab", branch: "it", semester: "sem3" },
{ id: "it309", name: "Digital Logic and Computer Design Lab", branch: "it", semester: "sem3" },
{ id: "it310", name: "Object Oriented Programming using C++ Lab", branch: "it", semester: "sem3" },
{ id: "eee301", name: "Electronics 1", branch: "eee", semester: "sem3" },
{ id: "eee302", name: "Computational Methods", branch: "eee", semester: "sem3" },
{ id: "eee303", name: "Electrical Materials", branch: "eee", semester: "sem3" },
{ id: "eee304", name: "Signal and Systems", branch: "eee", semester: "sem3" },
{ id: "eee305", name: "Indian Knowledge System", branch: "eee", semester: "sem3" },
{ id: "eee306", name: "EMFT", branch: "eee", semester: "sem3" },
{ id: "eee307", name: "Electrical Machines 1", branch: "eee", semester: "sem3" },
{ id: "eee401", name: "Electronics 2", branch: "eee", semester: "sem4" },
{ id: "eee402", name: "Power System 1", branch: "eee", semester: "sem4" },
{ id: "eee403", name: "Probability, Statistics and Linear Programming", branch: "eee", semester: "sem4" },
{ id: "eee404", name: "NAS", branch: "eee", semester: "sem4" },
{ id: "eee405", name: "Technical Writing", branch: "eee", semester: "sem4" },
{ id: "eee406", name: "Electrical Machines 2", branch: "eee", semester: "sem4" },
{ id: "eee501", name: "Introduction to Control System", branch: "eee", semester: "sem5" },
{ id: "eee502", name: "Power Electronics", branch: "eee", semester: "sem5" },
{ id: "eee503", name: "Power System 2", branch: "eee", semester: "sem5" },
{ id: "eee504", name: "Microprocessors and Microcontroller", branch: "eee", semester: "sem5" },
{ id: "eee505", name: "Electrical and Electronics Measuring Instruments", branch: "eee", semester: "sem5" },
{ id: "eee506", name: "Economics for Engineers", branch: "eee", semester: "sem5" },
{ id: "eee601", name: "UEEE", branch: "eee", semester: "sem6" },
{ id: "eee602", name: "Data Communication and Network", branch: "eee", semester: "sem6" },
{ id: "eee603", name: "Electric Drives", branch: "eee", semester: "sem6" },
{ id: "eee604", name: "C++", branch: "eee", semester: "sem6" },
{ id: "eee605", name: "Data Structure", branch: "eee", semester: "sem6" },
{ id: "eee606", name: "Artificial Intelligence", branch: "eee", semester: "sem6" },
{ id: "eee607", name: "Extra High Voltage AC", branch: "eee", semester: "sem6" },
{ id: "eee608", name: "Principle of Management", branch: "eee", semester: "sem6" },
{ id: "eee701", name: "E Mobility", branch: "eee", semester: "sem7" },
{ id: "eee702", name: "Bio Intrumentation", branch: "eee", semester: "sem7" },
{ id: "eee703", name: "Introduction to Software Engineering", branch: "eee", semester: "sem7" },
{ id: "eee704", name: "Renewable Energy Resources", branch: "eee", semester: "sem7" },
{ id: "eee705", name: "Introduction to Database Management System", branch: "eee", semester: "sem7" },
{ id: "ice301", name: "Computation Methods", branch: "ice", semester: "sem3" },
{ id: "ice302", name: "Indian Knowledge System", branch: "ice", semester: "sem3" },
{ id: "ice303", name: "Engineering Electromagnetics", branch: "ice", semester: "sem3" },
{ id: "ice304", name: "Electrical Machines", branch: "ice", semester: "sem3" },
{ id: "ice305", name: "Circuit and System", branch: "ice", semester: "sem3" },
{ id: "ice306", name: "Analog Electronics", branch: "ice", semester: "sem3" },
{ id: "ice401", name: "Sensors & Transducers", branch: "ice", semester: "sem4" },
{ id: "ice402", name: "Electrical & Electronic Measurement", branch: "ice", semester: "sem4" },
{ id: "ice403", name: "Communication System", branch: "ice", semester: "sem4" },
{ id: "ice404", name: "Digital Electronics", branch: "ice", semester: "sem4" },
{ id: "ice405", name: "Technical Writing", branch: "ice", semester: "sem4" },
{ id: "ice406", name: "Probability, Statistics and Linear Programming", branch: "ice", semester: "sem4" },
{ id: "ice501", name: "Economics for Engineers", branch: "ice", semester: "sem5" },
{ id: "ice502", name: "Digital Signal Processing", branch: "ice", semester: "sem5" },
{ id: "ice503", name: "Introduction to Control system", branch: "ice", semester: "sem5" },
{ id: "ice504", name: "Neural Network and Fuzzy logic System", branch: "ice", semester: "sem5" },
{ id: "ice505", name: "Industrial &optical Instrumentation", branch: "ice", semester: "sem5" },
{ id: "ice506", name: "Computer Networks", branch: "ice", semester: "sem5" },
{ id: "ice601", name: "Universal Human Values", branch: "ice", semester: "sem6" },
{ id: "ice602", name: "Principles of Management for Engineers", branch: "ice", semester: "sem6" },
{ id: "ice603", name: "Data Structure and Algorithm", branch: "ice", semester: "sem6" },
{ id: "ice701", name: "Biomedical Instrumentation", branch: "ice", semester: "sem7" },
{ id: "ice702", name: "Database Management System", branch: "ice", semester: "sem7" },
{ id: "ice703", name: "Digital Control system", branch: "ice", semester: "sem7" },
{ id: "ice704", name: "Software Engineering", branch: "ice", semester: "sem7" },
{ id: "ice705", name: "Artificial Neural Network", branch: "ice", semester: "sem7" },
{ id: "cse_aiml301", name: "Computational Methods", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml302", name: "Indian Knowledge System", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml303", name: "Discrete Mathematics", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml304", name: "Digital Logic and Computer Design", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml305", name: "Data Structures", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml306", name: "Object-Oriented Programming using C++", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml307", name: "Computational Methods Lab", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml308", name: "Digital Logic and Computer Design Lab", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml309", name: "Data Structures Lab", branch: "cse_aiml", semester: "sem3" },
{ id: "cse_aiml310", name: "Object-Oriented Programming using C++ Lab", branch: "cse_aiml", semester: "sem3" },
];

const LANGUAGES = [
  'JavaScript',
  'Python',
  'C',
  'C++',
  'C#',
  'Go',
  'Rust',
  'TypeScript',
  'Kotlin',
  'Swift',
  'PHP',
  'Ruby',
  'SQL',
  'Bash'
];

const UNIT_TEMPLATES = [
  {
    title: (lang) => `Introduction to ${lang}`,
    description: (lang) => `Overview: what ${lang} is, history, typical use-cases`,
    lessons: [
      {
        title: (lang) => `What is ${lang}?`,
        questions: [
          (lang) => `Which domain is ${lang} commonly used in?`,
          (lang) => `${lang} is primarily considered which kind of language?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            return [
              { 
                text: 'Web / Scripting', 
                // Add TypeScript explicitly
                correct: ['JavaScript','PHP','Ruby','Python','Bash','TypeScript'].includes(lang) 
              },
              { 
                text: 'Systems', 
                // Add C#, Kotlin, Swift explicitly
                correct: ['C','C++','Rust','Go','C#','Kotlin','Swift'].includes(lang) 
              },
              { text: 'Databases', correct: lang === 'SQL' }
            ];
          } else {
            return [
              { text: 'Low-level', correct: lang === 'C' || lang === 'Assembly' },
              { text: 'High-level', correct: true },
              { text: 'Markup', correct: false }
            ];
          }
        }
      },
      {
        title: (lang) => `Setup & Tooling for ${lang}`,
        questions: [
          (lang) => `Which command is commonly used to run ${lang} code?`,
          (lang) => `Which file extension is typical for ${lang} source files?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            const runCmds = {
              JavaScript: 'node',
              Python: 'python',
              C: 'gcc (compile) / ./a.out (run)',
              'C++': 'g++ (compile) / ./a.out (run)',
              'C#': 'dotnet',
              Go: 'go run',
              Rust: 'cargo run',
              TypeScript: 'ts-node / tsc then node',
              Kotlin: 'kotlinc / java',
              Swift: 'swift',
              PHP: 'php',
              Ruby: 'ruby',
              SQL: 'sql clients (psql/mysql)',
              Bash: 'bash'
            };
            return [
              { text: runCmds[lang] || 'toolchain command', correct: true },
              { text: 'compile-only', correct: false },
              { text: 'interpreted-only', correct: false }
            ];
          } else {
            const exts = {
              JavaScript: '.js',
              Python: '.py',
              C: '.c',
              'C++': '.cpp',
              'C#': '.cs',
              Go: '.go',
              Rust: '.rs',
              TypeScript: '.ts',
              Kotlin: '.kt',
              Swift: '.swift',
              PHP: '.php',
              Ruby: '.rb',
              SQL: '.sql',
              Bash: '.sh'
            };
            return [
              { text: exts[lang] || '.txt', correct: true },
              { text: '.exe', correct: false },
              { text: '.class', correct: false }
            ];
          }
        }
      }
    ]
  },

  {
    title: (lang) => `${lang} Syntax & Basics`,
    description: (lang) => 'Variables, expressions, operators and basic syntax',
    lessons: [
      {
        title: (lang) => 'Variables & Types',
        questions: [
          (lang) => `Which keyword (if any) is used to declare variables in ${lang}?`,
          (lang) => `Which type system does ${lang} primarily use?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            const decl = {
              JavaScript: 'let / const / var',
              Python: 'no keyword (assignment)',
              C: 'type before name (int x)',
              'C++': 'type before name',
              'C#': 'type before name or var',
              Go: 'var / :=',
              Rust: 'let',
              TypeScript: 'let / const / var',
              Kotlin: 'var / val',
              Swift: 'var / let',
              PHP: '$',
              Ruby: 'no keyword (assignment)',
              SQL: 'N/A',
              Bash: 'no (assignment)'
            };
            return [
              { text: decl[lang] || 'language-specific', correct: true },
              { text: 'let only', correct: false },
              { text: 'var only', correct: false }
            ];
          } else {
            const typing = {
              JavaScript: 'Dynamic',
              Python: 'Dynamic',
              C: 'Static',
              'C++': 'Static',
              'C#': 'Static',
              Go: 'Static',
              Rust: 'Static',
              TypeScript: 'Static (with annotations)',
              Kotlin: 'Static',
              Swift: 'Static',
              PHP: 'Dynamic (gradually typed in newer versions)',
              Ruby: 'Dynamic',
              SQL: 'Declarative',
              Bash: 'Dynamic'
            };
            return [
              { text: typing[lang] || 'Static', correct: true },
              { text: 'Dynamic', correct: typing[lang] === 'Dynamic' },
              { text: 'Weakly typed', correct: false }
            ];
          }
        }
      },
      {
        title: (lang) => 'Expressions & Operators',
        questions: [
          (lang) => `Which operator is used for equality comparison in ${lang}?`,
          (lang) => `Which operator increments a numeric value by 1 in ${lang}?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            return [
              { text: '== or ===', correct: lang === 'JavaScript' || lang === 'PHP' || lang === 'Ruby' || lang === 'Python' },
              { text: '==', correct: lang !== 'JavaScript' && lang !== 'Python' ? true : false },
              { text: '=', correct: false }
            ];
          } else {
            return [
              { text: '++', correct: ['C','C++','C#','JavaScript','PHP'].includes(lang) },
              { text: '+= 1', correct: true },
              { text: 'inc()', correct: false }
            ];
          }
        }
      }
    ]
  },

  {
    title: (lang) => `${lang} Control Flow`,
    description: (lang) => 'Conditionals, branching and loops',
    lessons: [
      {
        title: (lang) => 'Conditionals',
        questions: [
          (lang) => `Which construct is used for multi-branch selection in ${lang}?`,
          (lang) => `Is ternary operator available in ${lang}?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            return [
              { text: 'if / else', correct: true },
              { text: 'select-case only', correct: false },
              { text: 'pattern-only', correct: false }
            ];
          } else {
            const ternarySupported = !['SQL','Bash'].includes(lang);
            return [
              { text: ternarySupported ? 'Yes' : 'No', correct: true },
              { text: 'No', correct: !ternarySupported },
              { text: 'Only in newer versions', correct: false }
            ];
          }
        }
      },
      {
        title: (lang) => 'Loops & Iteration',
        questions: [
          (lang) => `Which loop is guaranteed to run at least once in ${lang}?`,
          (lang) => `Which common construct iterates a collection in ${lang}?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            return [
              { text: 'do-while / until', correct: !['Python','SQL','Bash'].includes(lang) },
              { text: 'for', correct: false },
              { text: 'while', correct: false }
            ];
          } else {
            return [
              { text: 'for-each / enhanced for', correct: true },
              { text: 'map only', correct: false },
              { text: 'iterator not available', correct: false }
            ];
          }
        }
      }
    ]
  },

  {
    title: (lang) => `${lang} Practical`,
    description: (lang) => 'I/O, tooling, and small practical tasks',
    lessons: [
      {
        title: (lang) => 'Reading / Writing Data',
        questions: [
          (lang) => `Which API is used for file reading in ${lang}?`,
          (lang) => `Which pattern helps auto-close resources (if applicable)?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            return [
              { text: 'Standard library I/O', correct: true },
              { text: 'No I/O support', correct: false },
              { text: 'Third-party only', correct: false }
            ];
          } else {
            return [
              { text: 'try-with-resources / context managers', correct: ['JavaScript','Python','Java','C#','Go','Rust'].includes(lang) || lang === 'Python' },
              { text: 'manual close', correct: true },
              { text: 'auto-close not needed', correct: false }
            ];
          }
        }
      },
      {
        title: (lang) => 'Mini Challenge',
        questions: [
          (lang) => `Which command builds or packages a ${lang} project?`,
          (lang) => `Which package manager is commonly used with ${lang}?`
        ],
        options: (lang, i) => {
          if (i === 0) {
            const build = {
              JavaScript: 'npm run build / webpack',
              Python: 'python setup / pip/poetry builds',
              C: 'make / gcc',
              'C++': 'make / cmake',
              'C#': 'dotnet build',
              Go: 'go build',
              Rust: 'cargo build',
              TypeScript: 'tsc / build tools',
              Kotlin: 'gradle / maven',
              Swift: 'swift build / xcodebuild',
              PHP: 'composer / build scripts',
              Ruby: 'rake',
              SQL: 'N/A',
              Bash: 'N/A'
            };
            return [
              { text: build[lang] || 'language build command', correct: true },
              { text: 'no build needed', correct: false },
              { text: 'use node always', correct: false }
            ];
          } else {
            const pm = {
              JavaScript: 'npm / yarn / pnpm',
              Python: 'pip / poetry',
              C: 'none specific (system package manager)',
              'C++': 'none specific (vcpkg/conan sometimes)',
              'C#': 'nuget',
              Go: 'go modules',
              Rust: 'cargo',
              TypeScript: 'npm / yarn',
              Kotlin: 'gradle / maven',
              Swift: 'swift package manager / cocoapods',
              PHP: 'composer',
              Ruby: 'gem / bundler',
              SQL: 'none',
              Bash: 'none'
            };
            return [
              { text: pm[lang] || 'system package manager', correct: true },
              { text: 'apt-get only', correct: false },
              { text: 'npm only', correct: false }
            ];
          }
        }
      }
    ]
  }
];

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

function buildCoursePayload(lang) {
  const id = `${slugify(lang)}-basics`;
  const units = UNIT_TEMPLATES.map((unitTemplate, uIndex) => {
    const unitTitle = unitTemplate.title(lang);
    const unitDescription = unitTemplate.description(lang);
    const lessons = unitTemplate.lessons.map((lessonTemplate, lIndex) => {
      const lessonTitle = lessonTemplate.title(lang);
      const challenges = lessonTemplate.questions.map((qFn, qIndex) => {
        const questionText = qFn(lang);
        const options = lessonTemplate.options(lang, qIndex);
        // Normalize options array to objects { text, correct: boolean }
        const optionsCreate = options.map(opt => ({
          text: opt.text,
          correct: !!opt.correct
        }));
        return {
          type: ChallengeType.SELECT,
          question: questionText,
          order: qIndex + 1,
          options: { create: optionsCreate }
        };
      });
      return {
        title: lessonTitle,
        order: lIndex + 1,
        challenges: { create: challenges }
      };
    });

    return {
      title: unitTitle,
      description: unitDescription,
      order: uIndex + 1,
      lessons: { create: lessons }
    };
  });

  return {
    id,
    name: `${lang} Basics`,
    type: CourseType.LEARN,
    units: { create: units }
  };
}

async function main() {
  console.log('Start seeding ...')

  // await prisma.course.create({
  //   data: {
  //     id: "java-basics",
  //     name: "Java Basics",
  //     type: "LEARN",
  //     units: {
  //       create: [
  //         // Unit 1: Introduction
  //         {
  //           title: "Introduction to Java",
  //           description: "Start your journey here — history, setup, and Hello World",
  //           order: 1,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "What is Java?",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which company originally developed Java?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "Microsoft", correct: false },
  //                           { text: "Sun Microsystems", correct: true },
  //                           { text: "Apple", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Java is primarily known as a ____ language.",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Low-level", correct: false },
  //                           { text: "High-level, object-oriented", correct: true },
  //                           { text: "Assembly", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Setup & Tooling",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which tool compiles Java source files to bytecode?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "javac", correct: true },
  //                           { text: "java", correct: false },
  //                           { text: "javadoc", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which file extension is used for Java source files?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: ".class", correct: false },
  //                           { text: ".java", correct: true },
  //                           { text: ".jar", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "First Program: Hello World",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which method is the Java program entry point?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "start()", correct: false },
  //                           { text: "main(String[] args)", correct: true },
  //                           { text: "entry()", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which command runs compiled Java bytecode?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "java MyClass", correct: true },
  //                           { text: "javac MyClass", correct: false },
  //                           { text: "run MyClass", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 2: Syntax & Operators
  //         {
  //           title: "Java Syntax & Operators",
  //           description: "Basic syntax, expressions, and operators",
  //           order: 2,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "Statements and Blocks",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which symbol defines a code block in Java?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "()", correct: false },
  //                           { text: "{}", correct: true },
  //                           { text: "[]", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "What ends a Java statement?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: ":", correct: false },
  //                           { text: ";", correct: true },
  //                           { text: ".", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Operators",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which operator is used for equality comparison of primitives?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "=", correct: false },
  //                           { text: "==", correct: true },
  //                           { text: "equals()", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which operator increments a variable by one?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "++", correct: true },
  //                           { text: "+=", correct: false },
  //                           { text: "--", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Expressions & Type Conversion",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "What happens when you add an int and a double?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "Result is int", correct: false },
  //                           { text: "Result is double (widening)", correct: true },
  //                           { text: "Compilation error", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which cast converts a double to an int?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "(int) value", correct: true },
  //                           { text: "int(value)", correct: false },
  //                           { text: "toInt(value)", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 3: Data Types & Variables
  //         {
  //           title: "Data Types & Variables",
  //           description: "Primitive types, reference types, and variable scope",
  //           order: 3,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "Primitive Types",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which primitive type stores true/false?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "char", correct: false },
  //                           { text: "boolean", correct: true },
  //                           { text: "int", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which type is 64-bit floating point?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "float", correct: false },
  //                           { text: "double", correct: true },
  //                           { text: "long", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Reference Types & Strings",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which of the following is immutable in Java?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "String", correct: true },
  //                           { text: "StringBuilder", correct: false },
  //                           { text: "StringBuffer", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "How do you create an array of ints?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "int[] arr = new int[5];", correct: true },
  //                           { text: "int arr = [5];", correct: false },
  //                           { text: "int arr[] = {};", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Variable Scope & Lifetime",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "A static variable belongs to ____.",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "An instance", correct: false },
  //                           { text: "The class", correct: true },
  //                           { text: "A method only", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Where are local variables declared?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Inside a method or block", correct: true },
  //                           { text: "At class level", correct: false },
  //                           { text: "Only in constructors", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 4: Control Flow
  //         {
  //           title: "Control Flow",
  //           description: "Conditional statements and loops",
  //           order: 4,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "If / Else",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which operator is used for ternary conditional?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "?:", correct: true },
  //                           { text: "??", correct: false },
  //                           { text: "->", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "What will `if (x = 5)` do in Java?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Assign 5 to x and compile", correct: false },
  //                           { text: "Compilation error (cannot assign in if)", correct: true },
  //                           { text: "Compare x to 5", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Switch",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which types are allowed in switch (Java 8)?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "int, char, String, enum", correct: true },
  //                           { text: "double, float", correct: false },
  //                           { text: "boolean only", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "What keyword stops execution in a case block?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "break", correct: true },
  //                           { text: "return", correct: false },
  //                           { text: "stop", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Loops (for, while, do-while)",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which loop executes body at least once?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "while", correct: false },
  //                           { text: "do-while", correct: true },
  //                           { text: "for", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which statement skips to next iteration?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "continue", correct: true },
  //                           { text: "break", correct: false },
  //                           { text: "skip", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 5: Object-Oriented Programming
  //         {
  //           title: "Object-Oriented Programming (OOP)",
  //           description: "Classes, objects, inheritance, polymorphism, encapsulation",
  //           order: 5,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "Classes & Objects",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which keyword creates a new object instance?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "make", correct: false },
  //                           { text: "new", correct: true },
  //                           { text: "create", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "What is a constructor?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "A special method to initialize objects", correct: true },
  //                           { text: "A static block", correct: false },
  //                           { text: "A field type", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Inheritance & Polymorphism",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which keyword is used for inheritance?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "implements", correct: false },
  //                           { text: "extends", correct: true },
  //                           { text: "inherits", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which allows runtime method selection?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Static binding", correct: false },
  //                           { text: "Dynamic dispatch (polymorphism)", correct: true },
  //                           { text: "Generics", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Encapsulation & Access Modifiers",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which modifier makes a member visible only within its class?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "public", correct: false },
  //                           { text: "private", correct: true },
  //                           { text: "protected", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which keyword restricts inheritance for a class?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "final", correct: true },
  //                           { text: "static", correct: false },
  //                           { text: "abstract", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 6: Collections & Generics
  //         {
  //           title: "Collections & Generics",
  //           description: "List, Set, Map, and type-safe generics",
  //           order: 6,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "List, Set, Map Basics",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which collection allows duplicate elements?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "Set", correct: false },
  //                           { text: "List", correct: true },
  //                           { text: "Map", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which Map implementation is unordered?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "TreeMap", correct: false },
  //                           { text: "HashMap", correct: true },
  //                           { text: "LinkedHashMap", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Generics",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "What does List<String> indicate?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "List of Objects", correct: false },
  //                           { text: "List of Strings (type-safe generics)", correct: true },
  //                           { text: "List that converts items to String", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which wildcard allows any subtype of T?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "? extends T", correct: true },
  //                           { text: "? super T", correct: false },
  //                           { text: "? equals T", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Iteration & Streams (Intro)",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which loop is best for simple iteration?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "for-each (enhanced for)", correct: true },
  //                           { text: "while with iterator", correct: false },
  //                           { text: "do-while", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Streams support which style of operations?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Imperative only", correct: false },
  //                           { text: "Functional (map/filter/reduce)", correct: true },
  //                           { text: "SQL queries only", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 7: Exceptions & I/O
  //         {
  //           title: "Exceptions & Input/Output",
  //           description: "Handling errors and reading/writing files",
  //           order: 7,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "Checked vs Unchecked Exceptions",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which exception must be declared or handled?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "Unchecked (RuntimeException)", correct: false },
  //                           { text: "Checked (IOException)", correct: true },
  //                           { text: "Error", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which block always runs after try/catch?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "finally", correct: true },
  //                           { text: "final", correct: false },
  //                           { text: "always", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "File I/O Basics",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which statement auto-closes resources?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "try-with-resources", correct: true },
  //                           { text: "try-finally", correct: false },
  //                           { text: "auto-close", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which class reads text from a file efficiently?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "FileInputStream", correct: false },
  //                           { text: "BufferedReader", correct: true },
  //                           { text: "OutputStream", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Custom Exceptions & Best Practices",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which class should custom checked exceptions extend?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "RuntimeException", correct: false },
  //                           { text: "Exception", correct: true },
  //                           { text: "Error", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Is it good practice to use exceptions for flow control?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "Yes, always", correct: false },
  //                           { text: "No, avoid for normal flow", correct: true },
  //                           { text: "Use only in constructors", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         },

  //         // Unit 8: Concurrency & Threads
  //         {
  //           title: "Concurrency & Threads (Intro)",
  //           description: "Threads, synchronization, and basic concurrent collections",
  //           order: 8,
  //           lessons: {
  //             create: [
  //               {
  //                 title: "Threads & Runnable",
  //                 order: 1,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which interface can be used to create a task for a Thread?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "Runnable", correct: true },
  //                           { text: "CallableOnly", correct: false },
  //                           { text: "Threadable", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which method starts a new thread?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "run()", correct: false },
  //                           { text: "start()", correct: true },
  //                           { text: "begin()", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Synchronization & Locks",
  //                 order: 2,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which keyword enforces exclusive access to a block?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "lock", correct: false },
  //                           { text: "synchronized", correct: true },
  //                           { text: "atomic", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which prevents instruction reordering visibility issues?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "volatile", correct: true },
  //                           { text: "transient", correct: false },
  //                           { text: "final", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               },
  //               {
  //                 title: "Concurrent Collections & Executors",
  //                 order: 3,
  //                 challenges: {
  //                   create: [
  //                     {
  //                       type: "SELECT",
  //                       question: "Which class helps manage a pool of threads?",
  //                       order: 1,
  //                       options: {
  //                         create: [
  //                           { text: "ThreadPoolExecutor / Executors", correct: true },
  //                           { text: "ArrayList", correct: false },
  //                           { text: "HashMap", correct: false }
  //                         ]
  //                       }
  //                     },
  //                     {
  //                       type: "SELECT",
  //                       question: "Which map implementation is thread-safe for concurrent access?",
  //                       order: 2,
  //                       options: {
  //                         create: [
  //                           { text: "HashMap", correct: false },
  //                           { text: "ConcurrentHashMap", correct: true },
  //                           { text: "TreeMap", correct: false }
  //                         ]
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   }
  // });
  // console.log('Java Basics course created.');

  console.log('Seeding multiple language courses...');

  for (const lang of LANGUAGES) {
    const payload = buildCoursePayload(lang);
    // Use upsert if you want idempotent seeds (avoid duplicates)
    await prisma.course.upsert({
      where: { id: payload.id },
      update: { name: payload.name, type: payload.type }, // minimal update
      create: { id: payload.id, name: payload.name, type: payload.type, units: payload.units }
    });
    console.log(`Created/Updated course: ${payload.name}`);
  }

  console.log('All courses seeded.');

  // const user = await prisma.user.findFirst();
  // if (user) {
  //   await prisma.forumThread.create({
  //     data: {
  //       title: "Welcome to the community!",
  //       body: "Say hello to everyone here.",
  //       authorId: user.id
  //     }
  //   });
  //   console.log('Forum thread created.');
    
  //   await prisma.userProgress.create({
  //     data: {
  //       userId: user.id,
  //       hearts: 5,
  //       points: 150
  //     }
  //   });
  //   console.log('User progress created.');
  // }

  // --- Create Courses, Branches, Semesters ---
  // We use createMany and skipDuplicates to avoid errors if data already exists
  await prisma.course.createMany({
    data: courses,
    skipDuplicates: true,
  })
  console.log('Courses created.')

  await prisma.branch.createMany({
    data: branches,
    skipDuplicates: true,
  })
  console.log('Branches created.')

  await prisma.semester.createMany({
    data: semesters,
    skipDuplicates: true,
  })
  console.log('Semesters created.')


  // --- Create Subjects ---
  // We need to transform the 'subjects' array to match the schema's field names
  // (e.g., 'branch' -> 'branchId', 'semester' -> 'semesterId')
  const subjectsToCreate = subjects.map(s => ({
    id: s.id,
    name: s.name,
    branchId: s.branch,
    semesterId: s.semester,
  }));

  await prisma.subject.createMany({
    data: subjectsToCreate,
    skipDuplicates: true,
  })
  console.log('Subjects created.')

  console.log('Seeding finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })