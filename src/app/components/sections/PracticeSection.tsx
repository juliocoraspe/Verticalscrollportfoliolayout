import { ScrollSection } from '../ScrollSection';

type PracticeSectionProps = {
  enterMotionGarden: () => void;
};

export function PracticeSection({ enterMotionGarden }: PracticeSectionProps) {
  return (
    <section id="about" className="practice-section py-24 px-6 sm:py-32 sm:px-8 bg-pure">
      <div className="max-w-6xl mx-auto space-y-[155px]">
        <div className="hero-index w-full min-w-0 border-y border-pale divide-y divide-pale">
          <a href="#case-studies" className="hero-index-item type-micro uppercase text-ink py-4 w-full">
            <span className="hero-index-label">Case Studies</span>
            <span className="type-micro text-dark hero-index-count">01</span>
          </a>
          <a href="#about-me" className="hero-index-item type-micro uppercase text-ink py-4 w-full">
            <span className="hero-index-label">About Me</span>
            <span className="type-micro text-dark hero-index-count">02</span>
          </a>
          <a href="#contact" className="hero-index-item type-micro uppercase text-ink py-4 w-full">
            <span className="hero-index-label">Contact</span>
            <span className="type-micro text-dark hero-index-count">03</span>
          </a>
          <button
            type="button"
            onClick={enterMotionGarden}
            className="hero-index-item type-micro uppercase text-accent py-4 w-full text-left"
          >
            <span className="hero-index-label">Motion Garden</span>
            <span className="type-micro text-dark hero-index-count">04</span>
          </button>
        </div>

        <div className="space-y-12">
          <ScrollSection entryDirection="bottom" motionRole="about-title">
            <h2 className="type-display-m text-ink">Practice</h2>
          </ScrollSection>

          <div className="border-t border-pale divide-y divide-pale md:divide-y-0 md:divide-x md:grid md:grid-cols-3">
            {[
              {
                title: 'Design Philosophy',
                body:
                  'I start by understanding the full problem, not just the surface. I like connecting research, creativity, and accessibility to make decisions that feel intentional, grounded, and genuinely useful, not just visually appealing.',
              },
              {
                title: 'What I Do Well',
                body:
                  'I’m good at turning complex problems into clear, structured systems. I work across researching, prototyping, and testing, often exploring ideas early to understand how things behave before committing to a final direction',
              },
              {
                title: 'Hybrid Practice',
                body:
                  'My practice extends beyond traditional design, combining creative disciplines with technical exploration. This hybrid perspective allows me to prototype realistically, experiment with interactions, and design systems that translate cleanly into maintainable products.',
              },
            ].map((item, index) => (
              <ScrollSection key={item.title} entryDirection="bottom" delay={index * 0.06} motionRole="about-paragraph">
                <div className="py-8 md:px-8 h-full">
                  <p className="type-section-title text-dark uppercase mb-4">{item.title}</p>
                  <p className="type-body text-ink">{item.body}</p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
