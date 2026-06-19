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
    // Check if dead code
    if (node.isDeadCode) return "#666666"; // Desaturated Gray
    // Check if spaghetti
    if (node.isSpaghetti) return "#FF003C"; // Neon Red
    
    return getColorForExtension(node.name || "");
  }, []);

  const nodeVal = useCallback((node: any) => {
    return node.val || 1;
  }, []);

  const nodeThreeObject = useCallback((node: any) => {
    const color = nodeColor(node);
    const size = (node.val || 1) * 1.5;
    
    // Create a circular glowing canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white core
      gradient.addColorStop(0.3, color); // Node color aura
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade out
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture, 
      color: 0xffffff, 
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, 1);
    return sprite;
  }, [nodeColor]);

  return (
    <div className="w-full h-full bg-background relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        nodeLabel="name"
        backgroundColor="#020208" // Deep space black
        nodeThreeObject={nodeThreeObject} // Glowing stars
        linkDirectionalParticles={3} // Data flowing particles
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleColor={() => "#80c0ff"} // Glowing blue particles
        linkColor={() => "rgba(180, 220, 255, 0.4)"} // Brighter, more visible links
        linkWidth={1.5} // Thicker links
        linkDirectionalArrowLength={0} // Remove solid arrows for cleaner look
        nodeRelSize={6}
        enableNodeDrag={true}
        onNodeClick={onNodeClick}
      />
    </div>
  );
}
