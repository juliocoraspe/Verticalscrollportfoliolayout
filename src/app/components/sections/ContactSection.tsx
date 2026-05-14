import { ScrollSection } from '../ScrollSection';
import { RESUME_URL } from '../../data/about';

type ContactSectionProps = {
  enterMotionGarden: () => void;
  enterAccessibility: () => void;
  enterAiExperience: () => void;
};

export function ContactSection(_props: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="border-t border-pale px-6 pt-8 pb-14 sm:px-6 sm:pt-20 sm:pb-16"
      style={{ backgroundColor: '#fcfbfa' }}
    >
      <div className="hero-breakout mx-auto">
        <div>
          <div className="space-y-6">
            <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
              <h2 className="type-display-l text-ink">Contact</h2>
            </ScrollSection>
            <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
              <p
                className="type-subhead text-dark contact-subtitle"
                style={{ maxWidth: 'none' }}
              >
                I’m open to UX/UI and Design Engineer roles, collaborations, and focused design work. If you’re exploring new ideas, complex systems, or thoughtful interfaces, I’d love to connect.
              </p>
            </ScrollSection>
          </div>
          <div className="mt-12 space-y-4 border-t border-pale pt-8 sm:mt-14 sm:pt-9">
            <p className="type-meta text-dark uppercase">Links</p>
            <div className="flex flex-wrap gap-6">
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="type-meta uppercase text-ink">
                Resume
              </a>
              <a
                href="https://www.linkedin.com/in/juliocoraspe"
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta uppercase text-ink"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/juliocoraspe"
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta uppercase text-accent"
              >
                GitHub
              </a>
              <a
                href="mailto:juliocoraspe@gmail.com"
                className="type-meta uppercase text-ink"
                aria-label="Email julio coraspe at juliocoraspe@gmail.com"
              >
                Email
              </a>
              <a
                href="https://juliocoraspe.github.io/photography-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta uppercase text-ink"
              >
                Creative Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
