import { A11yFigmaPluginWorkflow } from '../A11yFigmaPluginWorkflow';
import { WcagWorkflow } from '../WcagWorkflow';
import { ScrollSection } from '../ScrollSection';
import type { CSSProperties } from 'react';

const TECH_LABEL: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

type Standard = {
  num: string;
  code: string;
  title: string;
  body: string;
  detail?: string;
};

const STANDARDS: Standard[] = [
  {
    num: '01',
    code: '2.1.1 · 2.4.7',
    title: 'Keyboard Navigation',
    body:
      'All interactive elements—buttons, links, toggles, and embedded prototypes—are fully reachable and operable by keyboard alone. Tab order follows the natural reading sequence. A skip-to-main-content link is available at the top of the page for keyboard and assistive technology users.',
    detail: 'Tab · Shift+Tab · Enter · Space',
  },
  {
    num: '02',
    code: '2.3.3',
    title: 'Motion',
    body:
      'All animations and transitions respect the prefers-reduced-motion system setting. When reduced motion is enabled, scroll animations, slide transitions, and decorative motion are fully disabled without any loss of content or functionality.',
    detail: 'prefers-reduced-motion respected',
  },
  {
    num: '03',
    code: '4.1.2',
    title: 'Screen Readers',
    body:
      'Semantic HTML elements and ARIA landmark regions provide structure for assistive technologies. Interactive components use explicit ARIA labels and aria-expanded / aria-controls attributes to communicate state. Images include descriptive alt text.',
    detail: 'Semantic HTML · ARIA roles',
  },
  {
    num: '04',
    code: '1.4.3',
    title: 'Color & Contrast',
    body:
      'Text and interactive elements meet WCAG AA contrast ratios against their backgrounds. Color is never used as the sole means of conveying information—state changes and distinctions are also communicated through text, shape, or position.',
    detail: '4.5:1 normal · 3:1 large',
  },
  {
    num: '05',
    code: '2.4.7',
    title: 'Focus Indicators',
    body:
      'Visible focus rings are preserved on all interactive elements. Default browser outlines are not suppressed unless replaced with a clearly visible custom indicator that meets or exceeds the original contrast.',
    detail: 'Outline preserved',
  },
];

export function AccessibilitySection() {
  return (
    <main id="main-content">
      <WcagWorkflow
        beforeWorkflow={<A11yFigmaPluginWorkflow />}
        standardsConnector={<StandardsConnector />}
      />
    </main>
  );
}

