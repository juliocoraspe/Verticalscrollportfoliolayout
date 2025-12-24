import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  delay?: number;
  layout?: 'horizontal' | 'vertical';
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  tags,
  delay = 0,
  layout = 'horizontal',
}: ProjectCardProps) {
  return (
    <GlassCard delay={delay} className="p-0">
      <div className={`flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
        {/* Image Section with Reveal Mask */}
        <motion.div
          className={`relative overflow-hidden ${
            layout === 'horizontal' ? 'w-1/2' : 'w-full h-64'
          }`}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 1.2,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{
              duration: 1.5,
              delay: delay + 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
        </motion.div>

        {/* Content Section */}
        <div className={`p-8 ${layout === 'horizontal' ? 'w-1/2' : 'w-full'} flex flex-col justify-center`}>
          <motion.h3
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{
              duration: 0.8,
              delay: delay + 0.4,
              ease: 'easeOut',
            }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{
              duration: 0.8,
              delay: delay + 0.5,
              ease: 'easeOut',
            }}
          >
            {description}
          </motion.p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 rounded-full bg-gray-100/60 text-gray-700 text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.5,
                  delay: delay + 0.6 + index * 0.1,
                  ease: 'easeOut',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
