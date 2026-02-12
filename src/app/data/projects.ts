import todoBanner from '../../assets/images/todo-banner2.png';
import asmrBanner from '../../assets/images/lumn_final.png';

type EmbedConfig = {
  width: number;
  height: number;
  scale: number;
};

type EmbedContentConfig = {
  width: number;
  height: number;
  fit?: 'contain' | 'cover' | 'cover-width' | 'frame';
  offsetX?: number;
  offsetY?: number;
};

export type Project = {
  id: string;
  title: string;
  intent: string;
  role: string;
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: 'center' | 'top' | 'bottom';
  tags: string[];
  context: string;
  problem: string;
  process: string[];
  solution: string;
  outcome: string[];
  experienceUrl?: string;
  experienceHelper?: string;
  experienceThumbnail?: string;
  introEmbedUrl?: string;
  introEmbedLabel?: string;
  introEmbedConfig?: EmbedConfig;
  introEmbedMode?: 'scaled' | 'responsive';
  outcomeEmbedUrl?: string;
  outcomeEmbedConfig?: EmbedConfig;
  outcomeEmbedMode?: 'scaled' | 'responsive';
  outcomeEmbedContentConfig?: EmbedContentConfig;
  outcomeEmbedCta?: string;
  outcomeEmbedArrow?: 'up' | 'down';
  outcomeEmbedArrowPlacement?: 'above' | 'below';
  prototypeSummary?: string;
  prototypeUrl?: string;
  prototypeLabel?: string;
  demoLabel?: string;
  demoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'todo-app',
    title: 'To-Do app: Calendar Native Task system',
    intent:
      'Research-driven productivity system integrating direct calendar synchronization and pre-event reminder logic, validated through functional code prototyping.',
    role: 'UX Research, UI Design',
    imageUrl: todoBanner,
    tags: ['Research', 'UX Flow', 'UI Systems'],
    context:
      'Designed as a compact study in reducing task anxiety for busy students and early-career professionals with mixed levels of tech comfort. The work focused on how people capture tasks quickly, understand priority at a glance, and rely on their phone’s native tools (calendar + notifications) to stay on track across work and personal schedules.',
    problem:
      'Many existing to-do tools break trust in day-to-day planning: key actions like edit/delete aren’t always discoverable, priority signals can be unclear, and calendar integration is often unreliable. Without “ahead of time” visibility (widgets, smart reminders, dependable sync), tasks feel fragmented—making it harder for users to plan confidently.',
    process: [
      'Mapped friction points from first use through daily task capture, then tested core behaviors: add, edit, delete, set priority, select dates, and navigate between views. Insights from competitive research emphasized anticipation (widgets + reminders) and dependable calendar integration as key differentiators.',
      'Concepts were explored through lo-fi and hi-fi prototypes, then iterated based on usability feedback—improving clarity with stronger priority cues, clearer button meanings, and safer delete flows. In parallel, a lightweight code prototype was used to evaluate how adding a task and handing it off to the device’s native calendar would look and feel in a more realistic interaction context.',
    ],
    solution:
      'A pared-back task system with gentle hierarchy, clear completion feedback, and low visual noise—built around fast capture, readable prioritization, and a planning flow that supports calendar continuity. The design prioritizes “at a glance” understanding (widgets + smart notifications) while keeping actions and states easy to recognize, especially for less tech-savvy users.',
    outcome: [
      'Task creation and completion tested as intuitive, with a mostly smooth navigation flow and positive reception overall.',
      'Priority became easier to interpret with stronger visual cues, and action clarity improved through labels and safer edit/delete patterns.',
      'Calendar sync was consistently valued as a trust and “backup” mechanism—supporting more detailed event controls (like notification personalization) inside the user’s native calendar.',
      'Code-based prototyping helped validate the end-to-end experience of creating a task and saving it to the device calendar, reinforcing a unified planning workflow across the app and the user’s existing system.',
    ],
    experienceUrl: '/projects/todo-app/experience',
    experienceHelper: 'View the full report',
    experienceThumbnail: undefined,
    outcomeEmbedUrl: 'https://juliocoraspe.github.io/todo-app-calendar-sync/',
    outcomeEmbedConfig: { width: 430, height: 764, scale: 0.6 },
    outcomeEmbedMode: 'responsive',
    outcomeEmbedCta: undefined,
    outcomeEmbedArrow: 'up' as const,
    outcomeEmbedArrowPlacement: 'above' as const,
    prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
    prototypeUrl:
      'https://embed.figma.com/slides/LvTMFtH8K3zEHuvjDHNDUa/To-Do-App-%E2%80%94-Interaction---System-Validation?node-id=1-106&embed-host=share',
    demoLabel: 'Research Findings & Design Implications (Full Report)',
    demoUrl: undefined,
  },
  {
    id: 'asmr-app',
    title: 'LUMN: Sound reactive ASMR app',
    intent:
      'Interface exploration of a multisensory ASMR experience where AI-generated sound drives reactive visual systems and haptic feedback, prototyped through JavaScript animation experiments.',
    role: 'Visual Design, Interaction',
    imageUrl: asmrBanner,
    imageFit: 'contain' as const,
    tags: ['UI Craft', 'Motion', 'Prototyping'],
    context:
      'This project originated from a brand-led exploration focused on calm, emotional neutrality, and sensory balance. Before defining screens or interactions, visual language, imagery, and tone were established to ensure the interface would support relaxation rather than influence mood through visual stimulation. The app was conceived as an adaptive environment—one that responds to sound and user input without imposing visual noise—transforming listening into a focused, multisensory ritual.',
    problem:
      'Many ASMR and ambient sound apps unintentionally interfere with emotional regulation by relying on expressive visuals, dense layouts, or overstimulating UI patterns. These design choices introduce visual and cognitive noise, pulling attention away from sound and fragmenting the listening experience over time.',
    process: [
      'The experience evolved through layered visual and interaction exploration. Initial branding, imagery, and mood-driven research informed a restrained emotional baseline, followed by lo-fi structural layouts that prioritized clarity and spatial calm.',
      'Two contrasting creative directions were then explored: one darker and more expressive, using neon accents and contrast, and another reduced and light, built around soft whites, muted blacks, and visual stillness.',
      'From this exploration, a focused direction emerged—refined into a cohesive system of typography, components, motion principles, and responsive behaviors. Sound-reactive animations inspired by generative code practices were integrated into the playback experience, along with subtle haptic responses, reinforcing immersion without visual dominance.',
    ],
    solution:
      'A minimal, adaptive sound studio where the UI deliberately avoids emotional distortion, allowing users to personalize their experience through layered audio, responsive motion, and tactile feedback. Visuals remain restrained and intentional, while generative animations and haptics expand the sensory depth—creating an experience that feels immersive without becoming intrusive.',
    outcome: [
      'A deeply customizable listening environment shaped by sound, motion, and touch',
      'Reduced emotional and visual noise through restrained UI decisions',
      'Extended the design beyond static prototypes through real-time motion exploration using JavaScript and the Three.js library',
      'Built sound-reactive, generative animation studies to visualize how playback-screen visuals respond dynamically to audio input',
      'Validated how motion, sound, and subtle interaction could coexist without overwhelming the listening experience, reinforcing the app as a calm, multisensory system rather than a purely audio tool',
    ],
    experienceUrl: '/projects/asmr-app/experience',
    experienceHelper: 'View the full report',
    experienceThumbnail: undefined,
    outcomeEmbedUrl: 'https://juliocoraspe.github.io/birdsong-viz/',
    outcomeEmbedConfig: { width: 640, height: 1138, scale: 0.6 },
    outcomeEmbedContentConfig: { width: 526, height: 1138, fit: 'frame' as const, offsetX: 8 },
    outcomeEmbedMode: 'responsive',
    outcomeEmbedCta: undefined,
    prototypeLabel: 'Prototype embed placeholder — add the audio demo or motion study.',
    prototypeUrl:
      'https://embed.figma.com/design/fYwhBS4WdU21aEjBQKEGVl/Julio-Coraspe-Lumn?node-id=0-1&embed-host=share',
    demoLabel: 'Full Design Overview',
    demoUrl: undefined,
  },
];
