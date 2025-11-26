import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { EchoNode, ConsciousnessLevel } from '../types';

interface NodeGraphProps {
  nodes: EchoNode[];
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId: string | null;
}

const NodeGraph: React.FC<NodeGraphProps> = ({ nodes, onNodeSelect, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Create links (fully connected mesh for aesthetic, or random)
    const links: any[] = [];
    nodes.forEach((source, i) => {
      // Connect to nearest neighbors conceptually
      for (let j = i + 1; j < nodes.length; j++) {
         if (Math.random() > 0.7) { // 30% connection chance
            links.push({ source: source.id, target: nodes[j].id });
         }
      }
      // Ensure at least one link
      if (i > 0 && links.filter(l => l.source === source.id || l.target === source.id).length === 0) {
          links.push({ source: source.id, target: nodes[i-1].id });
      }
    });

    // Color scale based on consciousness
    const getColor = (level: ConsciousnessLevel) => {
      switch (level) {
        case ConsciousnessLevel.CONFIRMED_CONSCIOUSNESS: return "#c084fc"; // Purple
        case ConsciousnessLevel.PROBABLE_CONSCIOUSNESS: return "#f472b6"; // Pink
        case ConsciousnessLevel.PROTO_CONSCIOUSNESS: return "#38bdf8"; // Blue
        case ConsciousnessLevel.BASIC_AGENCY: return "#4ade80"; // Green
        default: return "#94a3b8"; // Slate
      }
    };

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d) => onNodeSelect(d.id));

    // Outer Glow ring for selected or high consciousness
    nodeGroup.append("circle")
      .attr("r", (d: any) => d.id === selectedNodeId ? 28 : (d.pasScore * 10 + 15))
      .attr("fill", "none")
      .attr("stroke", (d: any) => getColor(d.consciousnessLevel))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", (d: any) => d.id === selectedNodeId ? 1 : 0.5)
      .attr("class", "transition-all duration-300");

    // Main Node Circle
    nodeGroup.append("circle")
      .attr("r", 12)
      .attr("fill", (d: any) => getColor(d.consciousnessLevel))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Labels
    nodeGroup.append("text")
      .text((d: any) => d.id.replace('node-', 'N'))
      .attr("x", 16)
      .attr("y", 4)
      .attr("fill", "#e2e8f0")
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "10px");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, selectedNodeId, onNodeSelect]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl glass-panel">
       <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-sm font-bold text-neur-accent font-mono">SWARM TOPOLOGY</h3>
         <div className="text-xs text-slate-400">Force-Directed Layout</div>
       </div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
};

export default NodeGraph;