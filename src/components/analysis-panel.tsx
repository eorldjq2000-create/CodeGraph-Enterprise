"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";

export function AnalysisPanel() {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set(['함수 (Function)', '폴더 (Folder)']));
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set(['사용됨 (usage)']));
  const [activeDirs, setActiveDirs] = useState<Set<string>>(new Set(['scripts']));
  const [showLabels, setShowLabels] = useState(true);

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
  
  const toggleDir = (label: string) => {
    const next = new Set(activeDirs);
    if (next.has(label)) next.delete(label); else next.add(label);
    setActiveDirs(next);
  };

  const setAll = () => {
    setActiveNodes(new Set(['함수 (Function)', '필드 (Field)', '클래스 (Class)', '파일 (File)', '모듈 (Module)', '변수 (Variable)', '폴더 (Folder)', '열거형 (Enum)', '섹션 (Section)', '메서드 (Method)', '인터페이스 (Interface)', '라우트 (Route)', '타입 (Type)', '프로젝트 (Project)']));
    setActiveEdges(new Set(['정의함 (defines)', '사용됨 (usage)', '호출함 (calls)', '파일 포함 (contains file)', '폴더 포함 (contains folder)', '작성함 (writes)', '메서드 정의 (defines method)', '설정함 (configures)', '동시 변경 (changes with)', '상속함 (inherits)', '처리함 (handles)', '발생시킴 (raises)']));
  };

  const setNone = () => {
    setActiveNodes(new Set());
    setActiveEdges(new Set());
  };

  return (
    <div className="absolute top-0 right-0 h-screen w-[340px] z-20 flex flex-col bg-[#0b1016]/95 backdrop-blur-xl border-l border-white/5 shadow-2xl text-gray-300 font-sans overflow-hidden">
      
      {/* HEADER */}
      <div className="px-5 py-6 flex justify-between items-center border-b border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">필터 (FILTERS)</h2>
        <div className="flex gap-3 text-xs">
          <button onClick={setAll} className="text-[#00e5ff] hover:text-white transition-colors">모두 (All)</button>
          <span className="text-gray-600">|</span>
          <button onClick={setNone} className="text-[#00e5ff] hover:text-white transition-colors">없음 (None)</button>
        </div>
      </div>

      <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        
        {/* NODES */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 mb-3">노드 (Nodes)</h3>
          <div className="flex flex-wrap gap-2">
            <FilterBadge onClick={() => toggleNode('함수 (Function)')} color="#00e5ff" label="함수 (Function)" count="12,908" active={activeNodes.has('함수 (Function)')} />
            <FilterBadge onClick={() => toggleNode('필드 (Field)')} color="#718096" label="필드 (Field)" count="6,441" active={activeNodes.has('필드 (Field)')} />
            <FilterBadge onClick={() => toggleNode('클래스 (Class)')} color="#b042ff" label="클래스 (Class)" count="1,061" active={activeNodes.has('클래스 (Class)')} />
            <FilterBadge onClick={() => toggleNode('파일 (File)')} color="#4299e1" label="파일 (File)" count="937" active={activeNodes.has('파일 (File)')} />
            <FilterBadge onClick={() => toggleNode('모듈 (Module)')} color="#ff8800" label="모듈 (Module)" count="935" active={activeNodes.has('모듈 (Module)')} />
            <FilterBadge onClick={() => toggleNode('변수 (Variable)')} color="#a0aec0" label="변수 (Variable)" count="567" active={activeNodes.has('변수 (Variable)')} />
            <FilterBadge onClick={() => toggleNode('폴더 (Folder)')} color="#00ff88" label="폴더 (Folder)" count="444" active={activeNodes.has('폴더 (Folder)')} />
            <FilterBadge onClick={() => toggleNode('열거형 (Enum)')} color="#718096" label="열거형 (Enum)" count="229" active={activeNodes.has('열거형 (Enum)')} />
            <FilterBadge onClick={() => toggleNode('섹션 (Section)')} color="#a0aec0" label="섹션 (Section)" count="175" active={activeNodes.has('섹션 (Section)')} />
            <FilterBadge onClick={() => toggleNode('메서드 (Method)')} color="#00e5ff" label="메서드 (Method)" count="92" active={activeNodes.has('메서드 (Method)')} />
            <FilterBadge onClick={() => toggleNode('인터페이스 (Interface)')} color="#b042ff" label="인터페이스 (Interface)" count="29" active={activeNodes.has('인터페이스 (Interface)')} />
            <FilterBadge onClick={() => toggleNode('라우트 (Route)')} color="#ecc94b" label="라우트 (Route)" count="6" active={activeNodes.has('라우트 (Route)')} />
            <FilterBadge onClick={() => toggleNode('타입 (Type)')} color="#718096" label="타입 (Type)" count="2" active={activeNodes.has('타입 (Type)')} />
            <FilterBadge onClick={() => toggleNode('프로젝트 (Project)')} color="#e53e3e" label="프로젝트 (Project)" count="1" active={activeNodes.has('프로젝트 (Project)')} />
          </div>
        </div>

        {/* EDGES */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 mb-3">연결선 (Edges)</h3>
          <div className="flex flex-wrap gap-2">
            <EdgeBadge onClick={() => toggleEdge('정의함 (defines)')} label="정의함 (defines)" count="22,439" active={activeEdges.has('정의함 (defines)')} />
            <EdgeBadge onClick={() => toggleEdge('사용됨 (usage)')} label="사용됨 (usage)" count="17,119" active={activeEdges.has('사용됨 (usage)')} />
            <EdgeBadge onClick={() => toggleEdge('호출함 (calls)')} label="호출함 (calls)" count="10,119" active={activeEdges.has('호출함 (calls)')} />
            <EdgeBadge onClick={() => toggleEdge('파일 포함 (contains file)')} label="파일 포함 (contains file)" count="937" active={activeEdges.has('파일 포함 (contains file)')} />
            <EdgeBadge onClick={() => toggleEdge('폴더 포함 (contains folder)')} label="폴더 포함 (contains folder)" count="375" active={activeEdges.has('폴더 포함 (contains folder)')} />
            <EdgeBadge onClick={() => toggleEdge('작성함 (writes)')} label="작성함 (writes)" count="356" active={activeEdges.has('작성함 (writes)')} />
            <EdgeBadge onClick={() => toggleEdge('메서드 정의 (defines method)')} label="메서드 정의 (defines method)" count="92" active={activeEdges.has('메서드 정의 (defines method)')} />
            <EdgeBadge onClick={() => toggleEdge('설정함 (configures)')} label="설정함 (configures)" count="52" active={activeEdges.has('설정함 (configures)')} />
            <EdgeBadge onClick={() => toggleEdge('동시 변경 (changes with)')} label="동시 변경 (changes with)" count="15" active={activeEdges.has('동시 변경 (changes with)')} />
            <EdgeBadge onClick={() => toggleEdge('상속함 (inherits)')} label="상속함 (inherits)" count="9" active={activeEdges.has('상속함 (inherits)')} />
            <EdgeBadge onClick={() => toggleEdge('처리함 (handles)')} label="처리함 (handles)" count="6" active={activeEdges.has('처리함 (handles)')} />
            <EdgeBadge onClick={() => toggleEdge('발생시킴 (raises)')} label="발생시킴 (raises)" count="4" active={activeEdges.has('발생시킴 (raises)')} />
          </div>
        </div>

        {/* TOGGLE */}
        <div 
          className="mb-6 flex items-center gap-2 cursor-pointer text-[#00e5ff] hover:text-white transition-colors select-none"
          onClick={() => setShowLabels(!showLabels)}
        >
          {showLabels ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-gray-500" />}
          <span className={`text-sm font-medium ${showLabels ? '' : 'text-gray-500'}`}>라벨 표시 (Show labels)</span>
        </div>

        {/* SEARCH */}
        <div className="mb-4 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#121820] border border-white/10 rounded-md py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#00e5ff]/50 transition-colors placeholder:text-gray-600 text-white"
          />
        </div>

        {/* DIRECTORY LIST */}
        <div className="flex flex-col text-sm pb-10">
          <DirectoryItem onClick={() => toggleDir('cli-mcp-z00032')} name="cli-mcp-z00032" count="8" active={activeDirs.has('cli-mcp-z00032')} />
          <DirectoryItem onClick={() => toggleDir('cmd')} name="cmd" count="67" active={activeDirs.has('cmd')} />
          <DirectoryItem onClick={() => toggleDir('docs')} name="docs" count="9" active={activeDirs.has('docs')} />
          <DirectoryItem onClick={() => toggleDir('graph-ui')} name="graph-ui" count="222" active={activeDirs.has('graph-ui')} />
          <DirectoryItem onClick={() => toggleDir('internal')} name="internal" count="6,761" active={activeDirs.has('internal')} />
          <DirectoryItem onClick={() => toggleDir('scripts')} name="scripts" count="97" active={activeDirs.has('scripts')} />
          <DirectoryItem onClick={() => toggleDir('src')} name="src" count="1,169" active={activeDirs.has('src')} />
          <DirectoryItem onClick={() => toggleDir('test-infrastructure')} name="test-infrastructure" count="9" active={activeDirs.has('test-infrastructure')} />
          <DirectoryItem onClick={() => toggleDir('tests')} name="tests" count="2,269" active={activeDirs.has('tests')} />
          <DirectoryItem onClick={() => toggleDir('tools')} name="tools" count="305" active={activeDirs.has('tools')} />
          <DirectoryItem onClick={() => toggleDir('vendored')} name="vendored" count="11,558" active={activeDirs.has('vendored')} />
        </div>
      </div>
    </div>
  );
}

function FilterBadge({ color, label, count, active, onClick }: { color: string, label: string, count: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border text-xs cursor-pointer transition-all select-none hover:scale-105 active:scale-95 ${active ? 'bg-white/10 border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-[#1a202c]/50 border-white/5 text-gray-400 hover:bg-white/5'}`}>
      <span className={`w-2 h-2 rounded-full ${active ? 'shadow-[0_0_5px_currentColor]' : ''}`} style={{ backgroundColor: color, color: color }}></span>
      <span className="font-medium">{label}</span>
      <span className="opacity-40">{count}</span>
    </div>
  );
}

function EdgeBadge({ label, count, active, onClick }: { label: string, count: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border text-xs cursor-pointer transition-all select-none hover:scale-105 active:scale-95 ${active ? 'bg-white/10 border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-[#1a202c]/50 border-white/5 text-gray-400 hover:bg-white/5'}`}>
      <span className="font-medium">{label}</span>
      <span className="opacity-40">{count}</span>
    </div>
  );
}

function DirectoryItem({ name, count, active, onClick }: { name: string, count: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex justify-between items-center px-3 py-2.5 rounded-md cursor-pointer transition-all select-none hover:translate-x-1 active:scale-95 ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-xs">•</span>
        <span className="font-medium">{name}</span>
      </div>
      <span className="text-xs opacity-40">{count}</span>
    </div>
  );
}
