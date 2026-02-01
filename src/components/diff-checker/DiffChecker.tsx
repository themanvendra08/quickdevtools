"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { diffChars, Change } from "diff";

export function DiffChecker() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  const handleCompare = () => {
    const diff = diffChars(leftText, rightText);
    setDiffResult(diff);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          placeholder="Paste the first text here"
          value={leftText}
          onChange={(e) => setLeftText(e.target.value)}
          rows={15}
        />
        <Textarea
          placeholder="Paste the second text here"
          value={rightText}
          onChange={(e) => setRightText(e.target.value)}
          rows={15}
        />
      </div>
      <div className="text-center mt-4">
        <Button onClick={handleCompare}>Compare</Button>
      </div>
      {/* Only show result box when there's diff data */}
      {diffResult.length > 0 && (
        <div className="mt-4 bg-muted p-4 rounded-md">
          <pre className="whitespace-pre-wrap">
            {diffResult.map((part, index) => {
              const color = part.added
                ? "bg-green-200 dark:bg-green-900"
                : part.removed
                  ? "bg-red-200 dark:bg-red-900"
                  : "";
              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
}
