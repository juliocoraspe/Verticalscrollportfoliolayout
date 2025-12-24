import { ParticleGuide } from './components/ParticleGuide';
import { ScrollSection } from './components/ScrollSection';
import { MorphingText } from './components/MorphingText';
import { CaseStudy } from './components/CaseStudy';
import { ExploratoryGallery } from './components/ExploratoryGallery';
import { motion } from 'motion/react';

export default function App() {
  const caseStudies = [
    {
      title: 'HealthSync: Unified Patient Care Platform',
      role: 'Lead UX/UI Designer & Frontend Developer',
      timeline: '2024 • 6 months',
      heroImage: 'https://images.unsplash.com/photo-1667271361164-cc0588fa7190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY2NTE4NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      problem: {
        title: 'The Challenge',
        description: 'Healthcare providers were struggling with fragmented systems—patient data scattered across multiple platforms, leading to inefficient workflows and increased risk of medical errors. Clinicians spent more time navigating software than caring for patients.',
      },
      research: {
        title: 'Research & Discovery',
        insights: [
          'Interviewed 24 healthcare professionals across 6 clinics. Discovered that clinicians toggled between 5-7 different systems per patient visit.',
          'Shadowing sessions revealed 40% of appointment time was spent on data entry and system navigation.',
          'Security concerns and compliance requirements (HIPAA) were the primary barriers to system integration.',
        ],
      },
      strategy: {
        title: 'UX Strategy',
        approach: 'Created a unified dashboard that aggregates patient data from multiple sources while maintaining strict security protocols. Focused on reducing cognitive load through progressive disclosure and contextual information architecture.',
        userFlow: 'Mapped 12 core user journeys, prioritizing the most frequent: patient check-in, medical history review, prescription management, and discharge planning.',
      },
      design: {
        title: 'UI Design & Visual System',
        description: 'Designed a clean, clinical interface with high contrast for readability in bright medical environments. Established a color-coded system for priority levels and patient status, ensuring at-a-glance comprehension.',
        images: [
          'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY2NTE2OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1694878981955-1d8348e0f1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwaW50ZXJmYWNlJTIwc2NyZWVufGVufDF8fHx8MTc2NjU0Mjc3MHww&ixlib=rb-4.1.0&q=80&w=1080',
        ],
      },
      prototype: {
        title: 'Prototyping & Testing',
        description: 'Built high-fidelity prototypes in Figma with interactive flows. Conducted usability testing with 15 clinicians, iterating on navigation patterns and information density. Achieved 94% task completion rate with 30% faster workflows.',
      },
      implementation: {
        title: 'Frontend Development',
        stack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'React Query'],
        note: 'Translated designs into production-ready code with a focus on accessibility (WCAG 2.1 AA), performance optimization, and responsive design. Implemented real-time data synchronization and offline-first architecture for reliability.',
      },
      outcome: {
        metrics: [
          '58% reduction in time spent on administrative tasks',
          '92% user satisfaction score',
          'Deployed across 14 clinics',
        ],
      },
    },
    {
      title: 'Finwise: Personal Finance Management App',
      role: 'UX/UI Designer & Developer',
      timeline: '2023 • 4 months',
      heroImage: 'https://images.unsplash.com/photo-1750056393300-102f7c4b8bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzY2NTExNDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      problem: {
        title: 'The Challenge',
        description: 'Young professionals struggled to maintain financial awareness—existing tools were either too complex (enterprise-grade) or too simplistic (gamified apps with limited functionality). Users needed clarity without overwhelming detail.',
      },
      research: {
        title: 'Research & Discovery',
        insights: [
          'Surveyed 200+ millennials and Gen Z users. 73% abandoned financial apps within the first month due to complexity or lack of actionable insights.',
          'Users wanted transparency in their spending patterns but felt intimidated by traditional budgeting methods.',
          'Mobile-first usage was critical—85% of users checked their finances on-the-go.',
        ],
      },
      strategy: {
        title: 'UX Strategy',
        approach: 'Designed a progressive onboarding system that adapts to user financial literacy. Implemented smart categorization with AI-assisted tagging and personalized insights that evolve with user behavior.',
        userFlow: 'Simplified the mental model: Connect → Review → Understand → Act. Each screen supports one primary action to reduce decision fatigue.',
      },
      design: {
        title: 'UI Design & Visual System',
        description: 'Created a calming, trustworthy visual language using soft gradients and rounded corners. Implemented data visualization that tells stories—transforming numbers into meaningful narratives.',
        images: [
          'https://images.unsplash.com/photo-1602128110234-2d11c0aaadfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2NjQ0NjQ0NXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1703355685639-d558d1b0f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNpZ24lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY2NDU3NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        ],
      },
      prototype: {
        title: 'Prototyping & Testing',
        description: 'Rapid prototyping with micro-interactions that provide immediate feedback. A/B tested notification strategies—opt-in, contextual nudges outperformed scheduled reminders by 3x.',
      },
      implementation: {
        title: 'Frontend Development',
        stack: ['React Native', 'TypeScript', 'Recharts', 'Expo', 'Redux Toolkit'],
        note: 'Built cross-platform mobile app with native performance. Implemented secure banking API integrations with end-to-end encryption. Optimized for low-bandwidth scenarios with intelligent caching.',
      },
      outcome: {
        metrics: [
          '4.7 star rating on App Store',
          '67% user retention after 3 months',
          '12K+ active users',
        ],
      },
    },
  ];

  const exploratoryItems = [
    {
      title: 'Morphic Button States',
      category: 'UI Components',
      imageUrl: 'https://images.unsplash.com/photo-1689267166710-3875ccf73d64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYnV0dG9uJTIwZGVzaWdufGVufDF8fHx8MTc2NjU0Mjc3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Exploring organic state transitions for interactive elements',
    },
    {
      title: 'AI-Generated Textures',
      category: 'Generative AI',
      imageUrl: 'https://images.unsplash.com/photo-1610337673044-720471f83677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjY1NDI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Parametric Grid System',
      category: 'Creative Coding',
      imageUrl: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHBhdHRlcm58ZW58MXx8fHwxNzY2NTEyMTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Fluid Typography System',
      category: 'Design System',
      imageUrl: 'https://images.unsplash.com/photo-1615746363486-92cd8c5e0a90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVSSUyMGNvbXBvbmVudHN8ZW58MXx8fHwxNzY2NTQyNzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Responsive type scales with motion-driven hierarchy',
    },
    {
      title: 'Neural Network Visualization',
      category: 'Data Viz',
      imageUrl: 'https://images.unsplash.com/photo-1655271739682-61b7ce27706e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5lcmF0aXZlJTIwYXJ0fGVufDF8fHx8MTc2NjU0Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Micro-interaction Library',
      category: 'Animation',
      imageUrl: 'https://images.unsplash.com/photo-1505304451-3b3b85a91afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNvZGluZ3xlbnwxfHx8fDE3NjY1MTI4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Curated collection of purposeful UI animations',
    },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Particle Guide - Flock System */}
      <ParticleGuide />

      {/* Hero Section - Designer Introduction */}
      <section className="relative min-h-screen flex items-center justify-center px-8 z-20">
        <div className="max-w-5xl mx-auto">
          <ScrollSection entryDirection="bottom" delay={0}>
            <div className="mb-6 text-gray-500">
              <span>Available for select projects</span>
            </div>
          </ScrollSection>

          <MorphingText delay={0.05}>
            <h1 className="text-7xl mb-6 tracking-tight">
              UX/UI Designer<br />
              Frontend Developer
            </h1>
          </MorphingText>

          <ScrollSection entryDirection="bottom" delay={0.4}>
            <p className="text-2xl text-gray-600 max-w-3xl leading-relaxed">
              I design and build digital experiences where user needs drive every decision. 
              From research to production code, I bridge the gap between design intent and technical reality.
            </p>
          </ScrollSection>

          <ScrollSection entryDirection="bottom" delay={0.6}>
            <div className="mt-12 flex gap-6">
              <motion.a
                href="#case-studies"
                className="px-8 py-4 rounded-full bg-black text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Case Studies
              </motion.a>
              <motion.a
                href="#contact"
                className="px-8 py-4 rounded-full border border-gray-300 text-gray-700"
                whileHover={{ scale: 1.05, borderColor: '#000' }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <ScrollSection entryDirection="left">
            <h2 className="text-5xl mb-8">Design Philosophy</h2>
          </ScrollSection>
          <ScrollSection entryDirection="right" delay={0.2}>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Great design isn't about aesthetics—it's about understanding. I approach every project by first understanding the problem space, the users, and the constraints.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              My dual expertise in UX design and frontend development allows me to create solutions that are both user-centered and technically feasible. I think in systems, design with empathy, and build with precision.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-32 px-8 bg-gray-50 relative z-20">
        <div className="max-w-6xl mx-auto">
          <ScrollSection entryDirection="bottom">
            <h2 className="text-5xl mb-16">Expertise</h2>
          </ScrollSection>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: 'UX Research & Strategy',
                skills: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Information Architecture'],
              },
              {
                title: 'UI Design & Systems',
                skills: ['Visual Design', 'Design Systems', 'Prototyping', 'Interaction Design'],
              },
              {
                title: 'Frontend Development',
                skills: ['React/TypeScript', 'Responsive Design', 'Performance', 'Accessibility'],
              },
            ].map((area, index) => (
              <ScrollSection
                key={index}
                entryDirection="bottom"
                delay={index * 0.1}
              >
                <div className="backdrop-blur-sm bg-white/60 rounded-2xl border border-gray-200/60 p-8 relative z-20">
                  <h3 className="text-2xl mb-6">{area.title}</h3>
                  <ul className="space-y-3">
                    {area.skills.map((skill, i) => (
                      <motion.li
                        key={i}
                        className="text-gray-600 flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Anchor */}
      <div id="case-studies" className="h-px" />

      {/* Case Study 1 */}
      <CaseStudy {...caseStudies[0]} />

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-8 relative z-20">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Case Study 2 */}
      <CaseStudy {...caseStudies[1]} />

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-8 relative z-20">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Exploratory Gallery */}
      <section className="bg-gradient-to-b from-white to-gray-50 relative z-20">
        <ExploratoryGallery items={exploratoryItems} />
      </section>

      {/* Process Overview */}
      <section className="py-32 px-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          <ScrollSection entryDirection="bottom">
            <h2 className="text-5xl mb-16">How I Work</h2>
          </ScrollSection>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Discover & Define',
                description: 'Deep dive into user needs, business goals, and technical constraints through research and stakeholder interviews.',
              },
              {
                number: '02',
                title: 'Strategize & Structure',
                description: 'Map user journeys, define information architecture, and establish design principles that guide the solution.',
              },
              {
                number: '03',
                title: 'Design & Prototype',
                description: 'Create high-fidelity designs and interactive prototypes, testing and iterating based on user feedback.',
              },
              {
                number: '04',
                title: 'Build & Refine',
                description: 'Translate designs into production-ready code with attention to performance, accessibility, and maintainability.',
              },
            ].map((step, index) => (
              <ScrollSection
                key={index}
                entryDirection={index % 2 === 0 ? 'left' : 'right'}
                delay={0}
              >
                <div className="flex gap-8 items-start">
                  <span className="text-6xl text-gray-200">{step.number}</span>
                  <div>
                    <h3 className="text-3xl mb-4">{step.title}</h3>
                    <p className="text-xl text-gray-600">{step.description}</p>
                  </div>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-40 px-8 bg-black text-white relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <MorphingText delay={0.2}>
            <h2 className="text-7xl mb-8">Let's Collaborate</h2>
          </MorphingText>

          <ScrollSection entryDirection="bottom" delay={0.4}>
            <p className="text-2xl text-gray-400 mb-12">
              I'm currently available for select freelance projects and full-time opportunities.
            </p>
          </ScrollSection>

          <ScrollSection entryDirection="bottom" delay={0.6}>
            <div className="flex gap-6 justify-center">
              <motion.a
                href="mailto:hello@designer.com"
                className="px-8 py-4 rounded-full bg-white text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Email Me
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full border border-gray-700 text-white"
                whileHover={{ scale: 1.05, borderColor: '#fff' }}
                whileTap={{ scale: 0.95 }}
              >
                LinkedIn
              </motion.a>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-black border-t border-gray-800 relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-500">
          <p>© 2024 Portfolio</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Dribbble</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}