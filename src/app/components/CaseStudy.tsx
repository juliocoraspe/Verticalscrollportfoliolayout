import { memo } from 'react';
import { FigmaEmbed } from './embeds/FigmaEmbed';
import { ScrollSection } from './ScrollSection';
import { useIsMobile } from './ui/use-mobile';
import testingImage from '../../assets/images/Testing.png';
import stillenMobile from '../../assets/images/Stillen_mobile.jpg';

interface CaseStudyProps {
  title: string;
  role: string;
  timeline: string;
  problem: {
    title: string;
    description: string;
  };
  process: {
    title: string;
    description: string;
    steps: string[];
  };
  exploration: {
    title: string;
    description: string;
    images: string[];
  };
  solution: {
    title: string;
    description: string;
    outcomes: string[];
  };
  prototype: {
    title: string;
    embedUrl?: string;
    externalUrl?: string;
  };
}

interface CaseStudyContentProps extends CaseStudyProps {
  disableAnimation?: boolean;
}

function CaseStudyContentComponent({
  title,
  problem,
  process,
  exploration,
  solution,
  prototype,
  disableAnimation = false,
}: CaseStudyContentProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="space-y-24">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">{problem.title}</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-body text-ink">{problem.description}</p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">{process.title}</p>
          </ScrollSection>
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
              <p className="type-body text-ink">{process.description}</p>
            </ScrollSection>
            <div className="space-y-4 border-t border-pale pt-6">
              {process.steps.map((step, index) => (
                <ScrollSection
                  key={step}
                  entryDirection="bottom"
                  delay={index * 0.08}
                  motionRole="case-block"
                  disableAnimation={disableAnimation}
                >
                  <div className="border-b border-pale pb-4">
                    <p className="type-body text-ink">{step}</p>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">{exploration.title}</p>
          </ScrollSection>
          <div className="space-y-8">
            <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
              <p className="type-body text-ink">{exploration.description}</p>
            </ScrollSection>
            <div className="grid md:grid-cols-2 gap-6 border-t border-pale pt-6">
              <ScrollSection
                entryDirection="bottom"
                motionRole="case-block"
                className="col-span-2"
                disableAnimation={disableAnimation}
              >
                <div className="border border-pale">
                  <img src={testingImage} alt={`${title} testing`} className="w-full h-auto" />
                </div>
              </ScrollSection>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
            <p className="type-section-title text-dark uppercase">{solution.title}</p>
          </ScrollSection>
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="case-block" disableAnimation={disableAnimation}>
              <p className="type-body text-ink">{solution.description}</p>
            </ScrollSection>
            <div className="grid md:grid-cols-3 gap-6 border-t border-pale pt-6">
              {solution.outcomes.map((outcome) => (
                <div key={outcome} className="border-b border-pale pb-4">
                  <p className="type-body text-ink">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollSection
        entryDirection="scale"
        motionRole="case-block"
        duration={0.52}
        delay={0.12}
        ease={[0.4, 0, 0.2, 1]}
        disableTransform
        disableAnimation={disableAnimation}
      >
        <div className="mt-24">
          <div
            className="border border-pale"
            style={
              isMobile
                ? { width: 'calc(100% - 32px)', marginInline: 'auto' }
                : { width: 'calc((((100% - 2.5rem) * 2 / 3) - 2.75rem) + 1px)' }
            }
          >
            {prototype.embedUrl ? (
              <div className="aspect-[4/3] sm:aspect-video w-full border-b border-pale bg-pure">
                {isMobile ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <a
                      href={prototype.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full w-full"
                      aria-label="Open Stillen prototype in Figma"
                    >
                      <img
                        src={stillenMobile}
                        alt="Stillen solution static preview"
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
                    title={`${title} prototype`}
                    src={prototype.embedUrl}
                    wrapperClassName="h-full w-full"
                    iframeClassName="h-full w-full border-0"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video w-full border-b border-pale bg-pure flex items-center justify-center text-center p-6">
                <p className="type-body text-accent">
                  Prototype embed placeholder — add the Figma share link here.
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollSection>
    </>
  );
}

export const CaseStudyContent = memo(CaseStudyContentComponent);
