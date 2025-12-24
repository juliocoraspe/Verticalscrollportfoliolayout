import { motion } from 'motion/react';
import { ScrollSection } from './ScrollSection';
import { GlassCard } from './GlassCard';

interface CaseStudyProps {
  title: string;
  role: string;
  timeline: string;
  heroImage: string;
  problem: {
    title: string;
    description: string;
  };
  research: {
    title: string;
    insights: string[];
  };
  strategy: {
    title: string;
    approach: string;
    userFlow?: string;
  };
  design: {
    title: string;
    description: string;
    images: string[];
  };
  prototype: {
    title: string;
    description: string;
  };
  implementation: {
    title: string;
    stack: string[];
    note: string;
  };
  outcome: {
    metrics: string[];
  };
}

export function CaseStudy({
  title,
  role,
  timeline,
  heroImage,
  problem,
  research,
  strategy,
  design,
  prototype,
  implementation,
  outcome,
}: CaseStudyProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-32 relative z-20">
      {/* Hero Section */}
      <ScrollSection entryDirection="bottom" delay={0}>
        <div className="mb-16">
          <div className="flex gap-8 text-sm text-gray-500 mb-6">
            <span>{role}</span>
            <span>•</span>
            <span>{timeline}</span>
          </div>
          <h2 className="text-6xl mb-12 max-w-4xl">{title}</h2>
        </div>
      </ScrollSection>

      {/* Hero Image */}
      <ScrollSection entryDirection="scale" delay={0.2}>
        <GlassCard className="p-0 mb-32 overflow-hidden">
          <motion.img
            src={heroImage}
            alt={title}
            className="w-full h-[500px] object-cover"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </GlassCard>
      </ScrollSection>

      {/* Problem Definition */}
      <div className="grid grid-cols-12 gap-8 mb-32">
        <ScrollSection entryDirection="left" className="col-span-4">
          <h3 className="text-xl text-gray-500 sticky top-32">{problem.title}</h3>
        </ScrollSection>
        <ScrollSection entryDirection="right" delay={0.2} className="col-span-8">
          <p className="text-2xl leading-relaxed">{problem.description}</p>
        </ScrollSection>
      </div>

      {/* Research & Insights */}
      <div className="grid grid-cols-12 gap-8 mb-32">
        <ScrollSection entryDirection="left" className="col-span-4">
          <h3 className="text-xl text-gray-500 sticky top-32">{research.title}</h3>
        </ScrollSection>
        <div className="col-span-8 space-y-6">
          {research.insights.map((insight, index) => (
            <ScrollSection key={index} entryDirection="right" delay={index * 0.1}>
              <GlassCard className="p-8">
                <p className="text-lg">{insight}</p>
              </GlassCard>
            </ScrollSection>
          ))}
        </div>
      </div>

      {/* UX Strategy */}
      <div className="grid grid-cols-12 gap-8 mb-32">
        <ScrollSection entryDirection="left" className="col-span-4">
          <h3 className="text-xl text-gray-500 sticky top-32">{strategy.title}</h3>
        </ScrollSection>
        <ScrollSection entryDirection="right" delay={0.2} className="col-span-8">
          <p className="text-xl leading-relaxed mb-8">{strategy.approach}</p>
          {strategy.userFlow && (
            <div className="text-gray-600 italic">{strategy.userFlow}</div>
          )}
        </ScrollSection>
      </div>

      {/* UI Design & Visual System */}
      <div className="mb-32">
        <ScrollSection entryDirection="bottom">
          <h3 className="text-xl text-gray-500 mb-12">{design.title}</h3>
        </ScrollSection>
        <ScrollSection entryDirection="scale" delay={0.2}>
          <p className="text-xl mb-12 max-w-3xl">{design.description}</p>
        </ScrollSection>
        <div className="grid grid-cols-2 gap-8">
          {design.images.map((image, index) => (
            <ScrollSection
              key={index}
              entryDirection={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.15}
            >
              <GlassCard className="p-0 overflow-hidden">
                <img src={image} alt={`Design ${index + 1}`} className="w-full h-80 object-cover" />
              </GlassCard>
            </ScrollSection>
          ))}
        </div>
      </div>

      {/* Prototyping */}
      <div className="grid grid-cols-12 gap-8 mb-32">
        <ScrollSection entryDirection="left" className="col-span-4">
          <h3 className="text-xl text-gray-500 sticky top-32">{prototype.title}</h3>
        </ScrollSection>
        <ScrollSection entryDirection="right" delay={0.2} className="col-span-8">
          <p className="text-xl leading-relaxed">{prototype.description}</p>
        </ScrollSection>
      </div>

      {/* Implementation */}
      <div className="grid grid-cols-12 gap-8 mb-32">
        <ScrollSection entryDirection="left" className="col-span-4">
          <h3 className="text-xl text-gray-500 sticky top-32">{implementation.title}</h3>
        </ScrollSection>
        <div className="col-span-8">
          <ScrollSection entryDirection="right" delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-6">
              {implementation.stack.map((tech, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </ScrollSection>
          <ScrollSection entryDirection="right" delay={0.3}>
            <p className="text-gray-600">{implementation.note}</p>
          </ScrollSection>
        </div>
      </div>

      {/* Outcome */}
      <ScrollSection entryDirection="bottom">
        <div className="grid grid-cols-3 gap-6">
          {outcome.metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-md bg-white/40 rounded-2xl border border-gray-200/60 p-8 text-center relative z-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <p className="text-lg">{metric}</p>
            </motion.div>
          ))}
        </div>
      </ScrollSection>
    </div>
  );
}