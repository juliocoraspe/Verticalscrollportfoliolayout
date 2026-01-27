import todoBanner from '../../assets/images/todo-banner2.png';
import asmrBanner from '../../assets/images/asmr-banner2.png';
import redesign02 from '../../assets/images/Redesign02.png';
import bloopAvatar from '../../assets/images/bloop.png';

export const PROJECTS = [
  {
    id: 'todo-app',
    title: 'To-Do App',
    intent:
      'Research-driven task flow designed to reduce planning overwhelm by improving anticipation, clarity, and trust—especially through reliable calendar handoff and reminder visibility.',
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
    outcomeEmbedUrl: 'https://juliocoraspe.github.io/todo-polymorphic-app/',
    outcomeEmbedConfig: { width: 430, height: 764, scale: 0.6 },
    outcomeEmbedMode: 'responsive',
    outcomeEmbedCta: 'Explore the live coded demo below.',
    outcomeEmbedArrow: 'up' as const,
    outcomeEmbedArrowPlacement: 'above' as const,
    prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
    prototypeUrl:
      'https://embed.figma.com/slides/RCRXoEB4h7yTAKYjiK1Rx6/ToDo-Research?node-id=1-360&embed-host=share',
    demoLabel: 'Research Findings & Design Implications (Full Report)',
    demoUrl: undefined,
  },
  {
    id: 'asmr-app',
    title: 'ASMR App',
    intent:
      'A sensory-first mobile experience designed to minimize emotional disruption while amplifying perception through sound, motion, and subtle feedback. The interface acts as a quiet framework—allowing audio, generative visuals, and haptics to shape a calm, highly personalized listening state.',
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
  {
    id: 'marketplace-bloop',
    title: 'Marketplace (BLOOP)',
    intent:
      'BLOOP is a mobile-first marketplace concept designed to make local buying and selling feel immediate, clear, and low-friction. Built in response to a school assignment, the project applies Apple Human Interface Guidelines (HIG) to address common marketplace usability issues—especially hidden primary actions, slow listing flows, and unclear status feedback.',
    role: 'UX Research, UI Design',
    imageUrl: bloopAvatar,
    tags: ['Research', 'UX Flow', 'UI Systems'],
    context:
      'Many existing marketplaces introduce unnecessary friction during key moments such as posting an item, tracking progress, and communicating with buyers. BLOOP was designed around the idea of a “bubble”: something light, simple, and responsive. Every interaction aims to feel effortless, with subtle visual feedback confirming that actions were successful.',
    problem:
      'Research and heuristic analysis revealed three recurring issues in popular marketplace experiences:\n- Navigation creates friction when the primary “Sell” action is not immediately visible.\n- Listing flows feel slow and lack consistent progress feedback.\n- Messaging systems provide unclear status indicators (sent/read), reducing user confidence during conversations.',
    process: [
      'I evaluated existing marketplace patterns through the lens of Apple Human Interface Guidelines, focusing on primary action visibility, user feedback and control, and clear status communication.',
      'Based on these insights, I mapped an end-to-end user flow—from browsing the feed to posting an item, messaging, purchase confirmation, and managing listings. Key screens were designed using a mini design system to ensure consistency, clarity, and predictable interaction patterns.',
    ],
    solution:
      'BLOOP improves the marketplace experience through:\n- A clearly visible and easily accessible “Sell” entry point.\n- A streamlined listing flow with multi-image uploads and progress indicators.\n- A listing preview that confirms how an item will appear before publishing.\n- An inbox and chat experience with notification badges and clear sent/read status cues.\n- Consistent, card-based layouts and reusable components inspired by Apple HIG patterns.',
    outcome: [
      'Primary actions are easier to discover, reducing navigation friction.',
      'Listing feels faster and more controlled thanks to visible progress feedback.',
      'Messaging improves trust through clearer hierarchy and status indicators.',
      'A cohesive mini design system—Inter typography, clean neutral colors, and a single bold blue accent—keeps the interface minimal while reinforcing BLOOP’s identity.',
    ],
    prototypeSummary:
      'This section represents the full BLOOP app experience. Key screens showcased include the Home Feed, Create New Listing flow, and Messaging screens, highlighting action visibility, feedback, and clarity throughout the user journey.',
    experienceUrl: '/projects/todo-app/experience',
    experienceHelper: 'View the full report',
    experienceThumbnail: undefined,
    prototypeLabel: 'Prototype embed placeholder — add the live or Figma link.',
    prototypeUrl:
      'https://embed.figma.com/design/6lWQJTUiFO8Wvtem3dAKZT/Bloop-Julio-coraspe?node-id=0-1&embed-host=share',
    demoLabel: undefined,
    demoUrl: undefined,
  },
  {
    id: 'frontend-redesign',
    title: 'Frontend Redesign',
    intent: `Frontend implementation and interface redesign of an image-based web application.

This project began as a frontend development exercise, translating an existing Figma design into a functional web application using HTML, CSS, and JavaScript. The initial implementation focused on structure, modular components, and interactive features such as image posts and basic content management.

While technically complete, the interface remained visually neutral and utilitarian. This redesign reframes the product as a visual moodboard, refining the UI to better support exploration, inspiration, and content-focused interaction.`,
    role: 'Frontend, UI Design',
    imageUrl: redesign02,
    imagePosition: 'top' as const,
    tags: ['Frontend', 'Refactor', 'Accessibility'],
    context:
      `The original application functioned primarily as a simple image-based interface, where usability was driven by functionality rather than intent. Although the product worked as expected, its presentation did not clearly communicate why the content mattered or how it should be used.

This redesign shifts the product’s direction toward a moodboard-style experience, prioritizing visual clarity, hierarchy, and a calmer canvas for collecting and revisiting visual references.`,
    problem:
      `The main issue was not missing features, but an interface that treated content and controls with equal priority. This resulted in several UX challenges:
• Limited visual hierarchy between primary actions and secondary controls.
• UI elements competing with images for attention.
• Interaction patterns that suggested a management tool rather than a moodboard.

Without formal user research, these issues were identified through heuristic evaluation and UI design principles, revealing gaps in hierarchy, focus, and consistency that justified a design-led refactor.`,
    process: [
      'Audited the interface using heuristic principles to identify hierarchy and clarity issues.',
      'Simplified interaction patterns to reduce visual noise.',
      'Refined layout, spacing, and contrast to support content-first exploration.',
    ],
    solution:
      'A cleaner, content-first interface that transforms the application from a simple image viewer into a moodboard-style tool. The redesign emphasizes visual hierarchy, minimizes exposed controls, and aligns interaction patterns with the product’s new purpose.',
    outcome: [
      'Improved visual focus and hierarchy across the main canvas.',
      'Reduced cognitive load by consolidating secondary actions.',
      'Clearer alignment between product intent and interface behavior.',
    ],
    outcomeEmbedUrl:
      'https://embed.figma.com/design/6lWQJTUiFO8Wvtem3dAKZT/Bloop-Julio-coraspe?node-id=57-2628&embed-host=share',
    introEmbedUrl: 'https://juliocoraspe.github.io/se_project_spots/',
    introEmbedLabel: 'The existing application prior to design exploration and improvements',
    introEmbedConfig: { width: 1280, height: 720, scale: 0.4 },
    introEmbedMode: 'responsive',
    experienceUrl: '/projects/frontend-redesign/experience',
    experienceHelper: 'View the full report',
    experienceThumbnail: undefined,
    prototypeLabel: 'Prototype embed placeholder — add the coded prototype or live build.',
    prototypeUrl:
      'https://embed.figma.com/design/QFyh4I1PE2qzy5hOSgDvgL/Spots-ReDesign?node-id=0-1&embed-host=share',
    demoLabel: 'Interface Redesign — Full Design Cycle',
    demoUrl: undefined,
  },
];
