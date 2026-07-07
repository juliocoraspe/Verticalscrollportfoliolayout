import React, { useEffect, useState } from 'react';

type NavbarProps = {
  enterMotionGarden: () => void;
  enterAccessibility: () => void;
  enterAiExperience: () => void;
  onSelectHero?: () => void;
  // Optional controlled handler for the My Design Cycle button. When
  // provided, left-clicks on the #design-cycle anchor are intercepted and
  // routed through this handler so the scroll lands deterministically on
  // every click (avoids the native-jump vs smooth-scroll race that
  // otherwise leaves the section misaligned on repeated clicks).
  onSelectDesignCycle?: () => void;
  currentView?: 'main' | 'motion-garden' | 'accessibility' | 'ai-experience';
};

function IconHome() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7.25 8 2.75l5.5 4.5" />
      <path d="M4.25 6.6v6.15h7.5V6.6" />
      <path d="M6.7 12.75V9.4h2.6v3.35" />
    </svg>
  );
}

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

// The two groups are separated purely by a split layout: anchor links
// flush-left, separate-view links flush-right, with the empty space
// between them acting as the visual separator (and the labelled lists
// providing the semantic grouping for assistive tech). No drawn divider —
// that avoids the visual clash with the hero section's vertical rule.

export function Navbar({ enterAccessibility, enterAiExperience, onSelectHero, onSelectDesignCycle, currentView }: NavbarProps) {
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
  const isMainView = currentView == null || currentView === 'main';
  const isHeroActive = isMainView && activeSection === null;

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
          justifyContent: 'space-between',
          height: '100%',
          paddingLeft: 'clamp(12px, 2vw, 32px)',
          paddingRight: 'clamp(12px, 2vw, 32px)',
        }}
      >
        {/* Group 1 — in-page anchor links (same-page scroll). Flush-left. */}
        <ul
          aria-label="On this page"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li className="hidden sm:flex" style={{ marginRight: 'clamp(24px, 4vw, 72px)' }}>
            <a
              href="#main-content"
              onClick={
                onSelectHero
                  ? (e) => {
                      if (e.defaultPrevented) return;
                      if (e.button !== 0) return;
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      onSelectHero();
                    }
                  : undefined
              }
              aria-label="Home"
              aria-current={isHeroActive ? 'page' : undefined}
              className="text-ink flex items-center justify-center"
              style={{
                textDecoration: 'none',
                width: 48,
                color: 'var(--color-ink)',
                ...(isHeroActive ? activeUnderline : {}),
              }}
            >
              <IconHome />
            </a>
          </li>
          {anchorItems.map(({ num, label, href, Icon }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            // Left-clicks on #design-cycle go through the controlled
            // handler (deterministic offset-aware smooth scroll). Middle-
            // click, ⌘-click, etc. fall through to the native anchor.
            const handleClick =
              id === 'design-cycle' && onSelectDesignCycle
                ? (e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (e.defaultPrevented) return;
                    if (e.button !== 0) return;
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    onSelectDesignCycle();
                  }
                : undefined;
            return (
              <li key={num} style={{ display: 'flex' }}>
                <a
                  href={href}
                  onClick={handleClick}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className="text-ink flex items-center justify-center"
                  style={{
                    gap: 3,
                    textDecoration: 'none',
                    padding: '0 clamp(8px, 1.4vw, 14px)',
                    ...(isActive ? activeUnderline : {}),
                  }}
                >
                  {/* Mobile: icon only. Desktop: number + icon + text. */}
                  <span className="sm:hidden"><Icon /></span>
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
              </li>
            );
          })}
        </ul>

        {/* Group 2 — links to separate full-screen views, not in-page
            anchors. Flush-right. Distinct label so AT users know these
            behave differently from the on-page links above. */}
        <ul
          aria-label="Sections"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {(() => {
            const isActive = activeSection === 'accessibility';
            return (
              <li style={{ display: 'flex' }}>
                <button
                  type="button"
                  onClick={enterAccessibility}
                  aria-label="ACCESSIBILITY"
                  aria-current={isActive ? 'page' : undefined}
                  className="text-ink flex items-center justify-center"
                  style={{
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 clamp(8px, 1.4vw, 14px)',
                    ...(isActive ? activeUnderline : {}),
                  }}
                >
                  <span className="sm:hidden text-ink"><IconEye /></span>
                  <span
                    className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
                    style={{ letterSpacing: '0.06em' }}
                  >
                    <IconEye />
                    <span className="text-ink">ACCESSIBILITY</span>
                  </span>
                </button>
              </li>
            );
          })()}

          {(() => {
            const isActive = activeSection === 'ai-experience';
            return (
              <li style={{ display: 'flex' }}>
                <button
                  type="button"
                  onClick={enterAiExperience}
                  aria-label="AI PRACTICE"
                  aria-current={isActive ? 'page' : undefined}
                  className="text-accent flex items-center justify-center"
                  style={{
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 clamp(8px, 1.4vw, 14px)',
                    ...(isActive ? { borderBottom: '2px solid var(--color-accent)', marginBottom: -1 } : {}),
                  }}
                >
                  <span className="sm:hidden"><IconSignal /></span>
                  <span
                    className="hidden sm:flex items-center gap-1.5 type-micro uppercase"
                    style={{ letterSpacing: '0.06em' }}
                  >
                    <IconSignal />
                    <span>AI PRACTICE</span>
                  </span>
                </button>
              </li>
            );
          })()}
        </ul>
      </div>
    </nav>
  );
}
