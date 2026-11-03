import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowData {
  items: Exercise[];
  isSaved?: (id: string) => boolean;
  onStart?: (exercise: Exercise) => void;
  onToggleSave?: (id: string) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exerciseId: string) => void;
  canAddToRoutine?: boolean;
}

export interface ExerciseRowProps {
  index: number;
  style?: CSSProperties;
  exercise?: Exercise;
  data?: ExerciseRowData;
  isSaved?: boolean;
  onStart?: (exercise: Exercise) => void;
  onToggleSave?: (id: string) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exerciseId: string) => void;
  canAddToRoutine?: boolean;
}

export const ExerciseRow = memo(function ExerciseRow({
  index,
  style,
  exercise: directExercise,
  data,
  isSaved: directIsSaved,
  onStart: directOnStart,
  onToggleSave: directOnToggleSave,
  onAddToSession: directOnAddToSession,
  onAddToRoutine: directOnAddToRoutine,
  canAddToRoutine: directCanAddToRoutine,
}: ExerciseRowProps) {
  const exercise = directExercise ?? data?.items[index];
  if (!exercise) return null;

  const isSaved = directIsSaved ?? (data?.isSaved ? data.isSaved(exercise.id) : false);
  const onStart = directOnStart ?? data?.onStart;
  const onToggleSave = directOnToggleSave ?? data?.onToggleSave;
  const onAddToSession = directOnAddToSession ?? data?.onAddToSession;
  const onAddToRoutine = directOnAddToRoutine ?? data?.onAddToRoutine;
  const canAddToRoutine = directCanAddToRoutine ?? (data?.canAddToRoutine ?? false);

  return (
    <div
      style={style}
      className="exercise-row"
      data-testid={`exercise-row-${exercise.id}`}
    >
      <div className="col-stt">#{index + 1}</div>

      <div className="col-info">
        <div className="exercise-name">{exercise.name}</div>
        <div className="exercise-meta">
          HLV: <span className="meta-hlv">{exercise.trainer}</span>
          <span className="meta-divider">•</span>
          <span className="meta-group">{exercise.group}</span>
        </div>
      </div>

      <div className="col-time font-mono">
        {formatDuration(exercise.duration)}
      </div>

      <div className="col-actions">
        <button
          type="button"
          onClick={() => onStart?.(exercise)}
          className="btn-action btn-start"
          title="Bắt đầu tập ngay"
        >
          Bắt đầu
        </button>

        <button
          type="button"
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
          onClick={() => onToggleSave?.(exercise.id)}
          className={`btn-action btn-save ${isSaved ? 'saved' : ''}`}
          title={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
        >
          {isSaved ? '★' : '☆'}
        </button>

        <button
          type="button"
          onClick={() => onAddToSession?.(exercise)}
          className="btn-action btn-add-session"
          title="Thêm vào buổi tập hiện tại"
        >
          + Buổi tập
        </button>

        <button
          type="button"
          disabled={!canAddToRoutine}
          onClick={() => onAddToRoutine?.(exercise.id)}
          className="btn-action btn-add-routine"
          title={
            canAddToRoutine
              ? 'Thêm vào giáo án đã chọn'
              : 'Hãy chọn giáo án ở trên để thêm bài'
          }
        >
          + Giáo án
        </button>
      </div>
    </div>
  );
});

export default ExerciseRow;
