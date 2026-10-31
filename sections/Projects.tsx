import ProjectCard from "@/components/ProjectCard";
import { myProjects } from "@/constants";

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative c-space section-spacing"
    >
      <p className="eyebrow">Selected work</p>
      <h2 id="projects-title" className="text-heading mt-3">
        My Projects
      </h2>
      <p className="subtext mt-3 max-w-2xl">
        Products I designed, built and shipped end to end, from the database to
        the last pixel.
      </p>
      <div className="mt-12 space-y-8">
        {myProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
