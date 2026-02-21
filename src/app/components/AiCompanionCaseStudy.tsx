import { memo } from 'react';
import { FigmaEmbed } from './embeds/FigmaEmbed';
import { DeferredIframe } from './DeferredIframe';
import { ScrollSection } from './ScrollSection';
import { useIsMobile } from './ui/use-mobile';
import miloBanner from '../../assets/images/Milo 2.svg';
import miloMobile from '../../assets/images/Milo_mobile.jpg';
import miloPrototype from '../../assets/images/Milo_prototype.png';

const FIGMA_EMBED_URL =
  'https://embed.figma.com/design/JIjE307GOTQI96gbCzj0N0/Milo?node-id=0-1&embed-host=share';
const GITHUB_PAGES_EMBED_URL = 'https://juliocoraspe.github.io/Milo/'; // TODO: Replace GITHUB_PAGES_EMBED_URL

export const AI_COMPANION_TITLE = 'Milo: Voice-First AI Companion';
export const AI_COMPANION_SUMMARY =
  'Designed a behavior-driven voice AI companion focused on emotional presence. Modeled interaction logic, motion systems, and adaptive states through AI-assisted prototyping workflows.';
export const AI_COMPANION_BANNER = {
  src: miloBanner,
  alt: 'Milo interface banner',
  className: 'w-full h-auto object-contain md:h-[420px] md:object-cover md:object-top',
  style: { backgroundColor: '#F0F3F3' },
};

interface AiCompanionCaseStudyContentProps {
  disableAnimation?: boolean;
}

