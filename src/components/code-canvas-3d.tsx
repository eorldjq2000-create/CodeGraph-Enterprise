/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useRef, useCallback } from "react";
import * as THREE from "three";
import { GraphData, getColorForExtension } from "@/lib/mcp/cypher";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export function CodeCanvas3D({ data, onNodeClick }: { data: GraphData, onNodeClick?: (node: any) => void }) {
  const fgRef = useRef<any>();

  const nodeColor = useCallback((node: any) => {
    if (node.clusterColor === 'green') return "#00ff88";
    if (node.clusterColor === 'purple') return "#b042ff";
    if (node.clusterColor === 'cyan') return "#00e5ff";
    if (node.clusterColor === 'orange') return "#ff8800";
    
    // Check if dead code
    if (node.isDeadCode) return "#666666"; 
    // Check if spaghetti
    if (node.isSpaghetti) return "#FF003C"; 
    
    return getColorForExtension(node.name || "");
  }, []);

  const nodeThreeObject = useCallback((node: any) => {
    const color = nodeColor(node);
    const size = (node.val || 1);
    
    const group = new THREE.Group();
    
    // Core of the star (bright white)
    const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Glowing aura (colored, transparent, additive blending)
    const glowGeometry = new THREE.SphereGeometry(size * 1.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(color), 
      transparent: true, 
      opacity: 0.5, 
      blending: THREE.AdditiveBlending,
      depthWrite: false 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    return group;
  }, [nodeColor]);

  const handleNodeDragEnd = useCallback((node: any) => {
    // Pin node position after dragging so it stays where you pulled it
    node.fx = node.x;
    node.fy = node.y;
    node.fz = node.z;
  }, []);

  const linkColor = useCallback((link: any) => {
    if (link.color === 'green') return "rgba(0, 255, 136, 0.25)";
    if (link.color === 'purple') return "rgba(176, 66, 255, 0.25)";
    if (link.color === 'cyan') return "rgba(0, 229, 255, 0.25)";
    if (link.color === 'orange') return "rgba(255, 136, 0, 0.25)";
    return "rgba(255, 255, 255, 0.1)";
  }, []);

  return (
    <div className="w-full h-full bg-background relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        backgroundColor="#020208" // Deep space black
        nodeThreeObject={nodeThreeObject} // Glowing stars
        linkColor={linkColor} // Dynamic cluster colors
        linkWidth={0.2} // Very thin, lots of overlapping lines
        linkDirectionalArrowLength={0}
        nodeRelSize={6}
        enableNodeDrag={true}
        onNodeClick={onNodeClick}
        onNodeDragEnd={handleNodeDragEnd}
      />
    </div>
  );
}
