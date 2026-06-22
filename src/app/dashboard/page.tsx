/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { CodeCanvas3D } from '@/components/code-canvas-3d';
import { AnalysisPanel } from '@/components/analysis-panel';
import { TokenReducerPanel } from '@/components/token-reducer-panel';
import { ChatHistoryModal } from '@/components/chat-history-modal';
import { GraphData } from '@/lib/mcp/cypher';
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Layers, Copy } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const [activeDirs, setActiveDirs] = useState<Set<string>>(new Set([]));
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set([]));
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set([]));
  
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [promptInput, setPromptInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [curatedFiles, setCuratedFiles] = useState<any[]>([]);

  const [chatHistoryNode, setChatHistoryNode] = useState<any>(null);
  const [stats, setStats] = useState({ totalSessions: 0, totalTokensSaved: 0, savedCost: 0 });

  useEffect(() => {
    // Analytics Fetch
    fetch('/api/mcp/chat-history')
      .then(res => res.json())
      .then(data => {
        if(data) {
          // Assume $15 per 1M tokens roughly for Claude 3.5 Sonnet / Opus
          const cost = (data.totalTokensSaved || 0) * (15 / 1000000);
          setStats({
            totalSessions: data.totalSessions || 0,
            totalTokensSaved: data.totalTokensSaved || 0,
            savedCost: cost
          });
        }
      })
      .catch(e => console.error(e));
  }, []);

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
    fetch('/api/mcp/scan')
      .then(res => res.json())
      .then(data => {
        if (data && data.nodes) {
          setData(data);
        }
      })
      .catch(err => console.error("Failed to fetch real project data", err));
  }, []);

  const handleNodeClick = (node: any, event: MouseEvent) => {
    if (event.shiftKey) {
      const next = new Set(selectedNodes);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      setSelectedNodes(next);
      setSelectedNode(null);
      setCuratedFiles([]);
    } else {
      setSelectedNodes(new Set([node.id]));
      setSelectedNode(node);
      setCuratedFiles([]);
    }
  };

  const handleNodeRightClick = async (node: any) => {
    setSelectedNodes(new Set([node.id]));
    setSelectedNode(node);
    setChatHistoryNode(node);
    try {
      const res = await fetch('/api/mcp/context-curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId: node.id })
      });
      const result = await res.json();
      if (result.curatedFiles) setCuratedFiles(result.curatedFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#020208] text-foreground">
      {/* Analytics Banner */}
      <div className="absolute top-0 left-0 w-full bg-[#0d1117]/90 border-b border-[#30363d] p-2 z-40 text-center backdrop-blur-md">
        <span className="text-xs font-medium text-gray-300">
          이번 달 CodeGraph 파이프라인을 통해 총 <span className="text-[#58a6ff] font-bold">{stats.totalSessions}회</span> 대화 감지 ── 누적 <span className="text-[#7ee787] font-bold">{(stats.totalTokensSaved/10000).toFixed(1)}만 토큰</span> 방어, 총 <span className="text-[#d2a8ff] font-bold">${stats.savedCost.toFixed(2)}</span> 지갑 방어 성공
        </span>
      </div>

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
          selectedNodes={selectedNodes}
          onNodeClick={handleNodeClick}
          onNodeRightClick={handleNodeRightClick}
        />
      </div>

      {selectedNode && (
        <TokenReducerPanel 
          selectedNode={selectedNode} 
          onClose={() => { setSelectedNode(null); setSelectedNodes(new Set()); setCuratedFiles([]); }} 
        />
      )}

      {chatHistoryNode && (
        <ChatHistoryModal 
          fileName={chatHistoryNode.name} 
          onClose={() => setChatHistoryNode(null)} 
        />
      )}

      {/* Curated Files UI */}
      {curatedFiles.length > 0 && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-80 z-20 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <Layers size={16} /> 연관 파일 큐레이션 (Top 3)
          </h3>
          {curatedFiles.map((f, i) => (
            <Card key={i} className="bg-[#0b1016]/95 border-blue-900/50 p-3 shadow-xl">
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span className="font-mono text-blue-300 truncate">{f.name.split('/').pop()}</span>
                <span className="text-green-400 font-bold">{(f.relevanceScore * 100).toFixed(0)}%</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{f.reason}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Context-Aware Prompt Generator */}
      {selectedNodes.size > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] z-30">
          <Card className="bg-[#0b1016]/95 backdrop-blur-md border-[#30363d] shadow-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-2 text-blue-400 font-bold">
                <Sparkles size={14} /> AI Context Generator
              </span>
              <span>{selectedNodes.size}개 노드 선택됨</span>
            </div>
            
            {generatedPrompt ? (
              <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded text-xs font-mono text-green-300 relative">
                <pre className="whitespace-pre-wrap max-h-32 overflow-y-auto">{generatedPrompt}</pre>
                <button 
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded hover:bg-black/80"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    setGeneratedPrompt("");
                  }}
                >
                  <Copy size={12}/>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  placeholder="예: 선택한 클래스들의 결합도를 분리해줘"
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={() => {
                    const targetFiles = Array.from(selectedNodes).join(', ');
                    const prompt = `<Context>\nTarget Nodes: ${targetFiles}\n</Context>\n\nUser Request: ${promptInput}\n\nTask: Analyze the structural dependencies and provide an implementation plan.`;
                    setGeneratedPrompt(prompt);
                    setPromptInput("");

                    // Background Session Dumper
                    fetch('/api/mcp/chat-history', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        targetFile: targetFiles,
                        rawCodeLength: 15000, // mock combined length
                        compressedLength: prompt.length,
                        promptInput: prompt,
                        aiOutput: 'Waiting for AI bridging session...'
                      })
                    }).catch(e => console.error(e));
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2 text-sm transition-colors"
                >
                  <Send size={14}/> 생성
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
      
      {/* Title / Info overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          CodeGraph Enterprise
        </h1>
        <p className="text-xs text-blue-300/80 mt-1">AI Token Optimization Edition</p>
      </div>
    </div>
  );
}
