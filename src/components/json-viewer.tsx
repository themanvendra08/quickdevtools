"use client";

import React from "react";
import "react-json-view-lite/dist/index.css";

import { useJsonViewer } from "@/hooks/useJsonViewer";
import { JSON_VIEWER_CONSTANTS } from "@/utils/constants";
import { cn } from "@/lib/utils";
import {
  TabButtons,
  ViewTab,
  CompareView,
  JsonDisplay,
  JsonStatistics,
  KeyboardShortcuts,
} from "./json-viewer/index";

export default function JsonViewer() {
  const {
    jsonInput,
    parsedJson,
    activeTab,
    leftInput,
    rightInput,
    leftParsed,
    rightParsed,
    statistics,
    setJsonInput,
    setActiveTab,
    setLeftInput,
    setRightInput,
    handleCopy,
    handleCopyLeft,
    handleCopyRight,
    handleFormat,
    handleMinify,
    handleValidate,
    handleExport,
    handleClear,
    handleAutoFix,
    handleQuickFix,
  } = useJsonViewer();

  return (
    <div className="min-h-screen bg-background">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onFormat={handleFormat}
        onMinify={handleMinify}
        onValidate={handleValidate}
        onExport={handleExport}
        onClear={handleClear}
        onCopy={handleCopy}
        hasData={parsedJson !== null}
      />

      <div
        className={cn(
          "mx-auto px-6 py-8 space-y-8",
          activeTab === "compare"
            ? JSON_VIEWER_CONSTANTS.STYLES.CONTAINER_MAX_WIDTH.COMPARE
            : JSON_VIEWER_CONSTANTS.STYLES.CONTAINER_MAX_WIDTH.VIEW
        )}
      >
        {/* Main Content Card */}
        <div className="bg-card rounded-2xl border border-border shadow-lg">
          <div className="p-8">
            <div className="mb-8">
              <TabButtons activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="space-y-8">
              {activeTab === "view" && (
                <ViewTab
                  jsonInput={jsonInput}
                  parsedJson={parsedJson}
                  onInputChange={setJsonInput}
                  onCopy={handleCopy}
                  onFormat={handleFormat}
                  onMinify={handleMinify}
                  onValidate={handleValidate}
                  onExport={handleExport}
                  onClear={handleClear}
                  onAutoFix={handleAutoFix}
                  onQuickFix={handleQuickFix}
                />
              )}

              {activeTab === "compare" && (
                <CompareView
                  leftInput={leftInput}
                  rightInput={rightInput}
                  leftParsed={leftParsed}
                  rightParsed={rightParsed}
                  onLeftInputChange={setLeftInput}
                  onRightInputChange={setRightInput}
                  onCopyLeft={handleCopyLeft}
                  onCopyRight={handleCopyRight}
                />
              )}
            </div>
          </div>
        </div>

        {/* JSON Display and Statistics for view tab - side by side */}
        {activeTab === "view" && parsedJson !== null && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              <JsonDisplay data={parsedJson} />
            </div>
            <div className="xl:col-span-1">
              <JsonStatistics statistics={statistics} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
