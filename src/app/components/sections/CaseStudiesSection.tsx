import { RefObject } from 'react';
import { ScrollSection } from '../ScrollSection';
import { CaseStudyBlueprint } from '../CaseStudyBlueprint';
import { getStillenBlueprintSections } from '../CaseStudy';
import {
  AI_COMPANION_BANNER,
  AI_COMPANION_SUMMARY,
  AI_COMPANION_TITLE,
} from '../AiCompanionCaseStudy';
import { getMiloBlueprintSections } from '../MiloCaseStudy';
import { getSyncoBlueprintSections } from '../SyncoCaseStudy';
import { getLumnBlueprintSections } from '../LumnCaseStudy';
import {
  REAL_LIFE_BANNER,
  REAL_LIFE_SUMMARY,
  REAL_LIFE_TITLE,
  getRealLifeBlueprintSections,
} from '../RealLifeCaseStudy';
import {
  DIRECTPASS_BANNER,
  DIRECTPASS_SUMMARY,
  DIRECTPASS_TITLE,
  getDirectPassBlueprintSections,
} from '../DirectPassCaseStudy';
import type { Project } from '../../data/projects';

type CaseStudy = {
  title: string;
  role: string;
  timeline: string;
  summary: string;
  heroImage: string;
  problem: { title: string; description: string };
  process: { title: string; description: string; steps: string[] };
  exploration: { title: string; description: string };
  solution: { title: string; description: string; outcomes: string[] };
  prototype: { title: string; embedUrl: string; externalUrl: string };
};

type CaseStudiesSectionProps = {
  caseStudy: CaseStudy;
  todoProject: Project;
  asmrProject: Project;
  isStillenOpen: boolean;
  isMiloOpen: boolean;
  isTodoOpen: boolean;
  isAsmrOpen: boolean;
  isRealLifeOpen: boolean;
  isDirectPassOpen: boolean;
  caseStudyStillenRef: RefObject<HTMLElement | null>;
  caseStudyMiloRef: RefObject<HTMLElement | null>;
  caseStudyTodoRef: RefObject<HTMLElement | null>;
  caseStudyAsmrRef: RefObject<HTMLElement | null>;
  caseStudyRealLifeRef: RefObject<HTMLElement | null>;
  caseStudyDirectPassRef: RefObject<HTMLElement | null>;
  handleStillenToggle: () => void;
  handleMiloToggle: () => void;
  handleTodoToggle: () => void;
  handleAsmrToggle: () => void;
  handleRealLifeToggle: () => void;
  handleDirectPassToggle: () => void;
  handleStillenCollapse: () => void;
  handleMiloCollapse: () => void;
  handleTodoCollapse: () => void;
  handleAsmrCollapse: () => void;
  handleRealLifeCollapse: () => void;
  handleDirectPassCollapse: () => void;
  isMobile: boolean;
};

