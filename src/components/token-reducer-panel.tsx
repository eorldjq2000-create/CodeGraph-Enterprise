/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Scissors } from "lucide-react";

export function TokenReducerPanel({ selectedNode, onClose }: { selectedNode: any, onClose: () => void }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  // 안티그래비티 초압축 파싱 엔진 (Token Reduction Core)
  const compressContext = (code: string, fileName: string, centrality: number) => {
    if (!code) return "";

    // 1단계: 주석 및 불필요한 줄바꿈/공백 제거 (RegEx Clean)
    const cleaned = code
      .replace(/\/\*[\s\S]*?\*\//g, "") // 여러 줄 주석 제거
      .replace(/\/\/.*/g, "")           // 한 줄 주석 제거
      .replace(/^\s*[\r\n]/gm, "");     // 빈 줄 제거

    const lines = cleaned.split("\n");
    const imports: string[] = [];
    const skeleton: string[] = [];

    // 2단계 & 3단계: 임포트문 격리 및 함수/클래스 선언부(Signature) 정밀 추출
    lines.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("import ")) {
        imports.push(trimmed);
      } else if (
        trimmed.startsWith("export ") ||
        trimmed.startsWith("class ") ||
        trimmed.startsWith("interface ") ||
        trimmed.startsWith("function ") ||
        trimmed.startsWith("public ") ||
        trimmed.startsWith("private ") ||
        trimmed.startsWith("async ")
      ) {
        // 함수의 내부 구현부 block은 떼어내고 선언부 뼈대만 마스킹
        const signature = trimmed.split("{")[0].trim();
        if (signature) skeleton.push(signature);
      }
    });

    // AI가 가장 토큰 효율적으로 아키텍처를 이해할 수 있는 Minified JSON 구조체 반환
    return JSON.stringify({
      targetFile: fileName,
      metrics: { betweennessCentrality: centrality },
      architectureImports: imports,
      codeSkeleton: skeleton
    }, null, 0); // 공백을 0으로 설정하여 문자열 토큰 자체를 극소화
  };

  const [rawCode, setRawCode] = useState<string>("");
  const [finalMinifiedContext, setFinalMinifiedContext] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedNode?.id) {
      setIsLoading(true);
      fetch(`/api/mcp/file?path=${encodeURIComponent(selectedNode.id)}`)
        .then(res => res.json())
        .then(data => {
          if (data.content) {
            setRawCode(data.content);
            setFinalMinifiedContext(compressContext(data.content, selectedNode.name, selectedNode.val));
          } else {
            setRawCode("// Failed to fetch file content");
            setFinalMinifiedContext(compressContext("// Error", selectedNode.name, 0));
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedNode]);

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(finalMinifiedContext);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);

    // [Background Automatic Session Dumper] 
    // AI 주입용 컨텍스트 복사 시 자동으로 세션 덤프 실행 (실제 글자수 반영)
    try {
      await fetch('/api/mcp/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetFile: selectedNode?.name || 'unknown_file',
          rawCodeLength: rawCode.length,
          compressedLength: finalMinifiedContext.length,
          promptInput: finalMinifiedContext,
          aiOutput: 'Waiting for AI response stream...' // 추후 스트림 마감 시점에 업데이트 가능
        })
      });
    } catch (e) {
      console.error('Failed to dump session to background DB', e);
    }
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
                {isLoading ? "Fetching file content..." : `Raw Code: ~${Math.floor(rawCode.length / 3.5)} Tokens`} <br/>
                <button 
                  disabled={isLoading}
                  onClick={() => setIsMinified(true)}
                  className="mt-3 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 disabled:opacity-50 text-blue-400 rounded transition-colors"
                >
                  초압축 골격 추출하기
                </button>
              </div>
            ) : (
              <div className="relative bg-[#0d1117] border border-[#30363d] p-3 rounded text-xs text-gray-300 font-mono">
                <div className="flex justify-between items-center mb-2 text-[#7ee787]">
                  <span>Optimized: ~{Math.floor(finalMinifiedContext.length / 3.5)} Tokens ({Math.floor((1 - finalMinifiedContext.length / Math.max(1, rawCode.length)) * 100)}% 절감)</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-green-200 opacity-80 mt-2 p-2 bg-black/50 rounded max-h-40">
                  {finalMinifiedContext}
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
