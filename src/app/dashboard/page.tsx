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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    const mockNodes: any[] = [];
    const mockLinks: any[] = [];
    
    // Generate massive clusters to mimic the dense star-field look
    const clusters = [
      { id: 'c1', size: 150, colorType: 'green' }, // Huge green cluster
      { id: 'c2', size: 120, colorType: 'purple' }, // Purple cluster
      { id: 'c3', size: 80, colorType: 'cyan' }, // Cyan cluster
      { id: 'c4', size: 60, colorType: 'orange' }, // Orange cluster
    ];

    let nodeId = 0;
    clusters.forEach((cluster, i) => {
      const clusterNodes = [];
      // Generate nodes
      for (let j = 0; j < cluster.size; j++) {
        const id = `n${nodeId++}`;
        clusterNodes.push(id);
        mockNodes.push({
          id,
          group: i,
          val: Math.random() > 0.95 ? 4 : (Math.random() > 0.8 ? 2 : 0.5), // Mostly tiny stars, few big ones
          name: `sys_${cluster.colorType}_${id}.ts`,
          clusterColor: cluster.colorType,
          isDeadCode: Math.random() > 0.98,
          isSpaghetti: Math.random() > 0.98
        });
      }
      
      // Connect nodes within the cluster densely
      for (let j = 0; j < cluster.size * 2.5; j++) {
        const source = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
        const target = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
        if (source !== target) {
          mockLinks.push({ source, target, color: cluster.colorType });
        }
      }
      
      // Connect clusters to previous clusters
      if (i > 0) {
        for (let k = 0; k < 30; k++) {
          const source = `n${Math.floor(Math.random() * (nodeId - cluster.size))}`;
          const target = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
          mockLinks.push({ source, target, color: 'mixed' });
        }
      }
    });
    
    setData({ nodes: mockNodes, links: mockLinks });
  }, []);

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(
        selectedNode?.isDeadCode 
          ? "이 파일은 다른 모듈에서 전혀 호출되지 않고 있습니다. 안전하게 삭제하여 코드베이스를 최적화할 수 있습니다." 
          : selectedNode?.isSpaghetti 
            ? "순환 참조와 과도한 의존성이 감지되었습니다. 3개 이상의 모듈로 분리하는 리팩토링을 권장합니다." 
            : "코드 상태가 매우 양호합니다. 캡슐화 규칙을 잘 준수하고 있습니다."
      );
    }, 1500);
  };

  const closeNodeDetail = () => {
    setSelectedNode(null);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#020208] text-foreground">
      <AnalysisPanel />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <CodeCanvas3D data={data} onNodeClick={(node) => { setSelectedNode(node); setAnalysisResult(null); setIsAnalyzing(false); }} />
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
                <button onClick={closeNodeDetail} className="text-muted-foreground hover:text-white transition-colors">✕</button>
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

              {analysisResult ? (
                <div className="mt-4 p-3 bg-blue-950/50 border border-blue-800/50 rounded-md text-xs leading-relaxed text-blue-200">
                  <strong className="text-blue-400 block mb-1">🤖 AI 분석 결과:</strong>
                  {analysisResult}
                </div>
              ) : (
                <div className="mt-4">
                  <button 
                    onClick={handleAnalyzeClick}
                    disabled={isAnalyzing}
                    className="w-full py-2 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white rounded-md transition-colors flex justify-center items-center"
                  >
                    {isAnalyzing ? (
                      <span className="animate-pulse">AI 분석 중...</span>
                    ) : (
                      "소스 코드 분석하기"
                    )}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Title / Info overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          CodeGraph Enterprise
        </h1>
        <p className="text-xs text-blue-300/80 mt-1">미래지향적 프로젝트 시각화 엔진</p>
      </div>
    </div>
  );
}
