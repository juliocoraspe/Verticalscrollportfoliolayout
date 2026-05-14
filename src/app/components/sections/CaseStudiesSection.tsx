import { RefObject } from 'react';
import { ScrollSection } from '../ScrollSection';
import { CaseStudyBlueprint } from '../CaseStudyBlueprint';
import { CaseStudyContent, getStillenBlueprintSections } from '../CaseStudy';
import { ProjectDetailContent } from '../ProjectDetailContent';
import {
  AI_COMPANION_BANNER,
  AI_COMPANION_SUMMARY,
  AI_COMPANION_TITLE,
  AiCompanionCaseStudyContent,
  getMiloBlueprintSections,
} from '../AiCompanionCaseStudy';
import { getSyncoBlueprintSections, getLumnBlueprintSections } from '../ProjectDetailContent';
import type { Project } from '../../data/projects';

type CaseStudy = {
  title: string;
  role: string;
  timeline: string;
  summary: string;
  heroImage: string;
  problem: { title: string; description: string };
  process: { title: string; description: string; steps: string[] };
  exploration: { title: string; description: string; images: string[] };
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
  caseStudyStillenRef: RefObject<HTMLElement | null>;
  caseStudyMiloRef: RefObject<HTMLElement | null>;
  caseStudyTodoRef: RefObject<HTMLElement | null>;
  caseStudyAsmrRef: RefObject<HTMLElement | null>;
  handleStillenToggle: () => void;
  handleMiloToggle: () => void;
  handleTodoToggle: () => void;
  handleAsmrToggle: () => void;
  handleStillenCollapse: () => void;
  handleMiloCollapse: () => void;
  handleTodoCollapse: () => void;
  handleAsmrCollapse: () => void;
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
  caseStudyStillenRef,
  caseStudyMiloRef,
  caseStudyTodoRef,
  caseStudyAsmrRef,
  handleStillenToggle,
  handleMiloToggle,
  handleTodoToggle,
  handleAsmrToggle,
  handleStillenCollapse,
  handleMiloCollapse,
  handleTodoCollapse,
  handleAsmrCollapse,
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
          <article id="case-study-stillen" ref={caseStudyStillenRef} className="case-study-card">
            <CaseStudyBlueprint
              isMobile={isMobile}
              isOpen={isStillenOpen}
              onClose={handleStillenCollapse}
              ariaTitle={caseStudy.title}
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
                  <div className="space-y-6">
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
              classicMobileContent={
                <div
                  id="case-study-stillen-content"
                  role="region"
                  aria-labelledby="case-study-stillen-toggle"
                  className="case-study-content mt-16"
                >
                  <CaseStudyContent
                    title={caseStudy.title}
                    role={caseStudy.role}
                    timeline={caseStudy.timeline}
                    problem={caseStudy.problem}
                    process={caseStudy.process}
                    exploration={caseStudy.exploration}
                    solution={caseStudy.solution}
                    prototype={caseStudy.prototype}
                    disableAnimation={isMobile}
                  />
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="case-study-collapse-button"
                      aria-label="Collapse case study"
                      onClick={handleStillenCollapse}
                    >
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  <div className="space-y-6">
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
              classicMobileContent={
                <div
                  id="case-study-milo-content"
                  role="region"
                  aria-labelledby="case-study-milo-toggle"
                  className="case-study-content mt-16"
                >
                  <AiCompanionCaseStudyContent disableAnimation={isMobile} />
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="case-study-collapse-button"
                      aria-label="Collapse case study"
                      onClick={handleMiloCollapse}
                    >
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  <div className="space-y-6">
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
              classicMobileContent={
                <div
                  id="case-study-todo-content"
                  role="region"
                  aria-labelledby="case-study-todo-toggle"
                  className="case-study-content mt-16"
                >
                  <ProjectDetailContent project={todoProject} />
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="case-study-collapse-button"
                      aria-label="Collapse case study"
                      onClick={handleTodoCollapse}
                    >
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  <div className="space-y-6">
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
              classicMobileContent={
                <div
                  id="case-study-asmr-content"
                  role="region"
                  aria-labelledby="case-study-asmr-toggle"
                  className="case-study-content mt-16"
                >
                  <ProjectDetailContent project={asmrProject} />
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="case-study-collapse-button"
                      aria-label="Collapse case study"
                      onClick={handleAsmrCollapse}
                    >
                      <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M3 10H16M11 5L16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              }
            />
          </article>
        </div>
      </div>
    </section>
  );
}
