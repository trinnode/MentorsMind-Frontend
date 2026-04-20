import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { ExtendedSession } from '../../hooks/useMentorSessions';
import { useMentorSessions } from '../../hooks/useMentorSessions';

interface SessionNotesProps {
  sessionId: string;
  initialNotes?: string;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ sessionId, initialNotes = '' }) => {
  const { updateNotes } = useMentorSessions();
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = () => {
    updateNotes(sessionId, notes);
    setIsEditing(false);
  };

  const previewMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Session Notes</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-200 transition-colors"
            title={showPreview ? 'Edit' : 'Preview'}
          >
            {showPreview ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5h3m1.5-3h3.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div 
          className="prose prose-sm max-w-none p-3 bg-white rounded-xl border border-gray-100 min-h-[80px]"
          dangerouslySetInnerHTML={{ __html: previewMarkdown(notes) }}
        />
      ) : (
        <>
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            className={`outline-none border-2 transition-all min-h-[80px] p-3 rounded-xl bg-white ${
              isEditing 
                ? 'border-stellar shadow-lg shadow-stellar/10 border-2 resize-vertical max-h-48 overflow-y-auto' 
                : 'border-gray-100 cursor-text hover:border-gray-200'
            }`}
            onInput={(e) => setNotes(e.currentTarget.innerText)}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => !isEditing && setIsEditing(true)}
            dangerouslySetInnerHTML={{ __html: notes || '' }}
          />
          {isEditing && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-1.5 bg-stellar text-white text-xs font-bold rounded-xl hover:bg-stellar-dark shadow-md shadow-stellar/10 transition-all"
              >
                Save Notes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNotes(initialNotes);
                }}
                className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionNotes;

