import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useIsMobile } from './components/ui/use-mobile';
import { useViewportWidth } from './hooks/use-viewport-width';
import { HeroSection } from './components/sections/HeroSection';
import { PracticeSection } from './components/sections/PracticeSection';
import { CaseStudiesSection } from './components/sections/CaseStudiesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ProjectModal } from './components/sections/ProjectModal';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { ContactSection } from './components/sections/ContactSection';
import { CASE_STUDY } from './data/caseStudy';
import { PROJECTS } from './data/projects';
// Garden view disabled for now; keep for later reuse.
// import { ExploratoryGallery } from './components/ExploratoryGallery';

// Garden view disabled for now; keep for later reuse.
// type View = 'main' | 'garden';

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // Garden view disabled for now; keep for later reuse.
  // const [view, setView] = useState<View>('main');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isMiloOpen, setIsMiloOpen] = useState(false);
  const [isStillenOpen, setIsStillenOpen] = useState(false);
  const viewportWidth = useViewportWidth();
  const caseStudyStillenRef = useRef<HTMLElement | null>(null);
  const caseStudyMiloRef = useRef<HTMLElement | null>(null);
  const pendingCollapseScrollRef = useRef<HTMLElement | null>(null);
  const asmrOutcomeEmbedRef = useRef<HTMLDivElement | null>(null);
  const [asmrOutcomeScale, setAsmrOutcomeScale] = useState(1);
  // const scrollPositionRef = useRef(0);
  const scrollToCaseStudy = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      const behavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior, block: 'start' });
      });
    },
    [shouldReduceMotion],
  );

  useEffect(() => {
    if (!pendingCollapseScrollRef.current) return;
    const target = pendingCollapseScrollRef.current;
    pendingCollapseScrollRef.current = null;
    scrollToCaseStudy(target);
  }, [isMiloOpen, isStillenOpen, scrollToCaseStudy]);

  const handleStillenToggle = () => {
    setIsStillenOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyStillenRef.current;
      }
      return nextOpen;
    });
  };

  const handleMiloToggle = () => {
    setIsMiloOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyMiloRef.current;
      }
      return nextOpen;
    });
  };

  const handleStillenCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyStillenRef.current;
    setIsStillenOpen(false);
  };

  const handleMiloCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyMiloRef.current;
    setIsMiloOpen(false);
  };

  const caseStudy = CASE_STUDY;
  const projects = useMemo(() => PROJECTS, []);

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;
  const handleOpenProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
  }, []);
  const outcomeEmbedConfig = activeProject?.outcomeEmbedConfig;
  const hasScaledOutcomeEmbed = Boolean(activeProject?.outcomeEmbedUrl && outcomeEmbedConfig);
  const outcomeEmbedMode = activeProject?.outcomeEmbedMode ?? 'scaled';
  const outcomeEmbedIsResponsive = outcomeEmbedMode === 'responsive';
  const outcomeEmbedBaseScale = outcomeEmbedConfig?.scale ?? 0.6;
  const outcomeEmbedWidth = outcomeEmbedConfig?.width ?? 430;
  const outcomeEmbedHeight = outcomeEmbedConfig?.height ?? 764;
  const outcomeEmbedContentConfig = activeProject?.outcomeEmbedContentConfig;
  const outcomeEmbedContentWidth = outcomeEmbedContentConfig?.width ?? outcomeEmbedWidth;
  const outcomeEmbedContentHeight = outcomeEmbedContentConfig?.height ?? outcomeEmbedHeight;
  const outcomeEmbedContentFit = outcomeEmbedContentConfig?.fit ?? 'contain';
  const asmrEmbedAlignTop = outcomeEmbedContentFit === 'cover-width';
  const asmrEmbedUseFrameSize = outcomeEmbedContentFit === 'frame';
  const outcomeEmbedContentOffsetX = outcomeEmbedContentConfig?.offsetX ?? 0;
  const outcomeEmbedContentOffsetY = outcomeEmbedContentConfig?.offsetY ?? 0;
  const shouldScaleAsmrOutcomeEmbed =
    activeProject?.id === 'asmr-app' && outcomeEmbedIsResponsive && Boolean(outcomeEmbedConfig);
  const introEmbedConfig = activeProject?.introEmbedConfig;
  const hasIntroEmbed = Boolean(activeProject?.introEmbedUrl);
  const introEmbedMode = activeProject?.introEmbedMode ?? 'scaled';
  const introEmbedIsResponsive = introEmbedMode === 'responsive';
  const introEmbedBaseScale = introEmbedConfig?.scale ?? 0.4;
  const introEmbedWidth = introEmbedConfig?.width ?? 1280;
  const introEmbedHeight = introEmbedConfig?.height ?? 720;
  const projectCardsStatic = viewportWidth < 768;
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

  useEffect(() => {
    if (!shouldScaleAsmrOutcomeEmbed) return;
    const element = asmrOutcomeEmbedRef.current;
    if (!element) return;
    const frame = requestAnimationFrame(() => {
      const { width, height } = element.getBoundingClientRect();
      if (outcomeEmbedContentFit === 'frame') {
        setAsmrOutcomeScale(1);
        return;
      }
      if (!width || !height || !outcomeEmbedContentWidth || !outcomeEmbedContentHeight) return;
      const widthScale = width / outcomeEmbedContentWidth;
      const heightScale = height / outcomeEmbedContentHeight;
      const nextScale =
        outcomeEmbedContentFit === 'cover'
          ? Math.max(widthScale, heightScale)
          : outcomeEmbedContentFit === 'cover-width'
            ? widthScale
            : Math.min(widthScale, heightScale);
      setAsmrOutcomeScale(nextScale);
    });
    return () => cancelAnimationFrame(frame);
  }, [
    shouldScaleAsmrOutcomeEmbed,
    viewportWidth,
    outcomeEmbedContentWidth,
    outcomeEmbedContentHeight,
    outcomeEmbedContentFit,
  ]);

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
      <HeroSection isMobile={isMobile} />
      <PracticeSection />
      <CaseStudiesSection
        caseStudy={caseStudy}
        isStillenOpen={isStillenOpen}
        isMiloOpen={isMiloOpen}
        caseStudyStillenRef={caseStudyStillenRef}
        caseStudyMiloRef={caseStudyMiloRef}
        handleStillenToggle={handleStillenToggle}
        handleMiloToggle={handleMiloToggle}
        handleStillenCollapse={handleStillenCollapse}
        handleMiloCollapse={handleMiloCollapse}
        isMobile={isMobile}
      />
      <ProjectsSection
        projects={projects}
        onOpenProject={handleOpenProject}
        projectCardsStatic={projectCardsStatic}
      />

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            activeProject={activeProject}
            shouldReduceMotion={shouldReduceMotion}
            onClose={() => setActiveProjectId(null)}
            hasIntroEmbed={hasIntroEmbed}
            introEmbedIsResponsive={introEmbedIsResponsive}
            introEmbedWidth={introEmbedWidth}
            introEmbedHeight={introEmbedHeight}
            introEmbedScaledWidth={introEmbedScaledWidth}
            introEmbedScaledHeight={introEmbedScaledHeight}
            introEmbedScale={introEmbedScale}
            hasScaledOutcomeEmbed={hasScaledOutcomeEmbed}
            outcomeEmbedIsResponsive={outcomeEmbedIsResponsive}
            outcomeEmbedWidth={outcomeEmbedWidth}
            outcomeEmbedHeight={outcomeEmbedHeight}
            outcomeEmbedScaledWidth={outcomeEmbedScaledWidth}
            outcomeEmbedScaledHeight={outcomeEmbedScaledHeight}
            outcomeEmbedScale={outcomeEmbedScale}
            shouldScaleAsmrOutcomeEmbed={shouldScaleAsmrOutcomeEmbed}
            asmrOutcomeEmbedRef={asmrOutcomeEmbedRef}
            asmrOutcomeScale={asmrOutcomeScale}
            outcomeEmbedContentWidth={outcomeEmbedContentWidth}
            outcomeEmbedContentHeight={outcomeEmbedContentHeight}
            asmrEmbedAlignTop={asmrEmbedAlignTop}
            asmrEmbedUseFrameSize={asmrEmbedUseFrameSize}
            outcomeEmbedContentOffsetX={outcomeEmbedContentOffsetX}
            outcomeEmbedContentOffsetY={outcomeEmbedContentOffsetY}
          />
        )}
      </AnimatePresence>

      <AboutMeSection />
      <ContactSection />
    </div>
  );
}
