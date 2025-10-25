import {
  Award,
  Briefcase,
  Heart,
  GraduationCap,
  Code2,
  Palette,
  Smartphone,
  Database,
  Layout,
  Zap,
  Layers,
  GitBranch,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  FolderOpen,
  FileText,
  MessageSquare,
} from "lucide-react";

export const personalInfo = {
  name: "Batcat",
  fullName: "Batcat Chayanin",
  primaryTitle: "Product Design Lead & Creative Coder",
  location: "Bangkok, Thailand",
  availability: "Available for product collaborations Q1 2026",
  email: "hello@batcat.design",
  phone: "+66 61 234 5678",
  resumeUrl: "#",
  socialProfiles: {
    github: "https://github.com/hello-batcat",
    linkedin: "https://www.linkedin.com/in/hello-batcat",
    dribbble: "https://dribbble.com/hello-batcat",
    email: "mailto:hello@batcat.design",
  },
};

export const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Skills", path: "/skills" },
  { name: "Blog", path: "/blog" },
  { name: "Certifications", path: "/certifications" },
  { name: "Contact", path: "/contact" },
];

export const heroContent = {
  badge: "Designing clarity-first experiences",
  headline: "Sawasdee, I'm Batcat",
  highlight: "Batcat",
  subheadline: "Product design lead crafting knowledge-forward platforms for bold teams in APAC.",
  description:
    "I blend systems thinking, code, and storytelling to help product squads launch friendly, insight-rich journeys-from enterprise knowledge hubs to customer-facing dashboards.",
  primaryCta: { label: "View case studies", href: "/portfolio" },
  secondaryCta: { label: "Download CV", href: "#" },
  socials: [
    { label: "GitHub", href: "https://github.com/hello-batcat", icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/hello-batcat", icon: Linkedin },
    { label: "Email", href: "mailto:hello@batcat.design", icon: Mail },
  ],
  stats: [
    { value: "48+", label: "Product rollouts" },
    { value: "8 yrs", label: "Designing with teams" },
    { value: "36", label: "Workshops hosted" },
    { value: "98%", label: "Stakeholder satisfaction" },
  ],
};

export const contactCards = [
  {
    icon: Mail,
    title: "Email",
    content: personalInfo.email,
    link: `mailto:${personalInfo.email}`,
  },
  {
    icon: Phone,
    title: "Phone / LINE",
    content: personalInfo.phone,
    link: "tel:+66612345678",
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Bangkok & remote across APAC (GMT+7)",
  },
];

export const contactSocials = [
  { icon: Github, url: personalInfo.socialProfiles.github, label: "GitHub" },
  { icon: Linkedin, url: personalInfo.socialProfiles.linkedin, label: "LinkedIn" },
  { icon: Twitter, url: "https://x.com/batcatdesign", label: "X (Twitter)" },
];

export const aboutTimeline = [
  {
    year: "2022 - Present",
    title: "Product Design Lead · Flowspace",
    company: "Flowspace",
    description:
      "Leading a distributed team crafting knowledge platforms and design operations tooling across Asia-Pacific.",
  },
  {
    year: "2019 - 2022",
    title: "Design Systems Strategist · Line Leap",
    company: "Line Leap",
    description:
      "Launched cross-platform design tokens, accessibility playbooks, and weekly product critiques.",
  },
  {
    year: "2016 - 2019",
    title: "UX/UI Designer · Brightlab",
    company: "Brightlab",
    description:
      "Shipped progressive web apps, facilitated bilingual user research, and introduced rapid insight synthesis rituals.",
  },
];

export const aboutEducation = [
  {
    degree: "M.A. Service Design & Innovation",
    school: "Chulalongkorn University",
    year: "2014 - 2016",
    description:
      "Focused on knowledge systems, participatory research, and design facilitation for large organisations.",
  },
  {
    degree: "B.A. Communication Design",
    school: "King Mongkut's Institute of Technology",
    year: "2010 - 2014",
    description: "Explored interaction design, type systems, and storytelling for digital products.",
  },
];

export const aboutValues = [
  {
    icon: Heart,
    title: "Empathy Before Interfaces",
    description:
      "Every prototype starts with stories-listening deeply to the rituals that already work for people.",
  },
  {
    icon: Award,
    title: "Outcomes Over Output",
    description:
      "Design is successful when teams launch with confidence and customers feel seen, not when the UI looks shiny.",
  },
  {
    icon: Briefcase,
    title: "Co-create with Teams",
    description:
      "I bring product, data, and service design together, ensuring everyone owns the roadmap and results.",
  },
  {
    icon: GraduationCap,
    title: "Teach What You Ship",
    description:
      "I document patterns, run clinics, and coach so design grows as a shared capability-not a silo.",
  },
];

export const skillGroups = {
  technical: [
    { name: "React / Next.js", level: 92, icon: Code2 },
    { name: "TypeScript / JavaScript", level: 90, icon: Code2 },
    { name: "Information Architecture", level: 94, icon: Layout },
    { name: "Design Tokens", level: 88, icon: Layers },
    { name: "Node.js API design", level: 80, icon: Database },
    { name: "Data Visualization", level: 86, icon: Code2 },
    { name: "Research Synthesis", level: 92, icon: Zap },
    { name: "Experimentation Ops", level: 89, icon: GitBranch },
  ],
  design: [
    { name: "Figma", level: 96, icon: Palette },
    { name: "Design Systems", level: 94, icon: Layers },
    { name: "Content Design", level: 88, icon: Palette },
    { name: "Workshop Facilitation", level: 92, icon: Layout },
    { name: "Service Blueprinting", level: 90, icon: Zap },
    { name: "Prototype Testing", level: 93, icon: Smartphone },
    { name: "Accessibility Audits", level: 87, icon: Palette },
    { name: "Data Storytelling", level: 89, icon: Zap },
  ],
  tools: [
    { name: "Git / GitHub", level: 90, icon: GitBranch },
    { name: "Jira / Linear", level: 85, icon: Layers },
    { name: "Notion / Coda", level: 95, icon: Layout },
    { name: "Miro / FigJam", level: 93, icon: Palette },
    { name: "Playwright / Testing Library", level: 78, icon: Code2 },
    { name: "Sentry / Analytics", level: 82, icon: Database },
  ],
  soft: [
    { name: "Story-driven communication", level: 96 },
    { name: "Cross-cultural collaboration", level: 94 },
    { name: "Mentoring & coaching", level: 92 },
    { name: "Strategic facilitation", level: 90 },
    { name: "Systems thinking", level: 95 },
    { name: "Change management", level: 88 },
  ],
} as const;

export const learningFocus = [
  "AI-assisted prototyping",
  "Advanced localisation",
  "Systems coaching",
  "Edge rendering patterns",
];

export const technologyLogos = [
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "GraphQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "D3.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "Framer", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framer/framer-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
];

export const adminSkillDefaults = [
  { id: 1, name: "Design Systems Strategy", category: "Design", level: 95 },
  { id: 2, name: "React / Next.js", category: "Engineering", level: 90 },
  { id: 3, name: "Workshop Facilitation", category: "Leadership", level: 93 },
  { id: 4, name: "Research Ops", category: "Research", level: 88 },
] as const;

export const adminSettingsDefaults = {
  portfolioVisibility: "public",
  newsletterEnabled: true,
  autoReply: {
    enabled: true,
    message:
      "Khob khun for reaching out to Batcat! I typically reply within one business day. For urgent workshops, WhatsApp me at +66 61 234 567 8.",
  },
  integrations: {
    notion: true,
    linear: true,
    figma: true,
  },
};

export const adminQuickActions = [
  { label: "New Case Study", icon: FolderOpen },
  { label: "Write Post", icon: FileText },
  { label: "Add Credential", icon: Award },
  { label: "View Inbox", icon: MessageSquare },
];

export const certificationGroupLabels: Record<string, string> = {
  global: 'Global Certifications',
  course: 'Courses & Completed Programs',
};
