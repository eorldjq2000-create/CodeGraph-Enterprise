import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnalysisPanel() {
  return (
    <div className="absolute top-4 right-4 w-80 z-10 flex flex-col gap-4">
      <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Refactoring Toolkit
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Dead Code (In-degree = 0)</span>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">12 Files</Badge>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-500 w-1/4"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Spaghetti (High Centrality)</span>
              <Badge variant="destructive" className="bg-red-900 text-red-300">3 Modules</Badge>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-1/12 animate-pulse"></div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
