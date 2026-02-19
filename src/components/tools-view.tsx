"use client";

import { useState } from "react";
import { ToolCard } from "@/components/ui/tool-card";
import { Input } from "@/components/ui/input";
import { tools } from "@/config/tools";
import { Search } from "lucide-react";

export function ToolsView() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools
    .filter((tool) => {
      const query = searchQuery.toLowerCase();
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools by name, description, or tags..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
        {filteredTools.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No tools found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
