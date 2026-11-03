import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavedPage } from './SavedPage';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';

describe('Kiểm thử trang bài tập đã lưu SavedPage', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị thông báo khi chưa có bài tập nào được lưu', () => {
    render(<SavedPage />);
    expect(screen.getByText('Bạn chưa lưu bài tập nào.')).toBeInTheDocument();
  });

  it('hiển thị danh sách bài tập đã lưu và bấm nút Tập tất cả', async () => {
    const user = userEvent.setup();
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);
    expect(screen.getByText('2 bài tập đã được lưu')).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();

    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    await user.click(startAllBtn);

    expect(useSessionStore.getState().queue).toHaveLength(2);
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('bấm Bỏ lưu để xóa bài khỏi danh sách đã lưu', async () => {
    const user = userEvent.setup();
    useSavedStore.setState({ ids: ['e1'] });

    render(<SavedPage />);
    const removeBtn = screen.getByRole('button', { name: 'Bỏ lưu' });
    await user.click(removeBtn);

    expect(useSavedStore.getState().ids).toHaveLength(0);
  });
});

