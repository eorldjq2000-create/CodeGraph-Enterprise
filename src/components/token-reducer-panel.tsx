/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Scissors } from "lucide-react";

export function TokenReducerPanel({ selectedNode, onClose }: { selectedNode: any, onClose: () => void }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  // Mock tree-sitter minified output
  const mockMinifiedContext = `// Context Minified by CodeGraph
import { A, B } from 'core';
export class ${selectedNode?.name?.split('/').pop()?.split('.')[0] || 'NodeClass'} extends Component {
  constructor(props: Props);
  protected initGraph(): void;
  public render(): ReactNode;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockMinifiedContext);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!selectedNode) return null;

  return (
    <div className="absolute bottom-4 left-4 w-96 z-10 flex flex-col gap-4 animate-in slide-in-from-bottom-5">
      <Card className="bg-[#0b1016]/95 backdrop-blur-md border-[#30363d] shadow-2xl">
        <CardHeader className="pb-3 border-b border-[#30363d]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-semibold text-[#58a6ff] truncate">
              {selectedNode.name}
            </CardTitle>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">✕</button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-3">
          <div className="flex justify-between text-xs text-gray-300">
            <span className="text-gray-500">중요도 (Centrality):</span>
            <span className="font-mono">{Math.floor(selectedNode.val * 10)}</span>
          </div>
          <div className="mt-1 flex gap-2">
            {selectedNode.isSpaghetti && <Badge variant="destructive" className="bg-red-900/50 text-red-400 border-red-900">스파게티 경고</Badge>}
            {selectedNode.isDeadCode && <Badge variant="secondary" className="bg-gray-800 text-gray-400 border-gray-700">데드 코드</Badge>}
            {!selectedNode.isSpaghetti && !selectedNode.isDeadCode && <Badge className="bg-green-900/50 text-green-400 border-green-900">상태 양호</Badge>}
          </div>

          <div className="mt-4 border-t border-[#30363d] pt-4">
            <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
              <Scissors size={14} className="text-blue-400" /> MCP Context Minifier
            </h4>
            
            {!isMinified ? (
              <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded text-xs text-gray-500 font-mono text-center">
                Raw Code: ~12,450 Tokens <br/>
                <button 
                  onClick={() => setIsMinified(true)}
                  className="mt-3 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition-colors"
                >
                  초압축 골격 추출하기
                </button>
              </div>
            ) : (
              <div className="relative bg-[#0d1117] border border-[#30363d] p-3 rounded text-xs text-gray-300 font-mono">
                <div className="flex justify-between items-center mb-2 text-[#7ee787]">
                  <span>Optimized: 42 Tokens (99% 절감)</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-green-200 opacity-80 mt-2 p-2 bg-black/50 rounded">
                  {mockMinifiedContext}
                </pre>
                <button 
                  onClick={copyToClipboard}
                  className="mt-3 w-full py-2 flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded transition-colors"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? "복사 완료" : "AI 주입용 컨텍스트 복사"}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
