import { FigmaEmbed } from './embeds/FigmaEmbed';
import { DocumentModal } from './DocumentModal';
import type { BlueprintSection } from './CaseStudyBlueprint';
import directPassBanner from '../../assets/images/DirectPass_banner.jpg';
import directPassJourneyMap from '../../assets/images/DirectPass_journeymap.jpg';
import directPassUserPersona from '../../assets/images/DirectPass_user-persona.png';
import directPassNewUserFlow from '../../assets/images/DirectPass_new-user-flow.png';
import directPassReturningUserFlow from '../../assets/images/DirectPass_returning-user-flow.png';
import directPassInterviewSessions from '../../assets/images/DirectPass_interview-sessions.png';
import directPassAffinityPatterns from '../../assets/images/DirectPass_affinity-shared-patterns.png';
import directPassResearchApplyBoard from '../../assets/images/DirectPass_research-applyboard.png';
import directPassResearchClientQuestions from '../../assets/images/DirectPass_research-client-questions.png';
import directPassResearchInterviewGuide from '../../assets/images/DirectPass_research-interview-guide.png';
import directPassResearchTypeform from '../../assets/images/DirectPass_research-typeform.png';
import directPassUxReport from '../../assets/images/DirectPass_uxreport.jpg';
import directPassHifiHome from '../../assets/images/DirectPass_hifi_home.jpg';
import directPassAffinityDiagram from '../../assets/documents/DirectPass_affinity-diagram.pdf';

const FIGMA_EMBED_URL =
  'https://embed.figma.com/design/XOm6kAlJGKycxB0oTpoKmO/DirectPass-Team-2--Copy-?node-id=810-2917&embed-host=share';
const FIGMA_FILE_URL =
  'https://www.figma.com/design/XOm6kAlJGKycxB0oTpoKmO/DirectPass-Team-2--Copy-?node-id=810-2917';
const LOFI_FIGMA_EMBED_URL =
  'https://embed.figma.com/design/XOm6kAlJGKycxB0oTpoKmO/DirectPass-Team-2--Copy-?node-id=110-978&embed-host=share';
const LOFI_FIGMA_FILE_URL =
  'https://www.figma.com/design/XOm6kAlJGKycxB0oTpoKmO/DirectPass-Team-2--Copy-?node-id=110-978&t=YYIUFl7kFq7j2joB-1';
const SURVEY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSezcN_FgQssYxsg4zrnlmHGXcEOsaKYkKeqGWB-9-XsLBbvhQ/viewform';
const DIRECTPASS_PUBLIC_URL = `${import.meta.env.BASE_URL}directpass`;
const UX_REPORT_URL = `${DIRECTPASS_PUBLIC_URL}/ux-report/index.html`;

const RESEARCH_ARTIFACTS = [
  {
    number: '01',
    phase: 'Align',
    title: 'Questions for the client',
    description:
      'Nine alignment questions clarified scope, market, roadmap ownership, and the intended product endpoint.',
    takeaway:
      'Defined what belonged in the experience before interface decisions began.',
    previewType: 'image',
    preview: directPassResearchClientQuestions,
    alt: 'Workbook with client discovery questions organized by category, question, and why each answer matters',
    source: `${DIRECTPASS_PUBLIC_URL}/research-documents/client-questions.xlsx`,
  },
  {
    number: '02',
    phase: 'Inspire',
    title: 'Typeform reference analysis',
    description:
      'An interaction reference for making a long onboarding experience structured as questions feel conversational.',
    takeaway:
      'Borrow progressive disclosure and clear entry paths; avoid weak contrast and technical labels.',
    previewType: 'image',
    preview: directPassResearchTypeform,
    alt: 'Typeform inspirational analysis workbook documenting interaction strengths and accessibility weaknesses',
    source: `${DIRECTPASS_PUBLIC_URL}/research-documents/typeform-inspirational-analysis.xlsx`,
  },
  {
    number: '03',
    phase: 'Listen',
    title: 'Interview discussion guide',
    description:
      'Nineteen prompts explored discovery, trust, cost, process knowledge, organization, and emotion.',
    takeaway:
      'Asked about present behavior before introducing a possible DirectPass solution.',
    previewType: 'image',
    preview: directPassResearchInterviewGuide,
    alt: 'User research question workbook grouped into eight themes for moderated interviews',
    source: `${DIRECTPASS_PUBLIC_URL}/research-documents/user-research-questions.xlsx`,
  },
  {
    number: '04',
    phase: 'Compare',
    title: 'ApplyBoard competitive analysis',
    description:
      'A focused audit of onboarding, progress cues, contextual details, support, and accessibility.',
    takeaway:
      'Keep visible progress and contextual detail without ambiguous hierarchy or affordances.',
    previewType: 'image',
    preview: directPassResearchApplyBoard,
    alt: 'ApplyBoard competitive analysis workbook documenting product strengths and weaknesses',
    source: `${DIRECTPASS_PUBLIC_URL}/research-documents/applyboard-competitive-analysis.xlsx`,
  },
  {
    number: '05',
    phase: 'Synthesize',
    title: 'Institutional UX report',
    description:
      'An interactive audit connected desktop and mobile evidence from NYU, UBC, Northeastern, and Conestoga.',
    takeaway:
      'The information exists, but institutions rarely sequence it around the student journey.',
    previewType: 'image',
    preview: directPassUxReport,
    alt: 'Preview of the interactive institutional UX report for four university websites',
    source: UX_REPORT_URL,
    linkLabel: 'Explore interactive report',
  },
  {
    number: '06',
    phase: 'Plan',
    title: 'International student survey',
    description:
      'A form with 23 questions translated the strongest interview themes into a structured quantitative research plan.',
    takeaway:
      'Prepared a future validation layer around trust, decision criteria, challenges, and uncertainty about what comes next.',
    previewType: 'survey',
    preview: null,
    alt: 'Preview of the international student research survey with 23 questions',
    source: SURVEY_URL,
    linkLabel: 'Open research survey',
  },
] as const;

export const DIRECTPASS_TITLE = 'DirectPass: The GPS for Studying Abroad';
export const DIRECTPASS_SUMMARY =
  'A guidance platform that helps international students apply to U.S. and Canadian universities, track every milestone through a personalized roadmap and Unlock Score, and navigate visa requirements with clearer next steps.';
export const DIRECTPASS_BANNER = {
  src: directPassBanner,
  alt: 'DirectPass logo',
  className: 'w-full h-[128px] object-cover sm:h-[176px] md:h-[420px]',
  style: { objectPosition: '50% 45%' },
};

