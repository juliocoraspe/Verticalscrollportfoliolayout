import { RefObject } from 'react';
import { motion } from 'motion/react';
import { FigmaEmbed } from '../embeds/FigmaEmbed';
import { DemoHost } from '../demos/DemoHost';

type Project = {
  id: string;
  title: string;
  intent: string;
  role: string;
  context: string;
  problem: string;
  process: string[];
  solution: string;
  outcome: string[];
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: 'center' | 'top' | 'bottom';
  introEmbedUrl?: string;
  introEmbedLabel?: string;
  outcomeEmbedUrl?: string;
  outcomeEmbedArrow?: 'up' | 'down';
  outcomeEmbedArrowPlacement?: 'above' | 'below';
  outcomeEmbedCta?: string;
  prototypeSummary?: string;
  prototypeUrl?: string;
  prototypeLabel?: string;
  demoLabel?: string;
  demoUrl?: string;
};

type ProjectModalProps = {
  activeProject: Project;
  shouldReduceMotion: boolean;
  onClose: () => void;
  hasIntroEmbed: boolean;
  introEmbedIsResponsive: boolean;
  introEmbedWidth: number;
  introEmbedHeight: number;
  introEmbedScaledWidth: number;
  introEmbedScaledHeight: number;
  introEmbedScale: number;
  hasScaledOutcomeEmbed: boolean;
  outcomeEmbedIsResponsive: boolean;
  outcomeEmbedWidth: number;
  outcomeEmbedHeight: number;
  outcomeEmbedScaledWidth: number;
  outcomeEmbedScaledHeight: number;
  outcomeEmbedScale: number;
  shouldScaleAsmrOutcomeEmbed: boolean;
  asmrOutcomeEmbedRef: RefObject<HTMLDivElement | null>;
  asmrOutcomeScale: number;
  outcomeEmbedContentWidth: number;
  outcomeEmbedContentHeight: number;
  asmrEmbedAlignTop: boolean;
  asmrEmbedUseFrameSize: boolean;
  outcomeEmbedContentOffsetX: number;
  outcomeEmbedContentOffsetY: number;
};

