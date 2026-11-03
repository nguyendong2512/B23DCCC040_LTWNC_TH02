import { useMemo, useCallback } from 'react';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';
import { formatDuration } from '../../utils/format';

export const SavedPage = () => {
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);
  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);

  const savedExercises = useMemo(() => {
    const map = new Map(EXERCISES.map((e) => [e.id, e]));
    return savedIds
      .map((id) => map.get(id))
      .filter((e): e is Exercise => Boolean(e));
  }, [savedIds]);

  const handleStartAll = useCallback(() => {
    if (savedExercises.length > 0) {
      startSession(savedExercises, 0);
    }
  }, [savedExercises, startSession]);

  return (
    <div className="saved-page max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bài tập đã lưu
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {savedExercises.length} bài tập đã được lưu
          </p>
        </div>

        {savedExercises.length > 0 && (
          <button
            type="button"
            onClick={handleStartAll}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm shadow-sm"
          >
            Tập tất cả
          </button>
        )}
      </div>

      {savedExercises.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          Bạn chưa lưu bài tập nào.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {savedExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-mono text-sm w-8">
                  #{index + 1}
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {exercise.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    HLV: {exercise.trainer} | Nhóm: {exercise.group}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-gray-700 dark:text-gray-300 text-sm">
                  {formatDuration(exercise.duration)}
                </span>

                <button
                  type="button"
                  onClick={() => startSession([exercise], 0)}
                  className="px-2.5 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                >
                  Bắt đầu
                </button>

                <button
                  type="button"
                  onClick={() => addToSession(exercise)}
                  className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                >
                  + Buổi tập
                </button>

                <button
                  type="button"
                  aria-label="Bỏ lưu"
                  onClick={() => toggleSave(exercise.id)}
                  className="px-2.5 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 rounded font-medium"
                >
                  Bỏ lưu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;

