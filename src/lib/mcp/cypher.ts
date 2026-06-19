export interface GraphNode {
  id: string;
  group: number;
  val: number; // Centrality / size
  color?: string;
  name: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function getColorForExtension(filename: string): string {
  if (filename.endsWith(".ts") || filename.endsWith(".js") || filename.endsWith(".tsx")) return "#007ACC"; // Blue
  if (filename.endsWith(".go")) return "#00E5FF"; // Cyan
  if (filename.endsWith(".rs")) return "#F74C00"; // Orange
  if (filename.endsWith(".json") || filename.endsWith(".yml") || filename.endsWith(".yaml") || filename.endsWith(".md")) return "#A855F7"; // Purple
  return "#666666"; // Default gray
}

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
export function parseMCPDataToGraph(_rawData: any): GraphData {
  // Placeholder parsing logic for AST to 3D Force Graph format
  return {
    nodes: [],
    links: []
  };
}
