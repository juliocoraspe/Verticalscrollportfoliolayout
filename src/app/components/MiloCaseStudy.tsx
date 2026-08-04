import { FigmaEmbed } from './embeds/FigmaEmbed';
import type { BlueprintSection } from './CaseStudyBlueprint';
import miloMobile from '../../assets/images/Milo_mobile.jpg';
import miloPrototype from '../../assets/images/Milo_prototype.png';

const FIGMA_FILE_URL = 'https://www.figma.com/design/JIjE307GOTQI96gbCzj0N0/Milo?node-id=0-1';

const figmaEmbed = (nodeId: string) =>
  `https://embed.figma.com/design/JIjE307GOTQI96gbCzj0N0/Milo?node-id=${nodeId}&embed-host=share`;

const SYSTEM_EMBED = figmaEmbed('12-594'); // Interface Design system
const PRODUCT_MAP_EMBED = figmaEmbed('55-2664'); // Product map and gestures
const PROTOTYPE_URL = 'https://juliocoraspe.github.io/Milo/';
const REPO_URL = 'https://github.com/juliocoraspe/Milo';

// The five system states, each with the feeling it should communicate and the
// visual behaviour that carries it. Taken from the design system's own
// state-characteristics table.
const STATES: { state: string; feeling: string; behavior: string }[] = [
  {
    state: 'Idle / Presence',
    feeling: '“I’m here, no urgency”',
    behavior: 'Extremely subtle gradient, almost imperceptible, minimal motion.',
  },
  {
    state: 'Listening',
    feeling: '“Attention, openness”',
    behavior: 'Soft sage green. Slightly wider gradient with a slow, breathing-like pulse.',
  },
  {
    state: 'Thinking',
    feeling: '“Reflection, cognitive pause”',
    behavior: 'Blue-lavender. Thinner gradient, slower motion, long transitions.',
  },
  {
    state: 'Speaking',
    feeling: '“Clarity, active presence”',
    behavior: 'The most intense gradient; its width varies with volume, with gentle pulses.',
  },
  {
    state: 'Error / Disconnected',
    feeling: '“Absence, silence”',
    behavior: 'Gradient almost off. The background freezes — the only time motion stops.',
  },
];

// The four layers the interface is built from, ordered by how permanent they are.
const LAYERS: { name: string; visibility: string; detail: string }[] = [
  {
    name: 'Core Presence',
    visibility: 'Always visible',
    detail:
      'Animated background, organic shapes, grain texture. Persistent, slowly animated, and deliberately outside user control.',
  },
  {
    name: 'State Communication',
    visibility: 'Always visible',
    detail:
      'The perimeter glow and motion shifts that report what the system is doing, without words.',
  },
  {
    name: 'Content',
    visibility: 'On activity',
    detail:
      'Text, live voice transcription, and AI responses. Content appears word by word as voice input is processed.',
  },
  {
    name: 'System / Meta',
    visibility: 'On request',
    detail:
      'Account management, data and memory settings, privacy. Reachable only through a long press.',
  },
];

// Each source, what was taken from it, and where it landed in the interface.
const RESEARCH: { n: string; source: string; org: string; extracted: string; applied: string }[] = [
  {
    n: '01',
    source: 'People + AI Guidebook',
    org: 'Google PAIR',
    extracted:
      'Feedback and controls, mental models, and predictability and continuity — how an AI should communicate what it is doing and stay legible over time.',
    applied:
      'The animated background represents presence; the perimeter gradient functions as a system-status channel; slow motion reinforces continuity.',
  },
  {
    n: '02',
    source: 'Guidelines for Human-AI Interaction',
    org: 'Microsoft Research',
    extracted:
      'Convey system status, gradual engagement, and support efficient correction — an academic set of principles rather than product marketing.',
    applied:
      'The organic form plus gradient communicates state continuously, and slow non-reactive motion supports gradual engagement, so the interface reads as a companion rather than a tool.',
  },
  {
    n: '03',
    source: 'Safety & Interface Guidelines',
    org: 'OpenAI',
    extracted:
      'Communicate uncertainty, avoid misleading signals, keep system states visible rather than hidden.',
    applied:
      'Gradients and subtle pulses indicate processing honestly; organic motion communicates presence without implying the system knows more than it does.',
  },
  {
    n: '04',
    source: 'Human Interface Guidelines — Feedback',
    org: 'Apple',
    extracted:
      'Motion should communicate meaning rather than decorate, and micro-interactions should confirm responsiveness.',
    applied:
      'Smooth ease-in and ease-out transitions, and pacing slow enough to respect human focus rather than demand it.',
  },
  {
    n: '05',
    source: 'Conversation Design Principles',
    org: 'Google',
    extracted:
      'Turn-taking, confirmation, clarification, and correction — the structure underneath any dialogue.',
    applied:
      'Visual states map onto conversational moments, so the turn is legible without a chat transcript being on screen.',
  },
];

