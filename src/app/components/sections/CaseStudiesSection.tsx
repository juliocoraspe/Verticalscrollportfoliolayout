import { RefObject } from 'react';
import { ScrollSection } from '../ScrollSection';
import { CaseStudyContent } from '../CaseStudy';
import { ProjectDetailContent } from '../ProjectDetailContent';
import {
  AI_COMPANION_BANNER,
  AI_COMPANION_SUMMARY,
  AI_COMPANION_TITLE,
  AiCompanionCaseStudyContent,
} from '../AiCompanionCaseStudy';
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
    <section id="case-studies" className="w-full border-y border-pale" style={{ backgroundColor: '#fcfbfa' }}>
      <div className="max-w-6xl mx-auto px-6 py-24 sm:px-8 sm:py-32 relative z-20">
        <ScrollSection entryDirection="bottom" motionRole="case-intro">
          <div className="mb-16">
            <div className="flex flex-wrap items-center gap-3 type-meta text-dark">
              <span className="type-meta uppercase">Case Studies</span>
            </div>
          </div>
        </ScrollSection>

        <div className="space-y-20">
          <article id="case-study-stillen" ref={caseStudyStillenRef} className="case-study-card">
            <button
              type="button"
              id="case-study-stillen-toggle"
              className="case-study-toggle"
              aria-expanded={isStillenOpen}
              aria-controls="case-study-stillen-content"
              onClick={handleStillenToggle}
            >
              <div className="space-y-6">
                <h3 className="type-display-l text-ink case-study-title case-study-title-wrap">{caseStudy.title}</h3>
                <div>
                  <img
                    src={caseStudy.heroImage}
                    alt={caseStudy.title}
                    className="w-full h-auto object-contain md:h-[420px] md:object-cover md:object-top"
                  />
                </div>
                <div className="case-study-subtitle-row">
                  <p className="type-subhead text-dark">{caseStudy.summary}</p>
                  <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
            <div
              id="case-study-stillen-content"
              role="region"
              aria-labelledby="case-study-stillen-toggle"
              hidden={!isStillenOpen}
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
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          <article
            id="case-study-milo"
            ref={caseStudyMiloRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <button
              type="button"
              id="case-study-milo-toggle"
              className="case-study-toggle"
              aria-expanded={isMiloOpen}
              aria-controls="case-study-milo-content"
              onClick={handleMiloToggle}
            >
              <div className="space-y-6">
                <h3 className="type-display-l text-ink case-study-title">{AI_COMPANION_TITLE}</h3>
                <div className="border-y border-pale">
                  <img
                    src={AI_COMPANION_BANNER.src}
                    alt={AI_COMPANION_BANNER.alt}
                    className={AI_COMPANION_BANNER.className}
                    style={AI_COMPANION_BANNER.style}
                  />
                </div>
                <div className="case-study-subtitle-row">
                  <p className="type-subhead text-dark">{AI_COMPANION_SUMMARY}</p>
                  <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
            <div
              id="case-study-milo-content"
              role="region"
              aria-labelledby="case-study-milo-toggle"
              hidden={!isMiloOpen}
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
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          <article
            id="case-study-todo"
            ref={caseStudyTodoRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <button
              type="button"
              id="case-study-todo-toggle"
              className="case-study-toggle"
              aria-expanded={isTodoOpen}
              aria-controls="case-study-todo-content"
              onClick={handleTodoToggle}
            >
              <div className="space-y-6">
                <h3 className="type-display-l text-ink case-study-title case-study-title-wrap">{todoProject.title}</h3>
                <div>
                  <img
                    src={todoProject.imageUrl}
                    alt={todoProject.title}
                    className="w-full h-auto object-contain md:h-[420px] md:object-cover md:object-top"
                  />
                </div>
                <div className="case-study-subtitle-row">
                  <p className="type-subhead text-dark">{todoProject.intent}</p>
                  <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
            <div
              id="case-study-todo-content"
              role="region"
              aria-labelledby="case-study-todo-toggle"
              hidden={!isTodoOpen}
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
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          <article
            id="case-study-asmr"
            ref={caseStudyAsmrRef}
            className="case-study-card border-t border-pale pt-10"
            style={{ borderTopColor: 'rgba(229, 225, 220, 0.5)' }}
          >
            <button
              type="button"
              id="case-study-asmr-toggle"
              className="case-study-toggle"
              aria-expanded={isAsmrOpen}
              aria-controls="case-study-asmr-content"
              onClick={handleAsmrToggle}
            >
              <div className="space-y-6">
                <h3 className="type-display-l text-ink case-study-title case-study-title-wrap">{asmrProject.title}</h3>
                <div>
                  <img
                    src={asmrProject.imageUrl}
                    alt={asmrProject.title}
                    className="w-full h-auto object-cover md:h-[420px]"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </div>
                <div className="case-study-subtitle-row">
                  <p className="type-subhead text-dark">{asmrProject.intent}</p>
                  <svg className="case-study-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
            <div
              id="case-study-asmr-content"
              role="region"
              aria-labelledby="case-study-asmr-toggle"
              hidden={!isAsmrOpen}
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
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
