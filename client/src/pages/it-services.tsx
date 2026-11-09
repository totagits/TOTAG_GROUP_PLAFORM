import { useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, BarChart3, Check, Cloud, Code2, Cpu,
  ExternalLink, GraduationCap, Laptop, Mail, MapPin, Phone, School, Settings, Shield, Zap,
} from "lucide-react";
import Header from "@/components/header";
import SchoolPlatformDemo from "@/components/school-platform-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  features: string[];
  technologies: string[];
  colorClass: { iconBg: string; iconText: string };
}

const services: Service[] = [
    {
      id: "custom-software",
      title: "Custom Software Development",
      description: "Tailored web and mobile applications, enterprise systems (ERP, CRM, HRMIS), API integrations, and legacy system modernization.",
      icon: Code2,
      features: [
        "Web and Mobile Applications",
        "Enterprise Systems (ERP, CRM, HRMIS)",
        "API & Microservices Integrations", 
        "Legacy System Modernization",
        "Multi-tenant Architecture Solutions",
        "Integration with Third-party Systems"
      ],
      technologies: ["React", "Node.js", "Python", "Java", "Swift", "Kotlin", "PostgreSQL", "MongoDB"],
      colorClass: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
      }
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud & Infrastructure Solutions",
      description: "Comprehensive cloud migration (AWS, Azure, hybrid), virtualization, containerization, DevOps, and disaster recovery planning.",
      icon: Cloud,
      href: "/it-services/cloud-infrastructure",
      features: [
        "Cloud Migration (AWS, Azure, Hybrid Solutions)",
        "Virtualization & Containerization (Docker, Kubernetes)",
        "DevOps and CI/CD Pipelines",
        "Disaster Recovery & Business Continuity Planning",
        "Infrastructure as Code",
        "Network Architecture & Security"
      ],
      technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI"],
      colorClass: {
        iconBg: "bg-sky-100",
        iconText: "text-sky-600",
      }
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Compliance",
      description: "Advanced security solutions including penetration testing, identity management, SIEM integration, and data privacy compliance.",
      icon: Shield,
      href: "/it-services/cybersecurity",
      features: [
        "Penetration Testing & Vulnerability Assessments",
        "Identity & Access Management",
        "SIEM Integration & Monitoring",
        "Data Privacy and Regulatory Compliance Solutions",
        "Incident Response & Forensics",
        "Security Awareness Training"
      ],
      technologies: ["Splunk", "CrowdStrike", "Okta", "Nessus", "Wireshark", "Metasploit", "OWASP", "NIST"],
      colorClass: {
        iconBg: "bg-red-100",
        iconText: "text-red-600",
      }
    },
    {
      id: "managed-it-services",
      title: "Managed IT Services",
      description: "Comprehensive 24/7 IT support including network monitoring, help desk, vendor management, and ITIL-aligned operations.",
      icon: Settings,
      features: [
        "24/7 Network and Server Monitoring",
        "IT Help Desk and Remote Support",
        "Vendor and License Management",
        "ITIL-aligned Change and Incident Management",
        "IT Asset Management",
        "Service Level Agreement (SLA) Management"
      ],
      technologies: ["ServiceNow", "ITSM", "Monitoring Tools", "RMM", "SIEM", "Backup Solutions"],
      colorClass: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
      }
    },
    {
      id: "data-analytics",
      title: "Data & Analytics",
      description: "Advanced data warehousing, business intelligence dashboards, predictive analytics, and GIS mapping solutions.",
      icon: BarChart3,
      features: [
        "Data Warehousing & ETL Pipelines",
        "Business Intelligence Dashboards",
        "Predictive Analytics and Reporting",
        "GIS Mapping and Spatial Data Analysis",
        "Machine Learning & AI Development",
        "Big Data Processing"
      ],
      technologies: ["Python", "R", "TensorFlow", "Power BI", "Tableau", "Apache Spark", "Hadoop", "SQL"],
      colorClass: {
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
      }
    },
    {
      id: "digital-transformation",
      title: "Digital Transformation & Emerging Technologies",
      description: "Strategic process automation (RPA), IoT solutions, blockchain concepts, and comprehensive digital strategy consulting.",
      icon: Zap,
      features: [
        "Process Automation (RPA)",
        "Internet of Things (IoT) Solutions",
        "Blockchain Proof-of-concepts",
        "Digital Strategy and Consulting",
        "Technology Assessment & Roadmapping",
        "Performance Optimization"
      ],
      technologies: ["RPA Tools", "IoT Platforms", "Blockchain", "TOGAF", "ITIL", "Agile", "Scrum", "PMI"],
      colorClass: {
        iconBg: "bg-green-100",
        iconText: "text-green-600",
      }
    },
    {
      id: "saas-enterprise-platform",
      title: "SaaS Enterprise Platform",
      description: "Comprehensive 14-module FIMS & HRMIS cloud-based enterprise software suite designed for multi-tenant organizations with Liberian payment integration.",
      icon: Laptop,
      href: "/saas",
      features: [
        "14 Modular FIMS & HRMIS Platform ($20/month per module)",
        "Minimum 4 modules required, 10% discount for all modules",
        "Multi-tenant Architecture with Liberian Payment Integration",
        "Real-time Analytics & Reporting",
        "Mobile-first Employee Self-Service Portal",
        "Biometric Integration & Attendance Management",
        "Complete HR Lifecycle Management",
        "Financial Management & Compliance"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "Multi-tenant SaaS", "Mobile Money", "Biometrics", "Real-time Analytics"],
      colorClass: {
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
      }
    },
    {
      id: "training-capacity-building",
      title: "Training & Capacity Building",
      description: "Certified technical workshops, IT literacy programs, custom bootcamps, and mentorship programs to enhance team capabilities.",
      icon: GraduationCap,
      href: "/it-services/training-capacity-building",
      features: [
        "Certified Technical Workshops (Cloud, Security, Software Dev)",
        "End-user IT Literacy Programs",
        "Custom Bootcamps for Organizations",
        "Mentorship and Internship Programs",
        "Train-the-Trainer Programs",
        "Skills Assessment & Career Development"
      ],
      technologies: ["Azure", "AWS", "Cisco", "Docker", "Kubernetes", "React", "Python", "DevOps", "Agile", "ITIL"],
      colorClass: {
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
      }
    },
    {
      id: "school-management",
      title: "School Websites & Management Systems",
      description: "A public website for families and a management workspace for school staff, configured around your branding, programs and operations.",
      icon: School,
      features: [
        "Public school website and admissions information",
        "Application review and entrance examination workflows",
        "Attendance, class records and staff workspaces",
        "General education and TVET program catalogs",
        "School branding and configurable departments",
        "Student and guardian portals"
      ],
      technologies: ["School website", "Admissions", "Attendance", "TVET", "Staff workspace", "Family portals"],
      colorClass: { iconBg: "bg-teal-100", iconText: "text-teal-800" }
    }
  ];

