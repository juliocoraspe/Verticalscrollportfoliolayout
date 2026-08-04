import { FigmaEmbed } from './embeds/FigmaEmbed';
import type { Project } from '../data/projects';
import type { BlueprintSection } from './CaseStudyBlueprint';
import todoPreview from '../../assets/images/todo-app.png';
import syncoOutcomeMobile from '../../assets/images/Synco-mobile2.jpg';

const PROTOTYPE_URL = 'https://juliocoraspe.github.io/Synco/';
const REPO_URL = 'https://github.com/juliocoraspe/Synco';

// The three apps audited before any feature was proposed. Each one was picked
// because participants already used it, so the gap is a lived complaint rather
// than a heuristic score.
const COMPETITORS: { name: string; gap: string }[] = [
  { name: "Apple Reminders", gap: 'No “ahead of time” reminders; notifications are weak and quiet.' },
  { name: 'Microsoft To Do', gap: 'Sync issues with Hotmail and Apple Calendar; the iOS widget and main app were not functional.' },
  { name: 'Todoist', gap: 'Poor calendar sync with Google and Apple; no useful mobile widget.' },
];

// WSJF = Impact ÷ Effort, both scored 1–10. Ordered by score, descending.
const WSJF_ROWS: { feature: string; impact: number; effort: number; score: number; built: boolean }[] = [
  { feature: 'Widget + Smart Notifications', impact: 9, effort: 3, score: 3.0, built: true },
  { feature: 'Customizable Loud Alerts', impact: 7, effort: 3, score: 2.3, built: false },
  { feature: 'Focus Mode in One Tap', impact: 6, effort: 3, score: 2.0, built: false },
  { feature: 'Swipe Triage (Today / Later / Done)', impact: 7, effort: 4, score: 1.8, built: false },
  { feature: 'Unified Calendar Integration', impact: 8, effort: 6, score: 1.3, built: true },
];

