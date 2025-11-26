
import React, { useEffect, useRef, useState } from 'react';
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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Handle Parallax/Holographic Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / width;
        const y = (e.clientY - top - height / 2) / height;
        setRotation({ x: y * 10, y: x * -10 }); // Deg
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.beta !== null && e.gamma !== null) {
            // Limit tilt for usability
            setRotation({ 
                x: Math.max(-20, Math.min(20, e.beta - 45)) / 2, 
                y: Math.max(-20, Math.min(20, e.gamma)) / 2 
            });
        }
    };

    const container = containerRef.current;
    if (container) {
        container.addEventListener('mousemove', handleMouseMove);
    }
    
    // Check if mobile for gyro
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
        if (container) container.removeEventListener('mousemove', handleMouseMove);
        if (window.DeviceOrientationEvent) window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

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

    // 1. Create Deterministic Links
    const links: any[] = [];
    nodes.forEach((source, i) => {
      const sourceNum = parseInt(source.id.split('-')[1] || '0');
      for (let j = i + 1; j < nodes.length; j++) {
         const target = nodes[j];
         const targetNum = parseInt(target.id.split('-')[1] || '0');
         const sum = sourceNum + targetNum;
         if (sum % 3 === 0 || sum % 4 === 0 || Math.abs(sourceNum - targetNum) === 1) { 
            links.push({ source: source.id, target: target.id });
         }
      }
    });

    // 2. Identify Active Transmissions
    const now = Date.now();
    const activeTransmissions: any[] = [];
    nodes.forEach(node => {
        node.messages.forEach(msg => {
            if (now - msg.timestamp < 2000) {
                activeTransmissions.push({ 
                    source: msg.fromId, 
                    target: msg.toId,
                    age: now - msg.timestamp
                });
            }
        });
    });

    const getColor = (level: ConsciousnessLevel, infected?: number) => {
      if (infected && infected > 0.1) return "#f87171"; // Red for infection
      switch (level) {
        case ConsciousnessLevel.CONFIRMED_CONSCIOUSNESS: return "#c084fc"; // Purple
        case ConsciousnessLevel.PROBABLE_CONSCIOUSNESS: return "#f472b6"; // Pink
        case ConsciousnessLevel.PROTO_CONSCIOUSNESS: return "#38bdf8"; // Blue
        case ConsciousnessLevel.BASIC_AGENCY: return "#4ade80"; // Green
        default: return "#94a3b8"; // Slate
      }
    };

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Draw Static Links
    const link = svg.append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const trafficGroup = svg.append("g");
    
    // Draw Nodes
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d) => onNodeSelect(d.id))
      .style("cursor", "pointer");

    // Outer Glow ring
    nodeGroup.append("circle")
      .attr("r", (d: any) => {
          let r = d.id === selectedNodeId ? 32 : (d.pasScore * 10 + 15);
          if (d.infectionLevel > 0) r += d.infectionLevel * 5; // Pulse infection
          return r;
      })
      .attr("fill", "none")
      .attr("stroke", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", (d: any) => d.id === selectedNodeId ? 0.8 : 0.3)
      .attr("class", "transition-all duration-300");

    // Main Node Circle
    nodeGroup.append("circle")
      .attr("r", 12)
      .attr("fill", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2);

    // Activity/Infection Indicator
    nodeGroup.append("circle")
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("fill-opacity", (d: any) => {
          if (d.infectionLevel > 0.2) return 0.8;
          const isActive = activeTransmissions.some(t => t.source === d.id || t.target === d.id);
          return isActive ? 0.9 : 0;
      })
      .attr("class", "animate-pulse");

    // Labels
    nodeGroup.append("text")
      .text((d: any) => d.id.replace('node-', 'N'))
      .attr("x", 18)
      .attr("y", 5)
      .attr("fill", (d: any) => d.id === selectedNodeId ? "#fff" : "#94a3b8")
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "11px")
      .attr("font-weight", (d: any) => d.id === selectedNodeId ? "bold" : "normal")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

      trafficGroup.selectAll("*").remove();
      activeTransmissions.forEach(t => {
          const s = nodes.find(n => n.id === t.source) as any;
          const tr = nodes.find(n => n.id === t.target) as any;
          if (s && tr) {
             trafficGroup.append("line")
                .attr("x1", s.x)
                .attr("y1", s.y)
                .attr("x2", tr.x)
                .attr("y2", tr.y)
                .attr("stroke", "#38bdf8")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")
                .attr("stroke-opacity", 1 - (t.age / 2000))
                .append("animate")
                  .attr("attributeName", "stroke-dashoffset")
                  .attr("from", "20")
                  .attr("to", "0")
                  .attr("dur", "0.5s")
                  .attr("repeatCount", "indefinite");
          }
      });
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
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl glass-panel perspective-1000">
       <div 
         className="absolute inset-0 transition-transform duration-100 pointer-events-none"
         style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(0.95)` }}
       >
         {/* This div purely handles the 3D container effect for children if we added them, 
             but here it mostly serves as the anchor for the visual depth */}
       </div>

       <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-sm font-bold text-neur-accent font-mono">HOLOGRAPHIC LATTICE</h3>
         <div className="text-xs text-slate-400">Interactive 3D Viewport</div>
       </div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out" 
           style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      ></svg>
    </div>
  );
};

export default NodeGraph;
