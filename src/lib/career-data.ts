export type Career = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  internships: string[];
  interests: string[];
  responsibilities: string[];
  roadmap: { stage: string; items: string[] }[];
  growthPath: string[];
  interviewPrep: string[];
  companies: string[];
  salary: string;
};

const ROADMAP_GENERIC = [
  { stage: "Foundations", items: ["Core fundamentals", "Math / logic basics", "Version control with Git"] },
  { stage: "Build Skills", items: ["Hands-on projects", "Frameworks & tools", "Domain knowledge"] },
  { stage: "Advanced", items: ["System design", "Testing & quality", "Performance tuning"] },
  { stage: "Job Ready", items: ["Portfolio of 3 projects", "Resume + LinkedIn", "Mock interviews"] },
];

const INTERVIEW_GENERIC = [
  "Data structures & algorithms",
  "Domain-specific technical round",
  "System / case design discussion",
  "Behavioral & culture fit",
];

function c(partial: Partial<Career> & Pick<Career, "id" | "name" | "category" | "tagline" | "description" | "skills">): Career {
  return {
    projects: [],
    certifications: [],
    internships: [],
    interests: [],
    responsibilities: [
      "Design and implement core deliverables",
      "Collaborate across product and engineering",
      "Continuously improve quality and performance",
      "Document decisions and mentor peers",
    ],
    roadmap: ROADMAP_GENERIC,
    growthPath: ["Associate", "Engineer / Analyst", "Senior", "Lead / Principal", "Manager / Architect"],
    interviewPrep: INTERVIEW_GENERIC,
    companies: ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Deloitte"],
    salary: "₹6–18 LPA",
    ...partial,
  };
}

