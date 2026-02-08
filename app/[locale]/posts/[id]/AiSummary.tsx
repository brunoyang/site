'use client';

import { useState } from 'react';

interface AiSummaryProps {
  postId: string;
  locale: string;
  label: string;
  loadingLabel: string;
  titleLabel: string;
}

export default function AiSummary({ postId, locale, label, loadingLabel, titleLabel }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, locale }),
      });
      if (!res.ok) throw new Error('Failed');
      const { summary } = await res.json<{summary: string}>();
      setSummary(summary);
    } catch {
      setError('✗');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      {!summary && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-50 transition-colors"
        >
          <span>✨</span>
          {loading ? loadingLabel : label}
        </button>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {summary && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">✨ {titleLabel}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
