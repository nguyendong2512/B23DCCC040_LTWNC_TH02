import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownBar } from './CountdownBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 60,
};

describe('Kiểm thử component CountdownBar', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị trạng thái mặc định khi chưa bắt đầu buổi tập', () => {
    render(<CountdownBar />);
    expect(screen.getByText('Còn lại: 0:00')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('hiển thị đúng thời gian còn lại và phần trăm tiến trình khi có bài tập đang chạy', () => {
    useSessionStore.setState({
      queue: [mockExercise],
      currentIndex: 0,
      isRunning: true,
      elapsed: 15, // 60 - 15 = 45s -> 0:45; 15/60 = 25%
    });

    render(<CountdownBar />);
    expect(screen.getByText('Còn lại: 0:45')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});

