import { ScrollSection } from '../ScrollSection';
import { ABOUT_ME_PARAGRAPHS } from '../../data/about';
import { useIsMobile } from '../ui/use-mobile';
import julsPortrait from '../../../assets/images/Juls.JPG';

export function AboutMeSection() {
  const isMobile = useIsMobile();
  return (
    <section id="about-me" aria-label="About Me" className="pt-8 pb-24 px-6 sm:py-32 sm:px-6 border-t border-pale bg-pure">
      <div className="hero-breakout mx-auto space-y-12">
        <ScrollSection entryDirection="bottom" motionRole="contact-title">
          <h2 className="type-display-m text-ink">About Me</h2>
        </ScrollSection>
        <div className="max-w-6xl mx-auto w-full">
          <div className="border border-pale bg-pure">
            <img
              src={julsPortrait}
              alt="Julio Coraspe portrait"
              className="w-full h-auto object-cover md:h-[420px] md:object-top about-portrait-image"
            />
          </div>
        </div>

        <div className="space-y-8 text-left">
          {ABOUT_ME_PARAGRAPHS.map((paragraph, index) => (
            <ScrollSection
              key={paragraph.slice(0, 16)}
              entryDirection="none"
              disableTransform
              disableAnimation={isMobile}
              duration={8}
              delay={index * 0.5}
            >
              <p className="type-body text-ink">{paragraph}</p>
            </ScrollSection>
          ))}
        </div>
      </div>
    </section>
  );
}
