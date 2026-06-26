import {
  Code2, Database, BarChart3, LineChart, Cloud, Server, Shield, Palette, Puzzle,
  Smartphone, Globe, Cpu, Boxes, GitBranch, Bug, Lock, Briefcase, Eye, MessageSquare,
  Layers, Wrench, Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CAREER_ICONS: Record<string, LucideIcon> = {
  "ai-developer": Cpu,
  "ml-engineer": Cpu,
  "data-scientist": LineChart,
  "data-analyst": BarChart3,
  "bi-analyst": BarChart3,
  "nlp-engineer": MessageSquare,
  "cv-engineer": Eye,
  "business-analyst": LineChart,
  "product-analyst": BarChart3,
  "product-manager": Briefcase,
  "system-analyst": Puzzle,
  "full-stack": Globe,
  "software-engineer": Code2,
  "java-developer": Code2,
  "python-developer": Terminal,
  "frontend-developer": Layers,
  "backend-developer": Server,
  "mobile-developer": Smartphone,
  "android-developer": Smartphone,
  "react-native-developer": Smartphone,
  "devops": GitBranch,
  "cloud-engineer": Cloud,
  "sre": Wrench,
  "qa-engineer": Bug,
  "automation-tester": Bug,
  "cyber-security": Shield,
  "soc-analyst": Shield,
  "security-engineer": Lock,
  "ui-ux": Palette,
  "default": Boxes,
};

export function CareerIcon({ id, className }: { id: string; className?: string }) {
  const Icon = CAREER_ICONS[id] ?? CAREER_ICONS.default;
  return <Icon className={className} strokeWidth={1.8} />;
}

// keep alias for Database import (not unused if tree-shaken differently)
export { Database };
