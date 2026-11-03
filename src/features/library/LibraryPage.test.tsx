import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LibraryPage } from './LibraryPage';
import { RoutineProvider } from '../routines/RoutineContext';
import { useSessionStore } from '../session/useSessionStore';

const mockRoutines = [
  { id: 'r1', name: 'Giáo án ngực', exerciseIds: [] },
];

function renderLibrary() {
  return render(
    <RoutineProvider initialRoutines={mockRoutines}>
      <MemoryRouter>
        <LibraryPage />
      </MemoryRouter>
    </RoutineProvider>
  );
}

describe('Kiểm thử trang Kho bài tập LibraryPage', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị tiêu đề và số lượng 10000 bài tập ban đầu', () => {
    renderLibrary();
    expect(screen.getByText('Kho 10.000 bài tập')).toBeInTheDocument();
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });

  it('lọc theo nhóm cơ Chân', async () => {
    const user = userEvent.setup();
    renderLibrary();

    const groupSelect = screen.getByLabelText('Nhóm cơ');
    await user.selectOptions(groupSelect, 'Chân');

    expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument();
  });

  it('sắp xếp theo Thời lượng tăng dần và Tên A-Z', async () => {
    const user = userEvent.setup();
    renderLibrary();

    const sortSelect = screen.getByLabelText('Sắp xếp');
    await user.selectOptions(sortSelect, 'Thời lượng tăng dần');
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    await user.selectOptions(sortSelect, 'Tên A–Z');
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });

  it('tìm kiếm không có kết quả hiển thị thông báo Không tìm thấy bài tập nào', async () => {
    const user = userEvent.setup();
    renderLibrary();

    const searchInput = screen.getByLabelText('Tìm kiếm');
    await user.type(searchInput, 'xyz123456');

    // Chờ debounce 300ms
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });

    const notFoundElements = screen.getAllByText('Không tìm thấy bài tập nào');
    expect(notFoundElements.length).toBeGreaterThan(0);
  });

  it('chọn giáo án và kích hoạt nút + Giáo án', async () => {
    const user = userEvent.setup();
    renderLibrary();

    const routineSelect = screen.getByLabelText('Giáo án đang chọn');
    await user.selectOptions(routineSelect, 'r1');

    const addRoutineButtons = screen.getAllByRole('button', { name: '+ Giáo án' });
    expect(addRoutineButtons[0]).not.toBeDisabled();

    await user.click(addRoutineButtons[0]);
  });
});

