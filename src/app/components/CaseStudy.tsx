import type { BlueprintSection } from './CaseStudyBlueprint';
import { FigmaEmbed } from './embeds/FigmaEmbed';
import testingImage from '../../assets/images/Testing.png';
import stillenMobile from '../../assets/images/Stillen_mobile.jpg';
import stillenPersona from '../../assets/images/Stillen_persona.png';
import stillenJourneyMap from '../../assets/images/Stillen_journey-map.png';
import stillenUserFlow from '../../assets/images/Stillen_user-flow.png';
import stillenProductMap from '../../assets/images/Stillen_product-map.png';

interface CaseStudyProps {
  title: string;
  role: string;
  timeline: string;
  problem: {
    title: string;
    description: string;
  };
  process: {
    title: string;
    description: string;
    steps: string[];
  };
  exploration: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
    outcomes: string[];
  };
  prototype: {
    title: string;
    embedUrl?: string;
    externalUrl?: string;
  };
}

interface CaseStudyContentProps extends CaseStudyProps {
  disableAnimation?: boolean;
}


export function getStillenBlueprintSections({
  title,
  role,
  timeline,
  problem,
  process,
  solution,
  prototype,
}: CaseStudyProps): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: (
        <>
          <p>
            STILLEN is a furniture e-commerce concept positioned as accessible luxury for modern
            professionals. It combines a concierge-style AI assistant, an AR visualization experience
            for placing furniture in a real room, and delivery information surfaced early rather than
            at the end of checkout.
          </p>
          <p>
            The project began with a question about confidence rather than conversion: furniture is a
            high-commitment purchase, and the decision usually stalls somewhere between wanting the
            piece and trusting that it will arrive, fit, and look right. The work set out to find
            where that hesitation actually forms, and to design against those specific moments
            instead of redesigning the storefront as a whole.
          </p>
          <p>{process.description}</p>

          <ol className="dp-context-timeline" aria-label="STILLEN project process">
            <li><span>01</span><strong>Listen</strong><small>User interviews on how people evaluate furniture</small></li>
            <li><span>02</span><strong>Benchmark</strong><small>Competitive audit of existing platforms</small></li>
            <li><span>03</span><strong>Synthesize</strong><small>Persona and journey map from the findings</small></li>
            <li><span>04</span><strong>Locate</strong><small>User flow with the drop-off points named</small></li>
            <li><span>05</span><strong>Structure</strong><small>Product map and information architecture</small></li>
            <li><span>06</span><strong>Design</strong><small>High fidelity screens and usability testing</small></li>
          </ol>

          <p className="cs-bp-muted">
            Role: {role} · Timeline: {timeline}
          </p>
        </>
      ),
    },
    {
      id: '02',
      label: 'Research',
      body: (
        <>
          <p>
            Research ran before the problem statement. Two methods fed each other: moderated user
            interviews about how people actually decide on furniture, and a competitive audit of
            existing platforms to see which of those needs the market already met. The interviews
            explained the reasoning behind a purchase; the audit showed where that reasoning breaks
            against a real interface.
          </p>

          <div className="dp-research-sequence" aria-label="Research sequence">
            <span>Listen</span><i aria-hidden="true" />
            <span>Compare</span><i aria-hidden="true" />
            <span>Translate</span>
          </div>

          <div className="dp-research-artifacts">
            <article className="dp-research-artifact">
              <div className="dp-research-artifact__meta">
                <span>01</span>
                <span>Qualitative</span>
              </div>
              <h5>Key takeaways from user interviews</h5>
              <p>
                Participants described furniture shopping as identity work, not a transaction. Three
                patterns held across every conversation.
              </p>
              <ul>
                <li>
                  Home is read as an extension of personal identity, especially during major life
                  transitions, which makes purchases more intentional and more deliberate.
                </li>
                <li>
                  Significant time goes into research and comparison before committing; clarity and
                  reassurance matter throughout, not only at checkout.
                </li>
                <li>
                  Confidence depends on visual context and delivery clarity — understanding how a
                  product fits the space, and what happens after the order.
                </li>
              </ul>
              <p className="dp-research-artifact__takeaway">
                <strong>Design implication</strong>
                Support the comparison period itself, rather than optimizing only the final step.
              </p>
            </article>

            <article className="dp-research-artifact">
              <div className="dp-research-artifact__meta">
                <span>02</span>
                <span>Evaluative</span>
              </div>
              <h5>Key notes from competitor research</h5>
              <p>
                The audit looked for where competing platforms lose the user, and found the same
                three failures repeating.
              </p>
              <ul>
                <li>
                  Unclear delivery timelines, availability, and post-purchase communication create
                  uncertainty precisely when the purchase value is highest.
                </li>
                <li>
                  Navigation and performance issues produce friction at checkout and other key
                  actions, where confidence is most fragile.
                </li>
                <li>
                  Limited guidance and visualization support leave users unable to judge scale, fit,
                  and suitability in their own space.
                </li>
              </ul>
              <p className="dp-research-artifact__takeaway">
                <strong>Design implication</strong>
                The gaps are not aesthetic. They are informational, and each one maps to a moment in
                the flow.
              </p>
              <a
                href="https://www.figma.com/slides/BTm5IaDApMXuQjlARP4CaD/Competitive-Analysis-Stillen?node-id=1-116"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the full competitive analysis
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>

          <p style={{ margin: '16px 0 4px' }}>
            The two layers were then reduced to three research-backed insights, written as user needs
            so they could be tested against a design later:
          </p>
          <ul>
            <li>
              Transparent shipping, availability, and fulfillment information, surfaced early and
              consistently, so a purchase can be completed with confidence.
            </li>
            <li>
              A guided, reliable experience with clear confirmations for the actions that carry
              risk — adding to cart, saving items, purchasing, contacting support.
            </li>
            <li>
              Advanced visualization support that helps users understand scale, placement, and fit
              inside their real environment.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: '03',
      label: 'The Problem',
      body: (
        <>
          <p>
            The problem statement followed the research rather than preceding it. Read together, the
            interviews and the audit describe a single experience. {problem.description}
          </p>
          <p>
            What makes this a design problem rather than a content problem is where the friction
            lands. Each gap appears at a specific decision point, and at each of those points the
            user is being asked to commit more than they can currently justify — to trust a delivery
            date they cannot see, to imagine a scale they cannot measure, or to confirm a purchase
            without a signal that the previous action registered.
          </p>
          <p className="cs-bp-muted">
            How might STILLEN make a high-value furniture purchase feel verifiable at every step, so
            confidence is built continuously instead of being asked for all at once at checkout?
          </p>
        </>
      ),
    },
    {
      id: '04',
      label: 'Persona & Journey',
      body: (
        <>
          <p>
            The persona and the journey map turn the research into a single design lens. Bryce Tucker
            is a composite rather than one interview participant: a 32-year-old product manager in
            Kansas City who recently moved into a new apartment, willing to invest in quality
            furniture but only once confident about the product, the delivery, and the experience
            around both.
          </p>

          <section className="dp-synthesis-artifact" aria-labelledby="stillen-persona-title">
            <div className="dp-synthesis-artifact__heading">
              <span>01 · Primary persona</span>
              <h5 id="stillen-persona-title">A deliberate buyer who researches before committing</h5>
            </div>
            <p>
              Bryce researches extensively, compares brands and alternatives, values clarity and
              confirmation, and prefers a curated experience over an endless product list. That
              behavior is not indecision — it is a reasonable response to an environment that hides
              the information the decision requires.
            </p>

            <div className="dp-persona-signals" aria-label="Key persona signals">
              <article>
                <span>Current moment</span>
                <strong>Furnishing a new apartment</strong>
              </article>
              <article>
                <span>Primary objective</span>
                <strong>Design without ultra-luxury pricing</strong>
              </article>
              <article>
                <span>Highest risk</span>
                <strong>Committing without proof</strong>
              </article>
            </div>

            <p className="cs-bp-muted dp-synthesis-artifact__insight">
              Design implication: STILLEN should reward the research behavior instead of trying to
              shorten it — give Bryce more to verify, earlier, rather than fewer steps to click
              through.
            </p>

            <div className="cs-bp-media dp-persona-media">
              <div className="cs-bp-media-frame">
                <img
                  src={stillenPersona}
                  alt="User persona for Bryce Tucker, a 32-year-old product manager in Kansas City, showing demographics, bio, needs and goals, pain points, behaviors, and how STILLEN supports him"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <a className="cs-bp-media-link" href={stillenPersona} target="_blank" rel="noopener noreferrer">
                <span>View full user persona</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

          <section className="dp-synthesis-artifact" aria-labelledby="stillen-journey-title">
            <div className="dp-synthesis-artifact__heading">
              <span>02 · User journey</span>
              <h5 id="stillen-journey-title">Confidence rises and falls across four stages</h5>
            </div>
            <p>
              The journey follows Bryce through Awareness, Onboarding, Engagement, and Retention. The
              emotional line moves from curious and design-inspired, to interested and visually
              engaged, to focused and reassured, and finally to satisfied and loyal — but only when
              each stage answers the doubt raised by the one before it. Pain points cluster in the
              middle: overwhelming navigation during onboarding, then uncertainty about how the piece
              will look and when it will arrive.
            </p>
            <p className="cs-bp-muted dp-synthesis-artifact__insight">
              Product opportunity: position STILLEN as accessible luxury, guide the browse with
              intuitive hierarchy, combine AR and AI for realistic visualization, show real-time
              delivery estimates, and reinforce trust through clear confirmations and tracking.
            </p>

            <div className="cs-bp-media dp-journey-media">
              <div className="cs-bp-media-frame">
                <img
                  src={stillenJourneyMap}
                  alt="User journey map for Bryce Tucker across awareness, onboarding, engagement, and retention, with actions, emotions, touchpoints, pain points, and opportunities"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <a className="cs-bp-media-link" href={stillenJourneyMap} target="_blank" rel="noopener noreferrer">
                <span>View complete user journey</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </>
      ),
    },
    {
      id: '05',
      label: 'User Flow & Drop-off Points',
      body: (
        <>
          <p>
            The purchase flow was mapped as a sunny-day scenario — open the site, browse, select a
            product, visualize it, check delivery, add to cart, review, check out — and then read
            backwards for the moments where a user would stop. Three drop-off points came out of
            that reading. Naming them is what turned the research findings into design work: each one
            states why the user hesitates and what the interface does about it.
          </p>

          <ol className="rl-validation-flow" aria-label="Three drop-off points identified in the purchase flow">
            <li>
              <span>01</span>
              <strong>Visual Confidence</strong>
              <small>Unsure how the furniture will look in their space → AR + AI visualization on the product page</small>
            </li>
            <li>
              <span>02</span>
              <strong>Shipping Transparency</strong>
              <small>Unclear timelines or availability create hesitation → real-time estimates and stock indicators</small>
            </li>
            <li>
              <span>03</span>
              <strong>Checkout Confidence</strong>
              <small>Fear of mistakes without confirmation → clear confirmations for cart updates, removals, and each step</small>
            </li>
          </ol>

          <p style={{ margin: '16px 0 12px' }}>
            The three points are not evenly spaced by accident. They sit exactly where commitment
            increases: after choosing a product, before paying for delivery, and at the moment of
            purchase. Everything designed afterward was aimed at one of these three.
          </p>

          <div className="cs-bp-media dp-journey-media">
            <div className="cs-bp-media-frame">
              <img
                src={stillenUserFlow}
                alt="User flow for purchasing a furniture item, showing the sunny-day path from homepage to order confirmation with three annotated drop-off points and their prevention"
                loading="lazy"
                decoding="async"
              />
            </div>
            <a className="cs-bp-media-link" href={stillenUserFlow} target="_blank" rel="noopener noreferrer">
              <span>View complete user flow</span>
              <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </>
      ),
    },
    {
      id: '06',
      label: 'Solution & Architecture',
      body: (
        <>
          <p>{solution.description}</p>
          <ul>
            {solution.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>

          <p style={{ margin: '16px 0 12px' }}>
            Those outcomes required a structure, not only screens. The product map defines the pages,
            the content hierarchy inside each one, and the navigation relationships between them —
            with four insights from the research driving the architecture rather than decorating it.
          </p>

          <div className="dp-research-methods" aria-label="Core design insights driving the architecture">
            <article>
              <span>01 · Transparency</span>
              <h5>Delivery information lives everywhere</h5>
              <p>
                Shipping, timelines, and availability are integrated across Product Detail, Cart, and
                Checkout instead of appearing once at the end.
              </p>
            </article>
            <article>
              <span>02 · Clear navigation</span>
              <h5>Confirmation at every risky action</h5>
              <p>
                Guided flows and confirmation feedback across Cart, Checkout, and Order Confirmation
                answer the third drop-off point directly.
              </p>
            </article>
            <article>
              <span>03 · AR + AI tools</span>
              <h5>Visualization as its own destination</h5>
              <p>
                A dedicated experience reachable from both Home and Product Detail, so the scale
                question can be answered before hesitation sets in.
              </p>
            </article>
            <article>
              <span>04 · Intentional checkout</span>
              <h5>No &ldquo;Buy Now&rdquo; on product pages</h5>
              <p>
                Purchases are routed through the cart deliberately, to encourage mindful buying and
                reduce returns on high-value items.
              </p>
            </article>
          </div>

          <div className="cs-bp-media dp-journey-media">
            <div className="cs-bp-media-frame">
              <img
                src={stillenProductMap}
                alt="Product map and information architecture for STILLEN, showing home, collections, product detail, AR and AI visualization, saved items, cart, checkout, order confirmation, and support, with navigation relationships"
                loading="lazy"
                decoding="async"
              />
            </div>
            <a className="cs-bp-media-link" href={stillenProductMap} target="_blank" rel="noopener noreferrer">
              <span>View complete product map</span>
              <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </>
      ),
    },
    {
      id: '07',
      label: 'Validation & Next Steps',
      body: (
        <>
          <p>
            Usability testing confirmed that guided flows and clearer product detail layouts
            supported intuitive navigation and confident decision-making. The visualization feature
            had the strongest effect on purchase confidence — it addressed the first drop-off point
            most directly. Areas with higher visual density revealed the opposite: opportunities to
            improve hierarchy and scanability before density starts costing comprehension.
          </p>

          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <img src={testingImage} alt={`${title} usability testing`} style={{ objectFit: 'cover' }} />
            </div>
          </div>

          <p style={{ margin: '16px 0 12px' }}>
            The high fidelity screens below express those decisions: shipping information carried
            through the product and checkout experience, confirmation states on every action that
            can be undone, and a dedicated visualization entry point.
          </p>

          {prototype.embedUrl ? (
            <>
              <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
                <div className="cs-bp-media-frame">
                  <FigmaEmbed
                    title={`${title} high fidelity screens`}
                    src={prototype.embedUrl}
                    wrapperClassName="cs-bp-media-fill"
                    iframeClassName="cs-bp-media-fill"
                    mobileStaticImageSrc={stillenMobile}
                    mobileStaticImageAlt="STILLEN high fidelity screens static preview"
                    mobileLinkHref={prototype.externalUrl ?? prototype.embedUrl}
                    mobileLinkLabel="Open Figma Design"
                  />
                </div>
              </div>
              <div className="cs-bp-vsplit-cta" style={{ marginTop: 14 }}>
                <a
                  className="cs-bp-cta"
                  href={prototype.externalUrl ?? prototype.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the design file in Figma
                  <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </>
          ) : null}

          <p className="rl-outcome-next-signal">
            Scope of this validation: the sessions tested comprehension and navigation on the
            prototype. They did not measure conversion, return rate, or whether the AR experience
            changes real purchase behavior — that would require a live storefront and a longer
            window. The next steps, in order: run a moderated round focused on the three drop-off
            points specifically, test the AR flow on a physical device rather than in a prototype,
            reduce density in the screens flagged during testing, and only then instrument the funnel
            to see whether verified confidence shows up as completed purchases.
          </p>
        </>
      ),
    },
  ];
}
