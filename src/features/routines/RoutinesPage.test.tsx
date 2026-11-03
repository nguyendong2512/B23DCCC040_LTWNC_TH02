import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoutinesPage } from './RoutinesPage';
import { RoutineProvider } from './RoutineContext';

function renderWithProviders(ui: ReactNode) {
  return render(
    <RoutineProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </RoutineProvider>
  );
}

describe('Kiểm thử trang quản lý giáo án RoutinesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bấm Tạo khi ô trống thì thấy "Tên giáo án không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createButton);

    expect(
      screen.getByText('Tên giáo án không được để trống')
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByLabelText(/Tên giáo án/i);
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Giáo án thể lực');
    await user.click(createButton);

    expect(screen.getByText('Giáo án thể lực')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('báo lỗi khi tạo giáo án có tên trùng lặp không phân biệt hoa thường', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByLabelText(/Tên giáo án/i);
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Ngày ngực');
    await user.click(createButton);

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();

    // Nhập trùng tên khác hoa thường
    await user.type(input, 'ngày NGỰC');
    await user.click(createButton);

    expect(screen.getByText('Tên giáo án đã tồn tại.')).toBeInTheDocument();
  });
});

