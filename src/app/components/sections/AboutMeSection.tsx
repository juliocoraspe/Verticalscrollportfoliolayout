import { ScrollSection } from '../ScrollSection';
import { ABOUT_ME_PARAGRAPHS } from '../../data/about';
import julsPortrait from '../../../assets/images/Juls.JPG';

export function AboutMeSection() {
  return (
    <section
      id="about-me"
      aria-label="About Me"
      className="py-24 px-6 sm:py-32 sm:px-8 border-t border-pale"
      style={{ backgroundColor: '#fcfbfa' }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <ScrollSection entryDirection="bottom" motionRole="contact-title">
          <h2 className="type-display-m text-ink">About Me</h2>
        </ScrollSection>
        <div className="border border-pale bg-pure">
          <img
            src={julsPortrait}
            alt="Julio Coraspe portrait"
            className="w-full aspect-[239/100] object-cover about-portrait-image"
          />
        </div>

        <div className="space-y-8 text-left">
          {ABOUT_ME_PARAGRAPHS.map((paragraph, index) => (
            <ScrollSection
              key={paragraph.slice(0, 16)}
              entryDirection="none"
              disableTransform
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
