import { ScrollSection } from '../ScrollSection';
import { RESUME_URL } from '../../data/about';

type ContactSectionProps = {
  enterMotionGarden: () => void;
};

export function ContactSection({ enterMotionGarden }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="py-24 px-6 sm:py-32 sm:px-8 border-t border-pale"
      style={{ backgroundColor: '#fcfbfa' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
            <h2 className="type-display-m text-ink">Contact</h2>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
            <p className="type-subhead text-dark">
              I’m open to junior UX/UI roles, collaborations, and focused design work.
              If you’re exploring new ideas, complex systems, or thoughtful interfaces, I’d love to connect.
            </p>
          </ScrollSection>
          <div className="space-y-3 border-t border-pale pt-6">
            <p className="type-meta text-dark uppercase">Email</p>
            <a className="type-body text-ink" href="mailto:juliocoraspe@gmail.com">
              juliocoraspe@gmail.com
            </a>
          </div>
          <div className="space-y-3 border-t border-pale pt-6">
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
                href="https://www.behance.net/juliocoraspe"
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta uppercase text-ink"
              >
                Behance
              </a>
              <button type="button" onClick={enterMotionGarden} className="type-meta uppercase text-accent cursor-pointer">
                Motion Garden
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
