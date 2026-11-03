import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoutineDetailPage } from './RoutineDetailPage';
import { RoutineProvider } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';

const initialRoutines = [
  {
    id: 'r1',
    name: 'Ngày ngực',
    exerciseIds: ['e1', 'e2'], // e1 = 30s, e2 = 67s -> tổng 97s = 1 phút 37 giây
  },
];

function renderDetail(routePath = '/routines/r1') {
  return render(
    <RoutineProvider initialRoutines={initialRoutines}>
      <MemoryRouter initialEntries={[routePath]}>
        <Routes>
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
          <Route path="/routines" element={<div>Danh sách giáo án</div>} />
        </Routes>
      </MemoryRouter>
    </RoutineProvider>
  );
}

describe('Kiểm thử trang chi tiết giáo án RoutineDetailPage', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị thông báo khi không tìm thấy giáo án', () => {
    renderDetail('/routines/unknown');
    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('hiển thị tên giáo án, số bài tập và tổng thời gian tính bằng reduce', () => {
    renderDetail('/routines/r1');

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('Tổng số: 2 bài tập')).toBeInTheDocument();
    expect(
      screen.getByText('Tổng thời gian: 1 phút 37 giây')
    ).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
  });

  it('bấm Tập tất cả để bắt đầu buổi tập cho toàn bộ bài trong giáo án', async () => {
    const user = userEvent.setup();
    renderDetail('/routines/r1');

    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    await user.click(startAllBtn);

    expect(useSessionStore.getState().queue).toHaveLength(2);
    expect(useSessionStore.getState().isRunning).toBe(true);
    expect(useSessionStore.getState().queue[0].name).toBe('Đẩy tạ đơn 1');
  });

  it('bấm Bỏ để xóa bài tập khỏi giáo án', async () => {
    const user = userEvent.setup();
    renderDetail('/routines/r1');

    const removeButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    await user.click(removeButtons[0]);

    // Sau khi bỏ e1, chỉ còn 1 bài e2
    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
  });
});

