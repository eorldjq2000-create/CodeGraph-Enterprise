/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useRef, useCallback } from "react";
import { GraphData, getColorForExtension } from "@/lib/mcp/cypher";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export function CodeCanvas3D({ data }: { data: GraphData }) {
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
        backgroundColor="rgba(0,0,0,0)" // Transparent to inherit background
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        enableNodeDrag={false}
      />
    </div>
  );
}
