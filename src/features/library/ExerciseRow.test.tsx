import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

const sampleExercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 30,
};

describe('Kiểm thử component ExerciseRow', () => {
  it('hiển thị tên bài tập và 0:30', () => {
    render(<ExerciseRow exercise={sampleExercise} index={0} />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('bấm nút Bắt đầu (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài tập', async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();

    render(
      <ExerciseRow
        exercise={sampleExercise}
        index={0}
        onStart={handleStart}
      />
    );

    const startButton = screen.getByRole('button', { name: 'Bắt đầu' });
    await user.click(startButton);

    expect(handleStart).toHaveBeenCalledTimes(1);
    expect(handleStart).toHaveBeenCalledWith(sampleExercise);
  });
});

