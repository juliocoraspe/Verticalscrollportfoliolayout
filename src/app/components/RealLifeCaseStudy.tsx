import { FigmaEmbed } from './embeds/FigmaEmbed';
import { DocumentModal } from './DocumentModal';
import type { BlueprintSection } from './CaseStudyBlueprint';
import realLifeBanner from '../../assets/images/RealLife_banner.jpg';
import realLifeFeatureDefinition from '../../assets/images/RealLife_feature-definition-redacted.png';
import realLifeMvpFlow from '../../assets/images/RealLife_mvpflow.jpg';
import realLifePrototype from '../../assets/images/RealLife_prototype.png';
import realLifeValidationRecruitment from '../../assets/images/RealLife_validation-recruitment-redacted.png';
import realLifeValidationCommunications from '../../assets/images/RealLife_validation-communications-redacted.png';
import realLifeValidationAiPlanning from '../../assets/images/RealLife_validation-ai-planning-redacted.png';
import realLifeResearchAnalysisPreview from '../../assets/images/RealLife_research-analysis-redacted.jpg';
import realLifeMissedDayRecovery from '../../assets/images/RealLife_missed-day-recovery.png';
import realLifeResearchAnalysis from '../../assets/documents/RealLife_research-analysis-redacted.pdf';

const PROTOTYPE_EMBED_URL = `${import.meta.env.BASE_URL}real-life-prototype/index.html?embed=1`;
const PROTOTYPE_OPEN_URL = `${import.meta.env.BASE_URL}real-life-prototype/index.html`;

export const REAL_LIFE_TITLE = 'Real-Life Challenges: Product Feature for a Social App You Know';
export const REAL_LIFE_SUMMARY =
  'A product design case study exploring how a challenge loop for two people could reduce the “empty room” effect and strengthen repeat participation and retention, which are behavioral drivers of monthly active use.';
export const REAL_LIFE_BANNER = {
  src: realLifeBanner,
  alt: 'Real-Life Challenges prototype screens',
  className: 'w-full h-[128px] object-contain sm:h-[176px] md:h-[420px]',
  style: { backgroundColor: '#0c0c0c' },
};

function CompanyNameRedaction() {
  return (
    <span
      className="rl-nda-redaction"
      role="img"
      aria-label="Confidential company name"
    >
      <span aria-hidden="true">BeReal</span>
    </span>
  );
}

const VALIDATION_EVIDENCE = [
  {
    number: '01',
    title: 'Recruitment setup',
    description: 'Panel source, screening criteria, and recruitment reach configured in User Interviews.',
    image: realLifeValidationRecruitment,
    alt: 'User Interviews recruitment setup showing the panel source and recruitment criteria',
  },
  {
    number: '02',
    title: 'Participant communications',
    description: 'Study listing, confirmation, reminder, and incentive communications prepared for participants before launch.',
    image: realLifeValidationCommunications,
    alt: 'User Interviews participant communications setup for the confidential social app feature concept focus group',
  },
  {
    number: '03',
    title: 'Planning with AI',
    description: 'The platform’s internal AI helped structure preparation instructions, listing copy, prototype access, and the survey handoff.',
    image: realLifeValidationAiPlanning,
    alt: 'User Interviews internal AI assistant helping structure the focus group listing and study instructions',
    wide: true,
  },
] as const;

const PARTICIPATION_MAU = [
  { label: 'Jul 2021', value: 0.92, source: 'external' },
  { label: 'Jul 2022', value: 21.6, source: 'external' },
  { label: 'Aug 2022', value: 73.5, source: 'external' },
  { label: 'Jun 2024', value: 40, source: 'company' },
  { label: 'Mar 2025', value: 16, source: 'external' },
] as const;

const ANNUAL_DOWNLOADS = [
  { label: '2022', value: 93.5 },
  { label: '2023', value: 31.5 },
  { label: '2024', value: 12.7 },
  { label: '2025E', value: 6 },
] as const;