type InterviewFinding = {
  label: string;
  shortLabel: [string, string?];
  count: number;
  severity: 'High' | 'Medium';
  angle: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
};

/**
 * Data: synthesis of three moderated interviews (affinity mapping).
 * Shape size and color = severity; three markers = three interviewees.
 */
const INTERVIEW_FINDINGS: InterviewFinding[] = [
  { label: 'Too much info, not enough clarity', shortLabel: ['Too much information,', 'not enough clarity'], count: 3, severity: 'High', angle: -90, labelX: 380, labelY: 30, anchor: 'middle' },
  { label: 'Money is the biggest unknown', shortLabel: ['Money is the', 'biggest unknown'], count: 2, severity: 'High', angle: -18, labelX: 626, labelY: 155, anchor: 'start' },
  { label: 'Visa steps are confusing', shortLabel: ['Visa steps', 'are confusing'], count: 2, severity: 'High', angle: 54, labelX: 612, labelY: 462, anchor: 'start' },
  { label: 'Students track progress alone', shortLabel: ['Students track', 'progress alone'], count: 3, severity: 'Medium', angle: 126, labelX: 170, labelY: 482, anchor: 'end' },
  { label: 'Users want timely, relevant updates', shortLabel: ['Users want timely,', 'relevant updates'], count: 3, severity: 'Medium', angle: 198, labelX: 168, labelY: 174, anchor: 'end' },
];

const CHART_CENTER = { x: 380, y: 300 };
const DEG = Math.PI / 180;

function polarPoint(angle: number, radius: number) {
  return {
    x: CHART_CENTER.x + Math.cos(angle * DEG) * radius,
    y: CHART_CENTER.y + Math.sin(angle * DEG) * radius,
  };
}

function petalPath(angle: number, radius: number) {
  const left = polarPoint(angle - 27, radius);
  const right = polarPoint(angle + 27, radius);
  const innerLeft = polarPoint(angle - 18, 34);
  const innerRight = polarPoint(angle + 18, 34);
  const controlLeft = polarPoint(angle - 14, radius * 0.68);
  const controlRight = polarPoint(angle + 14, radius * 0.68);

  return [
    `M ${innerLeft.x} ${innerLeft.y}`,
    `Q ${controlLeft.x} ${controlLeft.y} ${left.x} ${left.y}`,
    `A ${radius} ${radius} 0 0 1 ${right.x} ${right.y}`,
    `Q ${controlRight.x} ${controlRight.y} ${innerRight.x} ${innerRight.y}`,
    'Z',
  ].join(' ');
}

