export type Career = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  internships: string[];
  interests: string[];
  responsibilities: string[];
  roadmap: { stage: string; items: string[] }[];
  companies: string[];
  salary: string;
};

export const CAREERS: Career[] = [
  {
    id: "ai-developer",
    name: "AI Developer",
    icon: "🧠",
    tagline: "Build intelligent systems that learn and adapt.",
    description:
      "Design and deploy machine learning models, neural networks, and AI-powered applications that solve real-world problems.",
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Git"],
    projects: ["AI Chatbot", "Face Recognition", "Image Classification", "Fake News Detection"],
    certifications: ["Google AI Essentials", "IBM AI Engineering", "Microsoft AI Fundamentals"],
    internships: ["AI Intern", "ML Intern"],
    interests: ["Artificial Intelligence", "Machine Learning", "Research"],
    responsibilities: [
      "Build, train and evaluate ML/DL models",
      "Productionize AI pipelines and APIs",
      "Collaborate with data and product teams",
      "Research new model architectures",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Python fundamentals", "Math: stats & linear algebra", "Numpy / Pandas"] },
      { stage: "Intermediate", items: ["Scikit-learn", "Classical ML projects", "Git & notebooks"] },
      { stage: "Advanced", items: ["Deep Learning with PyTorch/TensorFlow", "NLP & Computer Vision"] },
      { stage: "Job Ready", items: ["MLOps basics", "Portfolio of 3 AI projects", "Mock interviews"] },
    ],
    companies: ["Google", "Microsoft", "OpenAI", "NVIDIA", "TCS", "Infosys"],
    salary: "₹8–22 LPA",
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    icon: "📊",
    tagline: "Turn raw data into business decisions.",
    description:
      "Analyze complex datasets, build predictive models, and communicate insights that drive strategic decisions.",
    skills: ["Python", "SQL", "Statistics", "Pandas", "NumPy", "Power BI", "Tableau", "Machine Learning"],
    projects: ["Customer Churn", "Restaurant Sentiment Analysis", "Recommendation System", "Sales Prediction"],
    certifications: ["IBM Data Science", "Google Data Analytics"],
    internships: ["Data Science Intern", "Data Analyst Intern"],
    interests: ["Data Science", "Analytics", "Visualization"],
    responsibilities: [
      "Explore and clean large datasets",
      "Build statistical and ML models",
      "Design dashboards and reports",
      "Translate insights for stakeholders",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Excel & SQL", "Statistics 101", "Python basics"] },
      { stage: "Intermediate", items: ["Pandas, NumPy", "Power BI / Tableau", "Mini case studies"] },
      { stage: "Advanced", items: ["ML algorithms", "Feature engineering", "Model evaluation"] },
      { stage: "Job Ready", items: ["End-to-end DS project", "Storytelling with data", "Kaggle profile"] },
    ],
    companies: ["Amazon", "Flipkart", "Swiggy", "Deloitte", "EY", "Mu Sigma"],
    salary: "₹7–20 LPA",
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    icon: "📈",
    tagline: "Bridge business goals and tech solutions.",
    description:
      "Gather requirements, model processes, and translate business needs into actionable specifications for tech teams.",
    skills: ["SQL", "Excel", "Power BI", "Tableau", "Requirement Gathering", "Agile", "Jira", "Communication"],
    projects: ["HR Dashboard", "Sales Dashboard", "Inventory Dashboard", "Customer Analytics"],
    certifications: ["Google Data Analytics", "Microsoft Power BI", "Business Analysis Foundation"],
    internships: ["Business Analyst Intern", "Product Analyst Intern"],
    interests: ["Business Analytics", "Product Management", "Strategy"],
    responsibilities: [
      "Capture and document requirements",
      "Build dashboards and reports",
      "Run stakeholder workshops",
      "Define KPIs and success metrics",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Excel mastery", "SQL basics", "Business fundamentals"] },
      { stage: "Intermediate", items: ["Power BI / Tableau", "BRD & FRD writing", "Process mapping"] },
      { stage: "Advanced", items: ["Agile/Scrum", "Stakeholder management", "Advanced analytics"] },
      { stage: "Job Ready", items: ["Capstone case study", "Domain knowledge", "Resume + interviews"] },
    ],
    companies: ["Accenture", "Deloitte", "Capgemini", "TCS", "Wipro", "KPMG"],
    salary: "₹6–15 LPA",
  },
  {
    id: "full-stack",
    name: "Full Stack Developer",
    icon: "💻",
    tagline: "Ship end-to-end web products.",
    description:
      "Design, build and deploy modern web applications across frontend, backend, and database layers.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Express.js"],
    projects: ["Portfolio Website", "E-Commerce Website", "Social Media Application", "Food Delivery App"],
    certifications: ["Meta Frontend", "Meta Backend"],
    internships: ["Full Stack Intern", "Web Developer Intern"],
    interests: ["Full Stack Development", "Web Development"],
    responsibilities: [
      "Build responsive UIs",
      "Design REST APIs and DB schemas",
      "Deploy and monitor apps",
      "Collaborate in agile teams",
    ],
    roadmap: [
      { stage: "Beginner", items: ["HTML, CSS, JS", "Git & GitHub", "Responsive design"] },
      { stage: "Intermediate", items: ["React", "Node + Express", "MongoDB / SQL"] },
      { stage: "Advanced", items: ["Auth, testing", "TypeScript", "Cloud deploy"] },
      { stage: "Job Ready", items: ["3 full projects", "Open-source PR", "System design basics"] },
    ],
    companies: ["Zoho", "Razorpay", "Freshworks", "Atlassian", "Meta", "Zomato"],
    salary: "₹6–18 LPA",
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    icon: "⚙️",
    tagline: "Engineer robust, scalable software.",
    description:
      "Write clean, performant code, design data structures and architectures, and ship reliable systems.",
    skills: ["Java", "Python", "C++", "SQL", "DSA", "Git", "DBMS"],
    projects: ["Employee Management System", "Library Management System", "Banking System"],
    certifications: ["Oracle Java"],
    internships: ["Software Developer Intern"],
    interests: ["Software Development", "Automation"],
    responsibilities: [
      "Design and code features",
      "Code reviews and testing",
      "Optimize performance",
      "Maintain and refactor systems",
    ],
    roadmap: [
      { stage: "Beginner", items: ["A language (Java/Python)", "DSA basics", "Git"] },
      { stage: "Intermediate", items: ["OOP & design", "DBMS, OS, networks", "LeetCode 100"] },
      { stage: "Advanced", items: ["System design", "Testing", "One major framework"] },
      { stage: "Job Ready", items: ["Capstone project", "Mock interviews", "DSA 200+"] },
    ],
    companies: ["Google", "Microsoft", "Amazon", "Adobe", "TCS", "Infosys"],
    salary: "₹7–25 LPA",
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    icon: "🛠️",
    tagline: "Automate, deploy, and scale.",
    description:
      "Streamline software delivery with CI/CD, containerization, infrastructure as code, and observability.",
    skills: ["Linux", "Docker", "Kubernetes", "AWS", "Azure", "Jenkins", "Git", "Terraform"],
    projects: ["Docker Deployment", "CI/CD Pipeline", "Kubernetes Cluster"],
    certifications: ["AWS Cloud Practitioner", "Azure Fundamentals"],
    internships: ["DevOps Intern", "Cloud Intern"],
    interests: ["DevOps", "Cloud Computing", "Automation"],
    responsibilities: [
      "Build CI/CD pipelines",
      "Manage cloud infrastructure",
      "Monitor and alert",
      "Improve reliability and security",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Linux CLI", "Networking basics", "Git"] },
      { stage: "Intermediate", items: ["Docker", "One cloud (AWS/Azure)", "Jenkins / GitHub Actions"] },
      { stage: "Advanced", items: ["Kubernetes", "Terraform / IaC", "Monitoring stack"] },
      { stage: "Job Ready", items: ["End-to-end pipeline", "Cert + portfolio", "Mock interviews"] },
    ],
    companies: ["AWS", "Microsoft", "Red Hat", "Wipro", "Cognizant", "Infosys"],
    salary: "₹8–22 LPA",
  },
  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    icon: "☁️",
    tagline: "Architect resilient cloud platforms.",
    description:
      "Design, deploy and operate cloud-native systems with high availability, security and cost efficiency.",
    skills: ["AWS", "Azure", "Docker", "Linux", "Networking", "Terraform"],
    projects: ["Cloud Monitoring", "Cloud Storage", "Deployment Automation"],
    certifications: ["AWS Cloud Practitioner", "Azure Fundamentals", "Google Cloud Digital Leader"],
    internships: ["Cloud Intern"],
    interests: ["Cloud Computing", "DevOps", "Networking"],
    responsibilities: [
      "Design cloud architectures",
      "Automate infrastructure",
      "Optimize cost & performance",
      "Implement security best practices",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Networking", "Linux", "Cloud 101"] },
      { stage: "Intermediate", items: ["AWS / Azure core services", "IAM & security", "Docker"] },
      { stage: "Advanced", items: ["Kubernetes", "Terraform", "Multi-region design"] },
      { stage: "Job Ready", items: ["Cloud cert", "Reference architecture", "Interviews"] },
    ],
    companies: ["AWS", "Google Cloud", "Microsoft", "Oracle", "TCS", "Infosys"],
    salary: "₹8–24 LPA",
  },
  {
    id: "cyber-security",
    name: "Cyber Security Analyst",
    icon: "🛡️",
    tagline: "Defend systems and data from threats.",
    description:
      "Monitor, detect and respond to security incidents while hardening systems against vulnerabilities.",
    skills: ["Networking", "Linux", "Wireshark", "Ethical Hacking", "Security"],
    projects: ["Password Manager", "Network Scanner", "Vulnerability Scanner"],
    certifications: ["Google Cybersecurity", "CompTIA Security+"],
    internships: ["Cyber Security Intern"],
    interests: ["Cyber Security", "Networking"],
    responsibilities: [
      "Monitor SIEM and respond to alerts",
      "Perform vulnerability assessments",
      "Harden infrastructure",
      "Educate teams on security",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Networking + OSI", "Linux", "Security basics"] },
      { stage: "Intermediate", items: ["Wireshark, Nmap", "OWASP Top 10", "CTF practice"] },
      { stage: "Advanced", items: ["Ethical hacking", "Incident response", "Cloud security"] },
      { stage: "Job Ready", items: ["Security+ cert", "HTB / TryHackMe profile", "Resume"] },
    ],
    companies: ["Palo Alto", "Cisco", "IBM", "Deloitte", "PwC", "Wipro"],
    salary: "₹6–18 LPA",
  },
  {
    id: "ui-ux",
    name: "UI/UX Designer",
    icon: "🎨",
    tagline: "Design products people love to use.",
    description:
      "Research users, prototype interfaces, and craft delightful, accessible product experiences.",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    projects: ["Mobile App Design", "Website Redesign", "Healthcare App"],
    certifications: ["Google UX Design"],
    internships: ["UI/UX Intern"],
    interests: ["UI/UX", "Product Management"],
    responsibilities: [
      "Conduct user research",
      "Wireframe and prototype",
      "Run usability tests",
      "Maintain design systems",
    ],
    roadmap: [
      { stage: "Beginner", items: ["Design principles", "Figma basics", "Typography & color"] },
      { stage: "Intermediate", items: ["Wireframing", "Prototyping", "User research methods"] },
      { stage: "Advanced", items: ["Design systems", "Interaction design", "Accessibility"] },
      { stage: "Job Ready", items: ["3 case studies portfolio", "Mock critique", "Internship"] },
    ],
    companies: ["Razorpay", "Zoho", "Swiggy", "Flipkart", "Adobe", "Atlassian"],
    salary: "₹5–16 LPA",
  },
  {
    id: "system-analyst",
    name: "System Analyst",
    icon: "🧩",
    tagline: "Analyze systems and design solutions.",
    description:
      "Study existing systems, map business processes, and design improved software solutions end-to-end.",
    skills: ["SQL", "UML", "Requirement Gathering", "Documentation", "Agile", "Communication"],
    projects: ["ERP", "Hospital Management", "Banking System"],
    certifications: ["Business Analysis Foundation", "Scrum Fundamentals"],
    internships: ["System Analyst Intern"],
    interests: ["Business Analytics", "Software Development"],
    responsibilities: [
      "Analyze current systems",
      "Document requirements & UML",
      "Coordinate with developers",
      "Validate delivered solutions",
    ],
    roadmap: [
      { stage: "Beginner", items: ["SDLC basics", "SQL", "Documentation skills"] },
      { stage: "Intermediate", items: ["UML diagrams", "BRD/FRD", "Agile/Scrum"] },
      { stage: "Advanced", items: ["Domain expertise", "Solution design", "Stakeholder mgmt"] },
      { stage: "Job Ready", items: ["Case study portfolio", "Cert", "Interview prep"] },
    ],
    companies: ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "HCL"],
    salary: "₹5–14 LPA",
  },
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
  "Artificial Intelligence": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Prompt Engineering", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Hugging Face", "LangChain", "LLM Applications"],
  "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "Linux", "Terraform", "CI/CD"],
  "Database": ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQLite", "Firebase"],
  "Mobile Development": ["Flutter", "React Native", "Android"],
  "Testing": ["Selenium", "Postman", "API Testing", "Manual Testing", "JUnit"],
  "Business Analysis": ["Requirement Gathering", "User Stories", "UML", "Agile", "Scrum", "Jira", "Confluence", "BRD", "FRD", "Process Mapping"],
  "Soft Skills": ["Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management", "Adaptability", "Presentation Skills"],
};

