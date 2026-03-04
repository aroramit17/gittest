'use client';

import { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';

/**
 * Monaco Editor wrapper configured for HTML editing in a dark theme.
 *
 * Props:
 *  - value: string
 *  - onChange: (val: string) => void
 *  - readOnly?: boolean
 *  - placeholder?: string
 *  - height?: string
 */
export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  height = '100%',
}) {
  const editorRef = useRef(null);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Define a custom dark theme matching the dashboard
    monaco.editor.defineTheme('zenenhance-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'tag', foreground: '818cf8' },
        { token: 'attribute.name', foreground: 'c4b5fd' },
        { token: 'attribute.value', foreground: '60a5fa' },
        { token: 'comment', foreground: '475569' },
        { token: 'string', foreground: '34d399' },
      ],
      colors: {
        'editor.background': '#09090f',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#111118',
        'editor.selectionBackground': '#7c3aed33',
        'editorCursor.foreground': '#818cf8',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#64748b',
        'editor.inactiveSelectionBackground': '#7c3aed1a',
        'editorIndentGuide.background': '#1e293b',
        'editorWidget.background': '#111118',
        'editorWidget.border': '#1e293b',
        'input.background': '#0f0f18',
        'input.border': '#1e293b',
        'scrollbarSlider.background': '#ffffff10',
        'scrollbarSlider.hoverBackground': '#ffffff18',
      },
    });

    monaco.editor.setTheme('zenenhance-dark');
  }, []);

  const handleChange = useCallback((val) => {
    if (onChange) onChange(val || '');
  }, [onChange]);

  return (
    <Editor
      height={height}
      language="html"
      value={value}
      onChange={handleChange}
      onMount={handleMount}
      theme="zenenhance-dark"
      loading={
        <div className="flex items-center justify-center h-full text-sm text-slate-600">
          Loading editor...
        </div>
      }
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'line',
        overviewRulerBorder: false,
        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
        placeholder: !value ? placeholder : undefined,
      }}
    />
  );
}
