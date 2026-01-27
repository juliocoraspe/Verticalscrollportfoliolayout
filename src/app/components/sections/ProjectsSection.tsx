import { ScrollSection } from '../ScrollSection';
import { ProjectCard } from '../ProjectCard';

type Project = {
  id: string;
  title: string;
  intent: string;
  role: string;
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: 'center' | 'top' | 'bottom';
  tags: string[];
};

type ProjectsSectionProps = {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  projectCardsStatic: boolean;
};

export function ProjectsSection({ projects, onOpenProject, projectCardsStatic }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 px-6 sm:py-32 sm:px-8 bg-pure">
      <div className="max-w-6xl mx-auto">
        <ScrollSection entryDirection="bottom" motionRole="project-grid">
          <div className="mb-16">
            <p className="type-meta text-dark uppercase mb-4">Projects</p>
            <h2 className="type-display-m type-display-m-plus text-ink mb-4">
              Focused Explorations
            </h2>
            <p className="type-subhead text-dark max-w-2xl">
              Four focused studies that explore different entry points into the design lifecycle: research-led,
              concept-driven, system-building, and refinement-focused.
            </p>
          </div>
        </ScrollSection>

        <div className="border-b border-pale">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              projectId={project.id}
              title={project.title}
              intent={project.intent}
              role={project.role}
              imageUrl={project.imageUrl}
              imageFit={project.imageFit}
              imagePosition={project.imagePosition}
              tags={project.tags}
              onOpen={onOpenProject}
              delay={index * 0.08}
              disableAnimation={projectCardsStatic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
