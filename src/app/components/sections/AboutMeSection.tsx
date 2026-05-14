import { ScrollSection } from '../ScrollSection';
import { ABOUT_ME_PARAGRAPHS } from '../../data/about';
import { useIsMobile } from '../ui/use-mobile';
import julsPortrait from '../../../assets/images/Juls.JPG';

export function AboutMeSection() {
  const isMobile = useIsMobile();
  const textOffsetStyle = isMobile ? undefined : { width: '114%', transform: 'translateX(-7%)' };

  return (
    <section id="about-me" aria-label="About Me" className="border-t border-pale bg-pure px-6 pt-10 pb-14 sm:px-6 sm:pt-20 sm:pb-36">
      <div className="hero-breakout mx-auto space-y-8 sm:space-y-10">
        <ScrollSection entryDirection="bottom" motionRole="contact-title">
          <h2 className="type-display-l text-ink">About Me</h2>
        </ScrollSection>
        <div className="flow-root text-left" style={textOffsetStyle}>
          <div className="mx-auto mb-6 h-[9rem] w-full max-w-[12rem] overflow-hidden border border-pale bg-pure md:float-left md:mx-0 md:mr-8 md:mb-6 md:h-[10rem] md:w-[16rem] lg:mr-10 lg:h-[11rem] lg:w-[18rem] xl:h-[12rem] xl:w-[20rem]">
            <img
              src={julsPortrait}
              alt="Julio Coraspe portrait"
              className="h-full w-full object-cover about-portrait-image"
            />
          </div>
          {ABOUT_ME_PARAGRAPHS.map((paragraph, index) => (
            <ScrollSection
              key={paragraph.slice(0, 16)}
              entryDirection="none"
              disableTransform
              disableAnimation={isMobile}
              duration={8}
              delay={index * 0.5}
              className={index === 0 ? '' : 'mt-6 sm:mt-7'}
            >
              <p className="type-body text-ink">{paragraph}</p>
            </ScrollSection>
          ))}
        </div>
      </div>
    </section>
  );
}