// Ranked horizontal bars. Follows the same inline-SVG + --bp-* token approach
// as the charts in the RealLife and DirectPass studies, so the blueprint shell
// themes it without extra CSS.
function WsjfPriorityChart() {
  const width = 640;
  const rowH = 44;
  const headerH = 26;
  const height = headerH + WSJF_ROWS.length * rowH + 26;
  const labelW = 236;
  const barX = labelW + 12;
  const barMaxW = width - barX - 52;
  const maxScore = 3.0;
  const barH = 16;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="WSJF prioritization of five candidate features, scored as impact divided by effort. Widget plus Smart Notifications scores highest at 3.0; Unified Calendar Integration scores lowest at 1.3 but was still selected as a strategic differentiator."
      >
        <text x={0} y={12} fontSize={11} fill="var(--bp-dim, #707472)" letterSpacing="0.08em">
          FEATURE
        </text>
        <text x={barX} y={12} fontSize={11} fill="var(--bp-dim, #707472)" letterSpacing="0.08em">
          WSJF = IMPACT ÷ EFFORT
        </text>

        {WSJF_ROWS.map((row, i) => {
          const y = headerH + i * rowH;
          const w = (row.score / maxScore) * barMaxW;
          const fill = row.built ? 'var(--bp-accent, #344040)' : 'var(--bp-border-strong, #959492)';
          return (
            <g key={row.feature}>
              <text x={0} y={y + barH - 2} fontSize={13} fill="var(--bp-text, #111111)">
                {row.feature}
              </text>
              <text x={0} y={y + barH + 14} fontSize={11} fill="var(--bp-muted, #666c6a)">
                {`impact ${row.impact} · effort ${row.effort}`}
              </text>
              <rect
                x={barX}
                y={y + 2}
                width={barMaxW}
                height={barH}
                fill="var(--bp-accent-soft, rgba(52, 64, 64, 0.06))"
                rx={2}
              />
              <rect x={barX} y={y + 2} width={w} height={barH} fill={fill} rx={2}>
                <title>{`${row.feature}: impact ${row.impact} ÷ effort ${row.effort} = ${row.score.toFixed(1)}`}</title>
              </rect>
              <text
                x={barX + w + 8}
                y={y + barH - 2}
                fontSize={13}
                fontWeight={600}
                fill="var(--bp-text, #111111)"
              >
                {row.score.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 6 }}
        aria-hidden="true"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bp-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bp-accent, #344040)', flexShrink: 0 }} />
          Selected for the prototype
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bp-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bp-border-strong, #959492)', flexShrink: 0 }} />
          Deferred
        </span>
      </div>
    </div>
  );
}

export function getSyncoBlueprintSections(project: Project): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: (
        <>
          <p>{project.context}</p>
          <p>
            The project ran as a full loop rather than a screen exercise: audit the tools people
            already use, score the candidate features honestly, then write enough code to find out
            whether the highest-value one was actually buildable. That last step is what kept the
            prioritization from being theoretical.
          </p>

          <ol className="dp-context-timeline" aria-label="Synco project process">
            <li><span>01</span><strong>Audit</strong><small>Three to-do apps participants already used</small></li>
            <li><span>02</span><strong>Extract</strong><small>Unmet needs and differentiation opportunities</small></li>
            <li><span>03</span><strong>Score</strong><small>WSJF across five candidate features</small></li>
            <li><span>04</span><strong>Design</strong><small>Lo-fi to hi-fi, iterated on usability feedback</small></li>
            <li><span>05</span><strong>Prove</strong><small>Coded prototype testing the calendar handoff</small></li>
          </ol>

          <p className="cs-bp-muted">
            Role: {project.role} · Timeline: 2025
          </p>
        </>
      ),
    },
    {
      id: '02',
      label: 'Research: Competitive Audit',
      body: (
        <>
          <p>
            Rather than surveying the category broadly, the audit went narrow: three apps that
            participants already had installed. That constraint mattered — every gap below is
            something a real user had already run into and worked around, not a heuristic finding.
          </p>

          <div className="dp-research-sequence" aria-label="Research sequence">
            <span>Audit</span><i aria-hidden="true" />
            <span>Extract</span><i aria-hidden="true" />
            <span>Differentiate</span>
          </div>

          <ol className="rl-feature-idea-landscape" aria-label="Three to-do apps audited and the gap found in each">
            {COMPETITORS.map((c, i) => (
              <li key={c.name}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{c.name}</strong>
                <small>{c.gap}</small>
              </li>
            ))}
          </ol>

          <p style={{ margin: '16px 0 12px' }}>
            The same complaint surfaced in all three, from opposite directions: the app knows about a
            task, and the user finds out too late anyway. What was already working — quick capture,
            cross-device sync, clean interfaces — was left alone.
          </p>

          <div className="dp-research-methods" aria-label="What the audit produced">
            <article>
              <span>Observed</span>
              <h5>Unmet needs</h5>
              <p>
                Clear anticipation of upcoming tasks rather than last-minute alerts. Widgets showing
                the day or week at a glance. Notifications loud enough to actually register.
              </p>
            </article>
            <article>
              <span>Working</span>
              <h5>What to preserve</h5>
              <p>
                Quick task capture, cross-device sync, and simple interface design were consistently
                praised. None of these needed reinvention.
              </p>
            </article>
            <article>
              <span>Opportunity</span>
              <h5>Where to differentiate</h5>
              <p>
                Fuse widget and smart notifications into anticipation. Make calendar integration
                reliable where Todoist and Microsoft To Do failed. Make alerts customizable.
              </p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: '03',
      label: 'The Problem',
      body: (
        <>
          <p>
            The problem statement came out of the audit rather than preceding it. {project.problem}
          </p>
          <p>
            Framed as a design problem: the failure is not that tasks go unrecorded, it is that
            recording a task does not reliably produce awareness of it later. Every gap found in the
            audit sits on that same seam — between the moment of capture and the moment the task
            actually needs to surface.
          </p>
          <p className="cs-bp-muted">
            How might a to-do app make an upcoming task visible early enough to act on, using the
            phone&apos;s own widgets, notifications, and calendar rather than asking the user to
            remember to open the app?
          </p>
        </>
      ),
    },
    {
      id: '04',
      label: 'Prioritization: WSJF',
      body: (
        <>
          <p>
            Five candidate features came out of the audit. Rather than choosing by intuition, each
            was scored with WSJF — impact divided by effort, both on a 1–10 scale — so the
            assumptions behind the ranking would be visible and arguable.
          </p>

          <WsjfPriorityChart />

          <p style={{ margin: '16px 0 12px' }}>
            <strong>Widget + Smart Notifications</strong> won on the numbers at 3.0: a glance at
            today plus the next three tasks, with escalated reminders at one hour and ten minutes
            before. It scores well because it is supported natively by iOS and Android, needs only
            local storage with no backend, addresses the strongest unmet need directly, and can ship
            incrementally — the widget first, custom reminder settings later.
          </p>

          <p className="cs-bp-muted" style={{ marginBottom: 12 }}>
            Strategic note: even though Unified Calendar Integration ranks last on WSJF at 1.3 —
            high impact at 8, but effort at 6 — it was still selected. Calendar sync and export was
            the single most repeated complaint across Todoist and Microsoft To Do, and combining
            reliable sync with portability through <code>.ics</code> export is what separates Synco
            from the apps it was measured against. The score describes cost, not importance.
          </p>

          <p>
            Loud Alerts, Focus Mode, and Swipe Triage were all deferred. They improve usability
            incrementally, but none of them changes whether a user finds out about a task in time,
            which is the actual problem.
          </p>
        </>
      ),
    },
    {
      id: '05',
      label: 'Solution',
      body: (
        <>
          <p>{project.solution}</p>
          <p style={{ margin: '16px 0 12px' }}>
            Concretely, the two selected features shape the whole interface. Anticipation is designed
            for first — the widget and the reminder ladder are the primary surface, and the app
            itself is what you open when you need to change something, not what you open to find out
            what is happening.
          </p>
          <ul>
            {project.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: '06',
      label: 'Feasibility Prototype',
      layout: 'vsplit',
      body: (
        <div className="cs-bp-vsplit">
          <div className="cs-bp-vsplit-text">
            <div className="cs-bp-vsplit-title-row">
              <span className="cs-bp-display-num" aria-hidden="true">06</span>
              <h4 className="cs-bp-display-title">Feasibility Prototype</h4>
            </div>
            <div className="cs-bp-vsplit-body">
              <p>
                The WSJF ranking rests on an effort estimate, and an effort estimate is a guess until
                someone writes the code. So the two selected features were built: seven screens
                including a widget view and a notifications view, and a real calendar handoff that
                generates a <code>.ics</code> file the device&apos;s native calendar accepts.
              </p>
              <p>
                That last part is what the prototype was for. It confirmed the handoff works without
                a backend or a sync service — which is exactly what the effort score of 6 was
                uncertain about.
              </p>
            </div>
            <div className="cs-bp-vsplit-cta">
              <a className="cs-bp-cta" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                See full code on GitHub
                <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div
            className="cs-bp-vsplit-media"
            style={{ ['--media-aspect' as string]: '390 / 844' }}
          >
            <div
              className="cs-bp-vsplit-media-frame"
              style={{
                ['--frame-w' as string]: '390px',
                ['--frame-h' as string]: '844px',
                ['--frame-scale' as string]: '0.582',
              }}
            >
              <FigmaEmbed
                title={`${project.title} prototype`}
                src={PROTOTYPE_URL}
                wrapperClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                iframeClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                mobileStaticImageSrc={todoPreview}
                mobileStaticImageAlt={`${project.title} prototype preview`}
                mobileStaticImageObjectFit="cover"
                mobileLinkHref={REPO_URL}
                mobileLinkLabel="See full code on GitHub"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '07',
      label: 'Outcome & Next Steps',
      body: (
        <>
          <ul>
            {project.outcome.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p style={{ margin: '16px 0 12px' }}>
            The interaction and system validation deck below documents how the flows were tested and
            what changed as a result.
          </p>

          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title={`${project.title} interaction and system validation`}
                src={project.prototypeUrl ?? ''}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                mobileStaticImageSrc={syncoOutcomeMobile}
                mobileStaticImageAlt="Synco interaction and system validation static preview"
                mobileLinkLabel="Open Figma slides"
              />
            </div>
          </div>

          <p className="rl-outcome-next-signal">
            Scope of this validation: usability sessions tested comprehension and navigation, and the
            coded prototype tested technical feasibility of the calendar handoff. Neither measured
            whether anticipation actually reduces missed tasks — that needs instrumented use over
            several weeks. Next steps, in order: test the widget and reminder ladder on a real device
            where notifications behave natively, measure whether the one hour and ten minute
            escalation is the right cadence or merely the first guess, then revisit the deferred
            three — Loud Alerts, Focus Mode, Swipe Triage — against evidence rather than against the
            original effort estimates.
          </p>
        </>
      ),
    },
  ];
}
