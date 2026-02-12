import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './ui/use-mobile';
import { useViewportWidth } from '../hooks/use-viewport-width';
import { FigmaEmbed } from './embeds/FigmaEmbed';
import { DemoHost } from './demos/DemoHost';
import type { Project } from '../data/projects';
import lumnPreview from '../../assets/images/Lumn.jpg';
import todoPreview from '../../assets/images/todo-app.png';

type ProjectDetailContentProps = {
  project: Project;
};

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const isMobile = useIsMobile();
  const viewportWidth = useViewportWidth();
  const asmrOutcomeEmbedRef = useRef<HTMLDivElement | null>(null);
  const [asmrOutcomeScale, setAsmrOutcomeScale] = useState(1);

  const isFigmaPrototype = Boolean(project.prototypeUrl?.includes('figma.com'));
  const isFigmaOutcome = Boolean(project.outcomeEmbedUrl?.includes('figma.com'));
  const todoPrototypeUrl = project.id === 'todo-app' ? project.prototypeUrl ?? '' : '';
  const todoOutcomeUrl = project.id === 'todo-app' ? project.outcomeEmbedUrl ?? '' : '';
  const todoGithubUrl = 'https://github.com/juliocoraspe/todo-app-calendar-sync';

  const outcomeEmbedConfig = project.outcomeEmbedConfig;
  const hasScaledOutcomeEmbed = Boolean(project.outcomeEmbedUrl && outcomeEmbedConfig);
  const outcomeEmbedMode = project.outcomeEmbedMode ?? 'scaled';
  const outcomeEmbedIsResponsive = outcomeEmbedMode === 'responsive';
  const outcomeEmbedBaseScale = outcomeEmbedConfig?.scale ?? 0.6;
  const outcomeEmbedWidth = outcomeEmbedConfig?.width ?? 430;
  const outcomeEmbedHeight = outcomeEmbedConfig?.height ?? 764;
  const outcomeEmbedContentConfig = project.outcomeEmbedContentConfig;
  const outcomeEmbedContentWidth = outcomeEmbedContentConfig?.width ?? outcomeEmbedWidth;
  const outcomeEmbedContentHeight = outcomeEmbedContentConfig?.height ?? outcomeEmbedHeight;
  const outcomeEmbedContentFit = outcomeEmbedContentConfig?.fit ?? 'contain';
  const asmrEmbedAlignTop = outcomeEmbedContentFit === 'cover-width';
  const asmrEmbedUseFrameSize = outcomeEmbedContentFit === 'frame';
  const outcomeEmbedContentOffsetX = outcomeEmbedContentConfig?.offsetX ?? 0;
  const outcomeEmbedContentOffsetY = outcomeEmbedContentConfig?.offsetY ?? 0;
  const shouldScaleAsmrOutcomeEmbed =
    project.id === 'asmr-app' && outcomeEmbedIsResponsive && Boolean(outcomeEmbedConfig);

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

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-8 sm:py-16">
      <div className="space-y-12">
        <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
          <p className="type-section-title text-dark uppercase">Context</p>
          <p className="type-body text-ink">{project.context}</p>
        </section>

        <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
          <p className="type-section-title text-dark uppercase">Problem</p>
          <p className="type-body text-ink whitespace-pre-line">{project.problem}</p>
        </section>

        <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
          <p className="type-section-title text-dark uppercase">Process</p>
          <div className="space-y-4">
            {project.process.map((step) => (
              <p key={step} className="type-body text-ink border-b border-pale pb-3">
                {step}
              </p>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6">
          <p className="type-section-title text-dark uppercase">Solution</p>
          <p className="type-body text-ink whitespace-pre-line">{project.solution}</p>
        </section>

        {project.id === 'todo-app' ? (
          <section className="grid gap-8 border-t border-pale pt-6 items-start md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-8 md:space-y-6">
              <p className="type-section-title text-dark uppercase">Prototype</p>
              {project.outcome.map((item) => (
                <p key={item} className="type-body text-ink">
                  {item}
                </p>
              ))}
            </div>
            {hasScaledOutcomeEmbed ? (
              <div className="flex justify-center md:justify-end">
                <div
                  className="w-full max-w-[390px] sm:max-w-none border border-pale bg-pure overflow-hidden"
                  style={{
                    width: outcomeEmbedIsResponsive ? '100%' : outcomeEmbedScaledWidth,
                    maxWidth: '100%',
                  }}
                >
                  <a
                    href={todoOutcomeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-pale px-6 py-4 text-left sm:hidden"
                    aria-label="Click the image to open the full prototype"
                  >
                    <p className="type-micro text-dark">Click the image to open the full prototype</p>
                  </a>
                  <div
                    ref={shouldScaleAsmrOutcomeEmbed ? asmrOutcomeEmbedRef : undefined}
                    className="relative w-full bg-pure overflow-hidden"
                    style={{
                      height: outcomeEmbedIsResponsive ? 'auto' : outcomeEmbedScaledHeight,
                      aspectRatio: outcomeEmbedIsResponsive ? `${outcomeEmbedWidth} / ${outcomeEmbedHeight}` : undefined,
                    }}
                  >
                    <a
                      href={todoOutcomeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 sm:hidden"
                      aria-label="Open To-Do prototype"
                    >
                      <img src={todoPreview} alt="To-Do prototype preview" className="h-full w-full object-cover" />
                    </a>
                    <div className="hidden sm:block absolute inset-0">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-3 bg-cloud"
                      />
                      {outcomeEmbedIsResponsive ? (
                        isFigmaOutcome ? (
                          <FigmaEmbed
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl ?? ''}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        ) : (
                          <DemoHost
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        )
                      ) : (
                        <iframe
                          title={`${project.title} outcome embed`}
                          src={project.outcomeEmbedUrl}
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
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pale p-6">
                    <p className="type-body text-ink">To-Do App Exploration</p>
                    <a
                      href={todoGithubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta uppercase text-accent"
                    >
                      See full code on GitHub
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : project.id === 'asmr-app' ? (
          <section className="grid gap-8 border-t border-pale pt-6 items-start md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-8 md:space-y-6">
              <p className="type-section-title text-dark uppercase">Prototype</p>
              {project.outcome.map((item) => (
                <p key={item} className="type-body text-ink">
                  {item}
                </p>
              ))}
            </div>
            {hasScaledOutcomeEmbed ? (
              <>
                <div className="flex flex-col items-center sm:hidden">
                  <div className="w-full max-w-[390px] border border-pale bg-pure overflow-hidden">
                    <div className="border-b border-pale px-6 py-3">
                      <p className="type-micro text-dark">Click the image to open the full prototype.</p>
                    </div>
                    <a
                      href={project.outcomeEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      aria-label="Open Lumen exploration"
                    >
                      <div className="relative w-full bg-pure overflow-hidden" style={{ aspectRatio: '390 / 720' }}>
                        <img src={lumnPreview} alt="Lumen exploration preview" className="h-full w-full object-cover" />
                      </div>
                    </a>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pale p-6">
                      <p className="type-body text-ink">LUMN Exploration</p>
                      <a
                        href="https://github.com/juliocoraspe/birdsong-viz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-meta uppercase text-accent"
                      >
                        See full code on GitHub
                      </a>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-full flex justify-center md:justify-end">
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
                      {outcomeEmbedIsResponsive ? (
                        shouldScaleAsmrOutcomeEmbed ? (
                          <iframe
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl}
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
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl ?? ''}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        ) : (
                          <DemoHost
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        )
                      ) : (
                        <iframe
                          title={`${project.title} outcome embed`}
                          src={project.outcomeEmbedUrl}
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
                  </div>
                  {project.outcomeEmbedArrowPlacement === 'above' && (
                    <span className="type-micro text-dark mt-3">
                      {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                  {project.outcomeEmbedCta && (
                    <p className="type-meta text-accent mt-1 text-center">{project.outcomeEmbedCta}</p>
                  )}
                  <a
                    href={project.outcomeEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-meta text-accent mt-2 text-center hover:underline"
                  >
                    Want full interaction with the activated microphone? Open the demo in a new tab.
                  </a>
                  {project.outcomeEmbedArrowPlacement === 'below' && (
                    <span className="type-micro text-dark mt-1">
                      {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </>
            ) : null}
          </section>
        ) : (
          <section
            className={`grid gap-8 border-t border-pale pt-6 items-start ${
              hasScaledOutcomeEmbed
                ? project.id === 'asmr-app'
                  ? 'md:grid-cols-[200px_minmax(0,1fr)_360px] lg:grid-cols-[200px_minmax(0,1fr)_420px]'
                  : 'md:grid-cols-[200px_minmax(0,1fr)_280px] lg:grid-cols-[200px_minmax(0,1fr)_320px]'
                : 'md:grid-cols-[200px_minmax(0,1fr)]'
            }`}
          >
            <p className="type-section-title text-dark uppercase">Prototype</p>
            <div className="space-y-3">
              {project.outcome.map((item) => (
                <p key={item} className="type-body text-ink">
                  {item}
                </p>
              ))}
            </div>
            {hasScaledOutcomeEmbed ? (
              project.id === 'asmr-app' ? (
                <>
                  <div className="flex flex-col items-center sm:hidden">
                    <div className="w-full max-w-[390px]">
                      <p className="type-micro text-dark mb-3">Click the image to open the full prototype.</p>
                    </div>
                    <div className="w-full max-w-[390px] border border-pale bg-pure overflow-hidden">
                      <a
                        href={project.outcomeEmbedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        aria-label="Open Lumen exploration"
                      >
                        <div className="relative w-full bg-pure overflow-hidden" style={{ aspectRatio: '390 / 720' }}>
                          <img src={lumnPreview} alt="Lumen exploration preview" className="h-full w-full object-cover" />
                        </div>
                      </a>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pale p-6">
                        <p className="type-body text-ink">Lumen Exploration</p>
                        <a
                          href="https://github.com/juliocoraspe/birdsong-viz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-meta uppercase text-accent"
                        >
                          See full code on GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-center">
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
                      {outcomeEmbedIsResponsive ? (
                        shouldScaleAsmrOutcomeEmbed ? (
                          <iframe
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl}
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
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl ?? ''}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        ) : (
                          <DemoHost
                            title={`${project.title} outcome embed`}
                            src={project.outcomeEmbedUrl}
                            wrapperClassName="absolute left-0 top-0 h-full w-full"
                            iframeClassName="h-full w-full border-0 no-scrollbar"
                          />
                        )
                      ) : (
                        <iframe
                          title={`${project.title} outcome embed`}
                          src={project.outcomeEmbedUrl}
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
                    {project.outcomeEmbedArrowPlacement === 'above' && (
                      <span className="type-micro text-dark mt-3">
                        {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                      </span>
                    )}
                    {project.outcomeEmbedCta && (
                      <p className="type-meta text-accent mt-1 text-center">{project.outcomeEmbedCta}</p>
                    )}
                    <a
                      href={project.outcomeEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta text-accent mt-2 text-center hover:underline"
                    >
                      Want full interaction with the activated microphone? Open the demo in a new tab.
                    </a>
                    {project.outcomeEmbedArrowPlacement === 'below' && (
                      <span className="type-micro text-dark mt-1">
                        {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </>
              ) : (
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
                    {project.id === 'todo-app' && (
                      <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-full w-3 bg-cloud" />
                    )}
                    {outcomeEmbedIsResponsive ? (
                      isFigmaOutcome ? (
                        <FigmaEmbed
                          title={`${project.title} outcome embed`}
                          src={project.outcomeEmbedUrl ?? ''}
                          wrapperClassName="absolute left-0 top-0 h-full w-full"
                          iframeClassName="h-full w-full border-0 no-scrollbar"
                        />
                      ) : (
                        <DemoHost
                          title={`${project.title} outcome embed`}
                          src={project.outcomeEmbedUrl}
                          wrapperClassName="absolute left-0 top-0 h-full w-full"
                          iframeClassName="h-full w-full border-0 no-scrollbar"
                        />
                      )
                    ) : (
                      <iframe
                        title={`${project.title} outcome embed`}
                        src={project.outcomeEmbedUrl}
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
                  {project.outcomeEmbedArrowPlacement === 'above' && (
                    <span className="type-micro text-dark mt-3">
                      {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                  {project.outcomeEmbedCta && (
                    <p className="type-meta text-accent mt-1 text-center">{project.outcomeEmbedCta}</p>
                  )}
                  {project.outcomeEmbedArrowPlacement === 'below' && (
                    <span className="type-micro text-dark mt-1">
                      {project.outcomeEmbedArrow === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )
            ) : null}
          </section>
        )}

        <section
          id="outcome"
          aria-labelledby="outcome-title"
          className="grid md:grid-cols-[200px_1fr] gap-8 border-t border-pale pt-6"
        >
          <p id="outcome-title" className="type-section-title uppercase text-accent">
            Outcome
          </p>
          <div id="outcome-embed" className="border border-pale">
            {project.prototypeSummary && (
              <div className="p-6 border-b border-pale">
                <p className="type-body text-ink whitespace-pre-line">{project.prototypeSummary}</p>
              </div>
            )}
            {project.prototypeUrl ? (
              <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                {isFigmaPrototype ? (
                  <FigmaEmbed
                    title={`${project.title} prototype`}
                    src={project.prototypeUrl}
                    wrapperClassName="h-full w-full"
                    iframeClassName="h-full w-full border-0"
                  />
                ) : (
                  <iframe
                    title={`${project.title} prototype`}
                    src={project.prototypeUrl}
                    className="w-full h-full"
                    loading="lazy"
                    allow="fullscreen"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video w-full border-b border-pale bg-pure flex items-center justify-center text-center p-6">
                <p className="type-body text-dark">{project.prototypeLabel}</p>
              </div>
            )}
            {project.demoLabel && (
              <div className="p-6 flex flex-wrap gap-6">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-meta uppercase text-accent"
                  >
                    {project.demoLabel}
                  </a>
                ) : (
                  <span className="type-meta uppercase text-accent">{project.demoLabel}</span>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