export const CAREERS: Career[] = [
  c({
    id: "ai-developer", name: "AI Developer", category: "AI & Data",
    tagline: "Build intelligent systems that learn and adapt.",
    description: "Design, train and deploy machine learning models and intelligent applications that solve real-world problems.",
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Git"],
    projects: ["AI Chatbot", "Face Recognition", "Image Classification", "Fake News Detection"],
    certifications: ["Google AI Essentials", "IBM AI Engineering", "Microsoft AI Fundamentals"],
    internships: ["AI Intern", "Machine Learning Intern"],
    interests: ["Artificial Intelligence", "Machine Learning"],
    salary: "₹8–24 LPA",
    companies: ["Google", "Microsoft", "OpenAI", "NVIDIA", "TCS", "Infosys"],
    growthPath: ["ML Associate", "AI Developer", "Senior AI Engineer", "ML Architect", "Head of AI"],
    interviewPrep: ["Python + ML coding round", "ML theory & math", "Case: design an ML system", "Behavioral round"],
  }),
  c({
    id: "ml-engineer", name: "Machine Learning Engineer", category: "AI & Data",
    tagline: "Productionize ML models at scale.",
    description: "Engineer reliable ML pipelines, deploy models to production and monitor their performance.",
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Docker", "AWS", "MLOps", "Git"],
    projects: ["Recommendation System", "Image Classification", "Fake News Detection"],
    certifications: ["IBM AI Engineering", "AWS Machine Learning"],
    internships: ["Machine Learning Intern", "AI Intern"],
    interests: ["Machine Learning", "DevOps", "Cloud Computing"],
    salary: "₹10–28 LPA",
  }),
  c({
    id: "data-scientist", name: "Data Scientist", category: "AI & Data",
    tagline: "Turn raw data into business decisions.",
    description: "Analyze datasets, build predictive models, and translate insights into business value.",
    skills: ["Python", "SQL", "Statistics", "Pandas", "NumPy", "Power BI", "Tableau", "Machine Learning"],
    projects: ["Customer Churn Analysis", "Restaurant Sentiment Analysis", "Recommendation System", "Sales Dashboard"],
    certifications: ["IBM Data Science", "Google Data Analytics"],
    internships: ["Data Science Intern", "Data Analyst Intern"],
    interests: ["Data Science", "Business Analytics"],
    salary: "₹7–22 LPA",
    companies: ["Amazon", "Flipkart", "Swiggy", "Deloitte", "EY", "Mu Sigma"],
  }),
  c({
    id: "data-analyst", name: "Data Analyst", category: "AI & Data",
    tagline: "Find the story hidden in the data.",
    description: "Clean, analyze and visualize data to surface insights that drive product and business decisions.",
    skills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Statistics", "Data Visualization"],
    projects: ["HR Analytics Dashboard", "Sales Dashboard", "Financial Dashboard"],
    certifications: ["Google Data Analytics", "Microsoft Power BI"],
    internships: ["Data Analyst Intern", "Business Analyst Intern"],
    interests: ["Data Science", "Business Analytics"],
    salary: "₹5–14 LPA",
  }),
  c({
    id: "bi-analyst", name: "Business Intelligence Analyst", category: "AI & Data",
    tagline: "Power decisions with dashboards and KPIs.",
    description: "Build BI dashboards, define KPIs and partner with stakeholders to drive data-led decisions.",
    skills: ["SQL", "Power BI", "Tableau", "Excel", "ETL", "Dashboard Development"],
    projects: ["Sales Dashboard", "HR Analytics Dashboard", "Financial Dashboard"],
    certifications: ["Microsoft Power BI", "Tableau Desktop Specialist"],
    internships: ["Business Analyst Intern", "Data Analyst Intern"],
    interests: ["Business Analytics", "Data Science"],
    salary: "₹6–16 LPA",
  }),
  c({
    id: "nlp-engineer", name: "NLP Engineer", category: "AI & Data",
    tagline: "Help machines understand language.",
    description: "Design language models, build text pipelines and ship NLP-powered features.",
    skills: ["Python", "NLP", "Deep Learning", "PyTorch", "Hugging Face", "LangChain"],
    projects: ["AI Chatbot", "Fake News Detection"],
    certifications: ["IBM AI Engineering"],
    internships: ["AI Intern", "Machine Learning Intern"],
    interests: ["Artificial Intelligence", "Machine Learning"],
    salary: "₹9–24 LPA",
  }),
  c({
    id: "cv-engineer", name: "Computer Vision Engineer", category: "AI & Data",
    tagline: "Teach machines to see the world.",
    description: "Build computer vision systems for detection, recognition and image understanding.",
    skills: ["Python", "Computer Vision", "OpenCV", "Deep Learning", "PyTorch"],
    projects: ["Face Recognition", "Image Classification", "Crop Disease Detection"],
    certifications: ["IBM AI Engineering"],
    internships: ["AI Intern", "Machine Learning Intern"],
    interests: ["Artificial Intelligence", "Machine Learning"],
    salary: "₹9–24 LPA",
  }),
  c({
    id: "business-analyst", name: "Business Analyst", category: "Business",
    tagline: "Bridge business goals and tech solutions.",
    description: "Gather requirements, model processes and translate business needs into actionable specs.",
    skills: ["SQL", "Excel", "Power BI", "Tableau", "Requirement Gathering", "Agile", "Jira", "Communication"],
    projects: ["HR Analytics Dashboard", "Sales Dashboard", "Financial Dashboard"],
    certifications: ["Google Data Analytics", "Business Analysis Foundation"],
    internships: ["Business Analyst Intern", "Product Analyst Intern"],
    interests: ["Business Analytics", "Product Management"],
    salary: "₹6–16 LPA",
    companies: ["Accenture", "Deloitte", "Capgemini", "TCS", "Wipro", "KPMG"],
  }),
  c({
    id: "product-analyst", name: "Product Analyst", category: "Business",
    tagline: "Measure what matters in a product.",
    description: "Analyze product usage, run experiments and inform roadmap decisions with data.",
    skills: ["SQL", "Excel", "Statistics", "Tableau", "Power BI", "Communication"],
    projects: ["Customer Churn Analysis", "Sales Dashboard"],
    certifications: ["Google Data Analytics"],
    internships: ["Product Analyst Intern", "Business Analyst Intern"],
    interests: ["Product Management", "Business Analytics"],
    salary: "₹7–18 LPA",
  }),
  c({
    id: "product-manager", name: "Product Manager", category: "Business",
    tagline: "Own the why, what and when.",
    description: "Define product vision, prioritize roadmap and lead cross-functional teams to ship outcomes.",
    skills: ["Communication", "Agile", "Scrum", "Jira", "Requirement Gathering", "Presentation Skills"],
    projects: ["HR Analytics Dashboard", "E-Commerce Website"],
    certifications: ["Agile Fundamentals", "Scrum Fundamentals"],
    internships: ["Product Analyst Intern", "Business Analyst Intern"],
    interests: ["Product Management", "Business Analytics"],
    salary: "₹10–28 LPA",
  }),
  c({
    id: "system-analyst", name: "System Analyst", category: "Business",
    tagline: "Analyze systems, design solutions.",
    description: "Study existing systems, document requirements and design improved software solutions end-to-end.",
    skills: ["SQL", "UML", "Requirement Gathering", "Agile", "Communication"],
    projects: ["Employee Management System", "Banking System"],
    certifications: ["Business Analysis Foundation", "Scrum Fundamentals"],
    internships: ["Business Analyst Intern"],
    interests: ["Business Analytics", "Software Development"],
    salary: "₹5–14 LPA",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "HCL"],
  }),
  c({
    id: "full-stack", name: "Full Stack Developer", category: "Software",
    tagline: "Ship end-to-end web products.",
    description: "Design, build and deploy modern web applications across frontend, backend and database.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Express.js"],
    projects: ["Portfolio Website", "E-Commerce Website", "Social Media Application", "Food Delivery App"],
    certifications: ["Meta Frontend", "Meta Backend"],
    internships: ["Web Developer Intern", "Software Developer Intern"],
    interests: ["Full Stack Development", "Web Development"],
    salary: "₹6–20 LPA",
    companies: ["Zoho", "Razorpay", "Freshworks", "Atlassian", "Meta", "Zomato"],
  }),
  c({
    id: "software-engineer", name: "Software Engineer", category: "Software",
    tagline: "Engineer robust, scalable software.",
    description: "Write clean, performant code and ship reliable systems across the stack.",
    skills: ["Java", "Python", "C++", "SQL", "Git"],
    projects: ["Employee Management System", "Library Management System", "Banking System"],
    certifications: ["Oracle Java"],
    internships: ["Software Developer Intern"],
    interests: ["Software Development", "Automation"],
    salary: "₹7–26 LPA",
    companies: ["Google", "Microsoft", "Amazon", "Adobe", "TCS", "Infosys"],
  }),
  c({
    id: "java-developer", name: "Java Developer", category: "Software",
    tagline: "Build enterprise-grade backends in Java.",
    description: "Develop scalable backend services with Spring Boot and the broader Java ecosystem.",
    skills: ["Java", "SQL", "Git", "REST API"],
    projects: ["Employee Management System", "Banking System"],
    certifications: ["Oracle Java"],
    internships: ["Software Developer Intern"],
    interests: ["Software Development"],
    salary: "₹6–20 LPA",
  }),
  c({
    id: "python-developer", name: "Python Developer", category: "Software",
    tagline: "Solve problems fast with Python.",
    description: "Build APIs, automation and data tools with Python frameworks.",
    skills: ["Python", "SQL", "Git", "REST API"],
    projects: ["Employee Management System", "AI Chatbot"],
    certifications: ["Python for Everybody"],
    internships: ["Software Developer Intern"],
    interests: ["Software Development", "Automation"],
    salary: "₹6–20 LPA",
  }),
  c({
    id: "frontend-developer", name: "Frontend Developer", category: "Software",
    tagline: "Craft fast, beautiful interfaces.",
    description: "Build responsive, accessible web UIs with modern frameworks.",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS"],
    projects: ["Portfolio Website", "E-Commerce Website"],
    certifications: ["Meta Frontend"],
    internships: ["Web Developer Intern"],
    interests: ["Web Development", "UI/UX"],
    salary: "₹6–20 LPA",
  }),
  c({
    id: "backend-developer", name: "Backend Developer", category: "Software",
    tagline: "Design the engines that power apps.",
    description: "Build APIs, services and data models that scale.",
    skills: ["Node.js", "Express.js", "SQL", "MongoDB", "REST API", "Git"],
    projects: ["E-Commerce Website", "Social Media Application"],
    certifications: ["Meta Backend"],
    internships: ["Software Developer Intern"],
    interests: ["Software Development", "Web Development"],
    salary: "₹6–22 LPA",
  }),
  c({
    id: "mobile-developer", name: "Mobile Developer", category: "Software",
    tagline: "Build delightful mobile experiences.",
    description: "Design and ship cross-platform mobile apps.",
    skills: ["Flutter", "React Native", "JavaScript", "Git"],
    projects: ["Food Delivery App", "Social Media Application"],
    certifications: [],
    internships: ["Web Developer Intern"],
    interests: ["Mobile Development"],
    salary: "₹6–18 LPA",
  }),
  c({
    id: "android-developer", name: "Android Developer", category: "Software",
    tagline: "Native apps for a billion devices.",
    description: "Build native Android apps with Kotlin and Jetpack.",
    skills: ["Kotlin", "Android", "Git", "REST API"],
    projects: ["Food Delivery App", "Social Media Application"],
    certifications: [],
    internships: ["Web Developer Intern"],
    interests: ["Mobile Development"],
    salary: "₹6–18 LPA",
  }),
  c({
    id: "react-native-developer", name: "React Native Developer", category: "Software",
    tagline: "One codebase, two app stores.",
    description: "Build cross-platform mobile apps with React Native.",
    skills: ["React Native", "JavaScript", "TypeScript", "REST API"],
    projects: ["Food Delivery App", "Social Media Application"],
    certifications: [],
    internships: ["Web Developer Intern"],
    interests: ["Mobile Development", "Web Development"],
    salary: "₹6–18 LPA",
  }),
  c({
    id: "devops", name: "DevOps Engineer", category: "Cloud & DevOps",
    tagline: "Automate, deploy, and scale.",
    description: "Streamline delivery with CI/CD, containers and infrastructure-as-code.",
    skills: ["Linux", "Docker", "Kubernetes", "AWS", "Jenkins", "Git", "Terraform"],
    projects: ["Docker Deployment", "CI/CD Pipeline", "Kubernetes Cluster"],
    certifications: ["AWS Cloud Practitioner", "Azure Fundamentals"],
    internships: ["DevOps Intern", "Cloud Intern"],
    interests: ["DevOps", "Cloud Computing", "Automation"],
    salary: "₹8–24 LPA",
    companies: ["AWS", "Microsoft", "Red Hat", "Wipro", "Cognizant", "Infosys"],
  }),
  c({
    id: "cloud-engineer", name: "Cloud Engineer", category: "Cloud & DevOps",
    tagline: "Architect resilient cloud platforms.",
    description: "Design and operate cloud-native systems with high availability and security.",
    skills: ["AWS", "Azure", "Docker", "Linux", "Terraform"],
    projects: ["Docker Deployment", "CI/CD Pipeline"],
    certifications: ["AWS Cloud Practitioner", "Azure Fundamentals", "Google Cloud Digital Leader"],
    internships: ["Cloud Intern", "DevOps Intern"],
    interests: ["Cloud Computing", "DevOps", "Networking"],
    salary: "₹8–26 LPA",
  }),
  c({
    id: "sre", name: "Site Reliability Engineer", category: "Cloud & DevOps",
    tagline: "Keep production fast and never down.",
    description: "Apply engineering to operations: reliability, observability and incident response.",
    skills: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform"],
    projects: ["CI/CD Pipeline", "Kubernetes Cluster"],
    certifications: ["AWS Cloud Practitioner"],
    internships: ["DevOps Intern", "Cloud Intern"],
    interests: ["DevOps", "Cloud Computing"],
    salary: "₹10–28 LPA",
  }),
  c({
    id: "qa-engineer", name: "QA Engineer", category: "Testing",
    tagline: "Ship software that just works.",
    description: "Design test plans and ensure quality across releases.",
    skills: ["Manual Testing", "API Testing", "Postman", "JUnit", "Selenium"],
    projects: ["Banking System", "E-Commerce Website"],
    certifications: [],
    internships: ["QA Intern"],
    interests: ["Software Development", "Automation"],
    salary: "₹4–12 LPA",
  }),
  c({
    id: "automation-tester", name: "Automation Test Engineer", category: "Testing",
    tagline: "Make quality scalable.",
    description: "Build automated test suites that catch regressions early.",
    skills: ["Selenium", "Java", "Python", "API Testing", "Git"],
    projects: ["Banking System", "E-Commerce Website"],
    certifications: [],
    internships: ["QA Intern"],
    interests: ["Automation", "Software Development"],
    salary: "₹5–14 LPA",
  }),
  c({
    id: "cyber-security", name: "Cybersecurity Analyst", category: "Cybersecurity",
    tagline: "Defend systems and data from threats.",
    description: "Monitor, detect and respond to security incidents and harden systems.",
    skills: ["Networking", "Linux", "Ethical Hacking"],
    projects: ["Password Manager", "Network Scanner"],
    certifications: ["Google Cybersecurity", "CompTIA Security+"],
    internships: ["Cyber Security Intern"],
    interests: ["Cyber Security", "Networking"],
    salary: "₹6–18 LPA",
    companies: ["Palo Alto", "Cisco", "IBM", "Deloitte", "PwC", "Wipro"],
  }),
  c({
    id: "soc-analyst", name: "SOC Analyst", category: "Cybersecurity",
    tagline: "First responders of the digital world.",
    description: "Monitor SIEM, triage alerts and coordinate incident response.",
    skills: ["Networking", "Linux", "Security"],
    projects: ["Network Scanner", "Vulnerability Scanner"],
    certifications: ["CompTIA Security+"],
    internships: ["Cyber Security Intern"],
    interests: ["Cyber Security"],
    salary: "₹5–14 LPA",
  }),
  c({
    id: "security-engineer", name: "Security Engineer", category: "Cybersecurity",
    tagline: "Build security into every layer.",
    description: "Design secure systems, implement controls and review architecture.",
    skills: ["Networking", "Linux", "Ethical Hacking", "Security"],
    projects: ["Vulnerability Scanner", "Password Manager"],
    certifications: ["CompTIA Security+", "Google Cybersecurity"],
    internships: ["Cyber Security Intern"],
    interests: ["Cyber Security", "Cloud Computing"],
    salary: "₹8–22 LPA",
  }),
  c({
    id: "ui-ux", name: "UI/UX Designer", category: "Design",
    tagline: "Design products people love to use.",
    description: "Research users, prototype interfaces and craft accessible product experiences.",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    projects: ["Portfolio Website", "Social Media Application"],
    certifications: ["Google UX Design"],
    internships: ["Web Developer Intern"],
    interests: ["UI/UX", "Product Management"],
    salary: "₹5–16 LPA",
    companies: ["Razorpay", "Zoho", "Swiggy", "Flipkart", "Adobe", "Atlassian"],
  }),
];

