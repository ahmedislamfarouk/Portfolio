export interface Project {
  title: string;
  category: string;
  image: string;
  status: string;
  stats: string;
  year: string;
  description: string;
  technologies: string[];
  achievements?: string[];
  link?: string;
  github?: string;
}

export interface Award {
  title: string;
  organization: string;
  year: string;
  level: string;
  icon?: string;
}

export interface ResearchArea {
  title: string;
  description: string;
  icon: string;
  accent: string;
}
