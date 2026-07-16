import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useIsMobile } from './components/ui/use-mobile';
import { HeroSection } from './components/sections/HeroSection';
import { PracticeSection } from './components/sections/PracticeSection';
import { CaseStudiesSection } from './components/sections/CaseStudiesSection';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { ContactSection } from './components/sections/ContactSection';
import { AccessibilitySection } from './components/sections/AccessibilitySection';
import { MotionGarden } from './components/MotionGarden';
import { AiExperience } from './components/AiExperience';
import { Navbar } from './components/Navbar';
import { CASE_STUDY } from './data/caseStudy';
import { PROJECTS } from './data/projects';

type View = 'main' | 'motion-garden' | 'accessibility' | 'ai-experience';

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [view, setView] = useState<View>('main');
  const [isMiloOpen, setIsMiloOpen] = useState(false);
  const [isStillenOpen, setIsStillenOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isAsmrOpen, setIsAsmrOpen] = useState(false);
  const [isRealLifeOpen, setIsRealLifeOpen] = useState(false);
  const [isDirectPassOpen, setIsDirectPassOpen] = useState(false);
  const caseStudyStillenRef = useRef<HTMLElement | null>(null);
  const caseStudyMiloRef = useRef<HTMLElement | null>(null);
  const caseStudyTodoRef = useRef<HTMLElement | null>(null);
  const caseStudyAsmrRef = useRef<HTMLElement | null>(null);
  const caseStudyRealLifeRef = useRef<HTMLElement | null>(null);
  const caseStudyDirectPassRef = useRef<HTMLElement | null>(null);
  const pendingCollapseScrollRef = useRef<HTMLElement | null>(null);
  const scrollPositionRef = useRef(0);
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
  }, [isMiloOpen, isStillenOpen, isTodoOpen, isAsmrOpen, isRealLifeOpen, isDirectPassOpen, scrollToCaseStudy]);

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

  const handleTodoToggle = () => {
    setIsTodoOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyTodoRef.current;
      }
      return nextOpen;
    });
  };

  const handleAsmrToggle = () => {
    setIsAsmrOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyAsmrRef.current;
      }
      return nextOpen;
    });
  };

  const handleRealLifeToggle = () => {
    setIsRealLifeOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyRealLifeRef.current;
      }
      return nextOpen;
    });
  };

  const handleDirectPassToggle = () => {
    setIsDirectPassOpen((prev) => {
      const nextOpen = !prev;
      if (!nextOpen) {
        pendingCollapseScrollRef.current = caseStudyDirectPassRef.current;
      }
      return nextOpen;
    });
  };

  const handleStillenCollapse = () => setIsStillenOpen(false);
  const handleMiloCollapse = () => setIsMiloOpen(false);
  const handleTodoCollapse = () => setIsTodoOpen(false);
  const handleAsmrCollapse = () => setIsAsmrOpen(false);
  const handleRealLifeCollapse = () => setIsRealLifeOpen(false);
  const handleDirectPassCollapse = () => setIsDirectPassOpen(false);

  const caseStudy = CASE_STUDY;
  const todoProject = PROJECTS.find((project) => project.id === 'todo-app')!;
  const asmrProject = PROJECTS.find((project) => project.id === 'asmr-app')!;
  const getDesignCycleTitleTargetY = useCallback(() => {
    const title = document.getElementById('design-cycle-title');
    const fallback = document.getElementById('design-cycle');
    const target = title ?? fallback;
    if (!target) return null;

    // Match the visual landing point used by the other section titles:
    // navbar height (48px) + section top padding (32px mobile / 80px desktop).
    const titleViewportTop = isMobile ? 80 : 128;
    return Math.max(0, target.getBoundingClientRect().top + window.scrollY - titleViewportTop);
  }, [isMobile]);

  const scrollToDesignCycleTitle = useCallback(() => {
    const targetY = getDesignCycleTitleTargetY();
    if (targetY == null) return;
    window.scrollTo({
      top: targetY,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [getDesignCycleTitleTargetY, shouldReduceMotion]);

  // Controlled handler for the My Design Cycle nav button. Replaces the
  // native anchor jump (which races the hashchange-triggered smooth scroll
  // and was leaving the building stuck in the hero / the title drifting on
  // repeated clicks). Updates the URL via replaceState so the address bar
  // still reflects the section, but without re-firing hashchange.
  const selectDesignCycle = useCallback(() => {
    scrollToDesignCycleTitle();
    if (window.location.hash !== '#design-cycle') {
      window.history.replaceState(null, '', '#design-cycle');
    }
  }, [scrollToDesignCycleTitle]);

  const selectHero = useCallback(() => {
    scrollPositionRef.current = 0;
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    setView('main');
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    });
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const isMotionGardenHash = hash === '#motion-garden' || hash === '#garden';
      if (isMotionGardenHash) {
        setView('motion-garden');
        requestAnimationFrame(() => window.scrollTo(0, 0));
        return;
      }

      if (hash === '#accessibility') {
        setView('accessibility');
        requestAnimationFrame(() => window.scrollTo(0, 0));
        return;
      }

      if (hash === '#ai-experience') {
        setView('ai-experience');
        requestAnimationFrame(() => window.scrollTo(0, 0));
        return;
      }

      if (hash === '#design-cycle') {
        setView((currentView) => {
          requestAnimationFrame(scrollToDesignCycleTitle);
          return currentView === 'motion-garden' ||
            currentView === 'accessibility' ||
            currentView === 'ai-experience'
            ? 'main'
            : currentView;
        });
        return;
      }

      setView((currentView) => {
        if (
          currentView !== 'motion-garden' &&
          currentView !== 'accessibility' &&
          currentView !== 'ai-experience'
        ) {
          return currentView;
        }

        requestAnimationFrame(() => {
          const targetId = hash.startsWith('#') ? hash.slice(1) : '';
          if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
              return;
            }
          }
          window.scrollTo(0, scrollPositionRef.current);
        });

        return 'main';
      });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [scrollToDesignCycleTitle, shouldReduceMotion]);

  // Magnet snap: when scrolling down and the design-cycle section top enters
  // the trigger zone, auto-scroll to pin it below the navbar.
  // Scroll-down during snap is ignored (magnet wins). Only scroll-up breaks it.
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    let isSnapping = false;
    let snapRAF = 0;
    let cooldown = false;
    let cooldownTimer = 0;

    const cancelSnap = () => {
      cancelAnimationFrame(snapRAF);
      isSnapping = false;
      snapRAF = 0;
    };

    const snapTo = (targetY: number) => {
      cancelAnimationFrame(snapRAF);
      isSnapping = true;
      const startY = window.scrollY;
      const diff = targetY - startY;
      if (Math.abs(diff) < 2) { isSnapping = false; return; }
      const duration = 420;
      const start = performance.now();
      const step = (now: number) => {
        if (!isSnapping) return;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        window.scrollTo(0, startY + diff * eased);
        if (t < 1) {
          snapRAF = requestAnimationFrame(step);
        } else {
          isSnapping = false;
          cooldown = true;
          clearTimeout(cooldownTimer);
          cooldownTimer = window.setTimeout(() => { cooldown = false; }, 800);
        }
      };
      snapRAF = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      // Scroll-up always breaks the snap
      if (isSnapping && e.deltaY < 0) { cancelSnap(); return; }
      // Scroll-down during snap: magnet wins, ignore user input
      if (isSnapping && e.deltaY > 0) return;
      if (cooldown) return;
      const section = document.getElementById('design-cycle');
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top;
      const vh = window.innerHeight;
      if (e.deltaY > 0 && sectionTop > vh * 0.25 && sectionTop < vh * 0.72) {
        const targetY = getDesignCycleTitleTargetY() ?? section.offsetTop - 48;
        snapTo(targetY);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      cancelSnap();
      clearTimeout(cooldownTimer);
      window.removeEventListener('wheel', onWheel);
    };
  }, [getDesignCycleTitleTargetY, isMobile, shouldReduceMotion]);

  const enterMotionGarden = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    window.location.hash = 'motion-garden';
  }, []);

  const exitMotionGarden = useCallback(() => {
    window.location.hash = '';
  }, []);

  const enterAccessibility = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    window.location.hash = 'accessibility';
  }, []);

  const enterAiExperience = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    window.location.hash = 'ai-experience';
  }, []);

  if (view === 'motion-garden') {
    return (
      <div className="relative min-h-screen w-full bg-pure text-ink" style={{ paddingTop: 48 }}>
        <Navbar
          enterMotionGarden={enterMotionGarden}
          enterAccessibility={enterAccessibility}
          enterAiExperience={enterAiExperience}
          onSelectHero={selectHero}
          currentView="motion-garden"
        />
        <MotionGarden onExit={exitMotionGarden} />
        <ContactSection enterMotionGarden={enterMotionGarden} enterAccessibility={enterAccessibility} enterAiExperience={enterAiExperience} />
      </div>
    );
  }

  if (view === 'accessibility') {
    return (
      <div className="relative min-h-screen w-full bg-pure text-ink" style={{ paddingTop: 48 }}>
        <Navbar
          enterMotionGarden={enterMotionGarden}
          enterAccessibility={enterAccessibility}
          enterAiExperience={enterAiExperience}
          onSelectHero={selectHero}
          currentView="accessibility"
        />
        <AccessibilitySection />
        <ContactSection enterMotionGarden={enterMotionGarden} enterAccessibility={enterAccessibility} enterAiExperience={enterAiExperience} />
      </div>
    );
  }

  if (view === 'ai-experience') {
    return (
      <div className="relative min-h-screen w-full bg-pure text-ink" style={{ paddingTop: 48 }}>
        <Navbar
          enterMotionGarden={enterMotionGarden}
          enterAccessibility={enterAccessibility}
          enterAiExperience={enterAiExperience}
          onSelectHero={selectHero}
          currentView="ai-experience"
        />
        <AiExperience />
        <ContactSection enterMotionGarden={enterMotionGarden} enterAccessibility={enterAccessibility} enterAiExperience={enterAiExperience} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-pure text-ink" style={{ paddingTop: 48 }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[2000] focus:px-4 focus:py-2 focus:bg-pure focus:text-ink focus:type-meta focus:border focus:border-pale"
      >
        Skip to main content
      </a>
      <Navbar
        enterMotionGarden={enterMotionGarden}
        enterAccessibility={enterAccessibility}
        enterAiExperience={enterAiExperience}
        onSelectHero={selectHero}
        onSelectDesignCycle={selectDesignCycle}
      />
      <HeroSection isMobile={isMobile} />
      <PracticeSection enterMotionGarden={enterMotionGarden} />
      <CaseStudiesSection
        caseStudy={caseStudy}
        isStillenOpen={isStillenOpen}
        isMiloOpen={isMiloOpen}
        isTodoOpen={isTodoOpen}
        isAsmrOpen={isAsmrOpen}
        isRealLifeOpen={isRealLifeOpen}
        isDirectPassOpen={isDirectPassOpen}
        caseStudyStillenRef={caseStudyStillenRef}
        caseStudyMiloRef={caseStudyMiloRef}
        caseStudyTodoRef={caseStudyTodoRef}
        caseStudyAsmrRef={caseStudyAsmrRef}
        caseStudyRealLifeRef={caseStudyRealLifeRef}
        caseStudyDirectPassRef={caseStudyDirectPassRef}
        handleStillenToggle={handleStillenToggle}
        handleMiloToggle={handleMiloToggle}
        handleTodoToggle={handleTodoToggle}
        handleAsmrToggle={handleAsmrToggle}
        handleRealLifeToggle={handleRealLifeToggle}
        handleDirectPassToggle={handleDirectPassToggle}
        handleStillenCollapse={handleStillenCollapse}
        handleMiloCollapse={handleMiloCollapse}
        handleTodoCollapse={handleTodoCollapse}
        handleAsmrCollapse={handleAsmrCollapse}
        handleRealLifeCollapse={handleRealLifeCollapse}
        handleDirectPassCollapse={handleDirectPassCollapse}
        todoProject={todoProject}
        asmrProject={asmrProject}
        isMobile={isMobile}
      />

      <AboutMeSection />
      <ContactSection enterMotionGarden={enterMotionGarden} enterAccessibility={enterAccessibility} enterAiExperience={enterAiExperience} />
    </div>
  );
}
