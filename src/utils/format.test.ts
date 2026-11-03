import { describe, it, expect } from 'vitest';
import { formatDuration, formatMinutesSeconds } from './format';

describe('Định dạng thời gian', () => {
  it('formatDuration chuyển đổi 0 thành 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formatDuration chuyển đổi 67 thành 1:07', () => {
    expect(formatDuration(67)).toBe('1:07');
  });

  it('formatDuration chuyển đổi 120 thành 2:00', () => {
    expect(formatDuration(120)).toBe('2:00');
  });

  it('formatMinutesSeconds định dạng tổng thời gian dạng X phút Y giây', () => {
    expect(formatMinutesSeconds(97)).toBe('1 phút 37 giây');
    expect(formatMinutesSeconds(0)).toBe('0 phút 0 giây');
  });
});