export const CERTIFICATION_GROUPS: Record<string, string[]> = {
  "AI": ["Google AI Essentials", "IBM AI Engineering", "Microsoft AI Fundamentals", "Machine Learning Specialization"],
  "Data": ["Google Data Analytics", "Microsoft Power BI", "IBM Data Science", "Tableau Desktop Specialist"],
  "Cloud": ["AWS Cloud Practitioner", "Azure Fundamentals", "Google Cloud Digital Leader"],
  "Programming": ["Oracle Java", "Python for Everybody"],
  "Business": ["Agile Fundamentals", "Scrum Fundamentals", "Business Analysis Foundation"],
};

export const PROJECT_GROUPS: Record<string, string[]> = {
  "AI": ["AI Chatbot", "Image Classification", "Face Recognition", "Fake News Detection", "Crop Disease Detection"],
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
  "Cloud Intern", "Web Developer Intern",
];

export const EXPERIENCE_EXTRAS = [
  "Hackathons", "Open Source", "Freelancing", "Research", "Workshops", "Campus Clubs", "Technical Events",
];

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
  qualification: "",
  branch: "",
  year: "",
  cgpa: "",
  skills: [],
  certifications: [],
  projects: [],
  interests: [],
  internships: [],
  experienceExtras: [],
};

export function recommendCareers(data: AssessmentData): (Career & { score: number; matchReasons: string[] })[] {
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
      skillHits.length * 4 +
      certHits.length * 3 +
      projectHits.length * 3 +
      interestHits.length * 5 +
      internshipHits.length * 4;

    const reasons: string[] = [];
    if (skillHits.length) reasons.push(`${skillHits.length} matching skill${skillHits.length > 1 ? "s" : ""}`);
    if (interestHits.length) reasons.push(`${interestHits.length} aligned interest${interestHits.length > 1 ? "s" : ""}`);
    if (projectHits.length) reasons.push(`${projectHits.length} relevant project${projectHits.length > 1 ? "s" : ""}`);
    if (certHits.length) reasons.push(`${certHits.length} matching certification${certHits.length > 1 ? "s" : ""}`);
    if (internshipHits.length) reasons.push(`${internshipHits.length} relevant internship${internshipHits.length > 1 ? "s" : ""}`);

    return { ...c, score, matchReasons: reasons };
  })
    .sort((a, b) => b.score - a.score);
}

const STORAGE_KEY = "careerconnect.assessment";

export function saveAssessment(data: AssessmentData) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
export function loadAssessment(): AssessmentData {
  if (typeof window === "undefined") return DEFAULT_ASSESSMENT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ASSESSMENT;
    return { ...DEFAULT_ASSESSMENT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ASSESSMENT;
  }
}
