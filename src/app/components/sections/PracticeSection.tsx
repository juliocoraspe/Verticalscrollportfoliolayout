import { useState, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type PracticeSectionProps = {
  enterMotionGarden: () => void;
};

// ── Types ──────────────────────────────────────────────────────────────────

type Band1Card = { num: string; category: string; subtitle: string; body: string };
type Band23Card = { title: string; bullets?: string[]; body?: ReactNode; width?: number };

// ── BulletList ─────────────────────────────────────────────────────────────

function BulletList({ items, columns = 3 }: { items: string[]; columns?: number }) {
  const gap = 10;
  const itemWidth = `calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px)`;
  return (
    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: `6px ${gap}px`, listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 4, width: itemWidth }}>
          <span style={{
            width: '4px', height: '4px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-ink)',
            flexShrink: 0,
            marginTop: '0.5em',
            alignSelf: 'flex-start',
          }} />
          <span className="type-body text-dark">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Card data ──────────────────────────────────────────────────────────────

const band1Cards: Band1Card[] = [
  {
    num: '1',
    category: 'USER',
    subtitle: 'Desirability',
    body: 'Understanding human needs and behaviors to ensure products are intuitive, meaningful, and genuinely valuable for the people who use them.',
  },
  {
    num: '2',
    category: 'BUSINESS',
    subtitle: 'Viability',
    body: 'Aligning product decisions with organizational goals so solutions generate measurable value and support long-term sustainability.',
  },
  {
    num: '3',
    category: 'TECHNOLOGY',
    subtitle: 'Feasibility',
    body: 'Evaluating technical possibilities and constraints to ensure solutions can be realistically built, scaled, and maintained. Supported by hands-on front-end development experience.',
  },
];

const band2Cards: Band23Card[] = [
  {
    title: 'Discovery',
    width: 660,
    bullets: [
      'Foundational research',
      'UX strategy definition',
      'research planning',
      'method selection',
      'data collection',
      'insight synthesis',
      'bias mitigation',
    ],
  },
  {
    title: 'Design',
    width: 620,
    bullets: [
      'information architecture',
      'user flows',
      'wireframes',
      'UI design',
      'motion design',
      'prototyping',
      'usability testing',
    ],
  },
  {
    title: 'Delivery',
    width: 660,
    bullets: [
      'developer handoff',
      'Front-end collaboration',
      'implementation support',
      'post-launch validation',
      'feasibility awareness',
    ],
  },
];

const band3Cards: Band23Card[] = [
  {
    title: 'UX Strategy Toolkit',
    width: 680,
    bullets: [
      'SMART goal definition',
      'success metrics frameworks',
      'constraint mapping',
      'stakeholder alignment sessions',
      'product vision framing',
      'opportunity mapping',
    ],
  },
  {
    title: 'Research Toolkit',
    width: 720,
    bullets: [
      'user interviews',
      'surveys',
      'research panels',
      'analytics platforms',
      'competitor analysis',
      'heuristic evaluation',
      'heatmaps',
      'affinity mapping',
      'thematic analysis',
    ],
  },
  {
    title: 'Design Toolkit',
    width: 840,
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div>
          <p className="type-micro uppercase text-ink" style={{ marginBottom: 3 }}>Visual Interface Design</p>
          <BulletList items={['visual hierarchy', 'typography systems', 'color systems', 'layout and spacing']} columns={2} />
        </div>
        <div>
          <p className="type-micro uppercase text-ink" style={{ marginBottom: 3 }}>Motion & Interaction Design</p>
          <BulletList items={['state transitions', 'interaction feedback', 'attention guidance', 'spatial continuity']} columns={2} />
        </div>
        <div>
          <p className="type-micro uppercase text-ink" style={{ marginBottom: 3 }}>Accessibility Practice</p>
          <BulletList items={['WCAG alignment', 'Section 508', 'ADA']} columns={3} />
        </div>
      </div>
    ),
  },
  {
    title: 'Technical Collaboration',
    width: 800,
    bullets: [
      'Git / GitHub · HTML / CSS / JavaScript',
      'component architecture',
      'BEM methodology',
      'design system implementation',
      'interface debugging',
    ],
  },
  {
    title: 'AI-Augmented Workflow',
    width: 620,
    bullets: [
      'prompt engineering',
      'context engineering',
      'automation workflows',
      'MCP integration',
      'acceleration in Figma',
    ],
  },
];

