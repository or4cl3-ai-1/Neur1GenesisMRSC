import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EchoNode, ConsciousnessLevel, TopologyMode } from '../types';

interface NodeGraphProps {
  nodes: EchoNode[];
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId: string | null;
  onLinkSelect?: (sourceId: string, targetId: string) => void;
  selectedConnection?: { source: string; target: string } | null;
  topologyMode?: TopologyMode;
}

const NodeGraph: React.FC<NodeGraphProps> = ({ 
  nodes, 
  onNodeSelect, 
  selectedNodeId, 
  onLinkSelect, 
  selectedConnection,
  topologyMode = 'lattice'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / width;
        const y = (e.clientY - top - height / 2) / height;
        setRotation({ x: y * 10, y: x * -10 });
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

  // SVG Initialization
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    svg.append("g").attr("class", "link-layer");
    svg.append("g").attr("class", "traffic-layer");
    svg.append("g").attr("class", "node-layer");

    return () => { simulationRef.current?.stop(); };
  }, []);

  // Simulation Update
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]);

    // Dynamic Link Generation based on Topology
    const links: any[] = [];
    nodes.forEach((source, i) => {
      const sourceNum = parseInt(source.id.split('-')[1] || '0');
      for (let j = i + 1; j < nodes.length; j++) {
         const target = nodes[j];
         const targetNum = parseInt(target.id.split('-')[1] || '0');
         const sum = sourceNum + targetNum;
         
         let shouldLink = false;
         if (topologyMode === 'lattice') {
             shouldLink = sum % 3 === 0 || sum % 4 === 0 || Math.abs(sourceNum - targetNum) === 1;
         } else if (topologyMode === 'ring') {
             shouldLink = Math.abs(sourceNum - targetNum) === 1 || (sourceNum === 1 && targetNum === nodes.length);
         } else if (topologyMode === 'cluster') {
             shouldLink = (sourceNum <= 4 && targetNum <= 4) || (sourceNum > 4 && targetNum > 4) || (sourceNum === 1 && targetNum === 8);
         } else if (topologyMode === 'chaos') {
             shouldLink = Math.random() > 0.8;
         }

         if (shouldLink) { 
            links.push({ source: source.id, target: target.id });
         }
      }
    });

    let simulationNodes: any[] = nodes.map(n => ({ ...n }));
    if (simulationRef.current) {
        const oldNodes = new Map(simulationRef.current.nodes().map((n: any) => [n.id, n]));
        simulationNodes = simulationNodes.map(n => {
            const old: any = oldNodes.get(n.id);
            return old ? { ...n, x: old.x, y: old.y, vx: old.vx, vy: old.vy } : n;
        });
    }

    // Force Physics based on Topology
    if (!simulationRef.current) {
        simulationRef.current = d3.forceSimulation(simulationNodes);
    }
    
    simulationRef.current.nodes(simulationNodes);
    
    const linkForce = d3.forceLink(links).id((d: any) => d.id);
    const chargeForce = d3.forceManyBody();
    const centerForce = d3.forceCenter(width / 2, height / 2);
    const collideForce = d3.forceCollide();

    // Topology Parameters
    switch (topologyMode) {
        case 'lattice':
            linkForce.distance(120);
            chargeForce.strength(-300);
            collideForce.radius(40);
            break;
        case 'cluster':
            linkForce.distance(30);
            chargeForce.strength(-100);
            collideForce.radius(15);
            simulationRef.current.force("radial", d3.forceRadial(100, width/2, height/2).strength(0.5));
            break;
        case 'ring':
            linkForce.distance(100);
            chargeForce.strength(-500);
            collideForce.radius(30);
            simulationRef.current.force("radial", d3.forceRadial(200, width/2, height/2).strength(0.8));
            break;
        case 'chaos':
            linkForce.distance(200);
            chargeForce.strength(-800);
            collideForce.radius(60);
            break;
    }

    simulationRef.current
        .force("link", linkForce)
        .force("charge", chargeForce)
        .force("center", centerForce)
        .force("collide", collideForce);
        
    simulationRef.current.alpha(0.3).restart();

    // -- RENDERING LOGIC --
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

    const linkLayer = svg.select(".link-layer");
    const linkSelection = linkLayer.selectAll(".link-group")
        .data(links, (d: any) => [d.source.id || d.source, d.target.id || d.target].sort().join('-'));

    const linkEnter = linkSelection.enter().append("g").attr("class", "link-group");
    linkEnter.append("line").attr("class", "link-hit-area").attr("stroke", "transparent").attr("stroke-width", 25).style("cursor", "pointer"); // Larger hit area for touch
    linkEnter.append("line").attr("class", "link-visible").attr("stroke", "#334155").attr("stroke-opacity", 0.4).attr("stroke-width", 1).style("pointer-events", "none");

    const allLinks = linkEnter.merge(linkSelection as any);
    
    allLinks.select(".link-hit-area").on("click", (e, d: any) => { e.stopPropagation(); if(onLinkSelect) onLinkSelect(d.source.id || d.source, d.target.id || d.target); });
    allLinks.select(".link-visible")
        .attr("stroke", (d: any) => {
            const sId = d.source.id || d.source; const tId = d.target.id || d.target;
            const isSelected = selectedConnection && ((selectedConnection.source === sId && selectedConnection.target === tId) || (selectedConnection.source === tId && selectedConnection.target === sId));
            return isSelected ? "#38bdf8" : "#334155";
        })
        .attr("stroke-width", (d: any) => {
            const sId = d.source.id || d.source; const tId = d.target.id || d.target;
            const isSelected = selectedConnection && ((selectedConnection.source === sId && selectedConnection.target === tId) || (selectedConnection.source === tId && selectedConnection.target === sId));
            return isSelected ? 3 : 1;
        });

    linkSelection.exit().remove();

    const nodeLayer = svg.select(".node-layer");
    const nodeSelection = nodeLayer.selectAll(".node-group").data(simulationNodes, (d: any) => d.id);
    const nodesEnter = nodeSelection.enter().append("g").attr("class", "node-group").style("cursor", "pointer")
        .call(d3.drag<any, any>().on("start", (e, d) => { if (!e.active) simulationRef.current?.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }).on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; }).on("end", (e, d) => { if (!e.active) simulationRef.current?.alphaTarget(0); d.fx = null; d.fy = null; }));
    
    nodesEnter.append("circle").attr("class", "glow-ring").attr("fill", "none");
    nodesEnter.append("circle").attr("class", "main-circle").attr("r", 14).attr("stroke", "#0f172a").attr("stroke-width", 2); // Slightly larger nodes for mobile
    nodesEnter.append("circle").attr("class", "activity-dot").attr("r", 4).attr("fill", "#fff");
    nodesEnter.append("text").attr("class", "label").attr("x", 20).attr("y", 6).attr("font-family", "JetBrains Mono").attr("font-size", "11px").style("pointer-events", "none");

    const allNodes = nodesEnter.merge(nodeSelection as any);
    allNodes.on("click", (e, d) => { e.stopPropagation(); onNodeSelect(d.id); }).on("mouseover", (e, d) => setHoveredNodeId(d.id)).on("mouseout", () => setHoveredNodeId(null));

    allNodes.select(".glow-ring").transition().duration(300)
      .attr("r", (d: any) => {
          let r = (d.pasScore * 10 + 15); if (d.infectionLevel > 0) r += d.infectionLevel * 5; 
          if (d.id === selectedNodeId) return 40; if (d.id === hoveredNodeId) return r + 10; return r;
      })
      .attr("stroke", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel))
      .attr("stroke-opacity", (d: any) => (d.id === selectedNodeId) ? 0.8 : (d.id === hoveredNodeId ? 0.6 : 0.3));

    allNodes.select(".main-circle").attr("fill", (d: any) => getColor(d.consciousnessLevel, d.infectionLevel));
    allNodes.select(".activity-dot").attr("fill-opacity", (d: any) => { const hasTraffic = Array.from(trafficMap.keys()).some(k => k.includes(d.id)); return (d.infectionLevel > 0.2 || hasTraffic) ? 0.9 : 0; });
    allNodes.select(".label").text((d: any) => d.id.replace('node-', 'N')).transition().duration(200).attr("x", (d: any) => (d.id === selectedNodeId || d.id === hoveredNodeId) ? 26 : 20).attr("fill", (d: any) => (d.id === selectedNodeId || d.id === hoveredNodeId) ? "#fff" : "#94a3b8").style("font-size", (d: any) => (d.id === selectedNodeId || d.id === hoveredNodeId) ? "13px" : "11px");
    
    nodeSelection.exit().remove();

    const trafficLayer = svg.select(".traffic-layer");
    const trafficData = Array.from(trafficMap.entries()).map(([key, count]) => { const [s, t] = key.split('-'); return { id: key, source: simulationNodes.find(n => n.id === s), target: simulationNodes.find(n => n.id === t), count }; }).filter(d => d.source && d.target);
    const trafficSel = trafficLayer.selectAll(".t-group").data(trafficData, (d: any) => d.id);
    const tEnter = trafficSel.enter().append("g").attr("class", "t-group");
    tEnter.append("line")
        .attr("class", "glow-line animate-flow")
        .attr("stroke", "#38bdf8")
        .attr("stroke-linecap", "round")
        .attr("filter", "url(#glow)");
    
    const tAll = tEnter.merge(trafficSel as any);
    trafficSel.exit().remove();
    
    tAll.select(".glow-line")
        .attr("stroke-width", (d: any) => Math.min(2 + d.count * 1.5, 12))
        .attr("stroke-opacity", (d: any) => Math.min(0.6 + (d.count * 0.1), 1) * 0.4)
        .style("stroke-dasharray", (d: any) => {
            const dashLen = 6;
            const gapLen = Math.max(4, 24 - d.count * 4); // Frequent: more messages = smaller gaps
            return `${dashLen} ${gapLen}`;
        })
        .style("animation-duration", (d: any) => {
            return `${Math.max(0.4, 2 - d.count * 0.2)}s`; // Faster animation for higher frequency
        });

    simulationRef.current.on("tick", () => {
        allLinks.select(".link-visible").attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
        allLinks.select(".link-hit-area").attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
        allNodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        tAll.select(".glow-line").attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
    });

  }, [nodes, selectedNodeId, onNodeSelect, selectedConnection, hoveredNodeId, topologyMode]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl glass-panel perspective-1000 touch-none">
       <div className="absolute inset-0 transition-transform duration-100 pointer-events-none" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(0.95)` }}></div>
       <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-sm font-bold text-neur-accent font-mono">HOLOGRAPHIC LATTICE</h3>
         <div className="text-xs text-slate-400">Topology: {topologyMode.toUpperCase()}</div>
       </div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out touch-none" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, touchAction: 'none' }}></svg>
    </div>
  );
};

export default NodeGraph;