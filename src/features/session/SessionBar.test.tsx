import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 60 },
];

describe('Kiểm thử component SessionBar', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị Chưa bắt đầu buổi tập khi chưa có bài tập', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài đang tập và bấm nút Tạm dừng / Bắt đầu', async () => {
    const user = userEvent.setup();
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 0,
      isRunning: true,
      elapsed: 5,
    });

    render(<SessionBar />);
    expect(
      screen.getByText('Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang')
    ).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 2 bài')).toBeInTheDocument();

    const pauseButton = screen.getByRole('button', { name: 'Tạm dừng' });
    await user.click(pauseButton);
    expect(useSessionStore.getState().isRunning).toBe(false);

    const startButton = screen.getByRole('button', { name: 'Bắt đầu' });
    await user.click(startButton);
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('bấm Sau để chuyển bài tập tiếp theo', async () => {
    const user = userEvent.setup();
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
    });

    render(<SessionBar />);
    const nextButton = screen.getByRole('button', { name: 'Sau' });
    await user.click(nextButton);

    expect(useSessionStore.getState().currentIndex).toBe(1);
  });
});