// ── Card components ────────────────────────────────────────────────────────

function TickerCardBand23({
  card,
  defaultWidth = 460,
  cardStyle,
  columns = 3,
}: {
  card: Band23Card;
  defaultWidth?: number;
  cardStyle?: CSSProperties;
  columns?: number;
}) {
  const w = card.width ?? defaultWidth;
  const style = cardStyle ?? { minWidth: w, maxWidth: w };
  return (
    <div className="ticker-card flex items-start gap-4 border border-pale rounded px-5 py-3" style={style}>
      <p className="type-body text-ink shrink-0" style={{ paddingTop: 2 }}>{card.title}</p>
      <div className="w-px bg-pale shrink-0" style={{ minHeight: 16, alignSelf: 'stretch' }} />
      {card.bullets ? (
        <BulletList items={card.bullets} columns={columns} />
      ) : (
        <div className="type-body text-dark" style={{ whiteSpace: 'normal' }}>{card.body}</div>
      )}
    </div>
  );
}

function TrackArrow() {
  return (
    <div
      className="ticker-card"
      style={{ display: 'flex', alignItems: 'center', color: 'var(--color-pale)', padding: '0 8px' }}
    >
      <svg width="180" height="14" viewBox="0 0 180 14" fill="none" aria-hidden="true">
        <line x1="0" y1="7" x2="168" y2="7" stroke="currentColor" strokeWidth="0.75" />
        <polyline points="162,2 174,7 162,12" stroke="currentColor" strokeWidth="0.75" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Full-bleed helper ──────────────────────────────────────────────────────
const fullBleedStyle: CSSProperties = {
  marginLeft: 'calc(-50vw + 50%)',
  width: '100vw',
};

// ── Section ────────────────────────────────────────────────────────────────

export function PracticeSection({ enterMotionGarden }: PracticeSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [modalCard, setModalCard] = useState<Band23Card | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="about" className="practice-section pt-8 pb-6 sm:pt-10 sm:pb-8 px-6 sm:px-8 bg-pure">
      <div className="max-w-6xl mx-auto">

        {/* Navigation index */}
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

        {/* Section title */}
        <h2 className="type-display-m text-ink mt-20 mb-5">My Design Cycle</h2>

        {/* Ticker bands */}
        <div className="space-y-10 sm:space-y-4">

          {/* Band 1 — My Design Philosophy */}
          <div className="ticker-band">
            <p className="type-section-title text-dark mb-2" style={{ fontWeight: 400 }}>
              My Design Philosophy — The Three Lenses of Human-Centered Design by Tim Brown
            </p>

            {isMobile ? (
              /* Mobile: accordion, thin lines */
              <div style={{ }}>
                {band1Cards.map((card) => {
                  const open = expanded.has(`b1-${card.num}`);
                  return (
                    <div key={card.num} style={{ borderBottom: '1px solid var(--color-pale)' }}>
                      <button
                        type="button"
                        onClick={() => toggle(`b1-${card.num}`)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                          <span className="type-body text-ink">{card.category}</span>
                          <span className="type-micro uppercase text-dark">{card.subtitle}</span>
                        </div>
                        <span className="type-micro text-pale" style={{ flexShrink: 0, marginLeft: 8 }}>{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <p className="type-body text-dark" style={{ paddingBottom: 12 }}>{card.body}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Desktop: full-bleed horizontal with number animations */
              <div style={{ ...fullBleedStyle, padding: '0 24px' }}>
                <div className="flex gap-4">
                  {band1Cards.map((card) => (
                    <div
                      key={card.num}
                      className="flex items-center gap-5 border border-pale rounded px-5 py-3"
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <span
                        className={`type-display-m text-pale shrink-0 leading-none num-appear-${card.num}`}
                        style={{ minWidth: 28 }}
                      >
                        {card.num}
                      </span>
                      <div className="shrink-0" style={{ minWidth: 100 }}>
                        <p className="type-body text-ink leading-none">{card.category}</p>
                        <p className="type-micro uppercase text-dark mt-0.5">{card.subtitle}</p>
                      </div>
                      <div className="self-stretch w-px bg-pale shrink-0" />
                      <p className="type-body text-dark">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Band 2 — My Design Flow */}
          <div className="ticker-band">
            <p className="type-section-title text-dark mb-2" style={{ fontWeight: 400 }}>My Design Flow</p>

            {isMobile ? (
              /* Mobile: accordion, thin lines */
              <div style={{ }}>
                {band2Cards.map((card, i) => {
                  const open = expanded.has(`b2-${i}`);
                  return (
                    <div key={i} style={{ borderBottom: '1px solid var(--color-pale)' }}>
                      <button
                        type="button"
                        onClick={() => toggle(`b2-${i}`)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span className="type-body text-ink">{card.title}</span>
                        <span className="type-micro text-pale" style={{ flexShrink: 0, marginLeft: 8 }}>{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div style={{ paddingBottom: 12 }}>
                          {card.bullets && <BulletList items={card.bullets} columns={2} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Desktop: full-bleed horizontal static + arrow ticker */
              <>
                <div style={{ ...fullBleedStyle, padding: '0 24px' }}>
                  <div className="flex gap-4">
                    {band2Cards.map((card, i) => (
                      <TickerCardBand23
                        key={i}
                        card={card}
                        cardStyle={{ flex: [1.5, 1, 1.4][i], minWidth: 0 }}
                        columns={3}
                      />
                    ))}
                  </div>
                </div>
                <div className="ticker-overflow" style={{ ...fullBleedStyle, marginTop: 8 }}>
                  <div
                    className="ticker-track ticker-right"
                    style={{ animationDuration: '20s', gap: 0 }}
                    aria-hidden="true"
                  >
                    {[...Array(12)].map((_, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', color: 'var(--color-pale)', marginRight: 220 }}>
                        <TrackArrow />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Band 3 — Capabilities & Toolkits · ticker on all sizes */}
          <div className="ticker-band">
            <p className="type-section-title text-dark mb-2" style={{ fontWeight: 400 }}>Capabilities &amp; Toolkits</p>
            <div className="ticker-overflow" style={fullBleedStyle}>
              <div
                className="ticker-track ticker-left ticker-wide"
                aria-hidden={!isMobile}
              >
                {[...band3Cards, ...band3Cards].map((card, i) =>
                  isMobile ? (
                    /* Mobile: title-only card, tap opens modal */
                    <button
                      key={i}
                      type="button"
                      onClick={() => setModalCard(band3Cards[i % band3Cards.length])}
                      className="ticker-card flex items-center gap-3 border border-pale rounded px-4 py-3"
                      style={{ minWidth: 180, maxWidth: 180 }}
                    >
                      <p className="type-body text-ink">{card.title}</p>
                      <span className="type-micro text-pale shrink-0">↗</span>
                    </button>
                  ) : (
                    <TickerCardBand23 key={i} card={card} defaultWidth={660} columns={3} />
                  )
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal — Band 3 mobile card detail */}
      {modalCard && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setModalCard(null)}
        >
          <div
            className="bg-pure w-full rounded-t-2xl px-6 pt-5 pb-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="type-section-title text-ink">{modalCard.title}</p>
              <button
                type="button"
                onClick={() => setModalCard(null)}
                className="type-body text-dark"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-px bg-pale mb-4" />
            {modalCard.bullets ? (
              <BulletList items={modalCard.bullets} columns={2} />
            ) : (
              <div className="type-body text-dark">{modalCard.body}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
