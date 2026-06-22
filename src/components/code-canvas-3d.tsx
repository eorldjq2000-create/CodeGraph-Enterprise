/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useRef, useCallback } from "react";
import * as THREE from "three";
import { GraphData, getColorForExtension } from "@/lib/mcp/cypher";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export function CodeCanvas3D({ 
  data, onNodeClick, onNodeRightClick,
  activeDirs, activeNodes, activeEdges,
  selectedNodes = new Set()
}: { 
  data: GraphData, onNodeClick?: (node: any, event: MouseEvent) => void, onNodeRightClick?: (node: any, event: MouseEvent) => void,
  activeDirs: Set<string>, activeNodes: Set<string>, activeEdges: Set<string>,
  selectedNodes?: Set<string>
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
    const isSelected = selectedNodes.has(node.id);

    const scale = isHighlighted ? (isSelected ? 1.5 : 1) : 0.3;
    const opacity = isHighlighted ? 0.6 : 0.05;
    const coreOpacity = isHighlighted ? 1 : 0.1;

    const group = new THREE.Group();
    
    const coreGeometry = new THREE.SphereGeometry(size * scale, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: isSelected ? 0xffffff : 0xffffff, transparent: true, opacity: coreOpacity });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    const glowGeometry = new THREE.SphereGeometry(size * (isSelected ? 2.2 : 1.8) * scale, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(isSelected ? "#ff0055" : color), 
      transparent: true, 
      opacity: isSelected ? 0.9 : opacity, 
      blending: THREE.AdditiveBlending,
      depthWrite: false 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    if (isSelected) {
      const ringGeometry = new THREE.RingGeometry(size * scale * 2.5, size * scale * 2.8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff0055, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.lookAt(new THREE.Vector3(0, 0, 1));
      group.add(ring);
    }

    return group;
  }, [nodeColor, activeDirs, activeNodes, selectedNodes]);

  const handleNodeDragEnd = useCallback((node: any) => {
    node.fx = node.x;
    node.fy = node.y;
    node.fz = node.z;
  }, []);

  const linkVisibility = useCallback((link: any) => {
    const sNode = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
    const tNode = typeof link.target === 'object' ? link.target : data.nodes.find(n => n.id === link.target);
    
    const sourceDirMatch = activeDirs.size === 0 || (sNode && sNode.dir && activeDirs.has(sNode.dir));
    const targetDirMatch = activeDirs.size === 0 || (tNode && tNode.dir && activeDirs.has(tNode.dir));
    
    const sourceNodeMatch = activeNodes.size === 0 || (sNode && sNode.nodeType && activeNodes.has(sNode.nodeType));
    const targetNodeMatch = activeNodes.size === 0 || (tNode && tNode.nodeType && activeNodes.has(tNode.nodeType));

    const edgeTypeMatch = activeEdges.size === 0 || activeEdges.has(link.edgeType);

    if (activeDirs.size > 0 && (!sourceDirMatch && !targetDirMatch)) return false;
    if (activeNodes.size > 0 && (!sourceNodeMatch && !targetNodeMatch)) return false;
    if (!edgeTypeMatch) return false;
    
    return true;
  }, [activeDirs, activeNodes, activeEdges, data]);

  const linkWidth = useCallback((link: any) => {
    const sNode = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
    const tNode = typeof link.target === 'object' ? link.target : data.nodes.find(n => n.id === link.target);
    
    const sourceDirMatch = activeDirs.size === 0 || (sNode && sNode.dir && activeDirs.has(sNode.dir));
    const targetDirMatch = activeDirs.size === 0 || (tNode && tNode.dir && activeDirs.has(tNode.dir));
    
    const sourceNodeMatch = activeNodes.size === 0 || (sNode && sNode.nodeType && activeNodes.has(sNode.nodeType));
    const targetNodeMatch = activeNodes.size === 0 || (tNode && tNode.nodeType && activeNodes.has(tNode.nodeType));

    const fullyHighlighted = (activeDirs.size === 0 || (sourceDirMatch && targetDirMatch)) && 
                             (activeNodes.size === 0 || (sourceNodeMatch && targetNodeMatch));

    return fullyHighlighted ? 2.5 : 0.3;
  }, [activeDirs, activeNodes, data]);

  const linkColor = useCallback((link: any) => {
    const sNode = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
    const tNode = typeof link.target === 'object' ? link.target : data.nodes.find(n => n.id === link.target);
    
    const sourceDirMatch = activeDirs.size === 0 || (sNode && sNode.dir && activeDirs.has(sNode.dir));
    const targetDirMatch = activeDirs.size === 0 || (tNode && tNode.dir && activeDirs.has(tNode.dir));
    
    const sourceNodeMatch = activeNodes.size === 0 || (sNode && sNode.nodeType && activeNodes.has(sNode.nodeType));
    const targetNodeMatch = activeNodes.size === 0 || (tNode && tNode.nodeType && activeNodes.has(tNode.nodeType));

    const fullyHighlighted = (activeDirs.size === 0 || (sourceDirMatch && targetDirMatch)) && 
                             (activeNodes.size === 0 || (sourceNodeMatch && targetNodeMatch));

    const opacity = fullyHighlighted ? 1.0 : 0.1;

    if (link.color === 'green') return `rgba(0, 255, 136, ${opacity})`;
    if (link.color === 'purple') return `rgba(176, 66, 255, ${opacity})`;
    if (link.color === 'cyan') return `rgba(0, 229, 255, ${opacity})`;
    if (link.color === 'orange') return `rgba(255, 136, 0, ${opacity})`;
    if (link.color === 'blue') return `rgba(88, 166, 255, ${opacity})`;
    return `rgba(255, 255, 255, ${opacity * 0.8})`;
  }, [activeDirs, activeNodes, data]);

  return (
    <div className="w-full h-full bg-background relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        backgroundColor="#020208" // Deep space black
        nodeThreeObject={nodeThreeObject} // Glowing stars
        linkColor={linkColor} // Dynamic cluster colors
        linkVisibility={linkVisibility} // Properly hide filtered edges
        linkWidth={linkWidth} // Laser width
        linkDirectionalParticles={3} // Data flowing dots
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleSpeed={0.008}
        linkDirectionalArrowLength={0}
        nodeRelSize={6}
        enableNodeDrag={true}
        onNodeClick={onNodeClick}
        onNodeRightClick={onNodeRightClick}
        onNodeDragEnd={handleNodeDragEnd}
      />
    </div>
  );
}
