import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './ui/use-mobile';
import { useViewportWidth } from '../hooks/use-viewport-width';
import { FigmaEmbed } from './embeds/FigmaEmbed';
import { DemoHost } from './demos/DemoHost';
import type { Project } from '../data/projects';
import type { BlueprintSection } from './CaseStudyBlueprint';
import lumnPreview from '../../assets/images/Lumn.jpg';
import todoPreview from '../../assets/images/todo-app.png';
import lumnMobile from '../../assets/images/LUMN_mobile.jpg';
import todoMobile from '../../assets/images/Synco-mobile2.jpg';
import syncoOutcomeMobile from '../../assets/images/Synco-mobile2.jpg';

type ProjectDetailContentProps = {
  project: Project;
};

export function getSyncoBlueprintSections(project: Project): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: <p>{project.context}</p>,
    },
    {
      id: '02',
      label: 'Problem',
      body: <p>{project.problem}</p>,
    },
    {
      id: '03',
      label: 'Process',
      body: (
        <ul>
          {project.process.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ),
    },
    {
      id: '04',
      label: 'Solution',
      body: <p>{project.solution}</p>,
    },
    {
      id: '05',
      label: 'Prototype',
      layout: 'vsplit',
      body: (
        <div className="cs-bp-vsplit">
          <div className="cs-bp-vsplit-text">
            <div className="cs-bp-vsplit-title-row">
              <span className="cs-bp-display-num" aria-hidden="true">05</span>
              <h4 className="cs-bp-display-title">Prototype</h4>
            </div>
            <div className="cs-bp-vsplit-body">
              <p>
                Built a coded prototype to test the app&apos;s core value: syncing tasks with the
                user&apos;s native calendar.
              </p>
              <p>
                This helped move the concept beyond static screens and validate the interaction in a
                more tangible way.
              </p>
            </div>
            <div className="cs-bp-vsplit-cta">
              <a
                className="cs-bp-cta"
                href="https://github.com/juliocoraspe/Synco"
                target="_blank"
                rel="noopener noreferrer"
              >
                See full code on GitHub
                <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div
            className="cs-bp-vsplit-media"
            style={{ ['--media-aspect' as string]: '390 / 844' }}
          >
            <div
              className="cs-bp-vsplit-media-frame"
              style={{
                ['--frame-w' as string]: '390px',
                ['--frame-h' as string]: '844px',
                ['--frame-scale' as string]: '0.582',
              }}
            >
              <FigmaEmbed
                title={`${project.title} prototype`}
                src="https://juliocoraspe.github.io/Synco/"
                wrapperClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                iframeClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                mobileStaticImageSrc={todoPreview}
                mobileStaticImageAlt={`${project.title} prototype preview`}
                mobileStaticImageObjectFit="cover"
                mobileLinkHref="https://github.com/juliocoraspe/Synco"
                mobileLinkLabel="See full code on GitHub"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '06',
      label: 'Outcome',
      body: (
        <>
          <ul>
            {project.outcome.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title={`${project.title} outcome slides`}
                src={project.prototypeUrl ?? ''}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                mobileStaticImageSrc={syncoOutcomeMobile}
                mobileStaticImageAlt="Synco outcome static preview"
                mobileLinkLabel="Open Figma slides"
              />
            </div>
          </div>
        </>
      ),
    },
  ];
}

export function getLumnBlueprintSections(project: Project): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: <p>{project.context}</p>,
    },
    {
      id: '02',
      label: 'Problem',
      body: <p>{project.problem}</p>,
    },
    {
      id: '03',
      label: 'Process',
      body: (
        <ul>
          {project.process.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ),
    },
    {
      id: '04',
      label: 'Solution',
      body: <p>{project.solution}</p>,
    },
    {
      id: '05',
      label: 'Prototype',
      layout: 'vsplit',
      body: (
        <div className="cs-bp-vsplit">
          <div className="cs-bp-vsplit-text">
            <div className="cs-bp-vsplit-title-row">
              <span className="cs-bp-display-num" aria-hidden="true">05</span>
              <h4 className="cs-bp-display-title">Prototype</h4>
            </div>
            <div className="cs-bp-vsplit-body">
              <p>{project.outcome[2]}</p>
              <p>{project.outcome[3]}</p>
            </div>
            <div className="cs-bp-vsplit-cta">
              <a
                className="cs-bp-cta"
                href="https://github.com/juliocoraspe/birdsong-viz"
                target="_blank"
                rel="noopener noreferrer"
              >
                See full code on GitHub
                <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div
            className="cs-bp-vsplit-media"
            style={{ ['--media-aspect' as string]: '390 / 844' }}
          >
            <div
              className="cs-bp-vsplit-media-frame"
              style={{
                ['--frame-w' as string]: '640px',
                ['--frame-h' as string]: '1385px',
                ['--frame-scale' as string]: '0.354',
              }}
            >
              <FigmaEmbed
                title={`${project.title} prototype`}
                src={project.outcomeEmbedUrl ?? ''}
                wrapperClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                iframeClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                loading="lazy"
                allow="fullscreen; autoplay; microphone; camera"
                allowFullScreen
                mobileStaticImageSrc={lumnPreview}
                mobileStaticImageAlt={`${project.title} prototype preview`}
                mobileStaticImageObjectFit="cover"
                mobileLinkHref="https://github.com/juliocoraspe/birdsong-viz"
                mobileLinkLabel="See full code on GitHub"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '06',
      label: 'Outcome',
      body: (
        <>
          <ul>
            <li>{project.outcome[0]}</li>
            <li>{project.outcome[1]}</li>
            <li>{project.outcome[4]}</li>
          </ul>
          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title={`${project.title} design`}
                src={project.prototypeUrl ?? ''}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                mobileStaticImageSrc={lumnMobile}
                mobileStaticImageAlt="LUMN outcome static preview"
                mobileLinkLabel="Open Figma Design"
              />
            </div>
          </div>
        </>
      ),
    },
  ];
}

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
                  <div className="w-full border border-pale bg-pure px-6 py-4 text-left">
                    <a
                      href={project.outcomeEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta uppercase text-accent"
                    >
                      Want full interaction with the activated microphone? Open the demo in a new tab.
                    </a>
                  </div>
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
          <div
            id="outcome-embed"
            className="border border-pale"
            style={!isMobile ? { width: 'calc((100% + 12rem) * 2 / 3)', maxWidth: '100%' } : undefined}
          >
            {project.prototypeSummary && (
              <div className="p-6 border-b border-pale">
                <p className="type-body text-ink whitespace-pre-line">{project.prototypeSummary}</p>
              </div>
            )}
            {project.prototypeUrl ? (
              <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                {isFigmaPrototype ? (
                  project.id === 'asmr-app' ? (
                    isMobile ? (
                      <div className="relative h-full w-full overflow-hidden">
                        <a
                          href={project.prototypeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full w-full"
                          aria-label="Open LUMN prototype in Figma"
                        >
                          <img
                            src={lumnMobile}
                            alt="LUMN outcome static preview"
                            className="h-full w-full object-cover"
                            style={{ clipPath: 'inset(0 0 48px 0)' }}
                          />
                          <span className="absolute inset-x-0 bottom-0 flex h-12 items-center border-t border-pale bg-pure px-6 type-meta text-dark">
                            Open Figma Design
                          </span>
                        </a>
                      </div>
                    ) : (
                      <FigmaEmbed
                        title={`${project.title} prototype`}
                        src={project.prototypeUrl}
                        wrapperClassName="h-full w-full"
                        iframeClassName="h-full w-full border-0"
                      />
                    )
                  ) : project.id === 'todo-app' ? (
                    isMobile ? (
                      <div className="relative h-full w-full overflow-hidden">
                        <a
                          href={project.prototypeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full w-full"
                          aria-label="Open ToDo slides in Figma"
                        >
                          <img
                            src={syncoOutcomeMobile}
                            alt="Synco outcome static preview"
                            className="h-full w-full object-contain"
                          />
                          <span className="absolute inset-x-0 bottom-0 flex h-12 items-center border-t border-pale bg-pure px-6 type-meta text-dark">
                            Open Figma slides
                          </span>
                        </a>
                      </div>
                    ) : (
                      <FigmaEmbed
                        title={`${project.title} prototype`}
                        src={project.prototypeUrl}
                        wrapperClassName="h-full w-full"
                        iframeClassName="h-full w-full border-0"
                      />
                    )
                  ) : (
                    <FigmaEmbed
                      title={`${project.title} prototype`}
                      src={project.prototypeUrl}
                      wrapperClassName="h-full w-full"
                      iframeClassName="h-full w-full border-0"
                    />
                  )
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
            {project.demoLabel && project.id !== 'todo-app' && (
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