function ParticipationEvidenceChart() {
  const mauWidth = 390;
  const mauHeight = 220;
  const mauX = [42, 116, 190, 278, 350];
  const mauTop = 34;
  const mauBottom = 168;
  const mauMax = 80;
  const mauY = (value: number) =>
    mauBottom - (value / mauMax) * (mauBottom - mauTop);
  const downloadMaxWidth = 224;
  const downloadScale = (value: number) => (value / 100) * downloadMaxWidth;

  return (
    <figure className="rl-empty-room-evidence">
      <figcaption className="rl-empty-room-evidence__heading">
        <span>Product signal · participation and retention</span>
        <strong>Contraction after the peak raised a question about repeat use</strong>
      </figcaption>
      <p className="rl-empty-room-evidence__intro">
        Estimates of monthly active users and annual downloads point in the same direction after the 2022
        peak: the platform faced a problem with participation momentum. Because the sources use different
        geographies and methodologies, the points are directional signals. They are not one continuous audited series.
      </p>

      <div className="rl-empty-room-evidence__plots">
        <section aria-labelledby="rl-mau-chart-title">
          <span>01 · Monthly active use</span>
          <h5 id="rl-mau-chart-title">Growth, peak, then contraction</h5>
          <svg
            viewBox={`0 0 ${mauWidth} ${mauHeight}`}
            role="img"
            aria-label="External estimates show monthly active users growing from 0.92 million in July 2021 to 73.5 million in August 2022. A figure reported by the company shows 40 million in June 2024, while an external estimate shows 16 million in March 2025. The methodologies differ."
          >
            {[20, 40, 60, 80].map((tick) => (
              <g key={tick}>
                <line x1="32" x2="364" y1={mauY(tick)} y2={mauY(tick)} className="rl-empty-room-evidence__gridline" />
                <text x="28" y={mauY(tick) + 4} textAnchor="end" className="rl-empty-room-evidence__tick">{tick}M</text>
              </g>
            ))}
            <path
              d={PARTICIPATION_MAU.slice(0, 3).map((point, index) => `${index === 0 ? 'M' : 'L'} ${mauX[index]} ${mauY(point.value)}`).join(' ')}
              className="rl-empty-room-evidence__mau-line"
            />
            <path
              d={PARTICIPATION_MAU.slice(2).map((point, index) => `${index === 0 ? 'M' : 'L'} ${mauX[index + 2]} ${mauY(point.value)}`).join(' ')}
              className="rl-empty-room-evidence__mau-line is-method-gap"
            />
            {PARTICIPATION_MAU.map((point, index) => (
              <g key={point.label}>
                <circle
                  cx={mauX[index]}
                  cy={mauY(point.value)}
                  r="7"
                  className={`rl-empty-room-evidence__mau-point is-${point.source}`}
                />
                <text x={mauX[index]} y={mauY(point.value) - 15} textAnchor="middle" className="rl-empty-room-evidence__value">
                  {point.value < 1 ? point.value.toFixed(2) : point.value.toFixed(1)}M
                </text>
                <text x={mauX[index]} y="192" textAnchor="middle" className="rl-empty-room-evidence__label">
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="rl-empty-room-evidence__legend" aria-label="Monthly active user source legend">
            <span><i className="is-external" />External estimate</span>
            <span><i className="is-company" />Reported by the company</span>
          </div>
        </section>

        <section aria-labelledby="rl-download-chart-title">
          <span>02 · Acquisition signal</span>
          <h5 id="rl-download-chart-title">Annual downloads also declined</h5>
          <div className="rl-download-bars" role="img" aria-label="Annual downloads declined from 93.5 million in 2022 to 31.5 million in 2023, 12.7 million in 2024, and an estimated 6 million in 2025.">
            {ANNUAL_DOWNLOADS.map((point) => (
              <div key={point.label}>
                <span>{point.label}</span>
                <i><b style={{ width: `${downloadScale(point.value)}px` }} /></i>
                <strong>{point.value}M</strong>
              </div>
            ))}
          </div>
          <p>Annual downloads · 2025 is an estimate</p>
        </section>
      </div>

      <p className="rl-empty-room-evidence__sources">
        Sources synthesized in the project research analysis: Sensor Tower, Business of Apps,
        figures reported by the company, and external market estimates. Different methodologies prevent
        a direct comparison.
      </p>
    </figure>
  );
}

function EmptyRoomMechanism() {
  return (
    <div className="rl-empty-room-loop" aria-labelledby="rl-empty-room-loop-title">
      <span>Research insight · prominent behavioral gap</span>
      <h5 id="rl-empty-room-loop-title">The Empty Room can amplify participation loss</h5>
      <p>
        The gap is not a separate business problem from MAU. It is a recurring experience that helps
        explain why participation can weaken inside a social product whose value depends on familiar
        people continuing to show up.
      </p>
      <ol>
        <li><strong>Users filter ordinary life</strong><small>My routine does not feel interesting enough to post.</small></li>
        <li><strong>Participation becomes quieter</strong><small>I skip the prompt; my friends begin posting less too.</small></li>
        <li><strong>Return value falls</strong><small>There is less to see, less reason to reopen, and less reason to invite someone.</small></li>
      </ol>
    </div>
  );
}

/**
 * Generational chart for the Research & Insight section.
 * Sources: APA Stress in America (mental health by generation);
 * McKinsey Future of Wellness (wellness spend skew).
 */
const CHART_SERIES = [
  {
    label: 'Rate their own mental health “fair” or “poor”',
    color: '#BA4A2F',
    values: [27, 15, 13, 7],
  },
  {
    label: 'Have received therapy or mental health treatment',
    color: '#3A6EA8',
    values: [37, 35, 26, 22],
  },
];
const CHART_GROUPS = ['Gen Z', 'Millennials', 'Gen X', 'Boomers'];

function GenerationalWellnessChart() {
  const width = 640;
  const height = 268;
  const plotTop = 40;
  const plotBottom = height - 30;
  const plotH = plotBottom - plotTop;
  const groupW = width / CHART_GROUPS.length;
  const barW = 26;
  const barGap = 2;
  const maxV = 40;
  const y = (v: number) => plotBottom - (v / maxV) * plotH;

  return (
    <div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginBottom: 10 }}
        aria-hidden="true"
      >
        {CHART_SERIES.map((s) => (
          <span
            key={s.label}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bp-muted)' }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
            aria-label="Share of each generation rating their mental health as fair or poor, and share that has received mental health treatment. Gen Z ranks highest on both."
      >
        {[0, 20, 40].map((v) => (
          <g key={v}>
            <line
              x1={0}
              x2={width}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--bp-border, rgba(149,148,146,0.3))"
              strokeWidth={1}
            />
            <text x={0} y={y(v) - 4} fontSize={11} fill="var(--bp-dim, #707472)">
              {v}%
            </text>
          </g>
        ))}
        {CHART_GROUPS.map((group, gi) => {
          const center = groupW * gi + groupW / 2;
          const pairW = barW * 2 + barGap;
          return (
            <g key={group}>
              {CHART_SERIES.map((s, si) => {
                const v = s.values[gi];
                const x = center - pairW / 2 + si * (barW + barGap);
                return (
                  <g key={s.label}>
                    <rect x={x} y={y(v)} width={barW} height={plotBottom - y(v)} fill={s.color} rx={2}>
                      <title>{`${group}. ${s.label}: ${v}%`}</title>
                    </rect>
                    <text
                      x={x + barW / 2}
                      y={y(v) - 6}
                      fontSize={12}
                      fontWeight={600}
                      textAnchor="middle"
                      fill="var(--bp-text, #111111)"
                    >
                      {v}
                    </text>
                  </g>
                );
              })}
              <text
                x={center}
                y={plotBottom + 18}
                fontSize={12}
                textAnchor="middle"
                fill="var(--bp-muted, #767676)"
              >
                {group}
              </text>
            </g>
          );
        })}
        <line x1={0} x2={width} y1={plotBottom} y2={plotBottom} stroke="var(--bp-border-strong, #959492)" strokeWidth={1} />
      </svg>
      <p className="cs-bp-muted" style={{ fontSize: 12, marginTop: 8 }}>
        Sources: APA, Stress in America (Generation Z) · McKinsey, The Future of Wellness
      </p>
    </div>
  );
}

const FOCUS_GROUP_PARTICIPANTS = [
  { id: 'A', name: 'Aisha' },
  { id: 'T', name: 'Tomás' },
  { id: 'S', name: 'Sebastián' },
  { id: 'V', name: 'Valentina' },
  { id: 'M', name: 'Miriam' },
] as const;

type FocusGroupParticipantId = (typeof FOCUS_GROUP_PARTICIPANTS)[number]['id'];

const FOCUS_GROUP_FINDINGS: {
  number: string;
  label: string;
  title: string;
  detail: string;
  metric: string;
  direct: FocusGroupParticipantId[];
  affirmed: FocusGroupParticipantId[];
}[] = [
  {
    number: '01',
    label: 'Acquisition',
    title: 'The invitation works because the friend is the protagonist',
    detail: 'All five would accept; both participants without the platform said the shared action could justify installing it.',
    metric: '5 direct voices',
    direct: ['A', 'T', 'S', 'V', 'M'],
    affirmed: [],
  },
  {
    number: '02',
    label: 'Relevance',
    title: 'A real person appeared before a feature benefit',
    detail: 'Every participant immediately named one person and one challenge they would do together.',
    metric: '5 direct voices',
    direct: ['A', 'T', 'S', 'V', 'M'],
    affirmed: [],
  },
  {
    number: '03',
    label: 'Platform fit',
    title: 'It felt native to users and distinct to newcomers',
    detail: 'The three current users recognized the camera and spirit; the two people who did not use the product said it did not feel like fitness or Instagram.',
    metric: '3 direct · 2 qualified',
    direct: ['A', 'T', 'S'],
    affirmed: ['V', 'M'],
  },
  {
    number: '04',
    label: 'Emotional payoff',
    title: 'The private vault turns proof into a shared memory',
    detail: 'Four participants independently described the ending as an album, memory box, private space, or something sweet.',
    metric: '4 direct voices',
    direct: ['A', 'S', 'V', 'M'],
    affirmed: [],
  },
  {
    number: '05',
    label: 'Trust signal',
    title: '“No score” protects the concept from tracker fatigue',
    detail: 'Three participants singled out the absence of scores; one said it was the reason he would try the feature after abandoning a streak that lasted 200 days.',
    metric: '3 direct voices',
    direct: ['T', 'S', 'V'],
    affirmed: [],
  },
  {
    number: '06',
    label: 'Primary risk',
    title: 'A missed day decides whether accountability stays soft',
    detail: 'Three participants raised the failure state directly; the other two reinforced the need for a kinder recovery response.',
    metric: '3 direct · 2 affirmed',
    direct: ['T', 'S', 'V'],
    affirmed: ['A', 'M'],
  },
];

function QualitativeFindingsChart() {
  return (
    <figure className="rl-outcome-figure" aria-labelledby="rl-qualitative-title">
      <figcaption className="rl-outcome-heading">
        <span>01 · Qualitative evidence</span>
        <strong id="rl-qualitative-title">What the conversation revealed</strong>
      </figcaption>
      <p className="rl-outcome-intro">
        The Zoom focus group transcript was coded against six decision areas. Each participant is
        shown by name, and each theme counts that person only once. This means the chart shows breadth
        of agreement rather than conversation volume, regardless of how often an idea appeared.
      </p>

      <div className="rl-outcome-voice-legend" aria-label="Qualitative coding legend">
        <span><i className="is-direct" aria-hidden="true" /><strong>Solid:</strong> participant stated the finding directly</span>
        <span><i className="is-affirmed" aria-hidden="true" /><strong>Ring:</strong> participant affirmed or qualified it</span>
        <span><i className="is-silent" aria-hidden="true" /><strong>Small dot:</strong> finding was not expressed</span>
      </div>

      <div className="rl-outcome-findings">
        {FOCUS_GROUP_FINDINGS.map((finding) => (
          <article
            className="rl-outcome-finding"
            key={finding.title}
            aria-label={`${finding.label}. ${finding.metric}. ${finding.detail}`}
          >
            <div className="rl-outcome-finding__metric">
              <strong>{finding.direct.length}/5</strong>
              <span>direct voices</span>
              {finding.affirmed.length > 0 && <small>+ {finding.affirmed.length} affirmed or qualified</small>}
            </div>
            <div className="rl-outcome-finding__copy">
              <span>{finding.number} · {finding.label}</span>
              <h5>{finding.title}</h5>
              <p>{finding.detail}</p>
            </div>
            <div className="rl-outcome-finding__voices" role="list" aria-label={`Coding by participant for ${finding.label}`}>
              {FOCUS_GROUP_PARTICIPANTS.map((participant) => {
                const isDirect = finding.direct.includes(participant.id);
                const isAffirmed = finding.affirmed.includes(participant.id);
                const state = isDirect ? 'direct' : isAffirmed ? 'affirmed' : 'silent';
                return (
                  <span
                    className={`is-${state}`}
                    role="listitem"
                    key={participant.id}
                    aria-label={`${participant.name}: ${isDirect ? 'direct contribution' : isAffirmed ? 'affirmed or qualified the finding' : 'finding not expressed'}`}
                  >
                    <i aria-hidden="true" />
                    <strong>{participant.name}</strong>
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <p className="rl-outcome-source">
        Source: moderated focus group transcript, n=5. Moderator statements were excluded; counts
        represent distinct participant contributions, not the number of times a phrase was repeated.
      </p>
    </figure>
  );
}

type SurveyResponse = 'yes' | 'maybe' | 'low';

const SURVEY_ROWS: {
  label: string;
  value: string;
  valueDetail: string;
  units: SurveyResponse[];
}[] = [
  { label: 'Belongs on the platform', value: '5/5', valueDetail: 'positive', units: ['yes', 'yes', 'yes', 'yes', 'yes'] },
  { label: 'Would accept the invite', value: '5/5', valueDetail: 'positive', units: ['yes', 'yes', 'yes', 'yes', 'yes'] },
  { label: 'Would feel closer to their people', value: '4/5', valueDetail: 'positive', units: ['yes', 'yes', 'yes', 'yes', 'maybe'] },
  { label: 'Ease of understanding', value: '4.0', valueDetail: 'average / 5', units: ['yes', 'yes', 'yes', 'yes', 'low'] },
];

const SURVEY_RESPONSE_CODES = ['R1', 'R2', 'R3', 'R4', 'R5'] as const;

function getSurveyResponseLabel(response: SurveyResponse) {
  if (response === 'yes') return 'Positive / score of 4 or 5';
  if (response === 'maybe') return 'Partial / maybe';
  return 'Lower score';
}

function SurveyPetalChart() {
  const cx = 110;
  const cy = 88;
  const petalAngles = [-72, 0, 72, 144, 216];

  return (
    <figure className="rl-outcome-figure" aria-labelledby="rl-quantitative-title">
      <figcaption className="rl-outcome-heading">
        <span>02 · Quantitative evidence</span>
        <strong id="rl-quantitative-title">How consistently participants responded</strong>
      </figcaption>
      <p className="rl-outcome-intro">
        The Google Forms survey completed after the session converted the individual reactions into comparable
        signals. Each flower contains five labeled response units, R1 through R5. The codes anonymize the
        respondents; their order is visual only and is not mapped to the names in the transcript chart.
      </p>

      <div className="rl-survey-legend" aria-label="Survey response legend">
        <span><i className="is-yes" aria-hidden="true" /><strong>Filled, long petal:</strong> positive / score of 4 or 5</span>
        <span><i className="is-maybe" aria-hidden="true" /><strong>Light petal:</strong> partial / maybe</span>
        <span><i className="is-low" aria-hidden="true" /><strong>Short outline:</strong> lower score</span>
      </div>

      <div className="rl-survey-petals">
        {SURVEY_ROWS.map((row) => (
          <section className="rl-survey-petal" key={row.label} aria-label={`${row.label}: ${row.value} ${row.valueDetail}`}>
            <div className="rl-survey-petal__label">
              <span>Structured response</span>
              <h5>{row.label}</h5>
            </div>
            <div className="rl-survey-petal__result">
              <strong>{row.value}</strong>
              <span>{row.valueDetail}</span>
            </div>
            <svg viewBox="0 0 220 176" role="img" aria-label={`${row.label}: ${row.value} ${row.valueDetail}, based on five survey responses.`}>
              <title>{row.label}</title>
              <desc>{`Five response petals. ${row.value} ${row.valueDetail}.`}</desc>
              <circle cx={cx} cy={cy} r="58" className="rl-survey-petal__guide" />
              {row.units.map((unit, participantIndex) => {
                const length = unit === 'yes' ? 54 : unit === 'maybe' ? 44 : 34;
                const ry = length / 2;
                return (
                  <ellipse
                    key={`${row.label}-${participantIndex}`}
                    cx={cx}
                    cy={cy - ry}
                    rx={unit === 'low' ? 9.5 : 12}
                    ry={ry}
                    transform={`rotate(${petalAngles[participantIndex]} ${cx} ${cy})`}
                    className={`rl-survey-petal__mark is-${unit}`}
                  >
                    <title>{`Participant ${participantIndex + 1}: ${unit === 'yes' ? 'positive or scored 4 or 5' : unit === 'maybe' ? 'partial or maybe' : 'lower score'}`}</title>
                  </ellipse>
                );
              })}
              <circle cx={cx} cy={cy} r="19" className="rl-survey-petal__center" />
              {SURVEY_RESPONSE_CODES.map((responseCode, participantIndex) => {
                const angle = (petalAngles[participantIndex] - 90) * (Math.PI / 180);
                const labelRadius = 76;
                return (
                  <text
                    key={`${row.label}-${responseCode}-label`}
                    x={cx + Math.cos(angle) * labelRadius}
                    y={cy + Math.sin(angle) * labelRadius + 3}
                    textAnchor="middle"
                    className="rl-survey-petal__initial"
                  >
                    {responseCode}
                  </text>
                );
              })}
            </svg>
            <div className="rl-survey-petal__responses" role="list" aria-label={`Responses for ${row.label}`}>
              {row.units.map((unit, responseIndex) => (
                <span className={`is-${unit}`} role="listitem" key={`${row.label}-response-${responseIndex}`}>
                  <i aria-hidden="true" />
                  <strong>{SURVEY_RESPONSE_CODES[responseIndex]}</strong>
                  <small>{getSurveyResponseLabel(unit)}</small>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="rl-outcome-source">Source: Google Forms survey completed after the session, n=5. One petal = one participant response.</p>
    </figure>
  );
}

export function getRealLifeBlueprintSections(): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: (
        <>
          <aside className="rl-confidentiality-note" aria-label="Confidentiality note">
            <span>Confidentiality note</span>
            <p>
              This project was completed under a nondisclosure agreement. For this public case study,
              the company name and other identifying references have been withheld or obscured, while
              the research methods, design rationale, and evidence that is not sensitive remain intact so the
              process can be evaluated accurately.
            </p>
          </aside>
          <p>
            <CompanyNameRedaction /> grew rapidly around one spontaneous, unfiltered moment a day, but
            estimates of monthly active users after the peak and falling annual downloads suggested that
            reach was not consistently becoming repeat participation. This project therefore began with a
            retention question rather than a predetermined feature: what could give people a credible reason
            to reopen, contribute, and bring a close friend back into the experience?
          </p>
          <p>
            The research connected three layers: product signals around acquisition, reach, and monthly
            active use; academic and secondary research on disengagement; and audience behavior around
            routines, wellness, and connection between close friends. The &ldquo;Empty Room&rdquo; effect emerged as
            the most actionable behavioral gap inside the larger problem and became the primary inspiration for
            the feature: when ordinary life feels unworthy of a post and friends participate less, the feed
            loses social value and the reason to return weakens.
          </p>
          <p>
            Research findings were translated into seven possible directions and compared through RICE
            and a filter for strategic fit centered on authenticity, privacy, simplicity, and the ability to
            influence the behaviors beneath MAU. Gen Z remained the core audience; millennials were an
            adjacent cohort for testing broader relevance. The selected concept, Real-Life Challenges,
            turned small activities between close friends into a reason to invite, participate, and return,
            without adding streaks, scores, leaderboards, or public performance.
          </p>
          <p>
            My role as Product Designer covered research synthesis, product strategy, feature definition,
            interaction design, prototyping, and validation. The process moved from problem framing to a
            MVP with six screens, a coded prototype with 12 screens, and a moderated Zoom focus group lasting 45 minutes with
            five participants recruited through User Interviews, followed by a Google Forms survey.
            The validation tested desirability and comprehension of the participation loop; measuring
            retention or MAU impact would require a longitudinal beta. Timeline: 2026.
          </p>
        </>
      ),
    },
    {
      id: '02',
      label: 'Problem Framing: MAU Pressure & the Empty Room',
      body: (
        <>
          <p className="rl-problem-framing-lead">
            The case separates the product outcome from the behavioral gap found through research.
            Monthly active use is the primary problem signal. The Empty Room is one of the most notable
            gaps beneath it. It is also the gap that most directly inspired the feature direction.
          </p>

          <section className="rl-problem-layer" aria-labelledby="rl-product-signal-title">
            <div className="rl-problem-layer__heading">
              <span>01 · The product signal</span>
              <h5 id="rl-product-signal-title">Participation lost momentum after the growth peak</h5>
            </div>
            <p>
              External estimates place monthly active use at a 2022 peak before a substantial contraction,
              while annual downloads fell from 93.5 million in 2022 to 12.7 million in 2024. The sources
              use different methodologies, but together they make the product objective clear: acquisition
              alone was insufficient; the experience needed stronger reasons for repeat use.
            </p>

            <ParticipationEvidenceChart />

            <article className="rl-research-analysis-card">
              <DocumentModal
                className="rl-research-analysis-card__preview"
                src={realLifeResearchAnalysis}
                kind="pdf"
                title="Research analysis (redacted)"
                meta="1 extended page"
                triggerLabel="Open the complete redacted research analysis"
              >
                <img
                  src={realLifeResearchAnalysisPreview}
                  alt="Redacted research analysis on a single page covering company growth, funding, audience, competition, monthly active users, and annual downloads"
                  loading="lazy"
                  decoding="async"
                />
              </DocumentModal>
              <div className="rl-research-analysis-card__copy">
                <div className="rl-research-analysis-card__meta">
                  <span>Market and audience research</span>
                  <span>1 extended page</span>
                </div>
                <h5>Research analysis</h5>
                <p>
                  The supporting analysis documents the platform&apos;s growth arc, funding, competition,
                  audience composition, MAU estimates, and annual download trend. Company references are
                  blurred throughout the public version.
                </p>
                <DocumentModal
                  src={realLifeResearchAnalysis}
                  kind="pdf"
                  title="Research analysis (redacted)"
                  meta="1 extended page"
                >
                  Open redacted analysis
                  <span aria-hidden="true">↗</span>
                </DocumentModal>
              </div>
            </article>
          </section>

          <section className="rl-problem-layer is-behavior" aria-labelledby="rl-behavioral-gap-title">
            <div className="rl-problem-layer__heading">
              <span>02 · The behavioral gap</span>
              <h5 id="rl-behavioral-gap-title">The Empty Room was the clearest design opportunity</h5>
            </div>
            <p>
              Monthly active users describe an outcome, not its cause. Academic and secondary research on
              <CompanyNameRedaction /> disengagement found a recurring experience underneath that outcome:
              people used the app less when ordinary life did not feel exciting enough, daily posting became
              repetitive, or friends stopped participating. In an inactive social graph, there is less to
              see and less justification for exposing a routine moment or inviting someone else to join.
            </p>
            <EmptyRoomMechanism />
          </section>

          <section className="rl-problem-layer is-hypothesis" aria-labelledby="rl-design-hypothesis-title">
            <div className="rl-problem-layer__heading">
              <span>03 · The design hypothesis</span>
              <h5 id="rl-design-hypothesis-title">Give close friends a reason to return together</h5>
            </div>
            <p>
              Real-Life Challenges was designed to reduce the Empty Room effect by replacing a generic
              invitation with a concrete shared action. If that action increases invitation acceptance,
              contribution, and repeat participation, it may strengthen retention and eventually contribute
              to monthly active use.
            </p>
            <p className="cs-bp-muted">
              How might <CompanyNameRedaction /> rebuild recurring value between friends without making
              ordinary life performative, so more users have a reason to invite, participate, and return?
            </p>
            <p className="rl-empty-room-references">
              Measurement boundary: this case validates the proposed mechanism; it does not claim that one
              feature caused, reversed, or already measured the overall MAU trend for the platform.
            </p>
          </section>
        </>
      ),
    },
    {
      id: '03',
      label: 'Audience & Behavioral Opportunity: A Reason to Return Together',
      body: (
        <>
          <p>
            The product metric identified where pressure existed; audience behavior suggested where a
            design intervention could act. The opportunity was to influence the behaviors beneath MAU,
            including inviting, accepting, contributing, and returning, without changing the audience or making participation
            more performative.
          </p>

          <div className="rl-audience-roles" aria-label="Core and adjacent audiences">
            <article>
              <span>Core audience</span>
              <strong>Gen Z</strong>
              <p>Protect spontaneity, authenticity, privacy, and the social graph of close friends.</p>
            </article>
            <article>
              <span>Adjacent opportunity</span>
              <strong>Millennials</strong>
              <p>Explore broader relevance through purposeful reasons to participate without pressure.</p>
            </article>
          </div>

          <p style={{ marginBottom: 12 }}>
            Sensor Tower estimated that people ages 25 to 34 represented 12% of <CompanyNameRedaction /> users,
            versus nearly 25% for people ages 18 to 24. Secondary research also showed Gen Z and millennials
            contributing a disproportionate share of wellness spending while reporting significant mental health pressure. These
            signals did not prove demand for the feature; they helped define an appropriate intervention:
            small shared routines, connection between close friends, and no public scoring.
          </p>
          <GenerationalWellnessChart />
          <p style={{ margin: '16px 0 4px' }}>
            The resulting opportunity was deliberately narrow: make an ordinary action concrete enough
            to invite someone into, but light enough to remain authentic. The feature would extend the
            core experience rather than reposition the product as a wellness or fitness tracker.
          </p>
          <p className="rl-empty-room-references">
            Audience context:{' '}
            <a href="https://sensortower.com/" target="_blank" rel="noopener noreferrer">Sensor Tower audience snapshot</a>
            {' · '}
            <a href="https://www.pewresearch.org/internet/fact-sheet/social-media/" target="_blank" rel="noopener noreferrer">Pew Research Center, 2025</a>
          </p>
        </>
      ),
    },
    {
      id: '04',
      label: 'Feature Definition',
      body: (
        <div className="rl-feature-definition-layout">
          <div className="rl-feature-definition-copy">
            <p>
              With the pressure on participation and retention, the Empty Room mechanism, and audience
              behavior defined, ideation asked what could strengthen repeat participation without turning
              the platform into another conventional social network. Feed patterns associated with Instagram and Facebook,
              public performance, and visible metrics were treated as patterns to avoid; indirect references
              across fitness trackers, habit products, widgets, and private sharing tools were studied for
              useful behaviors rather than as templates. Every direction still had to protect the platform&apos;s
              spontaneity, authenticity, privacy, and simplicity.
            </p>
            <p>
              Before any scoring was applied, seven directions were mapped to a specific problem and an
              explicit hypothesis related to monthly active users.
            </p>

            <ol className="rl-feature-idea-landscape" aria-label="Seven feature directions explored before RICE prioritization">
              <li><span>01</span><strong>Clarity Layer</strong><small>Explain unfamiliar mechanics through onboarding and contextual guidance.</small></li>
              <li><span>02</span><strong>Real-Life Challenges</strong><small>Create a shared action loop that gives close friends a reason to return.</small></li>
              <li><span>03</span><strong>Home Screen Widget</strong><small>Reduce opening friction with glanceable updates from a chosen person.</small></li>
              <li><span>04</span><strong>Streak Proof</strong><small>Make progress and recovery rules more transparent and trustworthy.</small></li>
              <li><span>05</span><strong>Shared Moments</strong><small>Let two friends schedule and capture a private moment together.</small></li>
              <li><span>06</span><strong>Life Timeline</strong><small>Turn ephemeral posts into a long term personal artifact or yearbook.</small></li>
              <li><span>07</span><strong>Attestation</strong><small>Use friend verification to reinforce authenticity in a world shaped by generated content.</small></li>
            </ol>

            <p>
              RICE was then applied to the complete list to make assumptions about reach, impact,
              confidence, and effort explicit. The final scoring placed Real-Life Challenges first with 85,
              ahead of the Clarity Layer at 48 and the Home Screen Widget at 30. This result aligned the
              strongest RICE outcome with the behavioral opportunity identified in the research: changing
              the invitation and participation loop rather than only improving comprehension or visibility.
            </p>
            <p>
              The initial Challenges proposal included integration with fitness hardware and leaderboards. A
              second review of strategic fit deliberately removed mechanics associated with trackers. They borrowed
              too heavily from adjacent products and risked replacing connection between close friends with public
              measurement. The concept advanced because it gave one person a concrete reason to invite
              another, used ordinary life as the activity itself, and could still feel native to
              <CompanyNameRedaction />.
            </p>
            <p>
              The selected direction was then reduced to one closed loop: choose a small challenge, invite
              someone close, complete the action, and save the shared moment. The MVP covered five
              challenge families: Movement, Mood, Care, Connection, and Outside. It also supported photo,
              voice note, or check in proof. Explicit constraints such as no streaks, scores, leaderboards,
              or public performance kept the feature lightweight and oriented toward close friends.
            </p>
            <p>
              The product hypothesis was intentionally staged: a challenge would first need to improve
              invitation acceptance, completion, second participation, and reactivation. Only a longer beta
              could test whether those leading behaviors translated into stronger retention after 30 days and a
              meaningful contribution to monthly active use.
            </p>
            <ol className="rl-mau-hypothesis-chain" aria-label="Behavioral hypothesis connecting the feature to monthly active use">
              <li><span>01</span><strong>Invite</strong><small>A specific person receives a concrete reason to join.</small></li>
              <li><span>02</span><strong>Participate</strong><small>Both people complete the shared action.</small></li>
              <li><span>03</span><strong>Repeat</strong><small>They begin a second challenge within seven days.</small></li>
              <li><span>04</span><strong>Retain</strong><small>The shared loop creates recurring return value.</small></li>
              <li><span>05</span><strong>Contribute to MAU</strong><small>Sustained activity may influence the metric across the platform.</small></li>
            </ol>
            <p className="cs-bp-muted">
              The definition board connects the original situation to the core action, an MVP with six screens,
              required UI states, and the variations for first use, repeat use, success, and error needed to
              make the loop complete.
            </p>

            <p style={{ margin: '16px 0 12px' }}>
              The opening of that loop, drawn out: an empty first-time state that explains the idea
              without a challenge to show, the five challenge families as the only real choice, and a
              setup screen that names the person before it names the task. Each screen is annotated
              with the state it represents, so the flow shows the variations rather than only the
              happy path.
            </p>
            <div className="cs-bp-media" style={{ width: '100%' }}>
              <div className="cs-bp-media-frame">
                <img
                  src={realLifeMvpFlow}
                  alt="First three of the six MVP screens: an empty first-time intro, the challenge family picker, and the challenge setup and invite screen, each labelled with its UI state"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <DocumentModal
                className="cs-bp-media-link"
                src={realLifeMvpFlow}
                kind="image"
                title="MVP screens — the participation loop"
                meta="Screens 01–03 of 06"
              >
                <span>View the MVP screen flow</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </DocumentModal>
            </div>
          </div>
          <div className="cs-bp-media rl-feature-definition-board">
            <div className="cs-bp-media-frame">
              <img
                src={realLifeFeatureDefinition}
                alt="Real-Life Challenges feature definition board showing feature context, a loop with four steps, six MVP screens, UI states, and state variations"
                loading="lazy"
                decoding="async"
              />
            </div>
            <DocumentModal
              className="cs-bp-media-link"
              src={realLifeFeatureDefinition}
              kind="image"
              title="Feature definition board"
            >
              <span>View complete feature definition board</span>
              <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
            </DocumentModal>
          </div>
        </div>
      ),
    },
    {
      id: '05',
      label: 'Validation: Focus Group',
      body: (
        <>
          <p>
            Five participants across five countries tested the interactive prototype with 12 screens in a
            remote focus group lasting 45 minutes, conducted through Zoom. The session combined a short
            introduction, guided prototype exploration, group discussion, and a closing survey so the
            team could compare what participants said with how they understood and navigated the concept.
            This method could validate the proposed participation mechanism and its risks; it could not
            yet demonstrate retention or an effect on MAU across the platform.
          </p>

          <ol className="rl-validation-flow" aria-label="Focus group preparation and execution">
            <li><span>01</span><strong>Plan</strong><small>Study structure created with AI support</small></li>
            <li><span>02</span><strong>Recruit</strong><small>User Interviews panel</small></li>
            <li><span>03</span><strong>Moderate</strong><small>Zoom session lasting 45 minutes</small></li>
            <li><span>04</span><strong>Close</strong><small>Survey and incentive</small></li>
          </ol>

          <p>
            Recruitment, screening, scheduling, and participant communications were managed through
            User Interviews. Its internal AI project setup was also used during planning to
            help structure the study listing, preparation instructions, prototype access, and survey
            handoff. The generated material served as a starting point; the final criteria, facilitation
            plan, and language shown to participants were reviewed and finalized by the researcher.
          </p>

          <div className="rl-validation-incentive" aria-label="Participant incentive">
            <strong>$30</strong>
            <span>per participant</span>
            <small>5 completed sessions · $150 total participant incentives</small>
          </div>

          <p>
            Each participant received a USD 30 incentive after completing the session. Compensation was
            tied to attendance and completion rather than positive feedback, so participants could challenge
            the concept openly.
          </p>

          <div className="rl-validation-evidence" aria-label="Focus group planning and recruitment evidence">
            {VALIDATION_EVIDENCE.map((item) => (
              <figure className={item.wide ? 'is-wide' : undefined} key={item.title}>
                <DocumentModal
                  src={item.image}
                  kind="image"
                  title={item.title}
                  alt={item.alt}
                  triggerLabel={`Open ${item.title} screenshot`}
                >
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </DocumentModal>
                <figcaption>
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <h5 className="rl-validation-results-title">What the session validated</h5>
          <ul>
            <li>5/5 said the feature belongs on the platform, and 5/5 would accept the invite.</li>
            <li>All five could immediately name a specific person and challenge when asked.</li>
            <li>Participants coined the feature&apos;s defining term themselves: &ldquo;soft accountability.&rdquo;</li>
            <li>The &ldquo;no streaks, no scores&rdquo; framing proved to be the primary trust signal.</li>
          </ul>
        </>
      ),
    },
    {
      id: '06',
      label: 'Live Prototype',
      layout: 'vsplit',
      body: (
        <div className="cs-bp-vsplit">
          <div className="cs-bp-vsplit-text">
            <div className="cs-bp-vsplit-title-row">
              <span className="cs-bp-display-num" aria-hidden="true">06</span>
              <h4 className="cs-bp-display-title">Live Prototype</h4>
            </div>
            <div className="cs-bp-vsplit-body">
              <p>
                The concept was validated on a coded HTML prototype covering the full loop: create a
                challenge, invite a friend over iMessage, capture proof with the dual camera, unlock
                your friend&apos;s moment, and close it in a shared memory vault. That closed loop made the
                retention hypothesis testable at a behavioral level: one person initiates, another joins,
                both contribute, and the shared outcome creates a reason to return.
              </p>
              <p>This is the same build the focus group tested. Tap through it.</p>
            </div>
            <div className="cs-bp-vsplit-cta">
              <a
                className="cs-bp-cta"
                href={PROTOTYPE_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open prototype in a new tab
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
                title="Real-Life Challenges prototype"
                src={PROTOTYPE_EMBED_URL}
                wrapperClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                iframeClassName="cs-bp-vsplit-frame border-0 no-scrollbar"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                mobileStaticImageSrc={realLifePrototype}
                mobileStaticImageAlt="Real-Life Challenges prototype capture screen"
                mobileStaticImageObjectFit="cover"
                mobileLinkHref={PROTOTYPE_EMBED_URL}
                mobileLinkLabel="Open live prototype"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '07',
      label: 'Validation Outcome: Evidence for the Mechanism',
      body: (
        <div className="rl-outcome-section">
          <p className="rl-outcome-lead">
            The focus group produced two complementary evidence layers. The moderated conversation
            explains why the concept felt relevant, where trust formed, and where pressure could enter
            the experience; the Google Form completed after the session shows how consistently those reactions appeared
            across the five participants. Keeping the two views separate preserves the context behind a
            finding without losing the comparability of the survey. These results assess the behavioral
            premise behind repeat participation rather than a change in MAU.
          </p>

          <div className="rl-outcome-methodology" aria-label="Outcome research methodology">
            <article>
              <span>01 · Qualitative method</span>
              <strong>Zoom focus group + transcript coding</strong>
              <p>
                The moderated video call was conducted through Zoom. Its transcript was reviewed by
                decision area, and each participant was counted once per finding when they stated,
                affirmed, or qualified that theme.
              </p>
            </article>
            <article>
              <span>02 · Quantitative method</span>
              <strong>Google Forms survey after the session</strong>
              <p>
                After the discussion, the five participants completed the structured survey in Google
                Forms. Those responses were mapped question by question to show consensus, partial
                agreement, and lower scores.
              </p>
            </article>
          </div>

          <QualitativeFindingsChart />
          <SurveyPetalChart />

          <p className="rl-outcome-conclusion">
            Together, the two datasets support refinement rather than redesign. The invitation and
            framing around close friends created a credible reason to join, while the language about
            having no scores and the private memory vault kept the idea away from fitness tracker territory.
            The principal gap was the experience when a day is missed: the product still needed to prove that accountability would
            remain kind when one person could not complete the action. The research therefore supports
            advancing the participation hypothesis to a behavioral beta; it does not support claiming
            that the concept has improved retention or monthly active use.
          </p>
          <p className="rl-outcome-next-signal">
            Measurement ladder for a beta: invitation send and acceptance → first completion → a second
            challenge within seven days → reactivation and retention after 30 days among exposed users →
            contribution to monthly active use. The qualitative risk to monitor would be whether reminders
            remain supportive over time or begin to create interpersonal pressure.
          </p>
        </div>
      ),
    },
    {
      id: '08',
      label: 'Next Step: Test Retention & MAU',
      body: (
        <div className="rl-next-step">
          <section className="rl-next-step__remediations" aria-labelledby="rl-remediations-title">
            <div className="rl-next-step__copy">
              <span className="rl-next-step__eyebrow">Refinements after validation</span>
              <h5 id="rl-remediations-title">From focus group findings to a revised flow</h5>
              <p>
                The focus group identified three immediate trust gaps: notification copy could feel too
                pushy, invitees had no way to discuss the terms, and the flow offered no clear response
                when someone missed a day. Those findings were translated into focused revisions before
                the next behavioral test.
              </p>

              <ul className="rl-remediation-list">
                <li>
                  <strong>Softer microcopy</strong>
                  <span>Reminders now encourage a return without using the friend as pressure.</span>
                </li>
                <li>
                  <strong>Terms to discuss</strong>
                  <span>The invitee can raise changes to the action, duration, or proof before accepting.</span>
                </li>
                <li>
                  <strong>Recovery after a missed day</strong>
                  <span>
                    A new state asks for a short 10 second apology; without it, that day remains empty in
                    the shared vault.
                  </span>
                </li>
              </ul>
            </div>

            <figure className="rl-remediation-media">
              <div className="rl-remediation-media__frame">
                <div className="rl-remediation-media__image">
                  <img
                    src={realLifeMissedDayRecovery}
                    alt="Revised recovery screen asking the participant to record a ten second apology after missing a challenge day"
                    loading="lazy"
                  />
                  <span className="rl-remediation-media__company-mask" aria-hidden="true" />
                </div>
              </div>
              <figcaption>Recovery state added after the focus group validation.</figcaption>
            </figure>
          </section>

          <section className="rl-next-step__experiment" aria-labelledby="rl-next-experiment-title">
            <span className="rl-next-step__eyebrow">Next experiment</span>
            <h5 id="rl-next-experiment-title">Test whether the refined loop changes behavior</h5>
            <p>
              Next, run an A/B test of the invitation copy for current users and people who do not use the
              product, then validate the revised flow with a second, larger focus group. An instrumented
              beta over four weeks should compare exposed and unexposed cohorts and track invitation
              acceptance, completion, repeat participation, reactivation, and retention after 30 days
              before interpreting any contribution to MAU.
            </p>
            <p className="rl-next-step__learning">
              What I learned: the strongest early signal was not a business metric. Every participant
              named a real person within seconds of understanding the concept. That gave the invitation
              social specificity; only longitudinal behavior can show whether that intent becomes a
              durable reason to return.
            </p>
          </section>
        </div>
      ),
    },
  ];
}