const schoolService = services.find(service => service.id === "school-management")!;
const contactEmail = "tis@totaggroup.com";

type Panel = { kind: "details" | "demo"; service: Service } | { kind: "quote"; service?: Service };

function QuoteForm({ service }: { service?: Service }) {
  const [draftPrepared, setDraftPrepared] = useState(false);

  function prepareDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const offering = services.find(item => item.id === fields.get("service"))?.title ?? "IT Services";
    const subject = encodeURIComponent(`Quote request | ${offering}`);
    const body = encodeURIComponent([
      `Offering: ${offering}`,
      `Name: ${fields.get("name")}`,
      `Reply email: ${fields.get("email")}`,
      `Organization: ${fields.get("organization") || "Not provided"}`,
      "",
      String(fields.get("requirements")),
    ].join("\r\n"));
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setDraftPrepared(true);
  }

  return (
    <form onSubmit={prepareDraft} className="space-y-5" onChange={() => setDraftPrepared(false)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="quote-name">Your name</Label><Input id="quote-name" name="name" autoComplete="name" maxLength={80} required /></div>
        <div className="space-y-2"><Label htmlFor="quote-email">Email</Label><Input id="quote-email" name="email" type="email" autoComplete="email" maxLength={120} required /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="quote-org">School or organization (optional)</Label><Input id="quote-org" name="organization" autoComplete="organization" maxLength={100} /></div>
      <div className="space-y-2">
        <Label htmlFor="quote-service">Offering</Label>
        <select id="quote-service" name="service" defaultValue={service?.id ?? ""} required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
          <option value="" disabled>Choose an offering</option>
          {services.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quote-requirements">Tell us about your project</Label>
        <Textarea id="quote-requirements" name="requirements" rows={4} required maxLength={1000}
          placeholder={service?.id === schoolService.id ? "School location, programs, branding and features you need" : "Your requirements, goals and preferred timeline"} />
      </div>
      <p className="text-sm text-muted-foreground">Keep passwords, student records and other private information out of your message.</p>
      <Button type="submit" className="bg-teal-800 text-white hover:bg-teal-900"><Mail className="mr-2 h-4 w-4" aria-hidden="true" /> Open email draft</Button>
      {draftPrepared && <p className="text-sm text-muted-foreground" role="status">Send the draft from your email app. You can also email <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.</p>}
    </form>
  );
}

export default function ITServicesPortal() {
  const [panel, setPanel] = useState<Panel | null>(null);
  const catalogHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const primary = "bg-teal-800 text-white hover:bg-teal-900";

  function openPanel(next: Panel, event: React.MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setPanel(next);
  }

  function closePanel() {
    setPanel(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-9 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">TOTAG Group · Technology</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">IT Services &amp; SaaS Platform</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Explore software, infrastructure and managed services for businesses, schools and public institutions.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-teal-300 text-slate-950 hover:bg-teal-200" onClick={() => catalogHeading.current?.focus()}>
                  Browse offerings <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" className="border-slate-400 bg-transparent text-white hover:bg-slate-800 hover:text-white"
                  onClick={event => openPanel({ kind: "quote" }, event)}>Get Quote</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Explore TOTAG</p>
              <h2 className="mt-3 text-2xl font-semibold">Enterprise software and services</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Browse the service catalog or explore the Finance and HR SaaS platform.</p>
              <a href="/saas" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:underline">
                Explore the SaaS platform <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">Service catalog</p>
          <h2 ref={catalogHeading} tabIndex={-1} className="mt-3 scroll-mt-24 text-3xl font-bold tracking-tight text-slate-950 focus:outline-none sm:text-4xl">Products &amp; Services</h2>
          <p className="mt-3 text-slate-600">Select an offering to see what it includes and request a quote.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <button key={service.id} type="button" aria-label={`View details for ${service.title}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                onClick={event => openPanel({ kind: "details", service }, event)}>
                <span className={`grid h-11 w-11 place-items-center rounded-lg ${service.colorClass.iconBg} ${service.colorClass.iconText}`}>
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-4 text-lg font-semibold text-slate-950">{service.title}</span>
                <span className="mb-5 mt-2 flex-1 text-sm leading-6 text-slate-600">{service.description}</span>
                <span className="flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-teal-800">
                  View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">Talk to our team</h2>
              <p className="mb-5 mt-3 text-slate-600">Share what you want to build, improve or support.</p>
              <Button className={primary} onClick={event => openPanel({ kind: "quote" }, event)}>Get Quote</Button>
            </div>
            <address className="space-y-3 text-sm not-italic leading-6 text-slate-700">
              <a className="flex items-center gap-3 hover:underline" href={`mailto:${contactEmail}`}><Mail className="h-4 w-4 text-teal-800" aria-hidden="true" />{contactEmail}</a>
              <a className="flex items-center gap-3 hover:underline" href="tel:+231777666999"><Phone className="h-4 w-4 text-teal-800" aria-hidden="true" />+231-777-666-999</a>
              <p className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-teal-800" aria-hidden="true" />Guest House Road, Thinker’s Village Community, Paynesville, Montserrado, Liberia</p>
              <p>Monday–Friday, 8:00 AM–6:00 PM · Saturday, 9:00 AM–2:00 PM</p>
            </address>
          </div>
        </section>
      </main>

      <Dialog open={panel?.kind === "details" || panel?.kind === "quote"} onOpenChange={open => { if (!open) closePanel(); }}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] overflow-y-auto rounded-xl sm:max-w-3xl"
          onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}>
          {panel?.kind === "details" && (
            <>
              <DialogHeader className="gap-3 pr-6">
                <span className={`grid h-11 w-11 place-items-center rounded-lg ${panel.service.colorClass.iconBg} ${panel.service.colorClass.iconText}`}>
                  <panel.service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <DialogTitle className="text-2xl">{panel.service.title}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">{panel.service.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 font-semibold">What’s included</h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {panel.service.features.map(feature => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-800" aria-hidden="true" />{feature}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">{panel.service.id === schoolService.id ? "Capabilities" : "Technologies & tools"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {panel.service.technologies.map(technology => <Badge key={technology} variant="outline">{technology}</Badge>)}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button className={primary} onClick={() => setPanel({ kind: "quote", service: panel.service })}>Get Quote</Button>
                {panel.service.id === schoolService.id &&
                  <Button variant="outline" onClick={() => setPanel({ kind: "demo", service: panel.service })}>View a demo</Button>}
                {panel.service.href && <Button variant="outline" asChild><a href={panel.service.href}>Explore offering <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a></Button>}
                <Button variant="ghost" onClick={closePanel}>Close details</Button>
              </div>
            </>
          )}
          {panel?.kind === "quote" && (
            <>
              <DialogHeader className="pr-6">
                <DialogTitle className="text-2xl">Request a Quote</DialogTitle>
                <DialogDescription>Prepare an email to TOTAG about {panel.service?.title ?? "the offering you’re interested in"}.</DialogDescription>
              </DialogHeader>
              <QuoteForm key={panel.service?.id ?? "general"} service={panel.service} />
              {panel.service && <Button variant="ghost" className="justify-self-start"
                onClick={() => setPanel({ kind: "details", service: panel.service! })}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to offering
              </Button>}
            </>
          )}
        </DialogContent>
      </Dialog>
      <SchoolPlatformDemo open={panel?.kind === "demo"} requestLabel="Get Quote"
        onOpenChange={open => { if (!open) setPanel({ kind: "details", service: schoolService }); }}
        onRequest={() => setPanel({ kind: "quote", service: schoolService })} />
    </div>
  );
}
