import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useSessionStore } from '../session/useSessionStore';
import { formatDuration, formatMinutesSeconds } from '../../utils/format';

export const RoutineDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((s) => s.startSession);

  const routine = useMemo(() => {
    return routines.find((r) => r.id === id);
  }, [routines, id]);

  const routineExercises = useMemo(() => {
    if (!routine) return [];
    const exerciseMap = new Map<string, Exercise>(
      EXERCISES.map((e) => [e.id, e])
    );
    return routine.exerciseIds
      .map((eId) => exerciseMap.get(eId))
      .filter((e): e is Exercise => Boolean(e));
  }, [routine]);

  // Tính tổng thời gian bằng reduce
  const totalSeconds = useMemo(() => {
    return routineExercises.reduce((sum, ex) => sum + ex.duration, 0);
  }, [routineExercises]);

  if (!routine) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500 font-semibold mb-4">
          Không tìm thấy giáo án
        </p>
        <Link
          to="/routines"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Quay lại danh sách giáo án
        </Link>
      </div>
    );
  }

  const handleRemoveExercise = (exerciseId: string) => {
    dispatch({
      type: 'removeExercise',
      payload: { routineId: routine.id, exerciseId },
    });
  };

  const handleStartAll = () => {
    if (routineExercises.length > 0) {
      startSession(routineExercises, 0);
    }
  };

  return (
    <div className="routine-detail-page max-w-5xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link
          to="/routines"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Quay lại danh sách giáo án
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {routine.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tổng số: {routineExercises.length} bài tập
            </p>
            <p className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-1">
              Tổng thời gian: {formatMinutesSeconds(totalSeconds)}
            </p>
          </div>

          {routineExercises.length > 0 && (
            <button
              type="button"
              onClick={handleStartAll}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm shadow-sm transition-colors self-start md:self-auto"
            >
              Tập tất cả
            </button>
          )}
        </div>
      </div>

      {/* Danh sách bài tập trong giáo án */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Danh sách bài tập ({routineExercises.length})
        </h2>

        {routineExercises.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            Giáo án chưa có bài tập nào. Hãy sang trang{' '}
            <Link to="/" className="text-blue-600 underline">
              Kho bài tập
            </Link>{' '}
            để thêm bài vào giáo án!
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:border-gray-700">
            {routineExercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-mono text-sm w-8">
                    #{idx + 1}
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

                <div className="flex items-center gap-4">
                  <span className="font-mono text-gray-700 dark:text-gray-300 text-sm">
                    {formatDuration(exercise.duration)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded border border-red-200 dark:border-red-900 font-medium transition-colors"
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineDetailPage;

