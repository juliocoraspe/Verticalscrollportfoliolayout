import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ScrollSection } from './components/ScrollSection';
import { CaseStudy } from './components/CaseStudy';
import { ProjectCard } from './components/ProjectCard';
import { ExploratoryGallery } from './components/ExploratoryGallery';
import { ExternalPreviewLink } from './components/ExternalPreviewLink';
import { AnimatedParagraph } from './components/AnimatedParagraph';
import bannerCaseStudy from '../assets/images/banner-case-study.png';
import todoBanner from '../assets/images/todo-banner2.png';
import asmrBanner from '../assets/images/asmr-banner2.png';
import spotsBanner from '../assets/images/spots-banner.png';
import moodboard from '../assets/images/moodboard.png';

type View = 'main' | 'garden';

const RESUME_URL = '<GOOGLE_DRIVE_LINK_PLACEHOLDER>';
const ABOUT_ME_PARAGRAPHS = [
  'I was born in Venezuela currently live in the Midwest of the United States. I graduated as a lawyer, a background that shaped how I think about systems and structure. Today, I work at the intersection of creative practice and technology, designing and building digital products. I speak Spanish, English, and I plan to start learning French in 2026. I find meaning in contemplation and in what takes time.',
  'My creative profile is strongly visual, spanning photography (digital, mobile, and film, including film development and digitization), videography, professional editing, digital drawing, generative art through code, and motion design. These practices share a common thread: patience, process, and attention to detail. Exploring them has been less about collecting skills and more about developing craft, curiosity, and a lasting commitment to learning and making things with care.',
  'I have a strong fascination with artificial intelligence as a creative and procedural tool. I see it as an extension of thought and making—something that amplifies research, exploration, and execution rather than replacing them. I work with AI through prompt and context engineering, using it generatively for research, coding, and audiovisual experimentation, including local LLM setups and custom tooling such as code editor assistants and Figma plugins. This approach allows me to work with AI in a more intentional, productive, and secure way.',
];

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [view, setView] = useState<View>('main');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const aboutTextInView = useInView(aboutTextRef, { once: true, amount: 0.35, margin: '-120px' });
  const aboutStagger = 0.045;
  const aboutBaseDelay = 0.12;
  const aboutParagraphPause = 0.3;
  const aboutWordOffsets = useMemo(() => {
    let offset = 0;
    return ABOUT_ME_PARAGRAPHS.map((paragraph) => {
      const startIndex = offset;
      offset += paragraph.trim().split(/\s+/).length;
      return startIndex;
    });
  }, []);
  const heroLines = [
    'I design interfaces where behavior and systems matter.',
    'Grounded in research, prototyping, and sometimes, implementation.',
  ];
  const heroText = heroLines.join(' ');
  const heroContainerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };
  const heroWordVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.2, 0.7, 0.2, 1],
      },
    },
  };

  const caseStudy = {
    title: 'STILLEN: A Curated Furniture Experience',
    role: 'UX/UI designer',
    timeline: '2025',
    summary:
      'Designed a guided furniture e-commerce experience that enables users to visualize furniture at scale, understand fit and delivery, and complete purchases with confidence.',
    heroImage: bannerCaseStudy,
    problem: {
      title: 'Problem',
      description:
        'The experience creates friction and mistrust due to unclear delivery and availability information, navigation issues at critical moments, and a lack of tools that help users understand product scale, fit, and suitability in their real spaces.',
    },
    process: {
      title: 'Process',
      description:
        'Led qualitative research to understand how users evaluate furniture, manage uncertainty, and build confidence before purchase.',
      steps: [
        'Audited competitor experiences to identify systemic gaps in transparency, guidance, and visualization.',
        'Translated insights into personas and journey maps highlighting key decision and hesitation points',
        'Grounded design decisions in research findings to reduce friction and support confident purchasing.',
      ],
    },
    exploration: {
      title: 'Research Translation & Validation',
      description:
        'Usability testing confirmed that guided flows and clearer product detail layouts supported intuitive navigation and confident decision-making. Visualization features strongly influenced purchase confidence, while areas with higher visual density revealed opportunities to further improve hierarchy and scanability',
      images: [
        'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY2NTE2OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1694878981955-1d8348e0f1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwaW50ZXJmYWNlJTIwc2NyZWVufGVufDF8fHx8MTc2NjU0Mjc3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    solution: {
      title: 'Solution',
      description:
        'Delivered a research-validated, high-fidelity furniture e-commerce experience that reinforces transparency, guidance, and confident decision-making across high-value purchases.',
      outcomes: [
        'Reduced uncertainty during product evaluation by surfacing shipping, availability, and delivery timelines consistently across product and checkout experiences.',
        'Strengthened purchase confidence by validating a dedicated visualization experience that helps users understand scale, fit, and placement before committing.',
        'Improved high-commitment decision readiness by routing purchases through a deliberate cart and checkout flow, reducing impulsive actions and reinforcing trust.',
      ],
    },
    prototype: {
      title: 'Figma Prototype',
      embedUrl:
        'https://embed.figma.com/design/j53F6cGj6FfpQISnyeSRMd/Julio-Coraspe-Project-10?node-id=269-4025&embed-host=share',
      externalUrl: 'https://www.figma.com/design/j53F6cGj6FfpQISnyeSRMd/Julio-Coraspe-Project-10?node-id=269-4025',
    },
  };

  const projects = [
    {
      id: 'todo-app',
      title: 'To-Do App',
      intent: 'Research-driven task flow designed to reduce overwhelm for early-career professionals.',
      role: 'UX Research, UI Design',
      imageUrl: todoBanner,
      tags: ['Research', 'UX Flow', 'UI Systems'],
      context:
        'Designed as a compact study in reducing task anxiety for busy students and early-career professionals.',
      problem:
        'Existing to-do tools felt either too rigid or overly playful, undermining trust in day-to-day planning.',
      process: [
        'Mapped friction points from onboarding to daily capture.',
        'Sketched low-friction prioritization patterns for short sessions.',
        'Prototyped a three-stage rhythm: capture, prioritize, release.',
      ],
      solution:
        'A pared-back task system with gentle hierarchy, clear completion feedback, and zero visual noise.',
      outcome: [
        'Reduced task drop-off during onboarding',
        'Improved weekly task completion cadence',
      ],
      experienceUrl: '/projects/todo-app/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
      prototypeUrl:
        'https://embed.figma.com/slides/RCRXoEB4h7yTAKYjiK1Rx6/ToDo-Research?node-id=1-360&embed-host=share',
      demoLabel: 'Demo / code link placeholder',
      demoUrl: undefined,
    },
    {
      id: 'asmr-app',
      title: 'ASMR App',
      intent: 'Sensory-led interface exploration focused on calm transitions and ambient sound control.',
      role: 'Visual Design, Interaction',
      imageUrl: asmrBanner,
      imageFit: 'contain' as const,
      tags: ['UI Craft', 'Motion', 'Prototyping'],
      context:
        'Explored how motion-aware interfaces can support quiet rituals and sensory balance.',
      problem:
        'Most ASMR apps feel cluttered or overly decorative, which interrupts calm listening.',
      process: [
        'Studied ambient UI patterns and low-light accessibility.',
        'Built a tonal grid for mixing sound layers without visual overload.',
        'Prototyped transitions that feel slow, steady, and intentional.',
      ],
      solution:
        'A minimal sound studio with restrained transitions, designed to keep focus on the audio experience.',
      outcome: [
        'Clearer path from browse to mix',
        'Reduced UI fatigue during extended sessions',
      ],
      experienceUrl: '/projects/asmr-app/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the audio demo or motion study.',
      prototypeUrl:
        'https://embed.figma.com/design/fYwhBS4WdU21aEjBQKEGVl/Julio-Coraspe-Lumn?node-id=0-1&embed-host=share',
      demoLabel: 'Demo / code link placeholder',
      demoUrl: undefined,
    },
    {
      id: 'frontend-redesign',
      title: 'Frontend Redesign',
      intent: 'Interface refresh for an existing product, balancing legacy constraints with modern accessibility.',
      role: 'Frontend, UI Design',
      imageUrl: moodboard,
      imagePosition: 'top' as const,
      tags: ['Frontend', 'Refactor', 'Accessibility'],
      context:
        'A production redesign focused on clarity and maintainability while respecting existing constraints.',
      problem:
        'Legacy UI patterns were inconsistent, with low contrast and unpredictable layout behavior.',
      process: [
        'Audited the component system for semantic and accessibility gaps.',
        'Refactored layout logic for consistent grid behavior.',
        'Validated contrast and focus states across critical workflows.',
      ],
      solution:
        'A clean, accessible UI framework that supports iterative delivery and stable performance.',
      outcome: [
        'Reduced layout regressions after releases',
        'Higher contrast compliance across key views',
      ],
      experienceUrl: '/projects/frontend-redesign/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the coded prototype or live build.',
      prototypeUrl:
        'https://embed.figma.com/design/QFyh4I1PE2qzy5hOSgDvgL/Spots-ReDesign?node-id=0-1&embed-host=share',
      demoLabel: 'Demo / code link placeholder',
      demoUrl: undefined,
    },
  ];

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;

  const gardenItems = [
    {
      title: 'Morphic Button States',
      category: 'UI Components',
      imageUrl:
        '../src/assets/images/banner-case-study-1.png',
      description: 'Exploring organic state transitions for interactive elements.',
    },
    {
      title: 'AI-Generated Textures',
      category: 'Generative AI',
      imageUrl:
        'https://images.unsplash.com/photo-1610337673044-720471f83677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjY1NDI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Parametric Grid System',
      category: 'Creative Coding',
      imageUrl:
        'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHBhdHRlcm58ZW58MXx8fHwxNzY2NTEyMTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Fluid Typography System',
      category: 'Design System',
      imageUrl:
        'https://images.unsplash.com/photo-1615746363486-92cd8c5e0a90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVSSUyMGNvbXBvbmVudHN8ZW58MXx8fHwxNzY2NTQyNzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Responsive type scales with motion-driven hierarchy.',
    },
    {
      title: 'Neural Network Visualization',
      category: 'Data Viz',
      imageUrl:
        'https://images.unsplash.com/photo-1655271739682-61b7ce27706e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5lcmF0aXZlJTIwYXJ0fGVufDF8fHx8MTc2NjU0Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Micro-interaction Library',
      category: 'Animation',
      imageUrl:
        'https://images.unsplash.com/photo-1505304451-3b3b85a91afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNvZGluZ3xlbnwxfHx8fDE3NjY1MTI4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Curated collection of purposeful UI animations.',
    },
    {
      title: 'Prompted Interface Atlas',
      category: 'Prompt Engineering',
      imageUrl:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9tcHQlMjBlbmdpbmVlcmluZ3xlbnwwfHx8MTc2NjU1NDYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Mapping prompt strategies for calm interface exploration.',
    },
    {
      title: 'Interaction Tempo Study',
      category: 'Interaction Design',
      imageUrl:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmFjdGlvbiUyMGRlc2lnbnxlbnwwfHx8MTc2NjU1NDYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Exploring pacing, pauses, and intentional waiting states.',
    },
    {
      title: 'Ambient Spatial UI',
      category: 'Spatial',
      imageUrl:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzcGF0aWFsJTIwZGVzaWdufGVufDB8fHx8MTc2NjU1NDY0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A study in quiet spatial depth and low-contrast framing.',
    },
  ];

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#garden') {
        setView('garden');
        requestAnimationFrame(() => window.scrollTo(0, 0));
      } else {
        setView('main');
        requestAnimationFrame(() => window.scrollTo(0, scrollPositionRef.current));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const enterGarden = () => {
    scrollPositionRef.current = window.scrollY;
    window.location.hash = 'garden';
  };

  const exitGarden = () => {
    window.location.hash = '';
  };

  if (view === 'garden') {
    return (
      <div className="min-h-screen bg-cloud text-ink">
        <div className="max-w-7xl mx-auto px-8 pt-10">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              exitGarden();
            }}
            className="type-meta text-accent uppercase"
          >
            ← Return to Portfolio
          </a>
        </div>
        <ExploratoryGallery items={gardenItems} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-pure text-ink">
      <section className="min-h-screen flex items-center px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <p className="type-subhead text-dark uppercase">Julio Coraspe • UX/UI Designer</p>

          <motion.h1
            className="type-display-xl text-ink"
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            aria-label={heroText}
          >
            {heroLines.map((line, lineIndex) => {
              const words = line.split(' ');
              return (
                <span key={line} className="block">
                  {words.map((word, wordIndex) => (
                    <motion.span
                      key={`${lineIndex}-${wordIndex}`}
                      variants={heroWordVariants}
                      className="inline-block"
                      aria-hidden="true"
                    >
                      {word}
                      {wordIndex < words.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            className="type-subhead text-dark max-w-3xl"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.36,
              delay: shouldReduceMotion ? 0 : 0.12,
              ease: [0.19, 1, 0.3, 1],
            }}
          >
     Design-led, obsessed with translating research insights into design decisions.
Occasionally following ideas into reality when questions remain.
          </motion.p>

          <div className="max-w-md border-y border-pale divide-y divide-pale">
            <a
              href="#case-study"
              className="type-micro uppercase text-ink py-4 flex items-center justify-between w-full"
            >
              View Case Study
              <span className="type-micro text-dark">01</span>
            </a>
            <a
              href="#projects"
              className="type-micro uppercase text-ink py-4 flex items-center justify-between w-full"
            >
              Explore Projects
              <span className="type-micro text-dark">02</span>
            </a>
            <button
              type="button"
              onClick={enterGarden}
              className="type-micro uppercase text-accent py-4 flex items-center justify-between w-full"
            >
              <span>
                Enter <span className="text-accent">Garden</span>
              </span>
              <span className="type-micro text-dark">03</span>
            </button>
            <a
              href="#contact"
              className="type-micro uppercase text-ink py-4 flex items-center justify-between w-full"
            >
              Contact
              <span className="type-micro text-dark">04</span>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-32 px-8 bg-pure">
        <div className="max-w-6xl mx-auto">
          <ScrollSection entryDirection="bottom" motionRole="about-title">
            <h2 className="type-display-m text-ink">Practice</h2>
          </ScrollSection>

          <div className="mt-12 border-t border-pale divide-y divide-pale md:divide-y-0 md:divide-x md:grid md:grid-cols-3">
            {[
              {
                title: 'Design Philosophy',
                body:
                  'I start by understanding the full problem, not just the surface. I like connecting research, creativity, and accessibility to make decisions that feel intentional, grounded, and genuinely useful, not just visually appealing.',
              },
              {
                title: 'What I Do Well',
                body:
                  'I’m good at turning complex problems into clear, structured systems. I work across researching, prototyping, and testing, often exploring ideas early to understand how things behave before committing to a final direction',
              },
              {
                title: 'Hybrid Practice',
                body:
                  'My practice extends beyond traditional design, combining creative disciplines with technical exploration. This hybrid perspective allows me to prototype realistically, experiment with interactions, and design systems that translate cleanly into maintainable products.',
              },
            ].map((item, index) => (
              <ScrollSection
                key={item.title}
                entryDirection="bottom"
                delay={index * 0.06}
                motionRole="about-paragraph"
              >
                <div className="py-8 md:px-8 h-full">
                  <p className="type-section-title text-dark uppercase mb-4">{item.title}</p>
                  <p className="type-body text-ink">{item.body}</p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      <CaseStudy {...caseStudy} />

      <section id="projects" className="py-32 px-8 bg-pure">
        <div className="max-w-6xl mx-auto">
          <ScrollSection entryDirection="bottom" motionRole="project-grid">
            <div className="mb-16">
              <p className="type-meta text-dark uppercase mb-4">Projects</p>
              <h2 className="type-display-m text-ink mb-4">Focused Explorations</h2>
              <p className="type-subhead text-dark max-w-2xl">
                Three focused studies that explore different entry points into the design lifecycle:research-led, concept-driven, and refinement-focused.
              </p>
            </div>
          </ScrollSection>

          <div className="border-b border-pale">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                intent={project.intent}
                role={project.role}
                imageUrl={project.imageUrl}
                imageFit={project.imageFit}
                imagePosition={project.imagePosition}
                tags={project.tags}
                onOpen={() => setActiveProjectId(project.id)}
                delay={index * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-50 bg-pure text-ink overflow-y-auto no-scrollbar"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setActiveProjectId(null)}
          >
            <button
              type="button"
              onClick={() => setActiveProjectId(null)}
              className="absolute right-6 top-6 type-meta text-accent uppercase flex items-center gap-2"
              aria-label="Close project details"
            >
              <span aria-hidden="true">×</span>
              Close
            </button>
            <motion.div
              className="relative max-w-6xl mx-auto px-8 py-16"
              initial={shouldReduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.4, 0, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="border-b border-pale pb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <p className="type-meta text-dark uppercase">Project</p>
                  <h3 className="type-display-l text-ink">{activeProject.title}</h3>
                  <p className="type-subhead text-dark">{activeProject.role}</p>
                </div>
              </div>

              <div className="mt-10 grid md:grid-cols-[220px_1fr] gap-8 items-start border-b border-pale pb-10">
                <div className="border border-pale">
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                    className={`w-full h-32 ${
                      activeProject.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                    } ${
                      activeProject.imagePosition === 'top'
                        ? 'object-top'
                        : activeProject.imagePosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-center'
                    }`}
                  />
                </div>
                <p className="type-body text-ink">{activeProject.intent}</p>
              </div>

              <div className="mt-12 space-y-12">
                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title text-dark uppercase">Context</p>
                  <p className="type-body text-ink">{activeProject.context}</p>
                </section>

                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title text-dark uppercase">Problem</p>
                  <p className="type-body text-ink">{activeProject.problem}</p>
                </section>

                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title text-dark uppercase">Process</p>
                  <div className="space-y-4">
                    {activeProject.process.map((step) => (
                      <p key={step} className="type-body text-ink border-b border-pale pb-3">
                        {step}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title text-dark uppercase">Solution</p>
                  <p className="type-body text-ink">{activeProject.solution}</p>
                </section>

                <section className="grid md:grid-cols-[200px_minmax(0,1fr)_240px] gap-8 border-t border-pale pt-6 items-start">
                  <p className="type-section-title text-dark uppercase">Outcome</p>
                  <div className="space-y-3">
                    {activeProject.outcome.map((item) => (
                      <p key={item} className="type-body text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                  <ExternalPreviewLink
                    helperText={activeProject.experienceHelper}
                    href={activeProject.experienceUrl}
                    thumbnailSrc={activeProject.experienceThumbnail}
                  />
                </section>

                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title uppercase text-accent">Prototype</p>
                  <div className="border border-pale">
                    {activeProject.prototypeUrl ? (
                      <div className="aspect-video w-full border-b border-pale bg-pure">
                        <iframe
                          title={`${activeProject.title} prototype`}
                          src={activeProject.prototypeUrl}
                          className="w-full h-full"
                          loading="lazy"
                          allow="fullscreen"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full border-b border-pale bg-pure flex items-center justify-center text-center p-6">
                        <p className="type-body text-dark">{activeProject.prototypeLabel}</p>
                      </div>
                    )}
                    <div className="p-6 flex flex-wrap gap-6">
                      {activeProject.demoUrl ? (
                        <a
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-meta uppercase text-accent"
                        >
                          {activeProject.demoLabel}
                        </a>
                      ) : (
                        <span className="type-meta uppercase text-accent">
                          {activeProject.demoLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="about-me" aria-label="About Me" className="py-32 px-8 bg-pure border-t border-pale">
        <div className="max-w-6xl mx-auto space-y-12">
          <ScrollSection entryDirection="bottom" motionRole="contact-title">
            <h2 className="type-display-m text-ink">About Me</h2>
          </ScrollSection>
          <div className="border border-pale bg-pure">
            <div className="w-full aspect-[239/100] bg-cloud flex items-center justify-center">
              <span className="type-meta uppercase text-dark">Cinematic video placeholder</span>
            </div>
          </div>

          <div ref={aboutTextRef} className="space-y-8 text-left">
            {ABOUT_ME_PARAGRAPHS.map((paragraph, index) => (
              <AnimatedParagraph
                key={paragraph.slice(0, 16)}
                text={paragraph}
                className="type-body text-ink"
                inView={aboutTextInView}
                stagger={aboutStagger}
                startIndex={aboutWordOffsets[index]}
                delay={aboutBaseDelay + index * aboutParagraphPause}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-8 bg-pure border-t border-pale">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="contact-title">
              <h2 className="type-display-m text-ink">Contact</h2>
            </ScrollSection>
            <ScrollSection entryDirection="bottom" motionRole="contact-title">
              <p className="type-subhead text-dark">
                I’m open to junior UX/UI roles, collaborations, and focused design work.
If you’re exploring new ideas, complex systems, or thoughtful interfaces, I’d love to connect.
              </p>
            </ScrollSection>
            <div className="space-y-3 border-t border-pale pt-6">
              <p className="type-meta text-dark uppercase">Email</p>
              <a className="type-body text-ink" href="mailto:juliocoraspe@gmail.com">
                juliocoraspe@gmail.com
              </a>
            </div>
            <div className="space-y-3 border-t border-pale pt-6">
              <p className="type-meta text-dark uppercase">Links</p>
              <div className="flex flex-wrap gap-6">
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-meta uppercase text-ink"
                >
                  Resume
                </a>
                <a
                  href="https://www.linkedin.com/in/juliocoraspe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-meta uppercase text-ink"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/juliocoraspe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-meta uppercase text-accent"
                >
                  GitHub
                </a>
                <a
                  href="https://www.behance.net/juliocoraspe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-meta uppercase text-ink"
                >
                  Behance
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={enterGarden}
              className="type-meta text-accent uppercase cursor-pointer"
            >
              Visit the Garden
            </button>
          </div>

        </div>
      </section>

      <footer className="border-t border-pale bg-pure">
        <div className="max-w-6xl mx-auto px-8 py-16" />
      </footer>
    </div>
  );
}
