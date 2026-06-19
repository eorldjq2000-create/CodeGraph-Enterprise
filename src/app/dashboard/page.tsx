"use client";

import React, { useState, useEffect } from 'react';
import { CodeCanvas3D } from '@/components/code-canvas-3d';
import { AnalysisPanel } from '@/components/analysis-panel';
import { GraphData } from '@/lib/mcp/cypher';

export default function DashboardPage() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    // Generate some mock data for verification purposes
    const mockNodes = [
      { id: '1', group: 1, val: 5, name: 'src/main.ts' },
      { id: '2', group: 1, val: 2, name: 'src/utils.ts' },
      { id: '3', group: 2, val: 1, name: 'config/db.json' },
      { id: '4', group: 3, val: 3, name: 'src/api/handler.go' },
      { id: '5', group: 1, val: 1, name: 'src/dead_code.ts', isDeadCode: true },
      { id: '6', group: 1, val: 10, name: 'src/spaghetti_core.ts', isSpaghetti: true },
    ];
    
    const mockLinks = [
      { source: '1', target: '2' },
      { source: '1', target: '3' },
      { source: '4', target: '3' },
      { source: '2', target: '6' },
      { source: '4', target: '6' },
      { source: '1', target: '6' },
    ];
    
    setData({ nodes: mockNodes, links: mockLinks });
  }, []);

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-background">
      <AnalysisPanel />
      <CodeCanvas3D data={data} />
    </div>
  );
}
