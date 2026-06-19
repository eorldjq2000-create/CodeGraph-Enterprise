"use client";

import React, { useState, useEffect } from 'react';
import { CodeCanvas3D } from '@/components/code-canvas-3d';
import { AnalysisPanel } from '@/components/analysis-panel';
import { GraphData } from '@/lib/mcp/cypher';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    // Generate an impressive realistic mock architecture
    const mockNodes = [
      // Core
      { id: '1', group: 1, val: 12, name: 'src/core/engine.ts', isSpaghetti: true },
      { id: '2', group: 1, val: 8, name: 'src/core/parser.ts' },
      { id: '3', group: 1, val: 6, name: 'src/core/analyzer.ts' },
      // API
      { id: '4', group: 2, val: 5, name: 'src/api/routes.go' },
      { id: '5', group: 2, val: 4, name: 'src/api/handlers.go' },
      { id: '6', group: 2, val: 7, name: 'src/api/auth.go' },
      // DB
      { id: '7', group: 3, val: 9, name: 'src/db/models.rs' },
      { id: '8', group: 3, val: 5, name: 'src/db/queries.rs' },
      { id: '9', group: 3, val: 2, name: 'src/db/migrations.json' },
      // Utils
      { id: '10', group: 4, val: 2, name: 'src/utils/logger.ts' },
      { id: '11', group: 4, val: 1, name: 'src/utils/math_dead.ts', isDeadCode: true },
      { id: '12', group: 4, val: 1, name: 'src/utils/string_dead.ts', isDeadCode: true },
      // Frontend
      { id: '13', group: 5, val: 6, name: 'src/components/App.tsx' },
      { id: '14', group: 5, val: 4, name: 'src/components/Header.tsx' },
      { id: '15', group: 5, val: 8, name: 'src/components/GraphView.tsx' },
    ];
    
    const mockLinks = [
      // Core <-> DB
      { source: '1', target: '7' }, { source: '2', target: '7' }, { source: '3', target: '8' },
      // API <-> Core
      { source: '4', target: '1' }, { source: '5', target: '1' }, { source: '5', target: '2' }, { source: '6', target: '1' },
      // API <-> DB
      { source: '6', target: '7' },
      // Frontend <-> API
      { source: '13', target: '4' }, { source: '15', target: '4' },
      // Core internal
      { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '3' },
      // Utils (Logger used everywhere)
      { source: '1', target: '10' }, { source: '4', target: '10' }, { source: '7', target: '10' },
      // Frontend internal
      { source: '13', target: '14' }, { source: '13', target: '15' }
    ];
    
    setData({ nodes: mockNodes, links: mockLinks });
  }, []);

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-background text-foreground">
      <AnalysisPanel />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <CodeCanvas3D data={data} onNodeClick={(node) => setSelectedNode(node)} />
      </div>

      {/* Node Detail Panel (Functionality) */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 w-80 z-10 flex flex-col gap-4 animate-in slide-in-from-bottom-5">
          <Card className="bg-background/90 backdrop-blur-md border-border/50 shadow-2xl">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-blue-400 truncate">
                  {selectedNode.name}
                </CardTitle>
                <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-white transition-colors">✕</button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">중요도 (Centrality):</span>
                <span className="font-mono">{selectedNode.val * 10}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">연결된 의존성:</span>
                <span className="font-mono">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {data.links.filter((l: any) => l.source.id === selectedNode.id || l.target.id === selectedNode.id || l.source === selectedNode.id || l.target === selectedNode.id).length}개
                </span>
              </div>
              
              <div className="mt-2 flex gap-2">
                {selectedNode.isSpaghetti && <Badge variant="destructive">스파게티 경고</Badge>}
                {selectedNode.isDeadCode && <Badge variant="secondary">데드 코드</Badge>}
                {!selectedNode.isSpaghetti && !selectedNode.isDeadCode && <Badge className="bg-green-600">상태 양호</Badge>}
              </div>

              <div className="mt-4">
                <button className="w-full py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  소스 코드 분석하기
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Title / Info overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          CodeGraph Enterprise
        </h1>
        <p className="text-xs text-muted-foreground mt-1">프로젝트 구조 3D 시각화 엔진</p>
      </div>
    </div>
  );
}
