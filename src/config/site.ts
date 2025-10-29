import {
  Award,
  Briefcase,
  BookOpen,
  Code2,
  Heart,
  Palette,
  Smartphone,
  Database,
  Layout,
  Zap,
  Layers,
  GitBranch,
  Server,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Workflow,
  FolderOpen,
  FileText,
  MessageSquare,
} from "lucide-react";

export const personalInfo = {
  name: "Somkid",
  fullName: "Somkid Sodsai",
  primaryTitle: "System Administrator",
  location: "Thailand",
  availability: "Open to new infrastructure and IT challenges",
  email: "somkid.sodsai@example.com",
  phone: "+66 80 000 0000",
  resumeUrl: "#",
  socialProfiles: {
    github: "https://github.com/somkidsodsai",
    linkedin: "https://www.linkedin.com/in/somkidsodsai",
    dribbble: "https://dribbble.com/somkidsodsai",
    email: "mailto:somkid.sodsai@example.com",
    twitter: "https://x.com/somkidsodsai",
  },
};

export const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "Project", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Certifications", path: "/certifications" },
];

export const heroContent = {
  badge: "Committed to reliable infrastructure",
  headline: "Hello, I'm Somkid Sodsai",
  highlight: "Somkid",
  subheadline: "System administrator keeping infrastructure stable while learning every day.",
  description:
    "I manage hybrid-cloud and on-prem environments end to end, from provisioning and automation to monitoring, response, and post-incident reviews so your teams can deploy with confidence.",
  primaryCta: { label: "Explore projects", href: "/portfolio" },
  secondaryCta: { label: "Download CV", href: "#" },
  socials: [
    { label: "GitHub", href: personalInfo.socialProfiles.github, icon: Github },
    { label: "LinkedIn", href: personalInfo.socialProfiles.linkedin, icon: Linkedin },
    { label: "Email", href: "mailto:somkid.sodsai@example.com", icon: Mail },
  ],
  stats: [
    { value: "99.95%", label: "Uptime maintained" },
    { value: "12+", label: "Automation playbooks delivered" },
    { value: "8 years", label: "Infrastructure experience" },
    { value: "24/7", label: "On-call reliability" },
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
    link: `tel:${personalInfo.phone.replace(/\s+/g, "")}`,
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
  { icon: Twitter, url: personalInfo.socialProfiles.twitter ?? "#", label: "X (Twitter)" },
];

export const aboutTimeline = [
  {
    year: "2021 - Present",
    title: "Senior System Administrator - Flowspace Logistics",
    company: "Flowspace Logistics",
    description:
      "Lead infrastructure operations across AWS and on-prem hardware, implementing Infrastructure as Code, high-availability clusters, and standardized incident workflows.",
  },
  {
    year: "2017 - 2021",
    title: "Systems Engineer - Line Leap Retail",
    company: "Line Leap Retail",
    description:
      "Owned Windows and Linux server estates, coordinated network upgrades across 20+ locations, and introduced centralized logging plus SIEM alerting.",
  },
  {
    year: "2014 - 2017",
    title: "IT Support Specialist - Brightlab Manufacturing",
    company: "Brightlab Manufacturing",
    description:
      "Supported production floor systems, deployed imaging pipelines, and reduced ticket response time by automating routine maintenance.",
  },
];

export const aboutEducation = [
  {
    degree: "M.Sc. Information Technology Management",
    school: "King Mongkut's University of Technology Thonburi",
    year: "2016 - 2018",
    description:
      "Researched hybrid-cloud governance, disaster recovery planning, and enterprise network architecture.",
  },
  {
    degree: "B.Eng. Computer Engineering",
    school: "Chiang Mai University",
    year: "2010 - 2014",
    description: "Specialized in systems administration, virtualization, and secure network design.",
  },
];

export const aboutValues = [
  {
    icon: ShieldCheck,
    title: "Reliability First",
    description:
      "Plan maintenance windows, test failovers, and harden baselines so teams can trust the infrastructure day or night.",
  },
  {
    icon: Server,
    title: "Automate with Care",
    description:
      "Use scripting, configuration management, and monitoring to remove toil without losing sight of edge cases.",
  },
  {
    icon: Workflow,
    title: "Collaborate Across Functions",
    description:
      "Partner with developers, security, and support so changes roll out smoothly and everyone has the same playbook.",
  },
  {
    icon: BookOpen,
    title: "Share What I Learn",
    description:
      "Document fixes, run quick knowledge sessions, and mentor teammates to keep the entire org moving forward together.",
  },
];

export const skillGroups = {
  technical: [
    { name: "Linux / Windows Server", level: 94, icon: Code2 },
    { name: "Cloud Infrastructure (AWS/Azure)", level: 90, icon: Layout },
    { name: "Networking & Firewalls", level: 92, icon: Zap },
    { name: "Automation (Ansible, PowerShell)", level: 91, icon: GitBranch },
    { name: "Container Platforms (Docker/K8s)", level: 88, icon: Layers },
    { name: "Virtualization (VMware/Hyper-V)", level: 86, icon: Database },
    { name: "Monitoring & Observability", level: 90, icon: Smartphone },
    { name: "Backup & DR Strategy", level: 92, icon: ShieldCheck },
  ],
  design: [
    { name: "ITIL Change Management", level: 90, icon: Workflow },
    { name: "Incident Response & RCA", level: 92, icon: ShieldCheck },
    { name: "Capacity Planning", level: 88, icon: Layout },
    { name: "Stakeholder Communication", level: 91, icon: Palette },
    { name: "Documentation & Runbooks", level: 95, icon: FileText },
    { name: "Team Coaching", level: 87, icon: Heart },
    { name: "Vendor Coordination", level: 85, icon: Briefcase },
    { name: "Budget Forecasting", level: 83, icon: Award },
  ],
  tools: [
    { name: "Terraform & CloudFormation", level: 88, icon: Layers },
    { name: "Ansible & PowerShell DSC", level: 90, icon: GitBranch },
    { name: "Grafana / Prometheus / Zabbix", level: 92, icon: Smartphone },
    { name: "Azure DevOps / GitHub Actions", level: 86, icon: Code2 },
    { name: "ServiceNow / Jira", level: 84, icon: Workflow },
    { name: "CrowdStrike / SentinelOne", level: 80, icon: ShieldCheck },
  ],
  soft: [
    { name: "Clear incident communication", level: 95 },
    { name: "Cross-team collaboration", level: 93 },
    { name: "Mentoring & coaching", level: 90 },
    { name: "Strategic planning", level: 89 },
    { name: "Systems thinking", level: 95 },
    { name: "Change management", level: 92 },
  ],
} as const;


export const learningFocus = [
  "SRE best practices",
  "Zero-trust architectures",
  "Cloud cost optimization",
  "Kubernetes platform engineering",
];

export const technologyLogos = [
  { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
  { name: "Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { name: "Windows Server", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" },
  { name: "Terraform", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
  { name: "Ansible", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "Grafana", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
  { name: "Prometheus", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "VMware", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vmware/vmware-original.svg" },
];

export const adminSkillDefaults = [
  { id: 1, name: "Infrastructure Automation", category: "Operations", level: 95 },
  { id: 2, name: "Hybrid Cloud Administration", category: "Engineering", level: 90 },
  { id: 3, name: "Incident Coordination", category: "Leadership", level: 93 },
  { id: 4, name: "Security Hardening", category: "Security", level: 88 },
] as const;

export const adminSettingsDefaults = {
  portfolioVisibility: "public",
  newsletterEnabled: true,
  autoReply: {
    enabled: true,
    message:
      "Khob khun for reaching out to Somkid! I typically reply within one business day. For urgent issues, call or message me at +66 61 234 567 8.",
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
