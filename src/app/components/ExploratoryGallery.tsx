import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ScrollSection } from './ScrollSection';

interface ExperimentItem {
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}

interface ExploratoryGalleryProps {
  items: ExperimentItem[];
}

export function ExploratoryGallery({ items }: ExploratoryGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const expandedItem = useMemo(() => {
    if (expandedIndex === null) {
      return null;
    }
    return items[expandedIndex] ?? null;
  }, [expandedIndex, items]);

  return (
    <LayoutGroup>
      <div className="w-full max-w-7xl mx-auto px-8 py-32 relative z-20">
        <ScrollSection entryDirection="bottom" motionRole="garden-grid">
          <div className="mb-20">
            <p className="type-meta text-dark uppercase mb-4">Garden</p>
            <h2 className="type-display-l text-ink mb-6" data-motion="garden-title">
              Experimental Garden
            </h2>
            <p className="type-subhead text-dark max-w-2xl">
              A curated archive of experiments exploring interaction, generative tooling, and quiet interface rituals.
            </p>
          </div>
        </ScrollSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {items.map((item, index) => (
            <ScrollSection
              key={item.title}
              entryDirection="bottom"
              delay={index * 0.05}
              motionRole="garden-grid"
            >
              <motion.button
                type="button"
                layoutId={`garden-card-${index}`}
                className="relative text-left w-full bg-pure group"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
                }
                onClick={() => setExpandedIndex(index)}
              >
                <div className="h-56 md:h-60 w-full border border-pale">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 border-t border-pale pt-4 space-y-2">
                  <p className="type-micro uppercase text-dark">{item.category}</p>
                  <h3 className="type-display-m text-ink">{item.title}</h3>
                  {item.description && (
                    <p className="type-body text-dark">{item.description}</p>
                  )}
                </div>
              </motion.button>
            </ScrollSection>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#111111]/35 flex items-center justify-center px-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              layoutId={`garden-card-${expandedIndex}`}
              className="bg-pure border border-pale max-w-3xl w-full"
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="h-80 w-full border-b border-pale">
                <img src={expandedItem.imageUrl} alt={expandedItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 space-y-4">
                <p className="type-micro uppercase text-dark">{expandedItem.category}</p>
                <h3 className="type-display-m text-ink">{expandedItem.title}</h3>
                <p className="type-body text-dark">
                  {expandedItem.description ??
                    'This experiment explores pacing, interaction weight, and visual restraint in a non-linear study.'}
                </p>
                <button
                  type="button"
                  onClick={() => setExpandedIndex(null)}
                  className="type-meta text-accent uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
