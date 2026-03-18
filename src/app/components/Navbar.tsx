import React from 'react';

type NavbarProps = {
  enterMotionGarden: () => void;
};

function IconCycle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 2.5l2.5 2.5-7 7L4 13l.5-2.5 7-8z" />
      <line x1="9.5" y1="4" x2="12" y2="6.5" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4.5a1 1 0 0 1 1-1h3.5l1.5 1.5H14a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4.5z" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="5" r="2.5" />
      <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3.5" width="14" height="9" rx="1" />
      <path d="M1 5l7 4.5L15 5" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3,2 13,8 3,14" />
    </svg>
  );
}

const anchorItems = [
  { num: '01', label: 'MY DESIGN CYCLE', href: '#design-cycle', Icon: IconCycle },
  { num: '02', label: 'CASE STUDIES',    href: '#case-studies', Icon: IconFolder },
  { num: '03', label: 'ABOUT ME',        href: '#about-me',     Icon: IconPerson },
  { num: '04', label: 'CONTACT',         href: '#contact',      Icon: IconEnvelope },
];

const mobileLabel: React.CSSProperties = {
  fontSize: 7,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  lineHeight: 1,
  textAlign: 'center',
};

const divider = (
  <div
    className="sm:hidden"
    style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'var(--color-pale)', flexShrink: 0 }}
  />
);

export function Navbar({ enterMotionGarden }: NavbarProps) {
  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#fcfbfa',
        borderBottom: '1px solid var(--color-pale)',
        height: 48,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '100%',
          paddingLeft: 'clamp(0px, 2vw, 32px)',
          paddingRight: 'clamp(0px, 2vw, 32px)',
        }}
      >
        {anchorItems.map(({ num, label, href, Icon }, i) => (
          <React.Fragment key={num}>
            {i > 0 && divider}
            <a
              href={href}
              className="text-ink flex flex-col sm:flex-row items-center justify-center sm:gap-1.5"
              style={{ flex: 1, gap: 3, textDecoration: 'none', padding: '0 4px' }}
            >
              <span className="sm:hidden"><Icon /></span>
              <span className="sm:hidden text-ink" style={mobileLabel}>{label}</span>
              <span
                className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                <span className="text-dark">{num}</span>
                <span className="text-dark">–</span>
                <Icon />
                <span className="text-ink">{label}</span>
              </span>
            </a>
          </React.Fragment>
        ))}

        {divider}

        <button
          type="button"
          onClick={enterMotionGarden}
          className="text-accent flex flex-col sm:flex-row items-center justify-center sm:gap-1.5"
          style={{ flex: 1, gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
        >
          <span className="sm:hidden"><IconPlay /></span>
          <span className="sm:hidden" style={{ ...mobileLabel, color: 'currentColor' }}>MOTION GARDEN</span>
          <span
            className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
            style={{ letterSpacing: '0.06em' }}
          >
            <span className="text-dark">05</span>
            <span className="text-dark">–</span>
            <IconPlay />
            <span>MOTION GARDEN</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
