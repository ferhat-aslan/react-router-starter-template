import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { SubtitleEntry } from '~/utils/subtitle-parser';

interface SubtitleEditorProps {
  entries: SubtitleEntry[];
  onChange: (entries: SubtitleEntry[]) => void;
  readOnly?: boolean;
  showAddDelete?: boolean;
}

export default function SubtitleEditor({
  entries,
  onChange,
  readOnly = false,
  showAddDelete = true,
}: SubtitleEditorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEntry = entries[currentIndex];

  const handleFieldChange = (field: keyof SubtitleEntry, value: string | number) => {
    const updatedEntries = [...entries];
    updatedEntries[currentIndex] = {
      ...updatedEntries[currentIndex],
      [field]: value,
    };
    onChange(updatedEntries);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleJumpTo = (index: number) => {
    if (index >= 0 && index < entries.length) {
      setCurrentIndex(index);
    }
  };

  const handleAddEntry = () => {
    const newEntry: SubtitleEntry = {
      index: entries.length + 1,
      startTime: '00:00:00,000',
      endTime: '00:00:00,000',
      text: '',
    };
    const updatedEntries = [...entries, newEntry];
    onChange(updatedEntries);
    setCurrentIndex(updatedEntries.length - 1);
  };

  const handleDeleteEntry = () => {
    if (entries.length <= 1) return;
    
    const updatedEntries = entries.filter((_, idx) => idx !== currentIndex);
    // Reindex entries
    updatedEntries.forEach((entry, idx) => {
      entry.index = idx + 1;
    });
    onChange(updatedEntries);
    
    // Adjust current index if needed
    if (currentIndex >= updatedEntries.length) {
      setCurrentIndex(updatedEntries.length - 1);
    }
  };

  if (!currentEntry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No subtitle entries</p>
        {showAddDelete && !readOnly && (
          <button
            onClick={handleAddEntry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add First Entry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous entry"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Entry</span>
          <input
            type="number"
            min="1"
            max={entries.length}
            value={currentIndex + 1}
            onChange={(e) => handleJumpTo(parseInt(e.target.value) - 1)}
            className="w-20 px-3 py-2 text-center border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            of {entries.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === entries.length - 1}
          className="p-2 rounded-lg bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next entry"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Editor Fields */}
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 space-y-4">
        {/* Entry Index */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entry Number
          </label>
          <input
            type="number"
            value={currentEntry.index}
            onChange={(e) => handleFieldChange('index', parseInt(e.target.value))}
            disabled={readOnly}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Time
            </label>
            <input
              type="text"
              value={currentEntry.startTime}
              onChange={(e) => handleFieldChange('startTime', e.target.value)}
              disabled={readOnly}
              placeholder="00:00:00,000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Time
            </label>
            <input
              type="text"
              value={currentEntry.endTime}
              onChange={(e) => handleFieldChange('endTime', e.target.value)}
              disabled={readOnly}
              placeholder="00:00:00,000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>

        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtitle Text
          </label>
          <textarea
            value={currentEntry.text}
            onChange={(e) => handleFieldChange('text', e.target.value)}
            disabled={readOnly}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
            placeholder="Enter subtitle text..."
          />
        </div>

        {/* Style (for ASS format) */}
        {currentEntry.style !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Style (ASS)
            </label>
            <input
              type="text"
              value={currentEntry.style}
              onChange={(e) => handleFieldChange('style', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        )}
      </div>

      {/* Add/Delete Buttons */}
      {showAddDelete && !readOnly && (
        <div className="flex gap-4">
          <button
            onClick={handleAddEntry}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Entry
          </button>
          <button
            onClick={handleDeleteEntry}
            disabled={entries.length <= 1}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Entry
          </button>
        </div>
      )}
    </div>
  );
}