function AiCompanionCaseStudyContentComponent({
  disableAnimation = false,
}: AiCompanionCaseStudyContentProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-24">
      <div className="grid md:grid-cols-[1fr_2fr] gap-10">
        <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
          <p className="type-section-title text-dark uppercase">CONTEXT</p>
        </ScrollSection>
        <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
          <p className="type-body text-ink">
            Designed as an interface study for AI companionship rather than task execution. The goal is to explore
            how a system can feel continuously present—like a conversational partner—through pacing, subtle motion,
            and state-based feedback.
          </p>
        </ScrollSection>
      </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">FOUNDATION RESEARCH</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-body text-ink">
              This project’s foundation draws from established Human-AI Interaction guidance and interaction design
              systems, including Google’s People + AI Guidebook (PAIR), Microsoft’s Guidelines for Human-AI
              Interaction, Apple Human Interface Guidelines (motion + feedback), OpenAI’s Safety Best Practices, and
              Anthropic’s work on Constitutional AI. These sources emphasize transparency, communication of system
              status, predictability, gradual engagement, and human control.
            </p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">DESIGN HYPOTHESES</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-body text-ink">
              If an AI companion is meant to feel present rather than transactional, its interface should communicate
              “state” through continuous, calm feedback instead of abrupt UI changes. If conversation is ongoing rather
              than task-based, the system should prioritize gradual transitions, restrained contrast, and ambient
              motion that signals presence without demanding attention.
            </p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">INTERACTION STATES &amp; SYSTEM THINKING</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-body text-ink">
              The interface is organized around interaction states rather than isolated screens. States include idle
              presence, listening, thinking, speaking, uncertainty, and error/disconnected. Each state represents a
              shift in system behavior, communicated through rhythm, motion, and subtle visual modulation rather than
              explicit labels.
            </p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">IDEATION &amp; VISUAL DIRECTION</p>
          </ScrollSection>
          <div className="space-y-6">
            <ScrollSection
              entryDirection="bottom"
              motionRole="case-block"
              disableTransform
              disableAnimation={disableAnimation}
            >
              <p className="type-body text-ink">
                The visual system is intentionally minimal: a neutral background, restrained color usage, and organic
                forms to reduce distraction. Motion is slow and ambient—designed to suggest life and continuity. Visual
                ambiguity is used deliberately to support interpretation rather than enforce meaning.
              </p>
            </ScrollSection>
            <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
              <div className="space-y-4 border-t border-pale pt-6">
                <div
                  className="border border-pale"
                  style={
                    isMobile
                      ? { width: 'calc(100% - 32px)', marginInline: 'auto' }
                      : { width: 'calc((100% - 2.75rem) + 1px)' }
                  }
                >
                  <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                    {isMobile ? (
                      <div className="relative h-full w-full overflow-hidden">
                        <a
                          href={FIGMA_EMBED_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full w-full"
                          aria-label="Open Milo prototype in Figma"
                        >
                          <img
                            src={miloMobile}
                            alt="Milo ideation static preview"
                            className="h-full w-full object-cover"
                            style={{ objectPosition: 'top center', clipPath: 'inset(0 0 48px 0)' }}
                          />
                          <span className="absolute inset-x-0 bottom-0 flex h-12 items-center border-t border-pale bg-pure px-6 type-meta text-dark">
                            Open Figma Design
                          </span>
                        </a>
                      </div>
                    ) : (
                      <FigmaEmbed
                        title="AI Companion Interface Figma exploration"
                        src={FIGMA_EMBED_URL}
                        wrapperClassName="h-full w-full"
                        iframeClassName="h-full w-full border-0"
                        allow="fullscreen"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start">
          <ScrollSection
            entryDirection="bottom"
            motionRole="case-block"
            disableTransform
            disableAnimation={disableAnimation}
          >
            <div className="space-y-6">
              <p className="type-section-title text-dark uppercase">Prototyping and Technical Execution</p>
              <div className="space-y-6">
                <p className="type-body text-ink">
                  The prototyping process for this project followed a progressive transition from static design to
                  interactive implementation.
                </p>
                <p className="type-body text-ink">
                  Initial exploration and system definition were conducted in Figma, where the interface structure,
                  state-based logic, and visual hierarchy were established as static artifacts. This phase focused on
                  defining interaction states, typographic behavior, color systems, and pacing without committing to
                  implementation constraints.
                </p>
                <p className="type-body text-ink">
                  To introduce motion, temporal behavior, and interaction flow, the design was extended using Figma
                  Make. This allowed the interface to evolve from static layouts into a dynamic prototype, simulating
                  transitions, ambient motion, and state-driven feedback as a system rather than isolated screens.
                </p>
                <p className="type-body text-ink">
                  Technical refinement and behavioral adjustments were then carried out directly in code using Codex
                  within Visual Studio Code. This phase focused on translating the visual and interaction principles
                  into executable logic, refining motion timing, state transitions, and system responsiveness beyond
                  what was possible in design-only tools.
                </p>
                <p className="type-body text-ink">
                  The final prototype was deployed using GitHub Pages, serving as a lightweight environment to
                  validate the system in a real runtime context. This step ensured that design decisions related to
                  pacing, motion, and state communication could be evaluated under actual performance and rendering
                  conditions.
                </p>
                <p className="type-body text-ink">
                  This workflow intentionally avoids strict separation between design and implementation, treating
                  code as an extension of the design process rather than a downstream deliverable.
                </p>
              </div>
            </div>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-[390px] border border-pale bg-pure overflow-hidden">
                <div className="w-full max-w-[390px] sm:hidden px-6">
                  <p className="type-micro text-dark mt-3 mb-3">Click the image to open the full prototype.</p>
                </div>
                <div className="relative w-full bg-pure overflow-hidden" style={{ aspectRatio: '390 / 720' }}>
                  <a
                    href={GITHUB_PAGES_EMBED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 sm:hidden"
                    aria-label="Open Milo prototype"
                  >
                    <img src={miloPrototype} alt="Milo prototype preview" className="h-full w-full object-cover" />
                  </a>
                  <div className="hidden sm:block absolute inset-0">
                    <DeferredIframe
                      title="AI Companion Interface embedded prototype"
                      src={GITHUB_PAGES_EMBED_URL}
                      wrapperClassName="absolute inset-0"
                      className="h-full w-full border-0 no-scrollbar"
                      scrolling="no"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pale p-6">
                  <p className="type-body text-ink">Milo Exploration</p>
                  <a
                    href="https://github.com/juliocoraspe/Milo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-meta uppercase text-accent"
                  >
                    See full code on GitHub
                  </a>
                </div>
              </div>
            </div>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">OUTCOME</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-body text-ink">
              The outcome of this phase is not a finished product, but a validated interaction foundation: a
              state-driven visual language, motion pacing rules, and a UI system that can support future prototyping,
              testing, and implementation.
            </p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">What Comes Next</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <div className="space-y-6">
              <p className="type-body text-ink">
                The next phase of this project focuses on refining the visual system rather than expanding
                functionality. This includes further calibration of typographic scale and hierarchy to ensure
                clarity, rhythm, and accessibility across different interaction states.
              </p>
              <p className="type-body text-ink">
                Additional exploration will focus on the color behavior and motion logic of the perimeter gradients,
                refining how state transitions are expressed through subtle shifts in intensity, timing, and spatial
                presence. Background animations will also be revisited to better align motion pacing with longer,
                sustained interactions.
              </p>
              <p className="type-body text-ink">
                As the interface grows, defining a formal design system becomes essential. Establishing reusable rules
                for color, typography, motion, and state behavior will allow the system to scale consistently while
                preserving its emotional and experiential intent.
              </p>
              <p className="type-body text-ink">
                Future design work will also explore additional interface surfaces beyond the core screen, expanding
                the system into supporting views and complementary interaction moments that maintain continuity
                without introducing visual noise.
              </p>
            </div>
          </ScrollSection>
        </div>
    </div>
  );
}

export const AiCompanionCaseStudyContent = memo(AiCompanionCaseStudyContentComponent);
