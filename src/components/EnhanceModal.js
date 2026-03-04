'use client';

import { useState, useCallback } from 'react';
import { useEnhance } from '@/context/EnhanceContext';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';

export default function EnhanceModal() {
  const {
    modalOpen,
    closeModal,
    selectedEffect,
    inputCode,
    setInputCode,
    outputCode,
    status,
    error,
    previewHtml,
    enhance,
    resetCode,
  } = useEnhance();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // code | preview

  const handleCopy = useCallback(async () => {
    if (!outputCode) return;
    try {
      await navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = outputCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [outputCode]);

  if (!modalOpen || !selectedEffect) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="w-full max-w-6xl max-h-[90vh] bg-ze-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{selectedEffect.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedEffect.description}</p>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-ze-hover rounded-lg transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body: 2-column ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 overflow-hidden">

          {/* Left: Input editor */}
          <div className="flex flex-col border-r border-white/[0.06] min-h-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-slate-400">1. Paste Zenler HTML</span>
              <button
                onClick={resetCode}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 min-h-[200px]">
              <CodeEditor
                value={inputCode}
                onChange={setInputCode}
                placeholder="Paste your Zenler block code here..."
              />
            </div>
          </div>

          {/* Right: Output + Preview */}
          <div className="flex flex-col min-h-0">
            {/* Tab bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    activeTab === 'code'
                      ? 'bg-purple-500/10 text-purple-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  2. Output Code
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    activeTab === 'preview'
                      ? 'bg-purple-500/10 text-purple-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Live Preview
                </button>
              </div>
              <button
                onClick={handleCopy}
                disabled={!outputCode}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                  copied
                    ? 'text-white bg-emerald-500'
                    : 'text-emerald-400 bg-emerald-400/[0.08] border border-emerald-400/20 hover:bg-emerald-400/[0.15] disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 min-h-[200px]">
              {activeTab === 'code' ? (
                <CodeEditor
                  value={outputCode}
                  readOnly
                  placeholder="Enhanced code will appear here..."
                />
              ) : (
                <LivePreview html={previewHtml} />
              )}
            </div>
          </div>
        </div>

        {/* ── Footer: Apply button + status ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-ze-surface">
          <div className="text-xs">
            {status === 'processing' && (
              <span className="text-purple-300 flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                Enhancing with AI...
              </span>
            )}
            {status === 'success' && (
              <span className="text-emerald-400">Enhancement complete. Copy the output and paste into Zenler.</span>
            )}
            {status === 'error' && (
              <span className="text-red-400">{error}</span>
            )}
          </div>

          <button
            onClick={enhance}
            disabled={!inputCode.trim() || status === 'processing'}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-xl shadow-lg shadow-purple-500/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all"
          >
            {status === 'processing' ? (
              'Processing...'
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                Apply Effect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
