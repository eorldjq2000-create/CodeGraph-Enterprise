/* eslint-disable @typescript-eslint/no-explicit-any */
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
  
  const [activeDirs, setActiveDirs] = useState<Set<string>>(new Set([]));
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set([]));
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set([]));

  const toggleDir = (label: string) => {
    const next = new Set(activeDirs);
    if (next.has(label)) next.delete(label); else next.add(label);
    setActiveDirs(next);
  };
  
  const toggleNode = (label: string) => {
    const next = new Set(activeNodes);
    if (next.has(label)) next.delete(label); else next.add(label);
    setActiveNodes(next);
  };
  
  const toggleEdge = (label: string) => {
    const next = new Set(activeEdges);
    if (next.has(label)) next.delete(label); else next.add(label);
    setActiveEdges(next);
  };

  const setAllFilters = () => {
    setActiveNodes(new Set(['함수 (Function)', '필드 (Field)', '클래스 (Class)', '파일 (File)', '모듈 (Module)', '변수 (Variable)', '폴더 (Folder)', '열거형 (Enum)', '섹션 (Section)', '메서드 (Method)', '인터페이스 (Interface)', '라우트 (Route)', '타입 (Type)', '프로젝트 (Project)']));
    setActiveEdges(new Set(['정의함 (defines)', '사용됨 (usage)', '호출함 (calls)', '파일 포함 (contains file)', '폴더 포함 (contains folder)', '작성함 (writes)', '메서드 정의 (defines method)', '설정함 (configures)', '동시 변경 (changes with)', '상속함 (inherits)', '처리함 (handles)', '발생시킴 (raises)']));
  };

  const setNoneFilters = () => {
    setActiveNodes(new Set());
    setActiveEdges(new Set());
  };

  useEffect(() => {
    const mockNodes: any[] = [];
    const mockLinks: any[] = [];
    
    const clusters = [
      { id: 'c1', size: 150, colorType: 'green' }, 
      { id: 'c2', size: 120, colorType: 'purple' }, 
      { id: 'c3', size: 80, colorType: 'cyan' }, 
      { id: 'c4', size: 60, colorType: 'orange' }, 
    ];

    const dirNames = ["cli-mcp-z00032", "cmd", "docs", "graph-ui", "internal", "scripts", "src", "test-infrastructure", "tests", "tools", "vendored"];
    const nodeTypes = ['함수 (Function)', '필드 (Field)', '클래스 (Class)', '파일 (File)', '모듈 (Module)', '변수 (Variable)', '폴더 (Folder)', '열거형 (Enum)', '섹션 (Section)', '메서드 (Method)', '인터페이스 (Interface)', '라우트 (Route)', '타입 (Type)', '프로젝트 (Project)'];
    const edgeTypes = ['정의함 (defines)', '사용됨 (usage)', '호출함 (calls)', '파일 포함 (contains file)', '폴더 포함 (contains folder)', '작성함 (writes)', '메서드 정의 (defines method)', '설정함 (configures)', '동시 변경 (changes with)', '상속함 (inherits)', '처리함 (handles)', '발생시킴 (raises)'];

    let nodeId = 0;
    clusters.forEach((cluster, i) => {
      const clusterNodes = [];
      for (let j = 0; j < cluster.size; j++) {
        const id = `n${nodeId++}`;
        clusterNodes.push(id);
        const randomDir = dirNames[Math.floor(Math.random() * dirNames.length)];
        const randomNodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        mockNodes.push({
          id,
          group: i,
          val: Math.random() > 0.95 ? 4 : (Math.random() > 0.8 ? 2 : 0.5), 
          name: `${randomDir}/sys_${cluster.colorType}_${id}.ts`,
          dir: randomDir, 
          nodeType: randomNodeType,
          clusterColor: cluster.colorType,
          isDeadCode: Math.random() > 0.98,
          isSpaghetti: Math.random() > 0.98
        });
      }
      
      for (let j = 0; j < cluster.size * 2.5; j++) {
        const source = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
        const target = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
        const randomEdgeType = edgeTypes[Math.floor(Math.random() * edgeTypes.length)];
        if (source !== target) {
          mockLinks.push({ source, target, color: cluster.colorType, edgeType: randomEdgeType });
        }
      }
      
      if (i > 0) {
        for (let k = 0; k < 30; k++) {
          const source = `n${Math.floor(Math.random() * (nodeId - cluster.size))}`;
          const target = clusterNodes[Math.floor(Math.random() * clusterNodes.length)];
          const randomEdgeType = edgeTypes[Math.floor(Math.random() * edgeTypes.length)];
          mockLinks.push({ source, target, color: 'mixed', edgeType: randomEdgeType });
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
      <AnalysisPanel 
        activeDirs={activeDirs} toggleDir={toggleDir}
        activeNodes={activeNodes} toggleNode={toggleNode}
        activeEdges={activeEdges} toggleEdge={toggleEdge}
        setAllFilters={setAllFilters} setNoneFilters={setNoneFilters}
      />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <CodeCanvas3D 
          data={data} 
          activeDirs={activeDirs} 
          activeNodes={activeNodes}
          activeEdges={activeEdges}
          onNodeClick={(node) => { setSelectedNode(node); setAnalysisResult(null); setIsAnalyzing(false); }} 
        />
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
