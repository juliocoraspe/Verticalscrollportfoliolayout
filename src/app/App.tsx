import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ScrollSection } from './components/ScrollSection';
import { CaseStudy } from './components/CaseStudy';
import { AiCompanionCaseStudy } from './components/AiCompanionCaseStudy';
import { ProjectCard } from './components/ProjectCard';
import { useIsMobile } from './components/ui/use-mobile';
// Garden view disabled for now; keep for later reuse.
// import { ExploratoryGallery } from './components/ExploratoryGallery';
import bannerCaseStudy from '../assets/images/banner-case-study.png';
import todoBanner from '../assets/images/todo-banner2.png';
import asmrBanner from '../assets/images/asmr-banner2.png';
import spotsBanner from '../assets/images/spots-banner.png';
import redesign02 from '../assets/images/Redesign02.png';
import bloopAvatar from '../assets/images/bloop.png';
import julsPortrait from '../assets/images/Juls.JPG';

// Garden view disabled for now; keep for later reuse.
// type View = 'main' | 'garden';

const RESUME_URL = '<GOOGLE_DRIVE_LINK_PLACEHOLDER>';
const ABOUT_ME_PARAGRAPHS = [
  'I was born in Venezuela currently live in the Midwest of the United States. I graduated as a lawyer, a background that shaped how I think about systems and structure. Today, I work at the intersection of creative practice and technology, designing and building digital products. I speak Spanish, English, and I plan to start learning French in 2026. I find meaning in contemplation and in what takes time.',
  'My creative profile is strongly visual, spanning photography (digital, mobile, and film, including film development and digitization), videography, professional editing, digital drawing, generative art through code, and motion design. These practices share a common thread: patience, process, and attention to detail. Exploring them has been less about collecting skills and more about developing craft, curiosity, and a lasting commitment to learning and making things with care.',
  'I have a strong fascination with artificial intelligence as a creative and procedural tool. I see it as an extension of thought and making—something that amplifies research, exploration, and execution rather than replacing them. I work with AI through prompt and context engineering, using it generatively for research, coding, and audiovisual experimentation, including local LLM setups and custom tooling such as code editor assistants and Figma plugins. This approach allows me to work with AI in a more intentional, productive, and secure way.',
];

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // Garden view disabled for now; keep for later reuse.
  // const [view, setView] = useState<View>('main');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );
  // const scrollPositionRef = useRef(0);
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

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      intent:
        'Research-driven task flow designed to reduce planning overwhelm by improving anticipation, clarity, and trust—especially through reliable calendar handoff and reminder visibility.',
      role: 'UX Research, UI Design',
      imageUrl: todoBanner,
      tags: ['Research', 'UX Flow', 'UI Systems'],
      context:
        'Designed as a compact study in reducing task anxiety for busy students and early-career professionals with mixed levels of tech comfort. The work focused on how people capture tasks quickly, understand priority at a glance, and rely on their phone’s native tools (calendar + notifications) to stay on track across work and personal schedules.',
      problem:
        'Many existing to-do tools break trust in day-to-day planning: key actions like edit/delete aren’t always discoverable, priority signals can be unclear, and calendar integration is often unreliable. Without “ahead of time” visibility (widgets, smart reminders, dependable sync), tasks feel fragmented—making it harder for users to plan confidently.',
      process: [
        'Mapped friction points from first use through daily task capture, then tested core behaviors: add, edit, delete, set priority, select dates, and navigate between views. Insights from competitive research emphasized anticipation (widgets + reminders) and dependable calendar integration as key differentiators.',
        'Concepts were explored through lo-fi and hi-fi prototypes, then iterated based on usability feedback—improving clarity with stronger priority cues, clearer button meanings, and safer delete flows. In parallel, a lightweight code prototype was used to evaluate how adding a task and handing it off to the device’s native calendar would look and feel in a more realistic interaction context.',
      ],
      solution:
        'A pared-back task system with gentle hierarchy, clear completion feedback, and low visual noise—built around fast capture, readable prioritization, and a planning flow that supports calendar continuity. The design prioritizes “at a glance” understanding (widgets + smart notifications) while keeping actions and states easy to recognize, especially for less tech-savvy users.',
      outcome: [
        'Task creation and completion tested as intuitive, with a mostly smooth navigation flow and positive reception overall.',
        'Priority became easier to interpret with stronger visual cues, and action clarity improved through labels and safer edit/delete patterns.',
        'Calendar sync was consistently valued as a trust and “backup” mechanism—supporting more detailed event controls (like notification personalization) inside the user’s native calendar.',
        'Code-based prototyping helped validate the end-to-end experience of creating a task and saving it to the device calendar, reinforcing a unified planning workflow across the app and the user’s existing system.',
      ],
      experienceUrl: '/projects/todo-app/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      outcomeEmbedUrl: 'https://juliocoraspe.github.io/todo-polymorphic-app/',
      outcomeEmbedConfig: { width: 430, height: 764, scale: 0.6 },
      outcomeEmbedMode: 'responsive',
      outcomeEmbedCta: 'Explore the live coded demo below.',
      outcomeEmbedArrow: 'up' as const,
      outcomeEmbedArrowPlacement: 'above' as const,
      prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
      prototypeUrl:
        'https://embed.figma.com/slides/RCRXoEB4h7yTAKYjiK1Rx6/ToDo-Research?node-id=1-360&embed-host=share',
      demoLabel: 'Research Findings & Design Implications (Full Report)',
      demoUrl: undefined,
    },
    {
      id: 'asmr-app',
      title: 'ASMR App',
      intent:
        'A sensory-first mobile experience designed to minimize emotional disruption while amplifying perception through sound, motion, and subtle feedback. The interface acts as a quiet framework—allowing audio, generative visuals, and haptics to shape a calm, highly personalized listening state.',
      role: 'Visual Design, Interaction',
      imageUrl: asmrBanner,
      imageFit: 'contain' as const,
      tags: ['UI Craft', 'Motion', 'Prototyping'],
      context:
        'This project originated from a brand-led exploration focused on calm, emotional neutrality, and sensory balance. Before defining screens or interactions, visual language, imagery, and tone were established to ensure the interface would support relaxation rather than influence mood through visual stimulation. The app was conceived as an adaptive environment—one that responds to sound and user input without imposing visual noise—transforming listening into a focused, multisensory ritual.',
      problem:
        'Many ASMR and ambient sound apps unintentionally interfere with emotional regulation by relying on expressive visuals, dense layouts, or overstimulating UI patterns. These design choices introduce visual and cognitive noise, pulling attention away from sound and fragmenting the listening experience over time.',
      process: [
        'The experience evolved through layered visual and interaction exploration. Initial branding, imagery, and mood-driven research informed a restrained emotional baseline, followed by lo-fi structural layouts that prioritized clarity and spatial calm.',
        'Two contrasting creative directions were then explored: one darker and more expressive, using neon accents and contrast, and another reduced and light, built around soft whites, muted blacks, and visual stillness.',
        'From this exploration, a focused direction emerged—refined into a cohesive system of typography, components, motion principles, and responsive behaviors. Sound-reactive animations inspired by generative code practices were integrated into the playback experience, along with subtle haptic responses, reinforcing immersion without visual dominance.',
      ],
      solution:
        'A minimal, adaptive sound studio where the UI deliberately avoids emotional distortion, allowing users to personalize their experience through layered audio, responsive motion, and tactile feedback. Visuals remain restrained and intentional, while generative animations and haptics expand the sensory depth—creating an experience that feels immersive without becoming intrusive.',
      outcome: [
        'A deeply customizable listening environment shaped by sound, motion, and touch',
        'Reduced emotional and visual noise through restrained UI decisions',
        'Extended the design beyond static prototypes through real-time motion exploration using JavaScript and the Three.js library',
        'Built sound-reactive, generative animation studies to visualize how playback-screen visuals respond dynamically to audio input',
        'Validated how motion, sound, and subtle interaction could coexist without overwhelming the listening experience, reinforcing the app as a calm, multisensory system rather than a purely audio tool',
      ],
      experienceUrl: '/projects/asmr-app/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      outcomeEmbedUrl: 'https://juliocoraspe.github.io/birdsong-viz/',
      outcomeEmbedConfig: { width: 640, height: 1138, scale: 0.6 },
      outcomeEmbedMode: 'responsive',
      outcomeEmbedCta: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the audio demo or motion study.',
      prototypeUrl:
        'https://embed.figma.com/design/fYwhBS4WdU21aEjBQKEGVl/Julio-Coraspe-Lumn?node-id=0-1&embed-host=share',
      demoLabel: 'Full Design Overview',
      demoUrl: undefined,
    },
    {
      id: 'marketplace-bloop',
      title: 'Marketplace (BLOOP)',
      intent:
        'BLOOP is a mobile-first marketplace concept designed to make local buying and selling feel immediate, clear, and low-friction. Built in response to a school assignment, the project applies Apple Human Interface Guidelines (HIG) to address common marketplace usability issues—especially hidden primary actions, slow listing flows, and unclear status feedback.',
      role: 'UX Research, UI Design',
      imageUrl: bloopAvatar,
      tags: ['Research', 'UX Flow', 'UI Systems'],
      context:
        'Many existing marketplaces introduce unnecessary friction during key moments such as posting an item, tracking progress, and communicating with buyers. BLOOP was designed around the idea of a “bubble”: something light, simple, and responsive. Every interaction aims to feel effortless, with subtle visual feedback confirming that actions were successful.',
      problem:
        'Research and heuristic analysis revealed three recurring issues in popular marketplace experiences:\n- Navigation creates friction when the primary “Sell” action is not immediately visible.\n- Listing flows feel slow and lack consistent progress feedback.\n- Messaging systems provide unclear status indicators (sent/read), reducing user confidence during conversations.',
      process: [
        'I evaluated existing marketplace patterns through the lens of Apple Human Interface Guidelines, focusing on primary action visibility, user feedback and control, and clear status communication.',
        'Based on these insights, I mapped an end-to-end user flow—from browsing the feed to posting an item, messaging, purchase confirmation, and managing listings. Key screens were designed using a mini design system to ensure consistency, clarity, and predictable interaction patterns.',
      ],
      solution:
        'BLOOP improves the marketplace experience through:\n- A clearly visible and easily accessible “Sell” entry point.\n- A streamlined listing flow with multi-image uploads and progress indicators.\n- A listing preview that confirms how an item will appear before publishing.\n- An inbox and chat experience with notification badges and clear sent/read status cues.\n- Consistent, card-based layouts and reusable components inspired by Apple HIG patterns.',
      outcome: [
        'Primary actions are easier to discover, reducing navigation friction.',
        'Listing feels faster and more controlled thanks to visible progress feedback.',
        'Messaging improves trust through clearer hierarchy and status indicators.',
        'A cohesive mini design system—Inter typography, clean neutral colors, and a single bold blue accent—keeps the interface minimal while reinforcing BLOOP’s identity.',
      ],
      prototypeSummary:
        'This section represents the full BLOOP app experience. Key screens showcased include the Home Feed, Create New Listing flow, and Messaging screens, highlighting action visibility, feedback, and clarity throughout the user journey.',
      experienceUrl: '/projects/todo-app/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
      prototypeUrl:
        'https://embed.figma.com/design/6lWQJTUiFO8Wvtem3dAKZT/Bloop-Julio-coraspe?node-id=0-1&embed-host=share',
      demoLabel: undefined,
      demoUrl: undefined,
    },
    {
      id: 'frontend-redesign',
      title: 'Frontend Redesign',
      intent: `Frontend implementation and interface redesign of an image-based web application.

This project began as a frontend development exercise, translating an existing Figma design into a functional web application using HTML, CSS, and JavaScript. The initial implementation focused on structure, modular components, and interactive features such as image posts and basic content management.

While technically complete, the interface remained visually neutral and utilitarian. This redesign reframes the product as a visual moodboard, refining the UI to better support exploration, inspiration, and content-focused interaction.`,
      role: 'Frontend, UI Design',
      imageUrl: redesign02,
      imagePosition: 'top' as const,
      tags: ['Frontend', 'Refactor', 'Accessibility'],
      context:
        `The original application functioned primarily as a simple image-based interface, where usability was driven by functionality rather than intent. Although the product worked as expected, its presentation did not clearly communicate why the content mattered or how it should be used.

This redesign shifts the product’s direction toward a moodboard-style experience, prioritizing visual clarity, hierarchy, and a calmer canvas for collecting and revisiting visual references.`,
      problem:
        `The main issue was not missing features, but an interface that treated content and controls with equal priority. This resulted in several UX challenges:
• Limited visual hierarchy between primary actions and secondary controls.
• UI elements competing with images for attention.
• Interaction patterns that suggested a management tool rather than a moodboard.

Without formal user research, these issues were identified through heuristic evaluation and UI design principles, revealing gaps in hierarchy, focus, and consistency that justified a design-led refactor.`,
      process: [
        'Audited the interface using heuristic principles to identify hierarchy and clarity issues.',
        'Simplified interaction patterns to reduce visual noise.',
        'Refined layout, spacing, and contrast to support content-first exploration.',
      ],
      solution:
        'A cleaner, content-first interface that transforms the application from a simple image viewer into a moodboard-style tool. The redesign emphasizes visual hierarchy, minimizes exposed controls, and aligns interaction patterns with the product’s new purpose.',
      outcome: [
        'Improved visual focus and hierarchy across the main canvas.',
        'Reduced cognitive load by consolidating secondary actions.',
        'Clearer alignment between product intent and interface behavior.',
      ],
      outcomeEmbedUrl:
        'https://embed.figma.com/design/6lWQJTUiFO8Wvtem3dAKZT/Bloop-Julio-coraspe?node-id=57-2628&embed-host=share',
      introEmbedUrl: 'https://juliocoraspe.github.io/se_project_spots/',
      introEmbedConfig: { width: 1280, height: 720, scale: 0.4 },
      introEmbedMode: 'responsive',
      experienceUrl: '/projects/frontend-redesign/experience',
      experienceHelper: 'View the full report',
      experienceThumbnail: undefined,
      prototypeLabel: 'Prototype embed placeholder — add the coded prototype or live build.',
      prototypeUrl:
        'https://embed.figma.com/design/QFyh4I1PE2qzy5hOSgDvgL/Spots-ReDesign?node-id=0-1&embed-host=share',
      demoLabel: 'Interface Redesign — Full Design Cycle',
      demoUrl: undefined,
    },
  ];

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;
  const outcomeEmbedConfig = activeProject?.outcomeEmbedConfig;
  const hasScaledOutcomeEmbed = Boolean(activeProject?.outcomeEmbedUrl && outcomeEmbedConfig);
  const outcomeEmbedMode = activeProject?.outcomeEmbedMode ?? 'scaled';
  const outcomeEmbedIsResponsive = outcomeEmbedMode === 'responsive';
  const outcomeEmbedBaseScale = outcomeEmbedConfig?.scale ?? 0.6;
  const outcomeEmbedWidth = outcomeEmbedConfig?.width ?? 430;
  const outcomeEmbedHeight = outcomeEmbedConfig?.height ?? 764;
  const introEmbedConfig = activeProject?.introEmbedConfig;
  const hasIntroEmbed = Boolean(activeProject?.introEmbedUrl);
  const introEmbedMode = activeProject?.introEmbedMode ?? 'scaled';
  const introEmbedIsResponsive = introEmbedMode === 'responsive';
  const introEmbedBaseScale = introEmbedConfig?.scale ?? 0.4;
  const introEmbedWidth = introEmbedConfig?.width ?? 1280;
  const introEmbedHeight = introEmbedConfig?.height ?? 720;
  const contentGutter = viewportWidth < 640 ? 32 : 64;
  const availableEmbedWidth = Math.max(viewportWidth - contentGutter, 0);
  const clampEmbedScale = (baseScale: number, frameWidth: number) => {
    if (!availableEmbedWidth || !frameWidth) return baseScale;
    const fitScale = availableEmbedWidth / frameWidth;
    if (isMobile) {
      return Math.min(1, fitScale);
    }
    return Math.min(baseScale, fitScale);
  };
  const outcomeEmbedScale = clampEmbedScale(outcomeEmbedBaseScale, outcomeEmbedWidth);
  const outcomeEmbedScaledWidth = outcomeEmbedWidth * outcomeEmbedScale;
  const outcomeEmbedScaledHeight = outcomeEmbedHeight * outcomeEmbedScale;
  const introEmbedScale = clampEmbedScale(introEmbedBaseScale, introEmbedWidth);
  const introEmbedScaledWidth = introEmbedWidth * introEmbedScale;
  const introEmbedScaledHeight = introEmbedHeight * introEmbedScale;

  // Garden items disabled for now; keep for later reuse.
  /*
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
  */

  // Garden navigation disabled for now; keep for later reuse.
  /*
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
  */

  // Garden screen disabled for now; keep for later reuse.
  /*
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
  */

  return (
    <div className="relative min-h-screen w-full bg-pure text-ink">
      <section className="min-h-[100svh] flex items-center px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <div className="w-full hero-breakout mx-auto space-y-8 min-w-0">
          <p className="type-subhead text-dark uppercase">Julio Coraspe • UX/UI Designer</p>

          <motion.h1
            className="type-display-xl text-ink break-words hero-title min-w-0"
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            aria-label={heroText}
          >
            {isMobile
              ? heroLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))
              : heroLines.map((line, lineIndex) => {
                  const words = line.split(' ');
                  return (
                    <span key={line} className="block">
                      {words.map((word, wordIndex) => (
                        <Fragment key={`${lineIndex}-${wordIndex}`}>
                          <motion.span
                            variants={heroWordVariants}
                            className="inline-block"
                            aria-hidden="true"
                          >
                            {word}
                          </motion.span>
                          {wordIndex < words.length - 1 ? <span aria-hidden="true"> </span> : null}
                        </Fragment>
                      ))}
                    </span>
                  );
                })}
          </motion.h1>

          <motion.p
            className="type-subhead text-dark hero-subtitle min-w-0"
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

          <div className="hero-index w-full min-w-0 border-y border-pale divide-y divide-pale">
            <a
              href="#case-study"
              className="hero-index-item type-micro uppercase text-ink py-4 w-full"
            >
              <span className="hero-index-label">View Case Study</span>
              <span className="type-micro text-dark hero-index-count">01</span>
            </a>
            <a
              href="#projects"
              className="hero-index-item type-micro uppercase text-ink py-4 w-full"
            >
              <span className="hero-index-label">Explore Projects</span>
              <span className="type-micro text-dark hero-index-count">02</span>
            </a>
            <a
              href="#ai-companion-interface"
              className="hero-index-item type-micro uppercase text-ink py-4 w-full"
            >
              <span className="hero-index-label">Milo — AI Companion Interface</span>
              <span className="type-micro text-dark hero-index-count">03</span>
            </a>
            {/* Garden entry disabled for now; keep for later reuse. */}
            {/*
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
            */}
            <a
              href="#about-me"
              className="hero-index-item type-micro uppercase text-ink py-4 w-full"
            >
              <span className="hero-index-label">About Me</span>
              <span className="type-micro text-dark hero-index-count">04</span>
            </a>
            <a
              href="#contact"
              className="hero-index-item type-micro uppercase text-ink py-4 w-full"
            >
              <span className="hero-index-label">Contact</span>
              <span className="type-micro text-dark hero-index-count">05</span>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 sm:py-32 sm:px-8 bg-pure">
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

      <section
        id="projects"
        className="py-24 px-6 sm:py-32 sm:px-8"
        style={{ backgroundColor: '#fcfbfa' }}
      >
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
              className="absolute right-4 top-4 z-[60] pointer-events-auto type-meta text-accent uppercase flex items-center gap-2 sm:right-6 sm:top-6"
              aria-label="Close project details"
            >
              <span aria-hidden="true">×</span>
              Close
            </button>
            <motion.div
              className="relative max-w-6xl mx-auto px-4 py-12 sm:px-8 sm:py-16"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.4, 0, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="border-b border-pale pb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <p className="type-meta text-dark uppercase">
                    {activeProject.id === 'todo-app-bloop' ? 'Project Overview' : 'Project'}
                  </p>
                  <h3 className="type-display-l text-ink">{activeProject.title}</h3>
                  <p className="type-subhead text-dark">{activeProject.role}</p>
                </div>
              </div>

              <div
                className={`mt-10 grid gap-8 items-start border-b border-pale pb-10 ${
                  hasIntroEmbed
                    ? introEmbedIsResponsive
                      ? 'md:grid-cols-[minmax(0,1fr)_1fr]'
                      : 'md:grid-cols-[auto_1fr]'
                    : 'md:grid-cols-[220px_1fr]'
                }`}
              >
                <div
                  className={`border border-pale bg-pure max-w-full ${
                    hasIntroEmbed ? 'relative overflow-hidden' : ''
                  }`}
                  style={
                    hasIntroEmbed
                      ? introEmbedIsResponsive
                        ? {
                            width: '100%',
                            aspectRatio: `${introEmbedWidth} / ${introEmbedHeight}`,
                            maxWidth: '100%',
                          }
                        : {
                            width: introEmbedScaledWidth,
                            height: introEmbedScaledHeight,
                            maxWidth: '100%',
                          }
                      : undefined
                  }
                >
                  {hasIntroEmbed ? (
                    introEmbedIsResponsive ? (
                      <iframe
                        title={`${activeProject.title} live embed`}
                        src={activeProject.introEmbedUrl}
                        className="absolute left-0 top-0 h-full w-full border-0"
                        loading="eager"
                        allow="fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      <iframe
                        title={`${activeProject.title} live embed`}
                        src={activeProject.introEmbedUrl}
                        className="absolute left-0 top-0 origin-top-left border-0"
                        loading="eager"
                        allow="fullscreen"
                        allowFullScreen
                        style={{
                          width: introEmbedWidth,
                          height: introEmbedHeight,
                          transform: `scale(${introEmbedScale})`,
                        }}
                      />
                    )
                  ) : (
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
                  )}
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
                  <p className="type-body text-ink whitespace-pre-line">{activeProject.problem}</p>
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
                  <p className="type-body text-ink whitespace-pre-line">{activeProject.solution}</p>
                </section>

                <section
                  className={`grid gap-8 border-t border-pale pt-6 items-start ${
                    hasScaledOutcomeEmbed
                      ? activeProject.id === 'asmr-app'
                        ? 'md:grid-cols-[200px_minmax(0,1fr)_360px] lg:grid-cols-[200px_minmax(0,1fr)_420px]'
                        : 'md:grid-cols-[200px_minmax(0,1fr)_280px] lg:grid-cols-[200px_minmax(0,1fr)_320px]'
                      : 'md:grid-cols-[200px_minmax(0,1fr)]'
                  }`}
                >
                  <p className="type-section-title text-dark uppercase">Outcome</p>
                  <div className="space-y-3">
                    {activeProject.outcome.map((item) => (
                      <p key={item} className="type-body text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                  {hasScaledOutcomeEmbed ? (
                    <div className="flex flex-col items-center">
                      <div
                        className="relative overflow-hidden rounded-[24px] border border-pale bg-pure"
                        style={{
                          width: outcomeEmbedIsResponsive ? '100%' : outcomeEmbedScaledWidth,
                          height: outcomeEmbedIsResponsive ? 'auto' : outcomeEmbedScaledHeight,
                          aspectRatio: outcomeEmbedIsResponsive
                            ? `${outcomeEmbedWidth} / ${outcomeEmbedHeight}`
                            : undefined,
                          maxWidth: '100%',
                        }}
                      >
                        {activeProject.id === 'todo-app' && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-3 bg-cloud"
                          />
                        )}
                        {outcomeEmbedIsResponsive ? (
                          <iframe
                            title={`${activeProject.title} outcome embed`}
                            src={activeProject.outcomeEmbedUrl}
                            className="absolute left-0 top-0 h-full w-full border-0 no-scrollbar"
                            loading="eager"
                            allow="fullscreen; clipboard-read; clipboard-write; autoplay; microphone; camera"
                            allowFullScreen
                          />
                        ) : (
                          <iframe
                            title={`${activeProject.title} outcome embed`}
                            src={activeProject.outcomeEmbedUrl}
                            className="absolute left-0 top-0 origin-top-left border-0 no-scrollbar"
                            loading="eager"
                            allow="fullscreen; clipboard-read; clipboard-write; autoplay; microphone; camera"
                            allowFullScreen
                            style={{
                              width: outcomeEmbedWidth,
                              height: outcomeEmbedHeight,
                              transform: `scale(${outcomeEmbedScale})`,
                            }}
                          />
                        )}
                      </div>
                      {activeProject.outcomeEmbedArrowPlacement === 'above' && (
                        <span className="type-micro text-dark mt-3">
                          {activeProject.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                        </span>
                      )}
                      {activeProject.outcomeEmbedCta && (
                        <p className="type-meta text-accent mt-1 text-center">
                          {activeProject.outcomeEmbedCta}
                        </p>
                      )}
                      {activeProject.id === 'asmr-app' && (
                        <a
                          href={activeProject.outcomeEmbedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-meta text-accent mt-2 text-center hover:underline"
                        >
                          Want full interaction with the activated microphone? Open the demo in a new tab.
                        </a>
                      )}
                      {activeProject.outcomeEmbedArrowPlacement === 'below' && (
                        <span className="type-micro text-dark mt-1">
                          {activeProject.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  ) : null}
                </section>

                <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
                  <p className="type-section-title uppercase text-accent">
                    {activeProject.id === 'todo-app-bloop' ? 'Prototype / Visualization' : 'Prototype'}
                  </p>
                  <div className="border border-pale">
                    {activeProject.prototypeSummary && (
                      <div className="p-6 border-b border-pale">
                        <p className="type-body text-ink whitespace-pre-line">
                          {activeProject.prototypeSummary}
                        </p>
                      </div>
                    )}
                    {activeProject.prototypeUrl ? (
                      <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                        <iframe
                          title={`${activeProject.title} prototype`}
                          src={activeProject.prototypeUrl}
                          className="w-full h-full"
                          loading="eager"
                          allow="fullscreen"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full border-b border-pale bg-pure flex items-center justify-center text-center p-6">
                        <p className="type-body text-dark">{activeProject.prototypeLabel}</p>
                      </div>
                      )}
                    {activeProject.demoLabel && (
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
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AiCompanionCaseStudy />

      <section
        id="about-me"
        aria-label="About Me"
        className="py-24 px-6 sm:py-32 sm:px-8 border-t border-pale"
        style={{ backgroundColor: '#fcfbfa' }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <ScrollSection entryDirection="bottom" motionRole="contact-title">
            <h2 className="type-display-m text-ink">About Me</h2>
          </ScrollSection>
          <div className="border border-pale bg-pure">
            <img
              src={julsPortrait}
              alt="Julio Coraspe portrait"
              className="w-full aspect-[239/100] object-cover about-portrait-image"
            />
          </div>

          <div className="space-y-8 text-left">
            {ABOUT_ME_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 16)} className="type-body text-ink">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 sm:py-32 sm:px-8 border-t border-pale bg-pure">
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
            {/* Garden footer link disabled for now; keep for later reuse. */}
            {/*
            <button
              type="button"
              onClick={enterGarden}
              className="type-meta text-accent uppercase cursor-pointer"
            >
              Visit the Garden
            </button>
            */}
          </div>

        </div>
      </section>

      <footer className="border-t border-pale bg-pure">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:px-8 sm:py-16" />
      </footer>
    </div>
  );
}