function StandardsConnector() {
  return (
    <section
      className="px-6 sm:px-8 pt-12 pb-12 sm:pt-32 sm:pb-40"
      style={{
        backgroundColor: 'var(--color-pure)',
        borderTop: '1px solid var(--color-pale)',
        borderBottom: '1px solid var(--color-pale)',
        position: 'relative',
      }}
    >
        {/* Faint blueprint grid background to echo the scrollytelling */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(149,148,146,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(149,148,146,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="hero-breakout mx-auto relative z-10">
          {/* Header — full-width 12-col grid */}
          <div className="grid md:grid-cols-12 gap-6 items-end mb-10 sm:mb-24">
            <ScrollSection entryDirection="bottom" motionRole="case-intro" className="md:col-span-6">
              <h2 className="type-display-m text-ink" style={{ maxWidth: '18ch' }}>
                Standards I work toward.
              </h2>
            </ScrollSection>

            <ScrollSection
              entryDirection="bottom"
              motionRole="about-paragraph"
              delay={0.05}
              className="md:col-span-4 md:col-start-9"
            >
              <p
                className="type-micro uppercase mb-3"
                style={{ ...TECH_LABEL, color: 'var(--color-dark)' }}
              >
                Shared center
              </p>
              <p className="type-body text-ink">
                The two workflows serve different roles, but they are part of the same practice:
                accessibility as a design responsibility and as an implementation responsibility.
                These are the standards both workflows answer to.
              </p>
            </ScrollSection>
          </div>

          {/* Spec table header — blueprint plate style. Hidden on mobile;
              the mobile fallback below has its own stacked layout. */}
          <ScrollSection entryDirection="bottom" motionRole="about-paragraph" className="hidden md:block">
            <div
              className="grid items-center mb-2 pb-2"
              style={{
                gridTemplateColumns: '60px minmax(0, 1.4fr) minmax(0, 2.6fr) minmax(0, 1fr)',
                borderBottom: '1px solid var(--color-pale)',
              }}
            >
              <span
                className="type-micro uppercase"
                style={{ ...TECH_LABEL, color: 'var(--color-dark)', opacity: 0.6 }}
              >
                Idx
              </span>
              <span
                className="type-micro uppercase"
                style={{ ...TECH_LABEL, color: 'var(--color-dark)', opacity: 0.6 }}
              >
                Criterion
              </span>
              <span
                className="type-micro uppercase"
                style={{ ...TECH_LABEL, color: 'var(--color-dark)', opacity: 0.6 }}
              >
                Implementation
              </span>
              <span
                className="type-micro uppercase text-right"
                style={{ ...TECH_LABEL, color: 'var(--color-dark)', opacity: 0.6 }}
              >
                Detail
              </span>
            </div>
          </ScrollSection>

          {/* Standards rows — full width, 4 columns. Hidden on mobile;
              the mobile fallback below uses a single-column stacked layout. */}
          <div className="hidden md:block">
            {STANDARDS.map((s, i) => (
              <ScrollSection
                key={s.num}
                entryDirection="bottom"
                motionRole="case-block"
                delay={i * 0.04}
              >
                <div
                  className="grid items-start py-8 sm:py-10"
                  style={{
                    gridTemplateColumns:
                      'minmax(60px, 60px) minmax(0, 1.4fr) minmax(0, 2.6fr) minmax(0, 1fr)',
                    columnGap: '2rem',
                    borderBottom:
                      i === STANDARDS.length - 1 ? 'none' : '1px solid var(--color-pale)',
                  }}
                >
                  <span
                    className="type-micro uppercase"
                    style={{ ...TECH_LABEL, color: 'var(--color-accent)' }}
                  >
                    {s.num}
                  </span>
                  <div>
                    <p
                      className="type-section-title text-ink uppercase"
                      style={{ marginBottom: 6 }}
                    >
                      {s.title}
                    </p>
                    <p
                      className="type-micro uppercase"
                      style={{ ...TECH_LABEL, color: 'var(--color-dark)' }}
                    >
                      {s.code}
                    </p>
                  </div>
                  <p className="type-body text-ink" style={{ maxWidth: '60ch' }}>
                    {s.body}
                  </p>
                  <p
                    className="type-micro uppercase text-right"
                    style={{
                      ...TECH_LABEL,
                      color: 'var(--color-dark)',
                    }}
                  >
                    {s.detail}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>

          {/* Mobile fallback — same data as the desktop standards rows.
              Renders before the "Second method" handoff block so the
              reading order stays: header → standards 01–05 → handoff
              → next workflow. (Desktop hides this block; the rows
              above already cover the same content.) */}
          <div className="md:hidden mt-10 space-y-8">
            {STANDARDS.map((s, i) => (
              <ScrollSection
                key={`m-${s.num}`}
                entryDirection="bottom"
                motionRole="case-block"
                delay={i * 0.04}
              >
                <div className="pt-6" style={{ borderTop: '1px solid var(--color-pale)' }}>
                  <div className="flex justify-between items-baseline mb-3">
                    <span
                      className="type-micro uppercase"
                      style={{ ...TECH_LABEL, color: 'var(--color-accent)' }}
                    >
                      {s.num}
                    </span>
                    <span
                      className="type-micro uppercase"
                      style={{ ...TECH_LABEL, color: 'var(--color-dark)' }}
                    >
                      {s.code}
                    </span>
                  </div>
                  <p className="type-section-title text-ink uppercase mb-3">{s.title}</p>
                  <p className="type-body text-ink mb-3">{s.body}</p>
                  {s.detail && (
                    <p
                      className="type-micro uppercase"
                      style={{ ...TECH_LABEL, color: 'var(--color-dark)' }}
                    >
                      {s.detail}
                    </p>
                  )}
                </div>
              </ScrollSection>
            ))}
          </div>

          <ScrollSection
            entryDirection="bottom"
            motionRole="about-paragraph"
            delay={0.08}
            className="mt-16 sm:mt-20"
          >
            <div
              className="grid gap-8 pt-8 md:grid-cols-12"
              style={{ borderTop: '1px solid var(--color-pale)' }}
            >
              <div className="md:col-span-4">
                <p
                  className="type-micro uppercase mb-3"
                  style={{ ...TECH_LABEL, color: 'var(--color-dark)' }}
                >
                  Second method · after launch
                </p>
                <h3 className="type-display-s text-ink" style={{ maxWidth: '18ch' }}>
                  When the product already exists, the method changes.
                </h3>
              </div>
              <p className="type-body text-ink md:col-span-6 md:col-start-7">
                At that point I shift from design prevention to implementation repair. The same WCAG
                baseline is checked through Claude Code, Playwright, axe-core, browser automation,
                and human review so an existing site can be diagnosed, fixed, and explained clearly
                from my own machine.
              </p>
            </div>
          </ScrollSection>

        </div>
      </section>
  );
}
