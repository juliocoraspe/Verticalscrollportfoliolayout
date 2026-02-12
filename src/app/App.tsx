import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useIsMobile } from './components/ui/use-mobile';
import { HeroSection } from './components/sections/HeroSection';
import { PracticeSection } from './components/sections/PracticeSection';
import { CaseStudiesSection } from './components/sections/CaseStudiesSection';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { ContactSection } from './components/sections/ContactSection';
import { MotionGarden } from './components/MotionGarden';
import { CASE_STUDY } from './data/caseStudy';
import { PROJECTS } from './data/projects';

type View = 'main' | 'motion-garden';

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [view, setView] = useState<View>('main');
  const [isMiloOpen, setIsMiloOpen] = useState(false);
  const [isStillenOpen, setIsStillenOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isAsmrOpen, setIsAsmrOpen] = useState(false);
  const caseStudyStillenRef = useRef<HTMLElement | null>(null);
  const caseStudyMiloRef = useRef<HTMLElement | null>(null);
  const caseStudyTodoRef = useRef<HTMLElement | null>(null);
  const caseStudyAsmrRef = useRef<HTMLElement | null>(null);
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
  }, [isMiloOpen, isStillenOpen, isTodoOpen, isAsmrOpen, scrollToCaseStudy]);

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

  const handleStillenCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyStillenRef.current;
    setIsStillenOpen(false);
  };

  const handleMiloCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyMiloRef.current;
    setIsMiloOpen(false);
  };

  const handleTodoCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyTodoRef.current;
    setIsTodoOpen(false);
  };

  const handleAsmrCollapse = () => {
    pendingCollapseScrollRef.current = caseStudyAsmrRef.current;
    setIsAsmrOpen(false);
  };

  const caseStudy = CASE_STUDY;
  const todoProject = PROJECTS.find((project) => project.id === 'todo-app')!;
  const asmrProject = PROJECTS.find((project) => project.id === 'asmr-app')!;

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const isMotionGardenHash = hash === '#motion-garden' || hash === '#garden';

      if (isMotionGardenHash) {
        setView('motion-garden');
        requestAnimationFrame(() => window.scrollTo(0, 0));
        return;
      }

      setView((currentView) => {
        if (currentView !== 'motion-garden') {
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
  }, [shouldReduceMotion]);

  const enterMotionGarden = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    window.location.hash = 'motion-garden';
  }, []);

  const exitMotionGarden = useCallback(() => {
    window.location.hash = '';
  }, []);

  if (view === 'motion-garden') {
    return <MotionGarden onExit={exitMotionGarden} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-pure text-ink">
      <HeroSection isMobile={isMobile} />
      <PracticeSection enterMotionGarden={enterMotionGarden} />
      <CaseStudiesSection
        caseStudy={caseStudy}
        isStillenOpen={isStillenOpen}
        isMiloOpen={isMiloOpen}
        isTodoOpen={isTodoOpen}
        isAsmrOpen={isAsmrOpen}
        caseStudyStillenRef={caseStudyStillenRef}
        caseStudyMiloRef={caseStudyMiloRef}
        caseStudyTodoRef={caseStudyTodoRef}
        caseStudyAsmrRef={caseStudyAsmrRef}
        handleStillenToggle={handleStillenToggle}
        handleMiloToggle={handleMiloToggle}
        handleTodoToggle={handleTodoToggle}
        handleAsmrToggle={handleAsmrToggle}
        handleStillenCollapse={handleStillenCollapse}
        handleMiloCollapse={handleMiloCollapse}
        handleTodoCollapse={handleTodoCollapse}
        handleAsmrCollapse={handleAsmrCollapse}
        todoProject={todoProject}
        asmrProject={asmrProject}
        isMobile={isMobile}
      />

      <AboutMeSection />
      <ContactSection enterMotionGarden={enterMotionGarden} />
    </div>
  );
}
