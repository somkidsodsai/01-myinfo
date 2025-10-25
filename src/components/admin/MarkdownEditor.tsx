"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
};

const MarkdownEditor = ({ value, onChange, height = 360 }: MarkdownEditorProps) => {
  const { resolvedTheme } = useTheme();
  const colorMode = useMemo(() => (resolvedTheme === "dark" ? "dark" : "light"), [resolvedTheme]);

  return (
    <div
      data-color-mode={colorMode}
      className="rounded-md border border-border shadow-sm overflow-hidden"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={height}
        preview="live"
      />
    </div>
  );
};

export default MarkdownEditor;
