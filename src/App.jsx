import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Briefcase,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ServerCog,
  User,
} from 'lucide-react'

const profile = {
  name: 'Jose Perez Maysonet',
  title: 'IT Support Specialist | Production Control Analyst',
  location: 'Bayamon, Puerto Rico 00956',
  email: 'perezjose210100@gmail.com',
  phone: '(787) 322-1131',
}

const technicalSkills = [
  {
    category: 'Programming',
    items: ['Python', 'C#'],
  },
  {
    category: 'Web Development',
    items: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    category: 'Database Management',
    items: ['SQL'],
  },
  {
    category: 'Version Control',
    items: ['Git', 'GitHub'],
  },
  {
    category: 'IT & Systems',
    items: ['System Monitoring', 'Production Control', 'Basic Networking'],
  },
  {
    category: 'Tools',
    items: ['Microsoft Office Suite'],
  },
]

const professionalExperience = [
  {
    role: 'Production Control',
    company: 'Claro Puerto Rico',
    period: 'February 5, 2025 - Present',
    points: [
      'Monitor and validate production systems and operations.',
      'Escalate incidents and ensure operational continuity.',
      'Maintain logs and compliance documentation.',
      'Support internal teams by identifying and resolving system-related issues.',
      'Work in a high-responsibility corporate environment.',
    ],
  },
]

const projects = [
  {
    name: 'Digital Receipt System',
    company: 'NJ Printing / Shipleap',
    period: '2024',
    points: [
      'Developed a web-based digital receipt system for a hospital service provider.',
      'Designed front-end structure and implemented functional user input flows.',
      'Improved documentation workflow by replacing manual receipt processes.',
      'Applied structured logic to ensure data accuracy and organization.',
      'Collaborated with stakeholders to meet business requirements.',
    ],
  },
  {
    name: 'ChequePDF - Web-Based Check Generator',
    company: 'Independent Project',
    period: '2024',
    points: [
      'Developed a web application that generates printable checks in PDF format.',
      'Implemented financial calculations and structured form inputs.',
      'Integrated jsPDF for real-time PDF generation.',
      'Managed version control using GitHub.',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

function Section({ icon: Icon, title, children }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-2xl border border-white/10 bg-panel p-6 shadow-glass backdrop-blur-md md:p-8"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-2">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-100 md:text-2xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function App() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-8 shadow-glass backdrop-blur-md md:p-12"
      >
        <div className="pointer-events-none absolute -right-24 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
          Resume Portfolio
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-50 md:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-cyan-100 md:text-xl">{profile.title}</p>

        <div className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3">
            <MapPin className="h-4 w-4 text-cyan-300" /> {profile.location}
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-cyan-300/40"
          >
            <Mail className="h-4 w-4 text-cyan-300" /> {profile.email}
          </a>
          <a
            href="tel:+17873221131"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-cyan-300/40"
          >
            <Phone className="h-4 w-4 text-cyan-300" /> {profile.phone}
          </a>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3">
            <BadgeCheck className="h-4 w-4 text-cyan-300" /> Available for IT roles
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid gap-6 md:mt-10">
        <Section icon={User} title="Profile">
          <p className="leading-relaxed text-slate-300">
            Computer Science graduate with experience in IT operations,
            production control, and system support within a corporate
            telecommunications environment. Strong background in troubleshooting,
            process validation, and technical problem-solving. Experienced in
            developing real-world web applications that improve workflow
            efficiency.
          </p>
        </Section>

        <Section icon={Code2} title="Technical Skills">
          <div className="grid gap-4 md:grid-cols-2">
            {technicalSkills.map((skillGroup) => (
              <article
                key={skillGroup.category}
                className="rounded-xl border border-white/10 bg-slate-900/35 p-4"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
                  {skillGroup.category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section icon={Briefcase} title="Professional Experience">
          <div className="relative ml-1 border-l border-cyan-300/20 pl-6">
            {professionalExperience.map((job, index) => (
              <motion.article
                key={`${job.company}-${job.role}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="relative"
              >
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border border-cyan-200/40 bg-cyan-300" />
                <h3 className="text-lg font-semibold text-slate-100">
                  {job.role} - {job.company}
                </h3>
                <p className="text-sm text-cyan-100/80">{job.period}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section icon={ServerCog} title="Projects">
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="rounded-xl border border-white/10 bg-slate-900/35 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-100">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-cyan-100/80">
                  {project.company} | {project.period}
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section icon={GraduationCap} title="Education">
          <div className="rounded-xl border border-white/10 bg-slate-900/35 p-5">
            <h3 className="text-lg font-semibold text-slate-100">
              Bachelor&apos;s Degree in Computer Science
            </h3>
            <p className="mt-1 text-slate-300">
              Universidad Interamericana de Puerto Rico
            </p>
            <p className="mt-1 text-sm text-cyan-100/80">2019-2024</p>
          </div>
        </Section>

        <Section icon={Mail} title="Contact">
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-slate-100 transition hover:bg-cyan-300/20"
            >
              <p className="text-sm uppercase tracking-wide text-cyan-100/80">
                Email
              </p>
              <p className="mt-1 font-medium">{profile.email}</p>
            </a>
            <a
              href="tel:+17873221131"
              className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-slate-100 transition hover:bg-cyan-300/20"
            >
              <p className="text-sm uppercase tracking-wide text-cyan-100/80">
                Phone
              </p>
              <p className="mt-1 font-medium">{profile.phone}</p>
            </a>
          </div>
        </Section>
      </div>
    </main>
  )
}

export default App