export const QUALIFICATIONS = ["Diploma", "B.Tech / B.E.", "B.Sc.", "BCA", "MCA", "M.Tech", "MBA", "Other"];
export const BRANCHES = [
  "Computer Science", "Information Technology", "AI & Machine Learning", "Data Science",
  "Electronics", "Electrical", "Mechanical", "Civil", "Commerce", "Other",
];
export const YEARS = ["1st", "2nd", "3rd", "4th", "Graduate"];

export const SKILL_GROUPS: Record<string, string[]> = {
  "Programming Languages": ["Python", "Java", "C", "C++", "C#", "JavaScript", "TypeScript", "SQL", "PHP", "Go", "Kotlin", "Swift", "R"],
  "Web Development": ["HTML", "CSS", "Bootstrap", "Tailwind CSS", "React", "Angular", "Vue.js", "Node.js", "Express.js", "REST API"],
  "Data Analytics": ["Excel", "Advanced Excel", "Power BI", "Tableau", "Pandas", "NumPy", "Data Cleaning", "Data Visualization", "Statistics", "ETL", "Dashboard Development"],
  "Machine Learning": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Hugging Face", "LangChain"],
  "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "Linux", "Terraform", "CI/CD"],
  "Database": ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQLite", "Firebase"],
  "Mobile Development": ["Flutter", "React Native", "Android"],
  "Testing": ["Selenium", "Postman", "API Testing", "Manual Testing", "JUnit"],
  "Business Analysis": ["Requirement Gathering", "User Stories", "UML", "Agile", "Scrum", "Jira", "Confluence", "BRD", "FRD", "Process Mapping"],
  "Soft Skills": ["Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management", "Adaptability", "Presentation Skills"],
};

