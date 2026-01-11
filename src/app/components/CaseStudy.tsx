import { ScrollSection } from './ScrollSection';
import testingImage from '../../assets/images/Testing.png';

interface CaseStudyProps {
  title: string;
  role: string;
  timeline: string;
  summary: string;
  heroImage: string;
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

export function CaseStudy({
  title,
  role,
  timeline,
  summary,
  heroImage,
  problem,
  process,
  exploration,
  solution,
  prototype,
}: CaseStudyProps) {
  return (
    <section id="case-study" className="w-full max-w-6xl mx-auto px-8 py-32 relative z-20 border-t border-pale">
      <ScrollSection entryDirection="bottom" motionRole="case-intro">
        <div className="mb-16">
          <div className="flex flex-wrap items-center gap-3 type-meta text-dark mb-6">
            <span className="type-meta uppercase">Case Study</span>
            <span className="type-meta">•</span>
            <span className="type-meta">{role}</span>
            <span className="type-meta">•</span>
            <span className="type-meta">{timeline}</span>
          </div>
          <h2 className="type-display-l text-ink mb-6">{title}</h2>
          <p className="type-subhead text-dark max-w-3xl">{summary}</p>
        </div>
      </ScrollSection>

      <ScrollSection entryDirection="bottom" motionRole="case-block">
        <div className="border-y border-pale mb-24">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-auto object-contain md:h-[420px] md:object-cover md:object-top"
          />
        </div>
      </ScrollSection>

      <div className="space-y-24">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block">
            <p className="type-section-title text-dark uppercase">{problem.title}</p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="case-block">
            <p className="type-body text-ink">{problem.description}</p>
          </ScrollSection>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block">
            <p className="type-section-title text-dark uppercase">{process.title}</p>
          </ScrollSection>
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="case-block">
              <p className="type-body text-ink">{process.description}</p>
            </ScrollSection>
            <div className="space-y-4 border-t border-pale pt-6">
              {process.steps.map((step, index) => (
                <ScrollSection key={step} entryDirection="bottom" delay={index * 0.08} motionRole="case-block">
                  <div className="border-b border-pale pb-4">
                    <p className="type-body text-ink">{step}</p>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block">
            <p className="type-section-title text-dark uppercase">{exploration.title}</p>
          </ScrollSection>
          <div className="space-y-8">
            <ScrollSection entryDirection="bottom" motionRole="case-block">
              <p className="type-body text-ink">{exploration.description}</p>
            </ScrollSection>
            <div className="grid md:grid-cols-2 gap-6 border-t border-pale pt-6">
              <ScrollSection entryDirection="bottom" motionRole="case-block" className="col-span-2">
                <div className="border border-pale">
                  <img src={testingImage} alt={`${title} testing`} className="w-full h-auto" />
                </div>
              </ScrollSection>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <ScrollSection entryDirection="bottom" motionRole="case-block">
            <p className="type-section-title text-dark uppercase">{solution.title}</p>
          </ScrollSection>
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="case-block">
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
      >
        <div className="mt-24">
          <p className="type-meta text-accent uppercase mb-4">{prototype.title}</p>
          <div className="border border-pale">
            {prototype.embedUrl ? (
              <div className="aspect-video w-full border-b border-pale bg-pure">
                <iframe
                  title={`${title} prototype`}
                  src={prototype.embedUrl}
                  className="w-full h-full"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="aspect-video w-full border-b border-pale bg-pure flex items-center justify-center text-center p-6">
                <p className="type-body text-accent">
                  Prototype embed placeholder — add the Figma share link here.
                </p>
              </div>
            )}
            {prototype.externalUrl && (
              <div className="p-6">
                {prototype.embedUrl && (
                  <p className="type-body text-dark mb-3">
                    If the embed does not load, open the prototype in a new tab.
                  </p>
                )}
                <a
                  href={prototype.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-meta text-accent uppercase"
                >
                  View full prototype
                </a>
              </div>
            )}
          </div>
        </div>
      </ScrollSection>
    </section>
  );
}
