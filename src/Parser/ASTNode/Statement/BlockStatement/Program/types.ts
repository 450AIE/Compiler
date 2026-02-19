export const SourceType = {
  SCRIPT: "script",
  MODULE: "module",
} as const;

export type SourceType = (typeof SourceType)[keyof typeof SourceType];