export function CaseStudiesSection({
  caseStudy,
  todoProject,
  asmrProject,
  isStillenOpen,
  isMiloOpen,
  isTodoOpen,
  isAsmrOpen,
  isRealLifeOpen,
  isDirectPassOpen,
  caseStudyStillenRef,
  caseStudyMiloRef,
  caseStudyTodoRef,
  caseStudyAsmrRef,
  caseStudyRealLifeRef,
  caseStudyDirectPassRef,
  handleStillenToggle,
  handleMiloToggle,
  handleTodoToggle,
  handleAsmrToggle,
  handleRealLifeToggle,
  handleDirectPassToggle,
  handleStillenCollapse,
  handleMiloCollapse,
  handleTodoCollapse,
  handleAsmrCollapse,
  handleRealLifeCollapse,
  handleDirectPassCollapse,
  isMobile,
}: CaseStudiesSectionProps) {
  return (
    <section id="case-studies" className="w-full border-y border-pale px-6 sm:px-6" style={{ backgroundColor: '#fcfbfa' }}>
      <div className="hero-breakout mx-auto pt-8 pb-0 sm:pt-20">
        <ScrollSection entryDirection="bottom" motionRole="case-intro">
          <h2 className="type-display-l text-ink">Case Studies</h2>
        </ScrollSection>
      </div>
      <div className="max-w-6xl mx-auto pt-10 pb-14 sm:pt-20 sm:pb-32 relative z-20">
        <div className="space-y-20">
          <article id="case-study-reallife" ref={caseStudyRealLifeRef} className="case-study-card">
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isRealLifeOpen}
              onClose={handleRealLifeCollapse}
              ariaTitle={REAL_LIFE_TITLE}
              contentId="case-study-reallife-content"
              sections={getRealLifeBlueprintSections()}
              cover={
                <button
                  type="button"
                  id="case-study-reallife-toggle"
                  className="case-study-toggle"
                  aria-expanded={isRealLifeOpen}
                  aria-controls="case-study-reallife-content"
                  onClick={handleRealLifeToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title case-study-title-wrap">{REAL_LIFE_TITLE}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <img
                        src={REAL_LIFE_BANNER.src}
                        alt={REAL_LIFE_BANNER.alt}
                        className={REAL_LIFE_BANNER.className}
                        style={REAL_LIFE_BANNER.style}
                      />
                    </div>
                    <p className="type-subhead text-dark">{REAL_LIFE_SUMMARY}</p>
                  </div>
                </button>
              }
            />
          </article>

          <article
            id="case-study-directpass"
            ref={caseStudyDirectPassRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isDirectPassOpen}
              onClose={handleDirectPassCollapse}
              ariaTitle={DIRECTPASS_TITLE}
              contentId="case-study-directpass-content"
              sections={getDirectPassBlueprintSections()}
              cover={
                <button
                  type="button"
                  id="case-study-directpass-toggle"
                  className="case-study-toggle"
                  aria-expanded={isDirectPassOpen}
                  aria-controls="case-study-directpass-content"
                  onClick={handleDirectPassToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title case-study-title-wrap">{DIRECTPASS_TITLE}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <img
                        src={DIRECTPASS_BANNER.src}
                        alt={DIRECTPASS_BANNER.alt}
                        className={DIRECTPASS_BANNER.className}
                        style={DIRECTPASS_BANNER.style}
                      />
                    </div>
                    <p className="type-subhead text-dark">{DIRECTPASS_SUMMARY}</p>
                  </div>
                </button>
              }
            />
          </article>

          <article
            id="case-study-stillen"
            ref={caseStudyStillenRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isStillenOpen}
              onClose={handleStillenCollapse}
              ariaTitle={caseStudy.title}
              contentId="case-study-stillen-content"
              sections={getStillenBlueprintSections({
                title: caseStudy.title,
                role: caseStudy.role,
                timeline: caseStudy.timeline,
                problem: caseStudy.problem,
                process: caseStudy.process,
                exploration: caseStudy.exploration,
                solution: caseStudy.solution,
                prototype: caseStudy.prototype,
              })}
              cover={
                <button
                  type="button"
                  id="case-study-stillen-toggle"
                  className="case-study-toggle"
                  aria-expanded={isStillenOpen}
                  aria-controls="case-study-stillen-content"
                  onClick={handleStillenToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title case-study-title-wrap">{caseStudy.title}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <img
                        src={caseStudy.heroImage}
                        alt={caseStudy.title}
                        className="w-full h-[128px] object-cover object-top sm:h-[176px] md:h-[420px]"
                      />
                    </div>
                    <p className="type-subhead text-dark">{caseStudy.summary}</p>
                  </div>
                </button>
              }
            />
          </article>

          <article
            id="case-study-milo"
            ref={caseStudyMiloRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isMiloOpen}
              onClose={handleMiloCollapse}
              ariaTitle={AI_COMPANION_TITLE}
              contentId="case-study-milo-content"
              sections={getMiloBlueprintSections()}
              cover={
                <button
                  type="button"
                  id="case-study-milo-toggle"
                  className="case-study-toggle"
                  aria-expanded={isMiloOpen}
                  aria-controls="case-study-milo-content"
                  onClick={handleMiloToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title">{AI_COMPANION_TITLE}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <img
                        src={AI_COMPANION_BANNER.src}
                        alt={AI_COMPANION_BANNER.alt}
                        className={AI_COMPANION_BANNER.className}
                        style={AI_COMPANION_BANNER.style}
                      />
                    </div>
                    <p className="type-subhead text-dark">{AI_COMPANION_SUMMARY}</p>
                  </div>
                </button>
              }
            />
          </article>

          <article
            id="case-study-todo"
            ref={caseStudyTodoRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isTodoOpen}
              onClose={handleTodoCollapse}
              ariaTitle={todoProject.title}
              contentId="case-study-todo-content"
              sections={getSyncoBlueprintSections(todoProject)}
              cover={
                <button
                  type="button"
                  id="case-study-todo-toggle"
                  className="case-study-toggle"
                  aria-expanded={isTodoOpen}
                  aria-controls="case-study-todo-content"
                  onClick={handleTodoToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title case-study-title-wrap">{todoProject.title}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <img
                        src={todoProject.imageUrl}
                        alt={todoProject.title}
                        className="w-full h-[128px] object-cover sm:h-[176px] md:h-[420px] md:scale-[1.03] md:origin-top"
                        style={{ objectPosition: '50% 5%' }}
                      />
                    </div>
                    <p className="type-subhead text-dark">{todoProject.intent}</p>
                  </div>
                </button>
              }
            />
          </article>

          <article
            id="case-study-asmr"
            ref={caseStudyAsmrRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isAsmrOpen}
              onClose={handleAsmrCollapse}
              ariaTitle={asmrProject.title}
              contentId="case-study-asmr-content"
              sections={getLumnBlueprintSections(asmrProject)}
              cover={
                <button
                  type="button"
                  id="case-study-asmr-toggle"
                  className="case-study-toggle"
                  aria-expanded={isAsmrOpen}
                  aria-controls="case-study-asmr-content"
                  onClick={handleAsmrToggle}
                >
                  <div className="case-study-cover">
                    <div className="case-study-title-row">
                      <h3 className="type-display-s text-ink case-study-title case-study-title-wrap">{asmrProject.title}</h3>
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <img
                        src={asmrProject.imageUrl}
                        alt={asmrProject.title}
                        className="w-full h-[128px] object-cover sm:h-[176px] md:h-[420px]"
                        style={{ objectPosition: '50% 25%' }}
                      />
                    </div>
                    <p className="type-subhead text-dark">{asmrProject.intent}</p>
                  </div>
                </button>
              }
            />
          </article>

        </div>
      </div>
    </section>
  );
}
