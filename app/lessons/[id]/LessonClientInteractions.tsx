'use client';

import React, { useState } from 'react';
import { Bookmark, FileText, Check, Save } from 'lucide-react';

interface Props {
  lessonId: string;
  initialIsBookmarked: boolean;
  initialNote: string;
}

export default function LessonClientInteractions({
  lessonId,
  initialIsBookmarked,
  initialNote,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/bookmark`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const saveNote = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={toggleBookmark}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
          isBookmarked
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
      >
        <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
        <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      </button>

      <button
        onClick={() => setIsNotesOpen(!isNotesOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
      >
        <FileText className="h-3.5 w-3.5 text-cyan-400" />
        <span className="hidden sm:inline">My Notes</span>
      </button>

      {/* Notes Popover Drawer */}
      {isNotesOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              Lesson Scratchpad & Notes
            </span>
            <button
              onClick={() => setIsNotesOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <textarea
            rows={5}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Record your security observations, exploit findings, or cheat-sheet notes here..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">Auto-saved to your account</span>
            <button
              onClick={saveNote}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3 w-3" />
                  Saved!
                </>
              ) : isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  Save Note
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
