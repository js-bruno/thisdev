import { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useNodesState,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ProjectCard, {
  type ProjectCardData,
  type ProjectCardNode,
} from "./ProjectCard";
import { layoutGraph } from "../lib/layout";
import type { Project, ProjectLink } from "../data/projects";

const nodeTypes = { project: ProjectCard };

type Props = {
  projects: Project[];
  links: ProjectLink[];
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

const edgeColor = (kind: ProjectLink["kind"]) => {
  if (kind === "related") return "var(--border-strong)";
  if (kind === "inspired") return "var(--accent-2)";
  return "var(--accent)";
};

export default function ProjectMap({ projects, links }: Props) {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const direction = isMobile ? "TB" : "LR";
  const fitPadding = isMobile ? 0.06 : 0.22;

  const baseNodes = useMemo<ProjectCardNode[]>(
    () =>
      projects.map((project) => ({
        id: project.id,
        type: "project",
        data: project,
        position: { x: 0, y: 0 },
      })),
    [projects],
  );

  const edges = useMemo<Edge[]>(
    () =>
      links
        .filter((link) => !(isMobile && link.mobileHidden))
        .map((link) => ({
          id: link.id ?? `${link.source}-${link.target}`,
          source: link.source,
          target: link.target,
          sourceHandle: isMobile ? "source-bottom" : link.sourceHandle,
          targetHandle: isMobile ? "target-top" : link.targetHandle,
          label: link.label,
          type: "bezier",
          animated: link.kind === "uses",
          style: {
            stroke: edgeColor(link.kind),
            strokeWidth: link.kind === "uses" ? 1.7 : 1.3,
            strokeDasharray:
              link.kind === "related"
                ? "3 5"
                : link.kind === "inspired"
                  ? "7 4"
                  : undefined,
          },
          labelStyle: {
            fill: "var(--muted)",
            fontFamily: "var(--mono)",
            fontSize: 10,
          },
          labelBgStyle: {
            fill: "var(--bg-deep)",
            fillOpacity: 0.92,
          },
          labelBgPadding: [4, 6] as [number, number],
          labelBgBorderRadius: 2,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor(link.kind),
            width: 18,
            height: 18,
          },
        })),
    [links, isMobile],
  );

  const initialNodes = useMemo<ProjectCardNode[]>(
    () => layoutGraph(baseNodes, edges, direction),
    [baseNodes, edges, direction],
  );

  const [nodes, setNodes, onNodesChange] =
    useNodesState<ProjectCardNode>(initialNodes);
  const [flow, setFlow] =
    useState<ReactFlowInstance<ProjectCardNode, Edge> | null>(null);

  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    setNodes(layoutGraph(baseNodes, edges, direction));
    requestAnimationFrame(() => {
      void flow?.fitView({ padding: fitPadding });
    });
  }, [direction]);

  const reorganize = () => {
    setNodes((current) => layoutGraph(current, edges, direction));
    requestAnimationFrame(() => {
      void flow?.fitView({ padding: fitPadding });
    });
  };

  const openProject = (event: React.MouseEvent, node: ProjectCardNode) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) return;
    window.open(node.data.href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="project-map">
      <ReactFlow<ProjectCardNode, Edge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={openProject}
        onInit={setFlow}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: fitPadding }}
        minZoom={0.2}
        maxZoom={2.5}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--border)"
        />
        <Controls />

        {!isMobile && (
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) =>
              (node.data as ProjectCardData).languageColor
            }
            maskColor="rgb(10 7 8 / 0.72)"
            style={{ bottom: 32 }}
          />
        )}

        <Panel position="top-left" className="project-map-panel">
          <span>arrasta pra organizar</span>
          <button type="button" onClick={reorganize}>
            reorganizar
          </button>
        </Panel>

        <Panel position="top-right" className="project-map-legend">
          <span>
            <i className="legend-line legend-uses" /> usa / roda
          </span>
          <span>
            <i className="legend-line legend-inspired" /> inspirou
          </span>
          <span>
            <i className="legend-line legend-related" /> relacionado
          </span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
