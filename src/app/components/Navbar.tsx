import React, { useEffect, useState } from 'react';

type NavbarProps = {
  enterMotionGarden: () => void;
  enterAccessibility: () => void;
  enterAiExperience: () => void;
  currentView?: 'main' | 'motion-garden' | 'accessibility' | 'ai-experience';
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

function IconHash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5.5" y1="2" x2="4.5" y2="14" />
      <line x1="11.5" y1="2" x2="10.5" y2="14" />
      <line x1="2.5" y1="6" x2="13.5" y2="6" />
      <line x1="2" y1="10" x2="13" y2="10" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.75 8s2.25-4 6.25-4 6.25 4 6.25 4-2.25 4-6.25 4S1.75 8 1.75 8z" />
      <circle cx="8" cy="8" r="1.85" />
    </svg>
  );
}

function IconSignal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
      <line x1="2.5" y1="11.5" x2="13.5" y2="4.5" />
      <line x1="2.5" y1="7.5" x2="13.5" y2="7.5" />
      <line x1="2.5" y1="3.5" x2="13.5" y2="10.5" />
    </svg>
  );
}

const anchorItems = [
  { num: '01', label: 'MY DESIGN CYCLE',  href: '#design-cycle', Icon: IconCycle },
  { num: '02', label: 'CASE STUDIES',     href: '#case-studies', Icon: IconFolder },
  { num: '03', label: 'ABOUT / CONTACT',  href: '#about-me',     Icon: IconPerson },
];

const sectionIds = anchorItems.map(item => item.href.slice(1));

const mobileLabel: React.CSSProperties = {
  fontSize: 10,
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

export function Navbar({ enterAccessibility, enterAiExperience, currentView }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (currentView === 'motion-garden') {
      setActiveSection('motion-garden');
      return;
    }
    if (currentView === 'accessibility') {
      setActiveSection('accessibility');
      return;
    }
    if (currentView === 'ai-experience') {
      setActiveSection('ai-experience');
      return;
    }

    const updateActive = () => {
      const navHeight = 48;
      const scrollY = window.scrollY + navHeight + 1;

      // If the user has scrolled to the bottom, activate the last section (Contact)
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let activeId: string | null = null;
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) {
          activeId = id;
          break;
        }
      }
      setActiveSection(activeId);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [currentView]);

  const activeUnderline: React.CSSProperties = {
    borderBottom: '2px solid var(--color-ink)',
    marginBottom: -1,
  };

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
        {anchorItems.map(({ num, label, href, Icon }, i) => {
          const id = href.slice(1);
          const isActive = activeSection === id;
          return (
            <React.Fragment key={num}>
              {i > 0 && divider}
              <a
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="text-ink flex flex-col sm:flex-row items-center justify-center sm:gap-1.5"
                style={{
                  flex: 1,
                  gap: 3,
                  textDecoration: 'none',
                  padding: '0 4px',
                  ...(isActive ? activeUnderline : {}),
                }}
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
          );
        })}

        {divider}

        {(() => {
          const isActive = activeSection === 'accessibility';
          return (
            <button
              type="button"
              onClick={enterAccessibility}
              aria-current={isActive ? 'page' : undefined}
              className="text-ink flex flex-col sm:flex-row items-center justify-center sm:gap-1.5"
              style={{
                flex: 1,
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
                ...(isActive ? activeUnderline : {}),
              }}
            >
              <span className="sm:hidden text-ink"><IconEye /></span>
              <span className="sm:hidden text-ink" style={mobileLabel}>ACCESSIBILITY</span>
              <span
                className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                <IconEye />
                <span className="text-ink">ACCESSIBILITY</span>
              </span>
            </button>
          );
        })()}

        {divider}

        {(() => {
          const isActive = activeSection === 'ai-experience';
          return (
            <button
              type="button"
              onClick={enterAiExperience}
              aria-current={isActive ? 'page' : undefined}
              className="text-accent flex flex-col sm:flex-row items-center justify-center sm:gap-1.5"
              style={{
                flex: 1,
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
                ...(isActive ? { borderBottom: '2px solid var(--color-accent)', marginBottom: -1 } : {}),
              }}
            >
              <span className="sm:hidden"><IconSignal /></span>
              <span className="sm:hidden" style={{ ...mobileLabel, color: 'currentColor' }}>AI PRACTICE</span>
              <span
                className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                <IconSignal />
                <span>AI PRACTICE</span>
              </span>
            </button>
          );
        })()}
      </div>
    </nav>
  );
}
