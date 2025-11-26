
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EchoNode, ConsciousnessLevel } from '../types';

interface NodeGraphProps {
  nodes: EchoNode[];
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId: string | null;
  onLinkSelect?: (sourceId: string, targetId: string) => void;
  selectedConnection?: { source: string; target: string } | null;
}

const NodeGraph: React.FC<NodeGraphProps> = ({ nodes, onNodeSelect, selectedNodeId, onLinkSelect, selectedConnection }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep simulation ref to prevent restarting physics on every render
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
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
    
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
        if (container) container.removeEventListener('mousemove', handleMouseMove);
        if (window.DeviceOrientationEvent) window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Initialize SVG Structure (Run Once)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    // Clear legacy elements if any
    svg.selectAll("*").remove();

    // Definitions (Glow)
    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
    
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create Groups for Layering
    svg.append("g").attr("class", "link-layer");
    svg.append("g").attr("class", "traffic-layer");
    svg.append("g").attr("class", "node-layer");

    return () => {
        simulationRef.current?.stop();
    };
  }, []);

  // Handle Data Updates & Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]);

    // 1. Identify Links
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

    // 2. Map new data to existing simulation nodes to preserve position/velocity
    let simulationNodes: any[] = nodes.map(n => ({ ...n }));
    if (simulationRef.current) {
        const oldNodes = new Map(simulationRef.current.nodes().map((n: any) => [n.id, n]));
        simulationNodes = simulationNodes.map(n => {
            const old: any = oldNodes.get(n.id);
            if (old) {
                return { ...n, x: old.x, y: old.y, vx: old.vx, vy: old.vy };
            }
            return n;
        });
    }

    // 3. Update or Initialize Simulation
    if (!simulationRef.current) {
        simulationRef.current = d3.forceSimulation(simulationNodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(40));
    } else {
        simulationRef.current.nodes(simulationNodes);
        (simulationRef.current.force("link") as d3.ForceLink<any, any>).links(links);
        simulationRef.current.alpha(0.1).restart(); // Gentle heat
    }

    // 4. Traffic Calculation
    const now = Date.now();
    const trafficMap = new Map<string, number>();
    nodes.forEach(node => {
        node.messages.forEach(msg => {
            if (now - msg.timestamp < 4000) {
                const ids = [msg.fromId, msg.toId].sort().join('-');
                trafficMap.set(ids, (trafficMap.get(ids) || 0) + 1);
            }
        });
    });

    const getColor = (level: ConsciousnessLevel, infected?: number) => {
      if (infected && infected > 0.1) return "#f87171";
      switch (level) {
        case ConsciousnessLevel.CONFIRMED_CONSCIOUSNESS: return "#c084fc";
        case ConsciousnessLevel.PROBABLE_CONSCIOUSNESS: return "#f472b6";
        case ConsciousnessLevel.PROTO_CONSCIOUSNESS: return "#38bdf8";
        case ConsciousnessLevel.BASIC_AGENCY: return "#4ade80";
        default: return "#94a3b8";
      }
    };

    // 5. Render Links
    const linkLayer = svg.select(".link-layer");
    const linkSelection = linkLayer.selectAll(".link-group")
        .data(links, (d: any) => [d.source.id || d.source, d.target.id || d.target].sort().join('-'));

    const linkEnter = linkSelection.enter().append("g").attr("class", "link-group");
    
    // Invisible wide hit area for clicks
    linkEnter.append("line")
        .attr("class", "link-hit-area")
        .attr("stroke", "transparent")
        .attr("stroke-width", 15)
        .style("cursor", "pointer");

    // Visible line
    linkEnter.append("line")
        .attr("class", "link-visible")
        .attr("stroke", "#334155")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1)
        .style("pointer-events", "none");

    const allLinks = linkEnter.merge(linkSelection as any);
    
    allLinks.select(".link-hit-area")
        .on("click", (e, d: any) => {
            e.stopPropagation();
            if (onLinkSelect) {
                onLinkSelect(d.source.id || d.source, d.target.id || d.target);
            }
        });

    allLinks.select(".link-visible")
        .attr("stroke", (d: any) => {
            const sId = d.source.id || d.source;
            const tId = d.target.id || d.target;
            const isSelected = selectedConnection && 
               ((selectedConnection.source === sId && selectedConnection.target === tId) || 
                (selectedConnection.source === tId && selectedConnection.target === sId));
            return isSelected ? "#38bdf8" : "#334155";
        })
        .attr("stroke-opacity", (d: any) => {
             const sId = d.source.id || d.source;
             const tId = d.target.id || d.target;
             const isSelected = selectedConnection && 
                ((selectedConnection.source === sId && selectedConnection.target === tId) || 
                 (selectedConnection.source === tId && selectedConnection.target === sId));
             return isSelected ? 0.8 : 0.4;
        })
        .attr("stroke-width", (d: any) => {
            const sId = d.source.id || d.source;
            const tId = d.target.id || d.target;
            const isSelected = selectedConnection && 
               ((selectedConnection.source === sId && selectedConnection.target === tId) || 
                (selectedConnection.source === tId && selectedConnection.target === sId));
            return isSelected ? 2 : 1;
        });

    linkSelection.exit().remove();

    // 6. Render Nodes with Join Pattern
    const nodeLayer = svg.select(".node-layer");
    const nodeSelection = nodeLayer.selectAll(".node-group")
        .data(simulationNodes, (d: any) => d.id);

    const nodesEnter = nodeSelection.enter().append("g")
        .attr("class", "node-group")
        .style("cursor", "pointer")
        .call(d3.drag<any, any>()
            .on("start", (e, d) => {
                if (!e.active) simulationRef.current?.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (e, d) => {
                d.fx = e.x;
                d.fy = e.y;
            })
            .on("end", (e, d) => {
                if (!e.active) simulationRef.current?.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            })
        );
    
    // Add visual elements to new nodes
    nodesEnter.append("circle").attr("class", "glow-ring").attr("fill", "none");
    nodesEnter.append("circle").attr("class", "main-circle").attr("r", 12).attr("stroke", "#0f172a").attr("stroke-width", 2);
    nodesEnter.append("circle").attr("class", "activity-dot").attr("r", 4).attr("fill", "#fff");
    nodesEnter.append("text").attr("class", "label").attr("x", 18).attr("y", 5).attr("font-family", "JetBrains Mono").attr("font-size", "11px").style("pointer-events", "none");

    const allNodes = nodesEnter.merge(nodeSelection as any);
    
    // Update Click Handler & Attributes
    allNodes.on("click", (e, d) => {
        e.stopPropagation();
        onNodeSelect(d.id);
    });

    allNodes.select(".glow-ring")
      .transition().duration(300)
      .attr("r", (d: any) => {
          let r = d.id === selectedNodeId ? 32 : (d.pasScore * 10 + 15);
          if (d.infectionLevel > 0) r += d.infectionLevel * 5; 
          return r;
      })
      .attr("stroke", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", (d: any) => d.id === selectedNodeId ? 0.8 : 0.3);

    allNodes.select(".main-circle")
      .attr("fill", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel));

    allNodes.select(".activity-dot")
      .attr("fill-opacity", (d: any) => {
          const hasTraffic = Array.from(trafficMap.keys()).some(k => k.includes(d.id));
          return (d.infectionLevel > 0.2 || hasTraffic) ? 0.9 : 0;
      })
      .attr("class", (d: any) => (d.infectionLevel > 0.2 || Array.from(trafficMap.keys()).some(k => k.includes(d.id))) ? "activity-dot animate-pulse" : "activity-dot");

    allNodes.select(".label")
      .text((d: any) => d.id.replace('node-', 'N'))
      .attr("fill", (d: any) => d.id === selectedNodeId ? "#fff" : "#94a3b8")
      .attr("font-weight", (d: any) => d.id === selectedNodeId ? "bold" : "normal");

    nodeSelection.exit().remove();

    // 7. Render Traffic (Update Cycle)
    // Map traffic data to source/target nodes for positioning
    const trafficData = Array.from(trafficMap.entries()).map(([key, count]) => {
        const [s, t] = key.split('-');
        return { 
            id: key,
            source: simulationNodes.find(n => n.id === s), 
            target: simulationNodes.find(n => n.id === t),
            count 
        };
    }).filter(d => d.source && d.target);

    const trafficLayer = svg.select(".traffic-layer");
    const trafficSel = trafficLayer.selectAll(".t-group").data(trafficData, (d: any) => d.id);
    
    const tEnter = trafficSel.enter().append("g").attr("class", "t-group");
    tEnter.append("line").attr("class", "glow-line").attr("stroke", "#38bdf8").attr("stroke-linecap", "round").attr("filter", "url(#glow)");
    tEnter.append("line").attr("class", "core-line").attr("stroke", "#e0f2fe").attr("stroke-linecap", "round");

    const tAll = tEnter.merge(trafficSel as any);
    trafficSel.exit().remove();

    // Update traffic style
    tAll.select(".glow-line")
        .attr("stroke-width", (d: any) => Math.min(2 + d.count * 1.5, 12))
        .attr("stroke-opacity", (d: any) => Math.min(0.6 + (d.count * 0.1), 1) * 0.4);

    tAll.select(".core-line")
        .attr("stroke-width", (d: any) => (Math.min(2 + d.count * 1.5, 12) > 6 ? 3 : 1.5))
        .attr("stroke-dasharray", (d: any) => `${8 + d.count * 4}, 8`)
        // Simple manual animation fallback if needed, but CSS is usually better for dashoffset
        .append("animate")
          .attr("attributeName", "stroke-dashoffset")
          .attr("from", "32")
          .attr("to", "0")
          .attr("dur", "0.5s") 
          .attr("repeatCount", "indefinite");

    // 8. Tick Handler
    simulationRef.current.on("tick", () => {
        allLinks.select(".link-visible")
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        allLinks.select(".link-hit-area")
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        allNodes
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

        tAll.select(".glow-line")
            .attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
            
        tAll.select(".core-line")
            .attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
    });

  }, [nodes, selectedNodeId, onNodeSelect, selectedConnection]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl glass-panel perspective-1000">
       <div 
         className="absolute inset-0 transition-transform duration-100 pointer-events-none"
         style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(0.95)` }}
       ></div>
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
