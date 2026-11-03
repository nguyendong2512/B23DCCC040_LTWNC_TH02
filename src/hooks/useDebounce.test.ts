import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Kiểm thử hook useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị: trước 300ms vẫn là giá trị cũ, sau vi.advanceTimersByTime(300) là giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: 'đẩy', delay: 300 },
      }
    );

    expect(result.current).toBe('đẩy');

    // Đổi giá trị mới
    rerender({ value: 'kéo', delay: 300 });

    // Trước 300ms (ví dụ sau 200ms) vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('đẩy');

    // Sau khi đủ 300ms (tiến thêm 100ms nữa)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('kéo');
  });
});

