import { motion, useReducedMotion } from 'motion/react';

interface ProjectCardProps {
  title: string;
  intent: string;
  role: string;
  imageUrl: string;
  tags: string[];
  onOpen: () => void;
  delay?: number;
}

export function ProjectCard({
  title,
  intent,
  role,
  imageUrl,
  tags,
  onOpen,
  delay = 0,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.38,
        delay,
        ease: 'easeOut',
      }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        className="w-full text-left border-t border-pale py-8 focus:outline-none"
        whileHover={
          shouldReduceMotion
            ? undefined
            : { x: 6, transition: { duration: 0.2, ease: 'easeOut' } }
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-6 items-start">
          <div className="border border-pale bg-pure">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-24 object-cover"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 type-meta text-dark">
              <span className="type-meta uppercase">Project</span>
              <span className="type-meta">•</span>
              <span className="type-meta">{role}</span>
            </div>
            <h3 className="type-display-m text-ink">{title}</h3>
            <p className="type-body text-dark max-w-2xl">{intent}</p>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <span key={index} className="type-micro uppercase text-dark">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <span className="type-meta text-accent uppercase">Open</span>
        </div>
      </motion.button>
    </motion.div>
  );
}