export function getMiloBlueprintSections(): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: (
        <>
          <p>
            Designed as an interface study for AI companionship rather than task execution. The goal
            was to explore how a system can feel continuously present — like a conversational partner
            — through pacing, subtle motion, and state-based feedback.
          </p>
          <p>
            The governing principle, written before any screen: <strong>presence, not
            productivity</strong>. Which produced the constraint everything else follows from —{' '}
            <em>this interface does not react to content, it reacts to state</em>. The background
            never responds to what is being said or to the audio itself; it responds only to what the
            system is doing.
          </p>

          <ol className="dp-context-timeline" aria-label="Milo project process">
            <li><span>01</span><strong>Ground</strong><small>Five AI interaction guideline sets</small></li>
            <li><span>02</span><strong>Hypothesize</strong><small>What presence should feel like</small></li>
            <li><span>03</span><strong>Model</strong><small>States, triggers, and layer architecture</small></li>
            <li><span>04</span><strong>Specify</strong><small>Colour, gradient, motion, and text rules</small></li>
            <li><span>05</span><strong>Build</strong><small>Figma to Figma Make to code, running live</small></li>
          </ol>

          <p className="cs-bp-muted">
            Role: Interaction design, motion systems, design systems · Timeline: 2025
          </p>
        </>
      ),
    },
    {
      id: '02',
      label: 'Foundation Research',
      body: (
        <>
          <p>
            An interface with almost no affordances has to earn its restraint, so the behavioural
            rules were grounded in published guidance before anything was drawn. Five sources were
            read for one question each: what does this tell me about communicating system state
            without words?
          </p>

          <div className="dp-research-artifacts">
            {RESEARCH.map((r) => (
              <article className="dp-research-artifact" key={r.source}>
                <div className="dp-research-artifact__meta">
                  <span>{r.n}</span>
                  <span>{r.org}</span>
                </div>
                <h5>{r.source}</h5>
                <p>{r.extracted}</p>
                <p className="dp-research-artifact__takeaway">
                  <strong>Design implication</strong>
                  {r.applied}
                </p>
              </article>
            ))}
          </div>

          <p style={{ margin: '16px 0 4px' }}>
            The five converge on the same instruction from different directions: status must be
            continuously legible, engagement should build gradually rather than arrive all at once,
            and motion earns its place only when it carries meaning.
          </p>
        </>
      ),
    },
    {
      id: '03',
      label: 'Design Hypotheses',
      body: (
        <>
          <p>
            If an AI companion is meant to feel present rather than transactional, its interface
            should communicate state through continuous, calm feedback instead of abrupt UI changes.
            If conversation is ongoing rather than task-based, the system should prioritize gradual
            transitions, restrained contrast, and ambient motion that signals presence without
            demanding attention.
          </p>
          <p>
            Both hypotheses are falsifiable in the same way: if a user cannot tell what the system is
            doing without reading text, the visual channel has failed and the restraint was just
            withholding information.
          </p>
          <p className="cs-bp-muted">
            How might an interface report its own state continuously and legibly, using only colour,
            motion, and the edge of the screen, so a companion reads as present rather than idle?
          </p>
        </>
      ),
    },
    {
      id: '04',
      label: 'Interaction States',
      body: (
        <>
          <p>
            The interface is organized around states rather than screens. Each state carries a
            feeling it must communicate and a specific visual behaviour that carries it — the pairing
            is what keeps the system from being decorative.
          </p>

          <div className="dp-research-methods" aria-label="The five system states">
            {STATES.map((s) => (
              <article key={s.state}>
                <span>{s.state}</span>
                <h5>{s.feeling}</h5>
                <p>{s.behavior}</p>
              </article>
            ))}
          </div>

          <p style={{ margin: '16px 0 12px' }}>
            The distinction that made the model work is between what the <em>user</em> does and what
            the <em>system</em> does. Conflating the two is what makes AI interfaces feel erratic —
            the screen changes and it is unclear whether you caused it.
          </p>

          <div className="dp-research-methods" aria-label="Interaction triggers versus state changes">
            <article>
              <span>User interaction triggers</span>
              <h5>Deliberate, and always reversible</h5>
              <p>
                Tap anywhere activates listening. Long press reveals system controls. Swipe shows
                conversation history. Nothing appears unless it was asked for.
              </p>
            </article>
            <article>
              <span>System state changes</span>
              <h5>Announced, never silent</h5>
              <p>
                Voice detected enters listening. Processing enters thinking. Response ready enters
                responding. Inactivity returns to idle.
              </p>
            </article>
          </div>

          <p style={{ margin: '16px 0 0' }}>
            Text follows the same logic rather than running on its own track: nearly absent at idle,
            a small live transcription while listening, brief indicators while thinking, and dynamic
            display type with key words emphasized while speaking. On disconnection it freezes,
            matching the background.
          </p>
        </>
      ),
    },
    {
      id: '05',
      label: 'Layer Architecture',
      body: (
        <>
          <p>
            Four layers, ordered by permanence. The order is the argument: what is always there
            establishes continuity, and everything that could interrupt has to be requested.
          </p>

          <ol className="rl-validation-flow" aria-label="The four interface layers">
            {LAYERS.map((l, i) => (
              <li key={l.name}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{`${l.name} — ${l.visibility}`}</strong>
                <small>{l.detail}</small>
              </li>
            ))}
          </ol>

          <p style={{ margin: '16px 0 12px' }}>
            The perimeter gradient is the load-bearing element, so its rules are the strictest. It
            always originates from the edge of the viewport, never from the centre, and wraps all
            four corners continuously. Its inset runs 40–56 px at the most intense Speaking state and
            never exceeds 10–12% of screen width. One single colour per state — no multicolour
            gradients — against a warm off-white background that is never pure white, to avoid visual
            fatigue over a long session.
          </p>
          <p style={{ marginBottom: 12 }}>
            The animated background follows one reference: <em>a lava lamp seen from far away</em>.
            Constant slow movement that indicates continuous life rather than attention. It never
            reacts to text and never reacts to audio — only to global system state.
          </p>

          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title="Milo interface design system — states, colour, gradient, and motion"
                src={SYSTEM_EMBED}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                buttonLabel="Load design system documentation"
                mobileStaticImageSrc={miloMobile}
                mobileStaticImageAlt="Milo design system documentation preview"
                mobileLinkHref={FIGMA_FILE_URL}
                mobileLinkLabel="Open Figma Design"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          </div>

          <div className="cs-bp-vsplit-cta" style={{ marginTop: 14 }}>
            <a className="cs-bp-cta" href={FIGMA_FILE_URL} target="_blank" rel="noopener noreferrer">
              View the design file in Figma
              <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </>
      ),
    },
    {
      id: '06',
      label: 'Product Map & Gestures',
      body: (
        <>
          <p>
            The product map externalizes the logic so it can be argued with: low-fidelity wireframes
            for each state, the layer structure, and a schema of how states change without the screen
            changing.
          </p>
          <p style={{ marginBottom: 12 }}>
            Three gestures carry the entire navigation model. Each one reveals a layer and then gets
            out of the way — the quick controls dismiss automatically, leaving no persistent UI
            chrome behind.
          </p>

          <ol className="rl-validation-flow" aria-label="The three gestures and what each reveals">
            <li>
              <span>01</span>
              <strong>Tap — Quick Controls</strong>
              <small>Play/pause, voice on/off, text on/off. Ephemeral; dismisses on its own.</small>
            </li>
            <li>
              <span>02</span>
              <strong>Long press — System Navigation</strong>
              <small>Account, settings, privacy. The only route into the meta layer.</small>
            </li>
            <li>
              <span>03</span>
              <strong>Swipe — Conversation Context</strong>
              <small>Conversation history, on demand rather than persistently on screen.</small>
            </li>
          </ol>

          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%', marginTop: 16 }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title="Milo product map, wireframes, and gesture model"
                src={PRODUCT_MAP_EMBED}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                buttonLabel="Load product map and gestures"
                mobileStaticImageSrc={miloMobile}
                mobileStaticImageAlt="Milo product map and gesture model preview"
                mobileLinkHref={FIGMA_FILE_URL}
                mobileLinkLabel="Open Figma Design"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </>
      ),
    },
    {
      id: '07',
      label: 'Prototyping & Execution',
      layout: 'vsplit',
      body: (
        <div className="cs-bp-vsplit">
          <div className="cs-bp-vsplit-text">
            <div className="cs-bp-vsplit-title-row">
              <span className="cs-bp-display-num" aria-hidden="true">07</span>
              <h4 className="cs-bp-display-title">Prototyping & Execution</h4>
            </div>
            <div className="cs-bp-vsplit-body">
              <p>
                Figma established structure and state logic. Figma Make introduced motion and
                temporal behavior. VS Code with Codex handled implementation refinement. GitHub Pages
                provided runtime validation.
              </p>
              <p>
                The reason it had to run: every claim in the system is about time — breathing pulses,
                long transitions, motion slow enough to read as calm. None of that can be evaluated
                in a static frame. This workflow treats code as an extension of the design process,
                not a downstream deliverable.
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
                title="Milo AI companion interface prototype"
                src={PROTOTYPE_URL}
                wrapperClassName="cs-bp-vsplit-frame"
                iframeClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                mobileStaticImageSrc={miloPrototype}
                mobileStaticImageAlt="Milo prototype preview"
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
      id: '08',
      label: 'Outcome & What Comes Next',
      body: (
        <>
          <p>
            Not a finished product, but a validated interaction foundation: a state-driven visual
            language, motion pacing rules, and a UI system that can support future prototyping,
            testing, and implementation.
          </p>
          <p style={{ margin: '16px 0 12px' }}>
            The most transferable result is the separation of user triggers from system state
            changes. Once those are modelled independently, an interface with almost no visible
            controls stops being a risk and becomes legible — you always know whether the screen
            changed because of you or because of the system.
          </p>

          <p style={{ marginBottom: 12 }}>Next, in order:</p>
          <ul>
            <li>
              Refine typographic scale and hierarchy for accessibility across all five interaction
              states, where contrast is hardest at the low-intensity end.
            </li>
            <li>
              Calibrate the colour behavior and motion logic of the perimeter gradients, and revisit
              background animation pacing for sustained sessions rather than short demos.
            </li>
            <li>
              Formalize the design system into reusable rules for colour, typography, motion, and
              state behavior.
            </li>
            <li>
              Expand into additional interface surfaces — supporting views and interaction moments
              that maintain continuity without introducing visual noise.
            </li>
          </ul>

          <p className="rl-outcome-next-signal">
            Scope of this work: Milo is an interface and behaviour study, not a tested product. The
            state model, motion rules, and layer architecture are specified and running, but no
            usability sessions were conducted — so the central hypothesis, that a person can read
            system state from colour and motion alone without text, remains argued rather than
            demonstrated. That test is the next real milestone: show the running prototype to
            listeners with the text layer disabled, and ask them what the system is doing.
          </p>
        </>
      ),
    },
  ];
}
