import { DEFAULT_ASSESSMENT, type AssessmentData } from "./career-data";

export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  technologies: string;
  githubUrl: string;
  demoUrl: string;
};

export type ProfileData = {
  // Personal information
  fullName: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  gender: string;
  // Education
  qualification: string;
  branch: string;
  year: string;
  cgpa: string;
  college: string;
  university: string;
  degree: string;
  graduationYear: string;
  // Skills & experience
  skills: string[];
  softSkills: string[];
  projects: string[];
  projectEntries: ProjectEntry[];
  certifications: string[];
  internships: string[];
  experienceExtras: string[];
  interests: string[];
  // Links & resume
  resumeName: string;
  resumeDataUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  leetcodeUrl: string;
  hackerrankUrl: string;
};

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  dob: "",
  gender: "",
  qualification: "",
  branch: "",
  year: "",
  cgpa: "",
  college: "",
  university: "",
  degree: "",
  graduationYear: "",
  skills: [],
  softSkills: [],
  projects: [],
  projectEntries: [],
  certifications: [],
  internships: [],
  experienceExtras: [],
  interests: [],
  resumeName: "",
  resumeDataUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  leetcodeUrl: "",
  hackerrankUrl: "",
};


const STORAGE_KEY = "careerconnect.profile";

export function saveProfile(data: ProfileData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

/** Sections that must be filled for the profile to count as complete. */
export const REQUIRED_SECTIONS: { key: keyof ProfileData; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "qualification", label: "Qualification" },
  { key: "branch", label: "Branch" },
  { key: "year", label: "Current year" },
  { key: "skills", label: "Technical skills" },
  { key: "interests", label: "Career interests" },
];

const OPTIONAL_SECTIONS: (keyof ProfileData)[] = [
  "phone",
  "location",
  "college",
  "cgpa",
  "softSkills",
  "projects",
  "certifications",
  "internships",
  "experienceExtras",
  "resumeName",
  "linkedinUrl",
  "githubUrl",
];

function filled(value: ProfileData[keyof ProfileData]): boolean {
  return Array.isArray(value) ? value.length > 0 : String(value ?? "").trim().length > 0;
}

export function missingRequired(p: ProfileData): string[] {
  return REQUIRED_SECTIONS.filter((s) => !filled(p[s.key])).map((s) => s.label);
}

export function isProfileComplete(p: ProfileData): boolean {
  return missingRequired(p).length === 0;
}

export function profileCompletion(p: ProfileData): number {
  const keys = [...REQUIRED_SECTIONS.map((s) => s.key), ...OPTIONAL_SECTIONS];
  const done = keys.filter((k) => filled(p[k])).length;
  return Math.round((done / keys.length) * 100);
}

/** Map the profile onto the existing recommendation engine input (logic unchanged). */
export function profileToAssessment(p: ProfileData): AssessmentData {
  return {
    ...DEFAULT_ASSESSMENT,
    qualification: p.qualification,
    branch: p.branch,
    year: p.year,
    cgpa: p.cgpa,
    skills: [...p.skills, ...p.softSkills],
    certifications: p.certifications,
    projects: p.projects,
    interests: p.interests,
    internships: p.internships,
    experienceExtras: p.experienceExtras,
  };
}
