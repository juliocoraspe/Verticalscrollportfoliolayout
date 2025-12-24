import { motion } from 'motion/react';
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
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-32 relative z-20">
      <ScrollSection entryDirection="bottom">
        <div className="mb-20">
          <h2 className="text-6xl mb-6">Exploratory Lab</h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            A collection of experiments exploring the intersection of UX, generative AI, creative coding, and interaction design.
          </p>
        </div>
      </ScrollSection>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-3 gap-6">
        {items.map((item, index) => {
          // Create varied heights for visual interest
          const heightClass = index % 5 === 0 ? 'h-96' : index % 3 === 0 ? 'h-80' : 'h-72';
          
          return (
            <ScrollSection
              key={index}
              entryDirection={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'bottom' : 'right'}
              delay={0}
              className={index % 7 === 0 ? 'col-span-2' : ''}
            >
              <motion.div
                className={`relative rounded-2xl overflow-hidden backdrop-blur-sm bg-white/50 border border-gray-200/60 ${heightClass} group cursor-pointer z-20`}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                >
                  <span className="text-xs text-gray-300 mb-2">{item.category}</span>
                  <h3 className="text-2xl text-white mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-300">{item.description}</p>
                  )}
                </motion.div>

                {/* Category tag */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs text-gray-700">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            </ScrollSection>
          );
        })}
      </div>
    </div>
  );
}