export const CERTIFICATION_GROUPS: Record<string, string[]> = {
  "Machine Learning": ["Google AI Essentials", "IBM AI Engineering", "Microsoft AI Fundamentals", "Machine Learning Specialization"],
  "Data": ["Google Data Analytics", "Microsoft Power BI", "IBM Data Science", "Tableau Desktop Specialist"],
  "Cloud": ["AWS Cloud Practitioner", "Azure Fundamentals", "Google Cloud Digital Leader"],
  "Programming": ["Oracle Java", "Python for Everybody"],
  "Business": ["Agile Fundamentals", "Scrum Fundamentals", "Business Analysis Foundation"],
};

export const PROJECT_GROUPS: Record<string, string[]> = {
  "Machine Learning": ["AI Chatbot", "Image Classification", "Face Recognition", "Fake News Detection", "Crop Disease Detection"],
  "Data Analytics": ["HR Analytics Dashboard", "Sales Dashboard", "Customer Churn Analysis", "Restaurant Sentiment Analysis", "Financial Dashboard"],
  "Software": ["Employee Management System", "Library Management System", "Banking System", "E-Commerce Website"],
  "Cloud": ["Docker Deployment", "CI/CD Pipeline", "Kubernetes Cluster"],
  "Web": ["Portfolio Website", "Social Media Application", "Food Delivery App"],
};

