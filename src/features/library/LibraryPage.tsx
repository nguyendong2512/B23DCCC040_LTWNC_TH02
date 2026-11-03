import { useState, useMemo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise, MuscleGroup } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { ExerciseRow } from './ExerciseRow';
import type { ExerciseRowData } from './ExerciseRow';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import { useRoutines, useRoutineDispatch } from '../routines/RoutineContext';

export const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<string>('Mặc định');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);

  const routines = useRoutines();
  const routineDispatch = useRoutineDispatch();

  // Filter and sort memoized
  const filteredAndSorted = useMemo(() => {
    let result = EXERCISES;

    const term = debouncedSearch.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(term) ||
          ex.trainer.toLowerCase().includes(term)
      );
    }

    if (selectedGroup !== 'Tất cả') {
      result = result.filter((ex) => ex.group === selectedGroup);
    }

    if (sortBy === 'Tên A–Z' || sortBy === 'Tên A-Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'Thời lượng tăng dần') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedSearch, selectedGroup, sortBy]);

  // Set lookup for fast saved check
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  const isSavedCallback = useCallback(
    (id: string) => savedSet.has(id),
    [savedSet]
  );

  const handleStart = useCallback(
    (exercise: Exercise) => {
      const idx = filteredAndSorted.findIndex((e) => e.id === exercise.id);
      startSession(filteredAndSorted, idx >= 0 ? idx : 0);
    },
    [filteredAndSorted, startSession]
  );

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSave(id);
    },
    [toggleSave]
  );

  const handleAddToSession = useCallback(
    (exercise: Exercise) => {
      addToSession(exercise);
    },
    [addToSession]
  );

  const handleAddToRoutine = useCallback(
    (exerciseId: string) => {
      if (!selectedRoutineId) return;
      routineDispatch({
        type: 'addExercise',
        payload: { routineId: selectedRoutineId, exerciseId },
      });
    },
    [selectedRoutineId, routineDispatch]
  );

  const itemData = useMemo<ExerciseRowData>(
    () => ({
      items: filteredAndSorted,
      isSaved: isSavedCallback,
      onStart: handleStart,
      onToggleSave: handleToggleSave,
      onAddToSession: handleAddToSession,
      onAddToRoutine: handleAddToRoutine,
      canAddToRoutine: Boolean(selectedRoutineId),
    }),
    [
      filteredAndSorted,
      isSavedCallback,
      handleStart,
      handleToggleSave,
      handleAddToSession,
      handleAddToRoutine,
      selectedRoutineId,
    ]
  );

  const getItemKey = useCallback(
    (index: number, data: ExerciseRowData) => data.items[index].id,
    []
  );

  return (
    <div className="library-page max-w-5xl mx-auto px-4 py-6">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Kho 10.000 bài tập
        </h1>
        <p className="page-subtitle text-sm text-gray-500 dark:text-gray-400">
          Tìm kiếm, phân loại nhóm cơ và thêm vào giáo án tập luyện của bạn
        </p>
      </div>

      {/* Control panel: search, filters, sort, routine select */}
      <div className="filter-panel mb-6">
        {/* Search */}
        <div className="filter-item">
          <label htmlFor="search-input" className="filter-label">
            Tìm kiếm
          </label>
          <div className="filter-control-wrap">
            <input
              id="search-input"
              type="text"
              placeholder="Tìm theo bài tập, HLV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-control"
            />
          </div>
        </div>

        {/* Muscle group select */}
        <div className="filter-item">
          <label htmlFor="group-select" className="filter-label">
            Nhóm cơ
          </label>
          <div className="filter-control-wrap">
            <select
              id="group-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="filter-control"
            >
              <option value="Tất cả">Tất cả</option>
              {GROUPS.map((g: MuscleGroup) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort select */}
        <div className="filter-item">
          <label htmlFor="sort-select" className="filter-label">
            Sắp xếp
          </label>
          <div className="filter-control-wrap">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-control"
            >
              <option value="Mặc định">Mặc định</option>
              <option value="Tên A–Z">Tên A–Z</option>
              <option value="Thời lượng tăng dần">Thời lượng tăng dần</option>
            </select>
          </div>
        </div>

        {/* Selected routine */}
        <div className="filter-item">
          <label htmlFor="routine-select" className="filter-label">
            Giáo án đang chọn
          </label>
          <div className="filter-control-wrap">
            <select
              id="routine-select"
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
              className="filter-control"
            >
              <option value="">-- Chọn giáo án --</option>
              {routines.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.exerciseIds.length} bài)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result count line */}
      <div className="result-status-bar mb-3" data-testid="result-count">
        {filteredAndSorted.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="status-badge-count">
              Tìm thấy {filteredAndSorted.length} bài tập
            </span>
            {selectedGroup !== 'Tất cả' && (
              <span className="filter-tag">Cơ: {selectedGroup}</span>
            )}
            {sortBy !== 'Mặc định' && (
              <span className="filter-tag">Xếp: {sortBy}</span>
            )}
          </div>
        ) : (
          <span className="status-badge-empty">Không tìm thấy bài tập nào</span>
        )}
      </div>

      {/* Virtualized list card */}
      <div className="virtual-list-container">
        <div className="list-header-row">
          <div className="col-stt">STT</div>
          <div className="col-info">Bài tập & Huấn luyện viên</div>
          <div className="col-time">Thời lượng</div>
          <div className="col-actions">Thao tác</div>
        </div>

        {filteredAndSorted.length > 0 ? (
          <FixedSizeList
            height={560}
            itemCount={filteredAndSorted.length}
            itemSize={56}
            itemData={itemData}
            itemKey={getItemKey}
            width="100%"
          >
            {ExerciseRow}
          </FixedSizeList>
        ) : (
          <div className="empty-list-notice">
            <div className="text-lg font-medium text-gray-500 mb-1">
              Không tìm thấy bài tập nào
            </div>
            <p className="text-xs text-gray-400">
              Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc nhóm cơ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
