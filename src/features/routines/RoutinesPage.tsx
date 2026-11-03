import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';

export const RoutinesPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Tên giáo án không được để trống');
      return;
    }

    const isDuplicate = routines.some(
      (r) => r.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError('Tên giáo án đã tồn tại.');
      return;
    }

    dispatch({
      type: 'create',
      payload: { name: trimmed },
    });

    setName('');
    setError(null);
  };

  const handleRemove = (id: string) => {
    dispatch({
      type: 'remove',
      payload: { id },
    });
  };

  return (
    <div className="routines-page max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Danh sách giáo án
      </h1>

      {/* Form tạo giáo án */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Tạo giáo án mới
        </h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label
              htmlFor="routine-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tên giáo án
            </label>
            <div className="flex gap-3">
              <input
                id="routine-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Nhập tên giáo án..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
              >
                Tạo
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* List routines */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Các giáo án hiện có ({routines.length})
        </h2>

        {routines.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            Chưa có giáo án nào. Hãy tạo giáo án đầu tiên của bạn!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {routine.name}
                    </h3>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
                      {routine.exerciseIds.length} bài
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-3">
                  <Link
                    to={`/routines/${routine.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Xem chi tiết →
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemove(routine.id)}
                    className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded border border-red-200 dark:border-red-900 font-medium transition-colors"
                  >
                    Xóa
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

export default RoutinesPage;
