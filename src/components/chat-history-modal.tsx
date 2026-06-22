/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Terminal } from "lucide-react";

interface ChatRecord {
  id: string;
  target_file: string;
  prompt_input: string;
  ai_output: string;
  token_saved: number;
  created_at: string;
}

export function ChatHistoryModal({ fileName, onClose }: { fileName: string, onClose: () => void }) {
  const [history, setHistory] = useState<ChatRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would filter by targetFile on the backend
    fetch('/api/mcp/chat-history')
      .then(res => res.json())
      .then(data => {
        const fileHistory = (data.history || []).filter((h: any) => h.target_file === fileName);
        setHistory(fileHistory);
      })
      .finally(() => setLoading(false));
  }, [fileName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <Card className="w-[800px] h-[600px] flex flex-col bg-[#0b1016]/95 border-[#30363d] shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#30363d] pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-[#58a6ff] flex items-center gap-2">
              <MessageSquare size={18} />
              AI 컨텍스트 타임라인 디버깅
            </CardTitle>
            <span className="text-xs text-gray-400 font-mono">{fileName}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">✕</button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {loading ? (
            <div className="text-center text-gray-500 mt-20">Loading timeline...</div>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-2">
              <Terminal size={32} className="opacity-20" />
              <p>이 파일에 대한 AI 리팩토링 기록이 없습니다.</p>
            </div>
          ) : (
            history.map((record, i) => (
              <div key={record.id || i} className="flex flex-col gap-3 relative pl-6 border-l-2 border-[#30363d]">
                <div className="absolute w-3 h-3 bg-[#58a6ff] rounded-full -left-[7px] top-1"></div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{new Date(record.created_at).toLocaleString()}</span>
                  <Badge className="bg-green-900/50 text-green-400 border-green-900">
                    {record.token_saved.toLocaleString()} Tokens Saved
                  </Badge>
                </div>
                
                {/* User Prompt (Minified Context) */}
                <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-gray-300">
                  <div className="font-bold text-xs text-gray-500 mb-2">User (Injected Context):</div>
                  <pre className="text-xs text-[#7ee787] font-mono overflow-x-auto">
                    {record.prompt_input}
                  </pre>
                </div>

                {/* AI Response */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-sm text-gray-300">
                  <div className="font-bold text-xs text-[#58a6ff] mb-2">AI Response:</div>
                  <div className="text-xs whitespace-pre-wrap">
                    {record.ai_output}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
