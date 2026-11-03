import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 60 },
  { id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 45 },
];

describe('Kiểm thử store buổi tập useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('startSession đặt đúng bài và khởi động buổi tập', () => {
    const { startSession } = useSessionStore.getState();
    startSession(mockExercises, 1);

    const state = useSessionStore.getState();
    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(1);
    expect(state.queue[state.currentIndex].id).toBe('e2');
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    const { startSession } = useSessionStore.getState();
    startSession(mockExercises, 0); // e1 có duration 30

    // Đặt elapsed ở giây 29 (giây cuối)
    useSessionStore.setState({ elapsed: 29 });

    useSessionStore.getState().tick();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.queue[state.currentIndex].id).toBe('e2');
    expect(state.elapsed).toBe(0);
  });

  it('next ở bài cuối thì isRunning là false', () => {
    const { startSession } = useSessionStore.getState();
    startSession([mockExercises[0]], 0); // chỉ có 1 bài

    expect(useSessionStore.getState().isRunning).toBe(true);

    useSessionStore.getState().next();

    const state = useSessionStore.getState();
    expect(state.isRunning).toBe(false);
  });

  it('prev khi đã tập quá 3 giây chỉ đặt lại bài hiện tại về 0, ngược lại lùi về bài trước', () => {
    const { startSession } = useSessionStore.getState();
    startSession(mockExercises, 1); // Đang ở e2

    // Trường hợp 1: elapsed > 3 -> đặt lại về 0, index giữ nguyên
    useSessionStore.setState({ elapsed: 5 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().elapsed).toBe(0);
    expect(useSessionStore.getState().currentIndex).toBe(1);

    // Trường hợp 2: elapsed <= 3 -> lùi về bài trước (e1)
    useSessionStore.setState({ elapsed: 2 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('addToSession thêm bài vào cuối buổi tập và bỏ qua nếu đã có', () => {
    const { startSession, addToSession } = useSessionStore.getState();
    startSession([mockExercises[0]], 0);

    addToSession(mockExercises[1]);
    expect(useSessionStore.getState().queue).toHaveLength(2);

    // Thêm lại e1 đã có trong queue
    addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(2);
  });
});

