import React from "react";
import { Search, CheckCircle2 } from "lucide-react";

export function AnalysisPanel() {
  return (
    <div className="absolute top-0 right-0 h-screen w-[340px] z-20 flex flex-col bg-[#0b1016]/95 backdrop-blur-xl border-l border-white/5 shadow-2xl text-gray-300 font-sans overflow-hidden">
      
      {/* HEADER */}
      <div className="px-5 py-6 flex justify-between items-center border-b border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">필터 (FILTERS)</h2>
        <div className="flex gap-3 text-xs">
          <button className="text-[#00e5ff] hover:text-white transition-colors">모두 (All)</button>
          <span className="text-gray-600">|</span>
          <button className="text-[#00e5ff] hover:text-white transition-colors">없음 (None)</button>
        </div>
      </div>

      <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        
        {/* NODES */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 mb-3">노드 (Nodes)</h3>
          <div className="flex flex-wrap gap-2">
            <FilterBadge color="#00e5ff" label="함수 (Function)" count="12,908" active />
            <FilterBadge color="#718096" label="필드 (Field)" count="6,441" />
            <FilterBadge color="#b042ff" label="클래스 (Class)" count="1,061" />
            <FilterBadge color="#4299e1" label="파일 (File)" count="937" />
            <FilterBadge color="#ff8800" label="모듈 (Module)" count="935" />
            <FilterBadge color="#a0aec0" label="변수 (Variable)" count="567" />
            <FilterBadge color="#00ff88" label="폴더 (Folder)" count="444" active />
            <FilterBadge color="#718096" label="열거형 (Enum)" count="229" />
            <FilterBadge color="#a0aec0" label="섹션 (Section)" count="175" />
            <FilterBadge color="#00e5ff" label="메서드 (Method)" count="92" />
            <FilterBadge color="#b042ff" label="인터페이스 (Interface)" count="29" />
            <FilterBadge color="#ecc94b" label="라우트 (Route)" count="6" />
            <FilterBadge color="#718096" label="타입 (Type)" count="2" />
            <FilterBadge color="#e53e3e" label="프로젝트 (Project)" count="1" />
          </div>
        </div>

        {/* EDGES */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 mb-3">연결선 (Edges)</h3>
          <div className="flex flex-wrap gap-2">
            <EdgeBadge label="정의함 (defines)" count="22,439" />
            <EdgeBadge label="사용됨 (usage)" count="17,119" active />
            <EdgeBadge label="호출함 (calls)" count="10,119" />
            <EdgeBadge label="파일 포함 (contains file)" count="937" />
            <EdgeBadge label="폴더 포함 (contains folder)" count="375" />
            <EdgeBadge label="작성함 (writes)" count="356" />
            <EdgeBadge label="메서드 정의 (defines method)" count="92" />
            <EdgeBadge label="설정함 (configures)" count="52" />
            <EdgeBadge label="동시 변경 (changes with)" count="15" />
            <EdgeBadge label="상속함 (inherits)" count="9" />
            <EdgeBadge label="처리함 (handles)" count="6" />
            <EdgeBadge label="발생시킴 (raises)" count="4" />
          </div>
        </div>

        {/* TOGGLE */}
        <div className="mb-6 flex items-center gap-2 cursor-pointer text-[#00e5ff] hover:text-white transition-colors">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">라벨 표시 (Show labels)</span>
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
          <DirectoryItem name="cli-mcp-z00032" count="8" />
          <DirectoryItem name="cmd" count="67" />
          <DirectoryItem name="docs" count="9" />
          <DirectoryItem name="graph-ui" count="222" />
          <DirectoryItem name="internal" count="6,761" />
          <DirectoryItem name="scripts" count="97" active />
          <DirectoryItem name="src" count="1,169" />
          <DirectoryItem name="test-infrastructure" count="9" />
          <DirectoryItem name="tests" count="2,269" />
          <DirectoryItem name="tools" count="305" />
          <DirectoryItem name="vendored" count="11,558" />
        </div>
      </div>
    </div>
  );
}

function FilterBadge({ color, label, count, active }: { color: string, label: string, count: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border text-xs cursor-pointer transition-colors ${active ? 'bg-white/10 border-white/20 text-white' : 'bg-[#1a202c]/50 border-white/5 text-gray-400 hover:bg-white/5'}`}>
      <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: color, color: color }}></span>
      <span className="font-medium">{label}</span>
      <span className="opacity-40">{count}</span>
    </div>
  );
}

function EdgeBadge({ label, count, active }: { label: string, count: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border text-xs cursor-pointer transition-colors ${active ? 'bg-white/10 border-white/20 text-white' : 'bg-[#1a202c]/50 border-white/5 text-gray-400 hover:bg-white/5'}`}>
      <span className="font-medium">{label}</span>
      <span className="opacity-40">{count}</span>
    </div>
  );
}

function DirectoryItem({ name, count, active }: { name: string, count: string, active?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-xs">•</span>
        <span className="font-medium">{name}</span>
      </div>
      <span className="text-xs opacity-40">{count}</span>
    </div>
  );
}