export function ProjectModal({
  activeProject,
  shouldReduceMotion,
  onClose,
  hasIntroEmbed,
  introEmbedIsResponsive,
  introEmbedWidth,
  introEmbedHeight,
  introEmbedScaledWidth,
  introEmbedScaledHeight,
  introEmbedScale,
  hasScaledOutcomeEmbed,
  outcomeEmbedIsResponsive,
  outcomeEmbedWidth,
  outcomeEmbedHeight,
  outcomeEmbedScaledWidth,
  outcomeEmbedScaledHeight,
  outcomeEmbedScale,
  shouldScaleAsmrOutcomeEmbed,
  asmrOutcomeEmbedRef,
  asmrOutcomeScale,
  outcomeEmbedContentWidth,
  outcomeEmbedContentHeight,
  asmrEmbedAlignTop,
  asmrEmbedUseFrameSize,
  outcomeEmbedContentOffsetX,
  outcomeEmbedContentOffsetY,
}: ProjectModalProps) {
  const isFigmaPrototype = Boolean(activeProject.prototypeUrl?.includes('figma.com'));
  const isFigmaOutcome = Boolean(activeProject.outcomeEmbedUrl?.includes('figma.com'));

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-pure text-ink overflow-y-auto no-scrollbar"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
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
          <div className="space-y-3">
            {hasIntroEmbed && activeProject.introEmbedLabel && (
              <p className="type-micro text-dark">{activeProject.introEmbedLabel}</p>
            )}
            <div
              className={`border border-pale bg-pure max-w-full ${hasIntroEmbed ? 'relative overflow-hidden' : ''}`}
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
                    loading="lazy"
                    allow="fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    title={`${activeProject.title} live embed`}
                    src={activeProject.introEmbedUrl}
                    className="absolute left-0 top-0 origin-top-left border-0"
                    loading="lazy"
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
                  ref={shouldScaleAsmrOutcomeEmbed ? asmrOutcomeEmbedRef : undefined}
                  className="relative overflow-hidden rounded-[24px] border border-pale bg-pure"
                  style={{
                    width: outcomeEmbedIsResponsive ? '100%' : outcomeEmbedScaledWidth,
                    height: outcomeEmbedIsResponsive ? 'auto' : outcomeEmbedScaledHeight,
                    aspectRatio: outcomeEmbedIsResponsive ? `${outcomeEmbedWidth} / ${outcomeEmbedHeight}` : undefined,
                    maxWidth: '100%',
                  }}
                >
                  {activeProject.id === 'todo-app' && (
                    <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-full w-3 bg-cloud" />
                  )}
                  {outcomeEmbedIsResponsive ? (
                    shouldScaleAsmrOutcomeEmbed ? (
                      <iframe
                        title={`${activeProject.title} outcome embed`}
                        src={activeProject.outcomeEmbedUrl}
                        className="absolute border-0 no-scrollbar"
                        loading="lazy"
                        allow="fullscreen; clipboard-read; clipboard-write; autoplay; microphone; camera"
                        allowFullScreen
                        style={
                          asmrEmbedUseFrameSize
                            ? {
                                width: `calc(100% + ${outcomeEmbedContentOffsetX}px)`,
                                height: `calc(100% + ${outcomeEmbedContentOffsetY}px)`,
                                left: `${-outcomeEmbedContentOffsetX}px`,
                                top: `${-outcomeEmbedContentOffsetY}px`,
                                transform: 'none',
                              }
                            : {
                                width: outcomeEmbedContentWidth,
                                height: outcomeEmbedContentHeight,
                                left: asmrEmbedAlignTop ? '0' : '50%',
                                top: asmrEmbedAlignTop ? '0' : '50%',
                                transform: asmrEmbedAlignTop
                                  ? `scale(${asmrOutcomeScale})`
                                  : `translate(-50%, -50%) scale(${asmrOutcomeScale})`,
                              }
                        }
                      />
                    ) : isFigmaOutcome ? (
                      <FigmaEmbed
                        title={`${activeProject.title} outcome embed`}
                        src={activeProject.outcomeEmbedUrl ?? ''}
                        wrapperClassName="absolute left-0 top-0 h-full w-full"
                        iframeClassName="h-full w-full border-0 no-scrollbar"
                      />
                    ) : (
                      <DemoHost
                        title={`${activeProject.title} outcome embed`}
                        src={activeProject.outcomeEmbedUrl}
                        wrapperClassName="absolute left-0 top-0 h-full w-full"
                        iframeClassName="h-full w-full border-0 no-scrollbar"
                      />
                    )
                  ) : (
                    <iframe
                      title={`${activeProject.title} outcome embed`}
                      src={activeProject.outcomeEmbedUrl}
                      className="absolute left-0 top-0 origin-top-left border-0 no-scrollbar"
                      loading="lazy"
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
                  <p className="type-meta text-accent mt-1 text-center">{activeProject.outcomeEmbedCta}</p>
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
                  <p className="type-body text-ink whitespace-pre-line">{activeProject.prototypeSummary}</p>
                </div>
              )}
              {activeProject.prototypeUrl ? (
                <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                  {isFigmaPrototype ? (
                    <FigmaEmbed
                      title={`${activeProject.title} prototype`}
                      src={activeProject.prototypeUrl}
                      wrapperClassName="h-full w-full"
                      iframeClassName="h-full w-full border-0"
                    />
                  ) : (
                    <iframe
                      title={`${activeProject.title} prototype`}
                      src={activeProject.prototypeUrl}
                      className="w-full h-full"
                      loading="lazy"
                      allow="fullscreen"
                      allowFullScreen
                    />
                  )}
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
                    <span className="type-meta uppercase text-accent">{activeProject.demoLabel}</span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