export const INTERESTS = [
  "Artificial Intelligence", "Machine Learning", "Data Science", "Business Analytics",
  "Software Development", "Full Stack Development", "DevOps", "Cloud Computing",
  "Cyber Security", "UI/UX", "Product Management", "Mobile Development",
  "Web Development", "Automation", "Networking",
];

export const INTERNSHIPS = [
  "AI Intern", "Machine Learning Intern", "Software Developer Intern", "Data Analyst Intern",
  "Business Analyst Intern", "Product Analyst Intern", "DevOps Intern", "QA Intern",
  "Cloud Intern", "Web Developer Intern", "Cyber Security Intern",
];

export const EXPERIENCE_EXTRAS = [
  "Hackathons", "Open Source", "Freelancing", "Research", "Workshops", "Campus Clubs", "Technical Events",
];

export const TRENDING_SKILLS = [
  "Python", "SQL", "React", "Machine Learning", "AWS", "Power BI", "Docker", "TypeScript", "Kubernetes", "Tableau",
];

export const POPULAR_CAREER_IDS = ["software-engineer", "data-scientist", "full-stack", "ai-developer", "cloud-engineer", "product-manager"];

export type AssessmentData = {
  qualification: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  certifications: string[];
  projects: string[];
  interests: string[];
  internships: string[];
  experienceExtras: string[];
};

