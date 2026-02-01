export const JSON_VIEWER_CONSTANTS = {
  PLACEHOLDERS: {
    VIEW: "Paste your JSON here... (supports objects, arrays, and nested structures)",
    COMPARE_LEFT: "Left JSON to compare...",
    COMPARE_RIGHT: "Right JSON to compare...",
  },
  BUTTONS: {
    VIEW: "View",
    COMPARE: "Compare",
    COPY_DISPLAYED: "Copy JSON",
    COPY_LEFT: "Copy Left",
    COPY_RIGHT: "Copy Right",
    FORMAT: "Format",
    MINIFY: "Minify",
    VALIDATE: "Validate",
    EXPORT: "Export",
    CLEAR: "Clear",
    THEME: "Theme",
  },
  TOAST_MESSAGES: {
    COPY_SUCCESS: "JSON copied to clipboard!",
    COPY_LEFT_SUCCESS: "Left JSON copied!",
    COPY_RIGHT_SUCCESS: "Right JSON copied!",
    COPY_ERROR: "Failed to copy to clipboard",
    FORMAT_SUCCESS: "JSON formatted successfully!",
    MINIFY_SUCCESS: "JSON minified successfully!",
    VALIDATION_SUCCESS: "JSON is valid!",
    VALIDATION_ERROR: "Invalid JSON format",
    EXPORT_SUCCESS: "JSON exported successfully!",
    CLEAR_SUCCESS: "Content cleared!",
  },
  TITLES: {
    JSON_VIEWER: "JSON Viewer Pro",
    JSON_PREVIEW: "JSON Preview",
    COMPARISON: "JSON Comparison",
    STATISTICS: "Statistics",
  },
  STYLES: {
    CONTAINER_MAX_WIDTH: {
      VIEW: "max-w-full",
      COMPARE: "max-w-full",
    },
    TEXTAREA_ROWS: 10,
    MAX_HEIGHT: "max-h-[75vh]",
  },
  REGEX_PATTERNS: {
    OBJECT_OBJECT: /\[object Object\]/gi,
    OBJECT: /\[Object\]/g,
  },
  REPLACEMENTS: {
    OBJECT_MARKER: '"[Object]"',
  },
  FEATURES: {
    THEME_TOGGLE: true,
    SEARCH_FILTER: true,
    EXPORT_OPTIONS: true,
    VALIDATION: true,
    FORMATTING: true,
    KEYBOARD_SHORTCUTS: true,
  },
} as const;

export const DEFAULT_TAB: "view" | "compare" = "view";
