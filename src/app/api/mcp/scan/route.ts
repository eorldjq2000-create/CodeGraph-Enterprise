/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getFilesRecursively(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFilesRecursively(path.join(dir, file), fileList);
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

export async function GET() {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) {
      return NextResponse.json({ nodes: [], links: [] });
    }

    const files = getFilesRecursively(srcDir);
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Normalize path to use forward slashes and relative to project root
    const normalizePath = (p: string) => path.relative(process.cwd(), p).replace(/\\/g, '/');

    files.forEach(file => {
      const id = normalizePath(file);
      const content = fs.readFileSync(file, 'utf-8');
      
      const dirName = path.dirname(id).split('/').pop() || 'src';
      
      let nodeType = '파일 (File)';
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) nodeType = '컴포넌트 (Component)';
      else if (content.includes('class ')) nodeType = '클래스 (Class)';
      else if (content.includes('function ')) nodeType = '함수 (Function)';
      
      nodes.push({
        id,
        name: id,
        dir: dirName,
        nodeType,
        group: 1,
        val: 1, // Centrality mock
        clusterColor: 'cyan',
        isDeadCode: false,
        isSpaghetti: content.length > 5000
      });

      // Import Regex matching
      const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        let importPath = match[1];
        
        // Alias Resolution
        if (importPath.startsWith('@/')) {
          importPath = importPath.replace('@/', 'src/');
        } else if (importPath.startsWith('.')) {
          // Resolve relative path
          importPath = path.join(path.dirname(id), importPath).replace(/\\/g, '/');
        } else {
          // External module
          continue; 
        }

        // Add extensions if missing
        const possibleExtensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', ''];
        let resolvedTarget = importPath;
        for (const ext of possibleExtensions) {
          if (fs.existsSync(path.join(process.cwd(), importPath + ext))) {
            resolvedTarget = importPath + ext;
            break;
          }
        }

        links.push({
          source: id,
          target: resolvedTarget,
          edgeType: '의존성 (imports)',
          color: 'blue'
        });
      }
    });

    // InDegree calculation to refine val
    const inDegreeMap: Record<string, number> = {};
    links.forEach(l => {
      inDegreeMap[l.target] = (inDegreeMap[l.target] || 0) + 1;
    });

    nodes.forEach(n => {
      n.val = 1 + (inDegreeMap[n.id] || 0) * 0.5;
      if (n.val > 3) n.clusterColor = 'purple';
      else if (n.val > 1.5) n.clusterColor = 'green';
    });

    return NextResponse.json({ nodes, links });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to scan codebase' }, { status: 500 });
  }
}
