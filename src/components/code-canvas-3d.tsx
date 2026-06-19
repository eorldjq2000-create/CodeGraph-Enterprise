/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useRef, useCallback } from "react";
import { GraphData, getColorForExtension } from "@/lib/mcp/cypher";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export function CodeCanvas3D({ data, onNodeClick }: { data: GraphData, onNodeClick?: (node: any) => void }) {
  const fgRef = useRef<any>();

  const nodeColor = useCallback((node: any) => {
    // Check if dead code
    if (node.isDeadCode) return "#666666"; // Desaturated Gray
    // Check if spaghetti
    if (node.isSpaghetti) return "#FF003C"; // Neon Red
    
    return getColorForExtension(node.name || "");
  }, []);

  const nodeVal = useCallback((node: any) => {
    return node.val || 1;
  }, []);

  return (
    <div className="w-full h-full bg-background relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        nodeLabel="name"
        backgroundColor="#020208" // Deep space black
        linkDirectionalParticles={3} // Data flowing particles
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleColor={() => "#4da6ff"} // Glowing blue particles
        linkColor={() => "rgba(100, 150, 255, 0.15)"} // Faint glowing links
        linkDirectionalArrowLength={0} // Remove solid arrows for cleaner look
        nodeRelSize={6}
        enableNodeDrag={true}
        onNodeClick={onNodeClick}
      />
    </div>
  );
}
