import { useState } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { Project } from "../data/projects";

export type ProjectCardData = Project & { dimmed?: boolean };
export type ProjectCardNode = Node<ProjectCardData, "project">;

function Preview({ project }: { project: ProjectCardData }) {
  const [hover, setHover] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const gif = project.preview;
  const poster = project.poster;
  const src = hover && gif && !gifFailed ? gif : poster;

  if (!src || posterFailed) {
    return (
      <div className="project-card-placeholder" aria-hidden="true">
        {project.title.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`preview de ${project.title}`}
      loading="eager"
      decoding="async"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onError={() => {
        if (src === gif) setGifFailed(true);
        else setPosterFailed(true);
      }}
    />
  );
}

export default function ProjectCard({ data, selected }: NodeProps<ProjectCardNode>) {
  return (
    <div
      className={[
        "project-card",
        selected ? "is-selected" : "",
        data.dimmed ? "is-dimmed" : "",
      ].join(" ")}
    >
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        className="project-card-handle"
      />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        className="project-card-handle"
      />
      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        className="project-card-handle"
        style={{ left: "35%" }}
      />
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        className="project-card-handle"
        style={{ left: "65%" }}
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        className="project-card-handle"
      />

      <div className="project-card-preview">
        <Preview project={data} />
        <span className={`project-card-status status-${data.status}`}>
          {data.status}
        </span>
      </div>

      <div className="project-card-body">
        <div className="project-card-head">
          <h3>{data.title}</h3>
          {data.stars > 0 && (
            <span className="project-card-stars">★ {data.stars}</span>
          )}
        </div>

        <p>{data.description}</p>

        <div className="project-card-meta">
          <span className="project-card-lang">
            <i style={{ background: data.languageColor }} />
            {data.language}
          </span>
          <span>{data.year}</span>
        </div>

        <div className="project-card-tags">
          {data.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="project-card-actions">
          <a
            className="nodrag"
            href={data.href}
            target="_blank"
            rel="noopener"
            aria-label={`abrir ${data.repo} no GitHub`}
          >
            github ↗
          </a>
          {data.demo && (
            <a
              className="nodrag"
              href={data.demo}
              target="_blank"
              rel="noopener"
              aria-label={`abrir demo de ${data.title}`}
            >
              demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