export const DEFAULT_ASSESSMENT: AssessmentData = {
  qualification: "", branch: "", year: "", cgpa: "",
  skills: [], certifications: [], projects: [], interests: [], internships: [], experienceExtras: [],
};

export type Recommendation = Career & { score: number; matchPercent: number; matchReasons: string[] };

export function recommendCareers(data: AssessmentData): Recommendation[] {
  const setSkills = new Set(data.skills.map((s) => s.toLowerCase()));
  const setCerts = new Set(data.certifications.map((s) => s.toLowerCase()));
  const setProjects = new Set(data.projects.map((s) => s.toLowerCase()));
  const setInterests = new Set(data.interests.map((s) => s.toLowerCase()));
  const setInternships = new Set(data.internships.map((s) => s.toLowerCase()));

  return CAREERS.map((c) => {
    const skillHits = c.skills.filter((s) => setSkills.has(s.toLowerCase()));
    const certHits = c.certifications.filter((s) => setCerts.has(s.toLowerCase()));
    const projectHits = c.projects.filter((s) => setProjects.has(s.toLowerCase()));
    const interestHits = c.interests.filter((s) => setInterests.has(s.toLowerCase()));
    const internshipHits = c.internships.filter((s) => setInternships.has(s.toLowerCase()));

    const score =
      skillHits.length * 4 + certHits.length * 3 + projectHits.length * 3 +
      interestHits.length * 5 + internshipHits.length * 4;

    const max =
      c.skills.length * 4 + c.certifications.length * 3 + c.projects.length * 3 +
      c.interests.length * 5 + c.internships.length * 4;

    const ratio = max > 0 ? score / max : 0;
    // Map raw ratio to a friendly 40-99 range when there are any signals
    let matchPercent = 0;
    if (score === 0) matchPercent = 35 + Math.floor(Math.random() * 6);
    else matchPercent = Math.min(99, Math.round(55 + ratio * 55));

    const reasons: string[] = [];
    skillHits.slice(0, 2).forEach((s) => reasons.push(`${s} matches`));
    projectHits.slice(0, 1).forEach((p) => reasons.push(`${p} project`));
    internshipHits.slice(0, 1).forEach((i) => reasons.push(`${i} experience`));
    interestHits.slice(0, 1).forEach((i) => reasons.push(`Interested in ${i}`));
    certHits.slice(0, 1).forEach((cert) => reasons.push(`${cert} certified`));

    return { ...c, score, matchPercent, matchReasons: reasons };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

/* ---------- storage helpers ---------- */
const STORAGE_KEY = "careercompass.assessment";
const SAVED_KEY = "careercompass.saved";
const RECENTS_KEY = "careercompass.recents";

export function saveAssessment(data: AssessmentData) {
  if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export function loadAssessment(): AssessmentData {
  if (typeof window === "undefined") return DEFAULT_ASSESSMENT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ASSESSMENT;
    return { ...DEFAULT_ASSESSMENT, ...JSON.parse(raw) };
  } catch { return DEFAULT_ASSESSMENT; }
}

export function getSavedCareers(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]"); } catch { return []; }
}
export function toggleSavedCareer(id: string): string[] {
  const set = new Set(getSavedCareers());
  set.has(id) ? set.delete(id) : set.add(id);
  const arr = Array.from(set);
  localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
  return arr;
}
export function isCareerSaved(id: string): boolean {
  return getSavedCareers().includes(id);
}

export function pushRecent(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  const prev = getRecents().filter((r) => r.toLowerCase() !== term.toLowerCase());
  const next = [term, ...prev].slice(0, 6);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}
export function getRecents(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? "[]"); } catch { return []; }
}
