'use client';

import { useRef, useEffect } from 'react';

/**
 * Renders HTML inside a sandboxed iframe for a live preview.
 * Injects Bootstrap CSS + a dark body to mimic Zenler environment.
 *
 * Props:
 *  - html: string (the enhanced Zenler HTML to preview)
 */
export default function LivePreview({ html }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Inter', sans-serif;
      background: #0a0a0f;
      color: #e2e8f0;
    }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${html || '<p style="color:#475569;text-align:center;padding:40px 0;font-size:14px;">Preview will appear here after applying an effect.</p>'}
</body>
</html>`);
    doc.close();
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      sandbox="allow-same-origin"
      className="w-full h-full border-0 rounded-lg bg-ze-body"
    />
  );
}
