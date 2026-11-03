import { memo } from 'react';
import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export const CountdownBar = memo(function CountdownBar() {
  const elapsed = useSessionStore((s) => s.elapsed);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  if (!currentExercise) {
    return (
      <div className="countdown-container">
        <div className="countdown-labels">
          <span className="countdown-time">Còn lại: 0:00</span>
          <span className="countdown-percent">0%</span>
        </div>
        <div className="countdown-track">
          <div className="countdown-fill" style={{ width: '0%' }} />
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, currentExercise.duration - elapsed);
  const percent = Math.min(100, Math.round((elapsed / currentExercise.duration) * 100));

  return (
    <div className="countdown-container">
      <div className="countdown-labels">
        <span className="countdown-time">
          Còn lại: {formatDuration(remaining)}
        </span>
        <span className="countdown-percent">{percent}%</span>
      </div>
      <div className="countdown-track">
        <div
          className="countdown-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

export default CountdownBar;
