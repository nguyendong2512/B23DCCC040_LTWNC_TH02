import { useEffect, useCallback } from 'react';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';

export const SessionBar = () => {
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );
  const isRunning = useSessionStore((s) => s.isRunning);
  const queueLength = useSessionStore((s) => s.queue.length);
  const tick = useSessionStore((s) => s.tick);
  const toggleRun = useSessionStore((s) => s.toggleRun);
  const next = useSessionStore((s) => s.next);
  const prev = useSessionStore((s) => s.prev);

  // Interval timer tick
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Keyboard shortcut: Space to play/pause (ignore if focusing input/textarea/select)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        const tagName = target?.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          return;
        }
        e.preventDefault();
        toggleRun();
      }
    },
    [toggleRun]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <footer className="session-bar">
      <div className="session-bar-inner">
        {/* Info bài tập đang tập */}
        <div className="session-info">
          {currentExercise ? (
            <div className="session-exercise-name" title={`${currentExercise.name} – HLV ${currentExercise.trainer}`}>
              Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
            </div>
          ) : (
            <div className="session-exercise-empty">
              Chưa bắt đầu buổi tập
            </div>
          )}
          <div className="session-queue-count">
            Buổi tập: {queueLength} bài
          </div>
        </div>

        {/* CountdownBar (chỉ component này đọc elapsed) */}
        <div className="session-countdown-wrapper">
          <CountdownBar />
        </div>

        {/* Controls */}
        <div className="session-controls">
          <button
            type="button"
            onClick={prev}
            disabled={queueLength === 0}
            className="btn-player btn-player-nav"
            title="Lùi bài trước / Bắt đầu lại (khi > 3s)"
          >
            Trước
          </button>
          <button
            type="button"
            onClick={toggleRun}
            disabled={queueLength === 0}
            className={`btn-player btn-player-main ${
              isRunning ? 'btn-player-pause' : 'btn-player-start'
            }`}
            title="Bắt đầu / Tạm dừng (phím Space)"
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={queueLength === 0}
            className="btn-player btn-player-nav"
            title="Chuyển sang bài tiếp theo"
          >
            Sau
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SessionBar;
