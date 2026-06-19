/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useRef, useCallback } from "react";
import * as THREE from "three";
import { GraphData, getColorForExtension } from "@/lib/mcp/cypher";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export function CodeCanvas3D({ 
  data, onNodeClick, 
  activeDirs, activeNodes, activeEdges 
}: { 
  data: GraphData, onNodeClick?: (node: any) => void, 
  activeDirs: Set<string>, activeNodes: Set<string>, activeEdges: Set<string> 
}) {
  const fgRef = useRef<any>();

  const nodeColor = useCallback((node: any) => {
    if (node.clusterColor === 'green') return "#00ff88";
    if (node.clusterColor === 'purple') return "#b042ff";
    if (node.clusterColor === 'cyan') return "#00e5ff";
    if (node.clusterColor === 'orange') return "#ff8800";
    
    if (node.isDeadCode) return "#666666"; 
    if (node.isSpaghetti) return "#FF003C"; 
    
    return getColorForExtension(node.name || "");
  }, []);

  const nodeThreeObject = useCallback((node: any) => {
    const color = nodeColor(node);
    const size = (node.val || 1);
    
    const dirMatch = activeDirs.size === 0 || activeDirs.has(node.dir);
    const typeMatch = activeNodes.size === 0 || activeNodes.has(node.nodeType);
    const isHighlighted = dirMatch && typeMatch;

    const scale = isHighlighted ? 1 : 0.3; // shrink unselected
    const opacity = isHighlighted ? 0.6 : 0.05; // dim unselected
    const coreOpacity = isHighlighted ? 1 : 0.1;

    const group = new THREE.Group();
    
    const coreGeometry = new THREE.SphereGeometry(size * scale, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: coreOpacity });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    const glowGeometry = new THREE.SphereGeometry(size * 1.8 * scale, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(color), 
      transparent: true, 
      opacity: opacity, 
      blending: THREE.AdditiveBlending,
      depthWrite: false 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    return group;
  }, [nodeColor, activeDirs, activeNodes]);

  const handleNodeDragEnd = useCallback((node: any) => {
    node.fx = node.x;
    node.fy = node.y;
    node.fz = node.z;
  }, []);

  const linkColor = useCallback((link: any) => {
    const sNode = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
    const tNode = typeof link.target === 'object' ? link.target : data.nodes.find(n => n.id === link.target);
    
    const sourceDirMatch = activeDirs.size === 0 || (sNode && sNode.dir && activeDirs.has(sNode.dir));
    const targetDirMatch = activeDirs.size === 0 || (tNode && tNode.dir && activeDirs.has(tNode.dir));
    
    const sourceNodeMatch = activeNodes.size === 0 || (sNode && sNode.nodeType && activeNodes.has(sNode.nodeType));
    const targetNodeMatch = activeNodes.size === 0 || (tNode && tNode.nodeType && activeNodes.has(tNode.nodeType));

    const edgeTypeMatch = activeEdges.size === 0 || activeEdges.has(link.edgeType);

    if (activeDirs.size > 0 && (!sourceDirMatch && !targetDirMatch)) return "rgba(0,0,0,0)";
    if (activeNodes.size > 0 && (!sourceNodeMatch && !targetNodeMatch)) return "rgba(0,0,0,0)";
    if (!edgeTypeMatch) return "rgba(0,0,0,0)";
    
    const fullyHighlighted = (activeDirs.size === 0 || (sourceDirMatch && targetDirMatch)) && 
                             (activeNodes.size === 0 || (sourceNodeMatch && targetNodeMatch));

    const opacity = fullyHighlighted ? 0.25 : 0.03;

    if (link.color === 'green') return `rgba(0, 255, 136, ${opacity})`;
    if (link.color === 'purple') return `rgba(176, 66, 255, ${opacity})`;
    if (link.color === 'cyan') return `rgba(0, 229, 255, ${opacity})`;
    if (link.color === 'orange') return `rgba(255, 136, 0, ${opacity})`;
    return `rgba(255, 255, 255, ${opacity * 0.4})`;
  }, [activeDirs, activeNodes, activeEdges, data]);

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