function InterviewFindingsChart() {
  const severityColor = (severity: InterviewFinding['severity']) =>
    severity === 'High' ? '#B84B38' : '#397482';

  return (
    <figure className="dp-findings-chart">
      <figcaption className="dp-evidence-chart__heading">
        <span>Qualitative evidence · moderated interviews · n=3</span>
        <strong>What three conversations made visible</strong>
      </figcaption>
      <p className="dp-evidence-chart__intro">
        This qualitative view translates the interview synthesis into a visual evidence field. Shape size
        communicates severity, while the three markers indicate how many participants raised each theme.
      </p>

      <svg
        className="dp-findings-chart__radial"
        viewBox="0 0 760 570"
        role="img"
        aria-labelledby="directpass-findings-title directpass-findings-desc"
      >
        <title id="directpass-findings-title">Interview findings evidence field</title>
        <desc id="directpass-findings-desc">
          Five interview findings. Shape size and color show severity; the three markers show how many
          interviewees raised each issue. Findings with high severity are substantially larger than findings with medium severity.
        </desc>
        <defs>
          <radialGradient id="dp-high-glow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#B84B38" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#B84B38" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="dp-medium-glow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#397482" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#397482" stopOpacity="0.19" />
          </radialGradient>
        </defs>

        <circle cx={CHART_CENTER.x} cy={CHART_CENTER.y} r="205" fill="none" stroke="var(--bp-border, #d8d3ca)" strokeWidth="0.75" strokeDasharray="1 8" opacity="0.72" />

        {INTERVIEW_FINDINGS.map((finding) => {
          const severityRadius = finding.severity === 'High' ? 206 : 128;
          const radius = severityRadius - (finding.count === 2 ? 14 : 0);
          const color = severityColor(finding.severity);
          const labelGuideStart = polarPoint(finding.angle, radius + 6);
          const labelGuideEnd = polarPoint(finding.angle, radius + 30);
          const strandCount = 23;

          return (
            <g key={finding.label}>
              <path d={petalPath(finding.angle, radius)} fill={finding.severity === 'High' ? 'url(#dp-high-glow)' : 'url(#dp-medium-glow)'} stroke={color} strokeWidth="0.8" strokeOpacity="0.82" />

              {Array.from({ length: strandCount }, (_, index) => {
                const t = index / (strandCount - 1);
                const strandAngle = finding.angle - 25 + t * 50;
                const start = polarPoint(finding.angle + (t - 0.5) * 28, 36);
                const end = polarPoint(strandAngle, radius - 3);
                const control = polarPoint(finding.angle + (t - 0.5) * 16, radius * 0.63);

                return (
                  <path key={strandAngle} d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="0.65" strokeOpacity="0.56" />
                );
              })}

              {[0, 1, 2].map((participant) => {
                const markerAngle = finding.angle - 11 + participant * 11;
                const marker = polarPoint(markerAngle, radius - 14);
                const raised = participant < finding.count;

                return (
                  <circle key={participant} cx={marker.x} cy={marker.y} r="4.5" fill={raised ? color : 'var(--bp-bg, #f8f6f1)'} stroke={color} strokeWidth="1.25">
                    <title>{`${finding.label}. Interviewee ${participant + 1}: ${raised ? 'raised the issue' : 'did not raise the issue'}`}</title>
                  </circle>
                );
              })}

              <path d={`M ${labelGuideStart.x} ${labelGuideStart.y} L ${labelGuideEnd.x} ${labelGuideEnd.y}`} stroke={color} strokeWidth="0.8" opacity="0.74" />

              <text x={finding.labelX} y={finding.labelY} textAnchor={finding.anchor} fill="var(--bp-text, #111111)" className="dp-findings-chart__svg-label">
                <tspan x={finding.labelX}>{finding.shortLabel[0]}</tspan>
                {finding.shortLabel[1] ? <tspan x={finding.labelX} dy="16">{finding.shortLabel[1]}</tspan> : null}
                <tspan x={finding.labelX} dy="18" fill={color} className="dp-findings-chart__svg-value">
                  {`${finding.count} of 3 · ${finding.severity} severity`}
                </tspan>
              </text>
            </g>
          );
        })}

        <circle cx={CHART_CENTER.x} cy={CHART_CENTER.y} r="33" fill="var(--bp-bg, #f8f6f1)" />
        <circle cx={CHART_CENTER.x} cy={CHART_CENTER.y} r="28" fill="none" stroke="var(--bp-text, #111111)" strokeWidth="0.8" />
        <text x={CHART_CENTER.x} y={CHART_CENTER.y - 3} textAnchor="middle" className="dp-findings-chart__hub-number" fill="var(--bp-text, #111111)">03</text>
        <text x={CHART_CENTER.x} y={CHART_CENTER.y + 13} textAnchor="middle" className="dp-findings-chart__hub-label" fill="var(--bp-muted, #676767)">voices</text>
      </svg>

      <div className="dp-findings-chart__mobile" aria-hidden="true">
        {INTERVIEW_FINDINGS.map((finding) => {
          const color = severityColor(finding.severity);
          return (
            <div className="dp-findings-chart__mobile-row" key={finding.label}>
              <div
                className="dp-findings-chart__mobile-mark"
                style={{ color, width: finding.severity === 'High' ? 118 : 76 }}
              >
                <span style={{ width: finding.count === 3 ? '100%' : '82%' }} />
                <i /><i /><i className={finding.count === 2 ? 'is-open' : undefined} />
              </div>
              <div>
                <strong>{finding.label}</strong>
                <span style={{ color }}>{`${finding.count} of 3 · ${finding.severity} severity`}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dp-findings-chart__legend" aria-hidden="true">
        <span><i className="is-high" /> High severity</span>
        <span><i className="is-medium" /> Medium severity</span>
        <span>Shape size = severity · dots = interviewees</span>
      </div>
      <p className="cs-bp-muted dp-findings-chart__source">
        Source: moderated interviews and affinity map synthesis
      </p>
    </figure>
  );
}

type SurveyOption = {
  label: string;
  count: number;
  color: string;
  textColor?: string;
};

type SurveySignal = {
  code: string;
  section: string;
  title: string;
  question: string;
  base?: number;
  multiple?: boolean;
  coded?: boolean;
  conditional?: boolean;
  options: SurveyOption[];
};

const SURVEY_MODEL_SIZE = 37;
const SURVEY_PALETTE = ['#225E63', '#397482', '#4D8588', '#5F747D', '#6F6578', '#69765B', '#7E7064', '#526A73'] as const;
const surveyOption = (label: string, count: number, tone: number): SurveyOption => ({
  label,
  count,
  color: SURVEY_PALETTE[tone % SURVEY_PALETTE.length],
});

const SURVEY_SIGNALS: SurveySignal[] = [
  {
    code: 'Q01', section: 'Profile and context', title: 'Current country',
    question: 'What country are you currently living in?', coded: true,
    options: [
      surveyOption('Nigeria', 6, 0), surveyOption('India', 5, 1), surveyOption('Venezuela', 4, 2),
      surveyOption('France', 4, 3), surveyOption('Ireland', 3, 4), surveyOption('Brazil', 3, 5),
      surveyOption('Mexico', 3, 6), surveyOption('China', 2, 7), surveyOption('Ghana', 2, 1),
      surveyOption('Colombia', 2, 2), surveyOption('Pakistan', 2, 4), surveyOption('Canada', 1, 5),
    ],
  },
  {
    code: 'Q02', section: 'Profile and context', title: 'Current status',
    question: 'What is your current status?',
    options: [
      surveyOption('University student', 14, 0), surveyOption('Working professional', 10, 1),
      surveyOption('Recent graduate', 8, 2), surveyOption('High school student', 5, 3),
    ],
  },
  {
    code: 'Q03', section: 'Profile and context', title: 'International travel',
    question: 'Have you ever traveled outside your home country?',
    options: [surveyOption('Yes', 23, 0), surveyOption('No', 14, 4)],
  },
  {
    code: 'Q04', section: 'Motivation and decision process', title: 'Effect of travel',
    question: 'If yes, how did that experience affect your interest in studying abroad?',
    base: 23, coded: true, conditional: true,
    options: [
      surveyOption('Increased interest', 12, 0), surveyOption('Clarified destination preferences', 5, 1),
      surveyOption('Revealed cost or process complexity', 4, 4), surveyOption('Little or no effect', 2, 6),
    ],
  },
  {
    code: 'Q05', section: 'Motivation and decision process', title: 'Initial motivation',
    question: 'What first sparked your interest in studying abroad?', coded: true,
    options: [
      surveyOption('Career opportunities', 10, 0), surveyOption('Better education', 9, 1),
      surveyOption('Personal growth', 7, 2), surveyOption('Cultural experience', 6, 3),
      surveyOption('Family or mentor influence', 5, 4),
    ],
  },
  {
    code: 'Q06', section: 'Motivation and decision process', title: 'Reasons to study abroad',
    question: 'What are your main reasons for considering studying in the United States or Canada?', multiple: true,
    options: [
      surveyOption('Better education opportunities', 27, 0), surveyOption('Career opportunities', 24, 1),
      surveyOption('Personal growth', 21, 2), surveyOption('Cultural experience', 18, 3),
      surveyOption('Family recommendation', 7, 4),
    ],
  },
  {
    code: 'Q07',
    section: 'Motivation and decision process',
    title: 'Decision drivers',
    question: 'Of the factors below, which is most important when choosing a university?',
    options: [
      surveyOption('Tuition cost', 9, 0), surveyOption('Scholarships / financial aid', 8, 1),
      surveyOption('Program availability', 6, 2), surveyOption('Career opportunities', 5, 3),
      surveyOption('Academic reputation', 4, 4), surveyOption('Location', 2, 5),
      surveyOption('Campus life', 1, 6), surveyOption('Other', 2, 7),
    ],
  },
  {
    code: 'Q08', section: 'Motivation and decision process', title: 'Application stage',
    question: 'Which stage best describes where you are in the study abroad process?',
    options: [
      surveyOption('Just starting research', 10, 0), surveyOption('Comparing universities', 9, 1),
      surveyOption('Preparing applications', 8, 2), surveyOption('Submitted applications', 5, 3),
      surveyOption('Accepted / enrolled', 5, 4),
    ],
  },
  {
    code: 'Q09', section: 'Motivation and decision process', title: 'Universities considered',
    question: 'Approximately how many universities have you seriously considered applying to?',
    options: [
      surveyOption('None yet', 5, 4), surveyOption('1 to 3', 12, 0), surveyOption('4 to 6', 10, 1),
      surveyOption('7 to 10', 6, 2), surveyOption('More than 10', 4, 3),
    ],
  },
  {
    code: 'Q10', section: 'Information and support',
    title: 'Information ecosystem',
    question: 'Where do you usually get information about universities?',
    multiple: true,
    options: [
      surveyOption('University websites', 29, 0), surveyOption('Education consultants', 14, 1),
      surveyOption('Friends or family', 13, 2), surveyOption('Online forums / groups', 12, 3),
      surveyOption('Social media', 10, 4),
    ],
  },
  {
    code: 'Q11', section: 'Information and support',
    title: 'Confidence in information',
    question: 'How confident are you in identifying reliable university and application information?',
    options: [
      surveyOption('1 · Low confidence', 8, 4), surveyOption('2', 13, 3),
      surveyOption('3', 11, 1), surveyOption('4 · High confidence', 5, 0),
    ],
  },
  {
    code: 'Q12', section: 'Information and support', title: 'University fit information',
    question: 'What information do you look for when deciding whether a university is a good fit for you?',
    multiple: true, coded: true,
    options: [
      surveyOption('Tuition and funding', 26, 0), surveyOption('Program fit', 24, 1),
      surveyOption('Career outcomes', 19, 2), surveyOption('Location and living conditions', 16, 3),
      surveyOption('Admission requirements', 13, 4), surveyOption('Support and campus life', 10, 5),
    ],
  },
  {
    code: 'Q13', section: 'Information and support', title: 'People providing support',
    question: 'Who has been helping you through the process?', multiple: true,
    options: [
      surveyOption('Parents / family', 22, 0), surveyOption('Friends', 16, 1),
      surveyOption('Teachers / counselors', 14, 2), surveyOption('Education consultants', 9, 3),
      surveyOption('No one', 6, 4),
    ],
  },
  {
    code: 'Q14', section: 'Process friction',
    title: 'Most difficult steps',
    question: 'Which parts of the study abroad process have been most challenging?',
    multiple: true,
    options: [
      surveyOption('Financial planning', 22, 0), surveyOption('Scholarships', 20, 1),
      surveyOption('Understanding requirements', 18, 2), surveyOption('Visa process', 16, 3),
      surveyOption('Comparing universities', 13, 4), surveyOption('Application paperwork', 11, 5),
      surveyOption('Housing', 9, 6), surveyOption('Finding universities', 7, 7),
    ],
  },
  {
    code: 'Q15', section: 'Process friction',
    title: 'Uncertainty about what comes next',
    question: 'How often do you feel uncertain about what step to take next in the application process?',
    options: [
      surveyOption('Very often', 7, 4), surveyOption('Often', 10, 3), surveyOption('Sometimes', 11, 2),
      surveyOption('Rarely', 6, 1), surveyOption('Never', 3, 0),
    ],
  },
  {
    code: 'Q16', section: 'Process friction', title: 'Biggest obstacle',
    question: 'What has been the biggest obstacle in your study abroad journey so far?', coded: true,
    options: [
      surveyOption('Funding and affordability', 11, 0), surveyOption('Understanding requirements', 8, 1),
      surveyOption('Visa process', 6, 2), surveyOption('Application paperwork', 5, 3),
      surveyOption('Choosing universities', 4, 4), surveyOption('Housing', 3, 5),
    ],
  },
  {
    code: 'Q17', section: 'Process friction', title: 'Overall experience',
    question: 'How would you describe your overall experience with the process so far?', coded: true,
    options: [
      surveyOption('Overwhelming', 11, 4), surveyOption('Mixed or uneven', 10, 3),
      surveyOption('Manageable', 8, 2), surveyOption('Positive', 5, 0),
      surveyOption('Too early to assess', 3, 6),
    ],
  },
  {
    code: 'Q18', section: 'Process friction', title: 'What would make it easier',
    question: 'What would make the study abroad process easier for you?', coded: true,
    options: [
      surveyOption('One centralized guide', 10, 0), surveyOption('Clear sequence of steps', 9, 1),
      surveyOption('Funding and cost guidance', 7, 2), surveyOption('Deadline tracking', 5, 3),
      surveyOption('Advisor or community support', 4, 4), surveyOption('Clearer visa guidance', 2, 5),
    ],
  },
  {
    code: 'Q19', section: 'Resources and unmet needs', title: 'Resources used',
    question: 'What types of support or resources have you used during the study abroad process?', multiple: true,
    options: [
      surveyOption('University websites', 29, 0), surveyOption('Friends or family', 18, 1),
      surveyOption('Teachers / counselors', 15, 2), surveyOption('Education consultants', 14, 3),
      surveyOption('Student forums / groups', 12, 4), surveyOption('Social media', 10, 5),
      surveyOption('YouTube', 9, 6), surveyOption('None', 3, 7),
    ],
  },
  {
    code: 'Q20', section: 'Resources and unmet needs', title: 'Most helpful resource',
    question: 'Which of these resources has been the most helpful, and why?', coded: true,
    options: [
      surveyOption('Official university websites', 12, 0), surveyOption('Teachers or counselors', 8, 1),
      surveyOption('Education consultants', 6, 2), surveyOption('Peer communities', 5, 3),
      surveyOption('Videos or social media', 3, 4), surveyOption('None or mixed', 3, 6),
    ],
  },
  {
    code: 'Q21', section: 'Resources and unmet needs', title: 'Task students would remove',
    question: 'If you could remove one task from the study abroad process, what would it be?', coded: true,
    options: [
      surveyOption('Application paperwork', 10, 0), surveyOption('Visa administration', 8, 1),
      surveyOption('Repeated data entry', 6, 2), surveyOption('Financial documentation', 5, 3),
      surveyOption('University search and comparison', 4, 4), surveyOption('Nothing', 3, 5),
      surveyOption('Housing search', 1, 6),
    ],
  },
  {
    code: 'Q22', section: 'Resources and unmet needs', title: 'Missing tool or service',
    question: 'What is one tool, resource, or service you wish had existed when you started this journey?', coded: true,
    options: [
      surveyOption('Centralized roadmap', 13, 0), surveyOption('Funding matcher', 7, 1),
      surveyOption('Requirement comparison', 6, 2), surveyOption('Deadline tracker', 5, 3),
      surveyOption('Verified community', 3, 4), surveyOption('Visa guidance', 3, 5),
    ],
  },
  {
    code: 'Q23', section: 'Resources and unmet needs', title: 'Additional perspective',
    question: 'Is there anything else you would like to share about your experience with studying abroad?', coded: true,
    options: [
      surveyOption('Need greater transparency', 11, 0), surveyOption('Emotional stress is significant', 8, 1),
      surveyOption('Need information tailored by country', 6, 2), surveyOption('More support for independent applicants', 5, 3),
      surveyOption('Positive or appreciative note', 4, 4), surveyOption('Nothing else to add', 3, 6),
    ],
  },
];

function surveyStreamPath(start: number, end: number, halfHeight: number, index: number) {
  const width = end - start;
  const upperBias = index % 2 === 0 ? 1 : 0.82;
  const lowerBias = index % 3 === 0 ? 0.78 : 1;

  return [
    `M ${start} 38`,
    `C ${start + width * 0.18} ${38 - halfHeight * upperBias}, ${end - width * 0.18} ${38 - halfHeight}, ${end} 38`,
    `C ${end - width * 0.2} ${38 + halfHeight * lowerBias}, ${start + width * 0.2} ${38 + halfHeight}, ${start} 38`,
    'Z',
  ].join(' ');
}

function SurveyEvidenceWeave() {
  return (
    <figure className="dp-survey-weave">
      <figcaption className="dp-evidence-chart__heading">
        <span>Quantitative evidence · all 23 survey questions</span>
        <strong>How the full survey could quantify the student journey</strong>
      </figcaption>
      <p className="dp-evidence-chart__intro">
        This view models a possible result set with 37 responses across every question in the form. Questions
        with predefined choices retain the survey&apos;s original answer options; written responses are grouped into themes
        grounded in the interview affinity analysis. Question 04 is conditional and uses a base of 23.
      </p>

      <div className="dp-survey-weave__signals">
        {SURVEY_SIGNALS.map((signal, signalIndex) => {
          const totalMentions = signal.options.reduce((sum, option) => sum + option.count, 0);
          const maxCount = Math.max(...signal.options.map((option) => option.count));
          const responseBase = signal.base ?? SURVEY_MODEL_SIZE;
          const startsSection = signalIndex === 0 || SURVEY_SIGNALS[signalIndex - 1].section !== signal.section;
          const noteParts = [
            signal.conditional ? `Conditional question · n=${responseBase}` : null,
            signal.coded ? 'Written answers grouped by theme' : null,
            signal.multiple ? `Multiple selection · totals exceed ${responseBase}` : null,
          ].filter(Boolean);
          let runningTotal = 0;

          return (
            <div className="dp-survey-weave__entry" key={signal.code}>
              {startsSection ? (
                <div className="dp-survey-weave__section">
                  <span>{String(SURVEY_SIGNALS.slice(0, signalIndex + 1).filter((item, index) => index === 0 || SURVEY_SIGNALS[index - 1].section !== item.section).length).padStart(2, '0')}</span>
                  <strong>{signal.section}</strong>
                </div>
              ) : null}
              <article className="dp-survey-weave__signal">
                <div className="dp-survey-weave__question">
                  <span>{signal.code}</span>
                  <h5>{signal.title}</h5>
                  <p>{signal.question}</p>
                </div>
                <div className="dp-survey-weave__graphic">
                  <svg
                    viewBox="0 0 720 76"
                    role="img"
                    aria-label={`${signal.title}: ${signal.options.map((option) => `${option.label}, ${option.count} of ${responseBase}`).join('; ')}`}
                  >
                    <path d="M 18 38 C 196 22, 510 54, 702 38" fill="none" stroke="var(--bp-border-strong)" strokeWidth="0.8" strokeDasharray="1 7" />
                    {signal.options.map((option, index) => {
                      const start = 18 + (runningTotal / totalMentions) * 684;
                      runningTotal += option.count;
                      const end = 18 + (runningTotal / totalMentions) * 684;
                      const halfHeight = 9 + (option.count / maxCount) * 20;
                      const center = (start + end) / 2;
                      const textFits = end - start >= 22;

                      return (
                        <g key={option.label}>
                          <path
                            d={surveyStreamPath(start, end, halfHeight, index)}
                            fill={option.color}
                            fillOpacity="0.9"
                            stroke={option.color}
                            strokeWidth="0.8"
                          />
                          {[0.35, 0.58, 0.78].map((line, lineIndex) => (
                            <path
                              key={line}
                              d={`M ${start + 2} 38 C ${start + (end - start) * 0.28} ${38 + (lineIndex - 1) * halfHeight * line}, ${end - (end - start) * 0.28} ${38 - (lineIndex - 1) * halfHeight * line}, ${end - 2} 38`}
                              fill="none"
                              stroke={option.textColor ?? '#F8F3E9'}
                              strokeWidth="0.45"
                              strokeOpacity="0.42"
                            />
                          ))}
                          {textFits ? (
                            <text x={center} y="42" textAnchor="middle" fill={option.textColor ?? '#F8F3E9'} className="dp-survey-weave__count">
                              {option.count}
                            </text>
                          ) : null}
                        </g>
                      );
                    })}
                  </svg>

                  <ul className="dp-survey-weave__legend">
                    {signal.options.map((option) => (
                      <li key={option.label}>
                        <i style={{ background: option.color }} aria-hidden="true" />
                        <span>{option.label}</span>
                        <strong>{option.count}</strong>
                        <small>{`${Math.round((option.count / responseBase) * 100)}%`}</small>
                      </li>
                    ))}
                  </ul>
                  {noteParts.length ? <p className="dp-survey-weave__note">{noteParts.join(' · ')}</p> : null}
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <p className="cs-bp-muted dp-survey-weave__source">
        Question source: International Student Survey · all 23 questions represented
      </p>
    </figure>
  );
}

export function getDirectPassBlueprintSections(): BlueprintSection[] {
  return [
    {
      id: '01',
      label: 'Context',
      body: (
        <>
          <p>
            DirectPass is a guidance platform for international students pursuing education in the U.S.
            and Canada. It brings application guidance, milestone tracking, and visa preparation into
            one personalized path. A short intake creates a sequenced roadmap, while the Unlock Score
            and dashboard, which adapts to the current phase, show progress, blocked dependencies, and the next action a student
            should take.
          </p>
          <p>
            The project began by aligning on the product scope, intended users, business model, and the
            point at which DirectPass should stop or continue supporting a student. Research combined
            discovery questions for the client, an institutional UX audit across four education websites, a
            Typeform reference analysis, an ApplyBoard competitive review, moderated interviews,
            affinity mapping, and a survey plan with 23 questions.
          </p>
          <p>
            Those inputs revealed recurring friction around trustworthy information, cost, the order of
            admission and visa tasks, and visibility into progress. Instead of moving directly into UI,
            the team used the evidence to define a persona, map the student journey, and structure flows
            for both new and returning users before progressing from low fidelity wireframes to the
            current high fidelity screens.
          </p>

          <ol className="dp-context-timeline" aria-label="DirectPass project process">
            <li><span>01</span><strong>Align</strong><small>Scope and product intent</small></li>
            <li><span>02</span><strong>Benchmark</strong><small>Institutions and competitors</small></li>
            <li><span>03</span><strong>Listen</strong><small>Interviews and survey planning</small></li>
            <li><span>04</span><strong>Synthesize</strong><small>Affinity, persona, and journey</small></li>
            <li><span>05</span><strong>Define</strong><small>Flows for new and returning users</small></li>
            <li><span>06</span><strong>Design</strong><small>Low fidelity wireframes to high fidelity screens</small></li>
          </ol>

          <p className="cs-bp-muted">
            Role: UX research, interviews, synthesis, wireframing, and UI design · Timeline: 2026,
            in progress
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
            Research came before the problem statement because DirectPass began with a broad ambition:
            helping international students reach clarity rather than starting with a narrowly defined product problem.
            The team first needed to understand where the experience actually breaks down, which parts of
            the journey students already manage successfully, and where a new platform could provide value
            without duplicating information that already exists.
          </p>
          <p>
            The work therefore moved through connected layers. Client questions aligned the team on
            scope, business model, roadmap ownership, and the intended end of the student journey. Typeform
            provided an interaction reference for making a long intake feel conversational. ApplyBoard
            revealed established patterns and accessibility risks in a direct competitor. Finally, the
            interview guide translated those early assumptions into questions about real behavior, trust,
            cost, organization, and emotional pressure. An institutional audit then tested those accounts
            against four live education websites, while the survey instrument translated the strongest
            qualitative themes into questions that could later be measured at scale. The artifacts below
            show how each layer informed the next rather than functioning as an isolated deliverable.
          </p>

          <div className="dp-research-sequence" aria-label="Research sequence">
            <span>Align</span><i aria-hidden="true" />
            <span>Inspire</span><i aria-hidden="true" />
            <span>Listen</span><i aria-hidden="true" />
            <span>Compare</span>
          </div>

          <div className="dp-research-artifacts">
            {RESEARCH_ARTIFACTS.map((artifact) => (
              <article className="dp-research-artifact" key={artifact.title}>
                <div className="dp-research-artifact__meta">
                  <span>{artifact.number}</span>
                  <span>{artifact.phase}</span>
                </div>
                <h5>{artifact.title}</h5>
                <p>{artifact.description}</p>
                <div className={`dp-research-artifact__preview is-${artifact.previewType}`}>
                  {artifact.previewType === 'image' && artifact.preview ? (
                    <img src={artifact.preview} alt={artifact.alt} />
                  ) : (
                    <div className="dp-research-artifact__survey" role="img" aria-label={artifact.alt}>
                      <span>Survey instrument</span>
                      <strong>23</strong>
                      <p>questions · 5 to 10 minutes</p>
                      <div aria-hidden="true"><i /><i /><i /><i /><i /></div>
                    </div>
                  )}
                </div>
                <p className="dp-research-artifact__takeaway">
                  <strong>Design implication</strong>
                  {artifact.takeaway}
                </p>
                <a href={artifact.source} target="_blank" rel="noopener noreferrer">
                  {'linkLabel' in artifact ? artifact.linkLabel : 'Open source workbook'}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <div className="dp-research-methods" aria-label="Research methods">
            <article>
              <span>Qualitative</span>
              <h5>Moderated interviews</h5>
              <p>
                Three recorded Zoom sessions with prospective students in Venezuela, France, and
                Ireland. Transcripts were coded and manually verified before affinity synthesis.
              </p>
            </article>
            <article>
              <span>Quantitative plan</span>
              <h5>Student survey instrument</h5>
              <p>
                A total of 23 questions were prepared to measure confidence, information sources, decision
                criteria, challenges, and uncertainty about what comes next in a future validation round.
              </p>
            </article>
            <article>
              <span>Evaluative</span>
              <h5>Institutional analysis</h5>
              <p>
                Education platforms and university sites were evaluated across task clarity,
                onboarding, navigation, trust signals, accessibility, and guidance about what comes next.
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
            The problem emerged from the research rather than preceding it. Joselyn, Iverson, and Edward
            described different destinations and academic goals, but the same underlying experience:
            fragmented official information, financial uncertainty, unclear sequencing, and progress
            systems they had to build for themselves.
          </p>

          <div className="cs-bp-media dp-interview-collage">
            <div className="cs-bp-media-frame">
              <img
                src={directPassInterviewSessions}
                alt="Recorded Zoom interview sessions showing the facilitator and the three DirectPass research participants"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <p className="cs-bp-muted dp-evidence-caption">
            Three moderated interviews · three geographies · one repeated need for clearer guidance
          </p>

          <p style={{ margin: '14px 0 12px' }}>
            Affinity mapping organized every observation into six themes: information and research,
            financial concerns, visa process, tracking and organization, community and advice, and the
            ideal platform. Eight shared patterns surfaced across the interviews. The findings with the highest stakes
            findings were cost uncertainty, confusion about the order of admission and visa steps, and
            reliance on spreadsheets, Notion, or personal schedules as a substitute for a trusted system.
            In Edward&apos;s words: &ldquo;I spent a lot of time doing all this, and at the end it becomes a
            pain.&rdquo;
          </p>

          <article className="dp-research-artifact dp-affinity-card">
            <div className="dp-research-artifact__meta">
              <span>Affinity synthesis</span>
              <span>9 pages</span>
            </div>
            <h5>Interview affinity diagram</h5>
            <p>
              The full synthesis organizes observations from Joselyn, Iverson, and Edward into six themes
              and eight shared patterns, preserving the evidence behind the qualitative findings.
            </p>
            <div className="dp-research-artifact__preview is-image">
              <img
                src={directPassAffinityPatterns}
                alt="Preview of the DirectPass affinity diagram showing eight shared interview patterns"
              />
            </div>
            <p className="dp-research-artifact__takeaway">
              <strong>Design implication</strong>
              Connect fragmented information, cost, sequencing, tracking, and timely guidance in one
              verified experience.
            </p>
            <DocumentModal
              src={directPassAffinityDiagram}
              kind="pdf"
              title="Interview affinity diagram"
              meta="9 pages"
            >
              Open affinity diagram · 9 pages
              <span aria-hidden="true">↗</span>
            </DocumentModal>
          </article>

          <section className="dp-evidence-framework" aria-labelledby="directpass-evidence-framework-title">
            <span>Two methods · two evidence layers</span>
            <h5 id="directpass-evidence-framework-title">Qualitative depth, quantitative structure</h5>
            <p>
              The first chart preserves the depth of the interviews: what participants experienced, why it
              mattered, and which problems carried the greatest severity. The second chart uses the survey
              structure to examine those signals as measurable response patterns. Together, they connect
              the reasons behind the problem with a way to evaluate how broadly those patterns may occur.
            </p>
          </section>

          <InterviewFindingsChart />
          <SurveyEvidenceWeave />
        </>
      ),
    },
    {
      id: '04',
      label: 'Persona & Journey',
      body: (
        <>
          <p>
            The persona and journey map turn the research into one coherent design lens. Emmanuela is a
            composite persona rather than a single interview participant: she brings together the goals,
            trust patterns, and recurring barriers observed across interviews, survey questions, and the
            institutional analysis.
          </p>

          <section className="dp-synthesis-artifact" aria-labelledby="directpass-persona-title">
            <div className="dp-synthesis-artifact__heading">
              <span>01 · Primary persona</span>
              <h5 id="directpass-persona-title">A determined applicant navigating an unreliable system</h5>
            </div>
            <p>
              Emmanuela is 25 and lives in Lagos, Nigeria. With a background in research science, she is
              preparing to pursue a Ph.D. in the U.S. and is currently in the research stage. Her goal is
              clear, but the path is not: funding eligibility, credit transfer, deadlines, career support,
              and visa requirements live across disconnected sources.
            </p>
            <p>
              She places the most trust in cited official information, .edu and .gov domains, and
              advisors. When those sources fail to explain how the pieces connect, she is pushed toward
              unofficial blogs and peer advice. This increases skepticism and the risk of discovering an
              application error too late. Her persistence is therefore not the problem; the absence of a
              verified, centralized sequence is.
            </p>

            <div className="dp-persona-signals" aria-label="Key persona signals">
              <article>
                <span>Current moment</span>
                <strong>Research</strong>
              </article>
              <article>
                <span>Primary objective</span>
                <strong>Fund a U.S. Ph.D.</strong>
              </article>
              <article>
                <span>Highest risk</span>
                <strong>Late errors</strong>
              </article>
            </div>

            <p className="cs-bp-muted dp-synthesis-artifact__insight">
              Design implication: DirectPass should preserve Emmanuela&apos;s agency while bringing verified
              sources, funding opportunities, milestone tracking, and early error prevention into one
              understandable sequence.
            </p>

            <div className="cs-bp-media dp-persona-media">
              <div className="cs-bp-media-frame">
                <img
                  src={directPassUserPersona}
                  alt="User persona for Emmanuela A., a Ph.D. applicant age 25 in Lagos, showing her needs, frustrations, trusted sources, feelings, and current progress in the research stage"
                />
              </div>
              <DocumentModal
                className="cs-bp-media-link"
                src={directPassUserPersona}
                kind="image"
                title="User persona — Emmanuela A."
              >
                <span>View full user persona</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </DocumentModal>
            </div>
          </section>

          <section className="dp-synthesis-artifact" aria-labelledby="directpass-journey-title">
            <div className="dp-synthesis-artifact__heading">
              <span>02 · User journey</span>
              <h5 id="directpass-journey-title">Follow the emotional cost of fragmented guidance</h5>
            </div>
            <p>
              The journey follows Emmanuela through Awareness, Research, Planning, Applying, and Visa / Next
              Steps. Initial excitement gives way to worry during research and anxiety during planning,
              when she must compare costs, requirements, documents, and deadlines without a reliable way to
              organize them. Confidence improves once the application is submitted, then falls again when
              admission and visa processes appear to overlap.
            </p>
            <p className="cs-bp-muted dp-synthesis-artifact__insight">
              Product opportunity: make information comparable during research, convert planning into a
              personalized checklist, surface status and reminders during application, and clearly explain
              what happens after admission.
            </p>

            <div className="cs-bp-media dp-journey-media">
              <div className="cs-bp-media-frame">
                <img
                  src={directPassJourneyMap}
                  alt="User journey map for Emmanuela across awareness, research, planning, applying, and visa next steps, with actions, thoughts, emotions, pain points, and product opportunities"
                />
              </div>
              <DocumentModal
                className="cs-bp-media-link"
                src={directPassJourneyMap}
                kind="image"
                title="User journey map"
              >
                <span>View complete user journey</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </DocumentModal>
            </div>
          </section>
        </>
      ),
    },
    {
      id: '05',
      label: 'Product Definition',
      body: (
        <>
          <p style={{ marginBottom: 12 }}>
            The product definition had to support two fundamentally different moments: helping a new
            student turn uncertainty into a personalized roadmap, and helping a returning student know
            exactly what to do next. I mapped both flows before drawing the interface so onboarding,
            progress tracking, blocked states, and the Unlock Score would operate as one continuous
            guidance system rather than separate features.
          </p>

          <section className="dp-flow-card" aria-labelledby="directpass-new-user-flow-title">
            <div className="dp-flow-card__heading">
              <span>01 · New users</span>
              <h5 id="directpass-new-user-flow-title">From an open question to a personalized starting point</h5>
            </div>
            <p>
              The flow for new users begins with account creation, then progressively narrows the student&apos;s
              context: destination, motivation, personal background, field of study, academic standing,
              school preferences, visa readiness, and document status. Questions tailored to the country for
              the U.S. and Canada branch only when they become relevant, while an &ldquo;undecided&rdquo;
              route keeps exploration open. The branches reconverge into visa and academic evaluation
              requirements, producing a structured profile that DirectPass can translate into a tailored
              roadmap instead of a generic checklist.
            </p>
            <p className="cs-bp-muted dp-flow-card__insight">
              Design implication: ask for complexity in a sequence, then return it as clarity.
            </p>
            <div className="cs-bp-media dp-flow-card__media is-portrait">
              <div className="cs-bp-media-frame">
                <img
                  src={directPassNewUserFlow}
                  alt="Onboarding flow for new users: account creation, destination and background questions, school preferences, visa readiness, academic evaluation, and personalized path completion"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <DocumentModal
                className="cs-bp-media-link"
                src={directPassNewUserFlow}
                kind="image"
                title="User flow — new user"
              >
                <span>View complete flow for new users</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </DocumentModal>
            </div>
          </section>

          <section className="dp-flow-card" aria-labelledby="directpass-returning-user-flow-title">
            <div className="dp-flow-card__heading">
              <span>02 · Returning users</span>
              <h5 id="directpass-returning-user-flow-title">Turn every return visit into visible progress</h5>
            </div>
            <p>
              The flow for returning users opens on a dashboard that adapts to the current phase and surfaces progress before
              asking for action. When the current phase is actionable, the system presents the next task
              and routes it by type: an action handled by the student, an outside dependency that must be
              tracked, or a document requiring upload or review. Completing any path updates the Unlock
              Score and generates the next prompt.
            </p>
            <p>
              When there is no new update, the product makes that waiting state explicit rather than
              appearing broken. It then offers parallel work such as visa preparation, planning before departure,
              or funding exploration, so a blocked application can still move forward. Both branches
              return to the same progress loop, giving the dashboard continuity across multiple visits.
            </p>
            <p className="cs-bp-muted dp-flow-card__insight">
              Design implication: a blocked primary task should never create an experience with no path forward.
            </p>
            <div className="cs-bp-media dp-flow-card__media is-landscape">
              <div className="cs-bp-media-frame">
                <img
                  src={directPassReturningUserFlow}
                  alt="Flow for returning users: dashboard adapted to the current phase, actionable and waiting branches, routing by task type, parallel work, task completion, Unlock Score update, and next prompt"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <DocumentModal
                className="cs-bp-media-link"
                src={directPassReturningUserFlow}
                kind="image"
                title="User flow — returning user"
              >
                <span>View complete flow for returning users</span>
                <span className="cs-bp-cta-arrow" aria-hidden="true">↗</span>
              </DocumentModal>
            </div>
          </section>
        </>
      ),
    },
    {
      id: '06',
      label: 'Low Fidelity Wireframes',
      body: (
        <>
          <p style={{ marginBottom: 12 }}>
            Eight pages of low fidelity wireframes established the structure of the homepage,
            onboarding, roadmap, dashboard, and login experience. At this stage, the work focused only
            on information hierarchy, task order, and how students would move from one step to the next
            before any visual styling was introduced.
          </p>
          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title="DirectPass low fidelity wireframes in Figma"
                src={LOFI_FIGMA_EMBED_URL}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                allow="fullscreen"
                allowFullScreen
                buttonLabel="Load low fidelity wireframes"
              />
            </div>
          </div>
          <div className="cs-bp-vsplit-cta" style={{ marginTop: 14 }}>
            <a
              className="cs-bp-cta"
              href={LOFI_FIGMA_FILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View low fidelity wireframes in Figma
              <span className="cs-bp-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </>
      ),
    },
    {
      id: '07',
      label: 'High Fidelity Screens',
      body: (
        <>
          <p style={{ marginBottom: 12 }}>
            These high fidelity screens translate the research into a visual system. The UI uses clear
            hierarchy, visible progress, labels written in plain language, and differentiated states to support
            the UX goal of reducing uncertainty and making each next step easier to understand.
          </p>
          <p className="cs-bp-muted" style={{ marginBottom: 12 }}>
            For example, research showed that students struggled with scattered information and an
            unclear sequence of tasks. The high fidelity direction responds with a persistent progress
            rail, one primary question or action at a time, and a review step that helps students
            confirm their roadmap information before continuing. In this way, the interface makes the
            experience grounded in research visible instead of adding a purely decorative layer.
          </p>
          <p style={{ marginBottom: 12 }}>
            The embedded Figma file provides a closer view of how those UX decisions are expressed
            through the layouts, components, and visual system across the individual screens.
          </p>
          <div className="cs-bp-media cs-bp-media-landscape" style={{ height: 280, maxWidth: '100%' }}>
            <div className="cs-bp-media-frame">
              <FigmaEmbed
                title="DirectPass high fidelity screen designs in Figma"
                src={FIGMA_EMBED_URL}
                wrapperClassName="cs-bp-media-fill"
                iframeClassName="cs-bp-media-fill"
                allow="fullscreen"
                allowFullScreen
                mobileStaticImageSrc={directPassHifiHome}
                mobileStaticImageAlt="DirectPass high fidelity homepage design"
                mobileLinkHref={FIGMA_FILE_URL}
                mobileLinkLabel="View designs in Figma"
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
      id: '08',
      label: 'Conclusion & Next Steps',
      body: (
        <>
          <p>
            This is a live project, presented as such. Sprints 0 through 2 are complete: product scope,
            competitive audit, user interviews, affinity mapping, personas, journey map, flow charts,
            wireframes, design system, and high fidelity screens for seven core flows.
          </p>
          <p>
            The strongest signal so far came from the interviews: every participant independently
            described the same solution before ever seeing the product: one place, one order, one next step.
            When your users design your value proposition for you, you&apos;re pointed the
            right way.
          </p>
          <p>
            That validation defines the next phase. The team&apos;s recommended steps, in order, are:
          </p>
          <ul>
            <li><strong>User testing:</strong> conduct usability sessions on the onboarding quiz with international students.</li>
            <li><strong>Refine:</strong> translate feedback into copy written in plain language, progress indicators, and clear error states.</li>
            <li>Finish high fidelity screens for the U.S./Canada flows, desktop and mobile.</li>
            <li>Run a complete pilot with a small group of students applying to U.S. or Canadian schools.</li>
            <li>Launch and iterate on complete data and feedback.</li>
          </ul>
          <p>
            The project will be successful when students understand each step without confusion,
            fewer users abandon the quiz, the time to a completed roadmap decreases, and DirectPass
            earns trust across every stage of the application journey.
          </p>
        </>
      ),
    },
  ];
}
