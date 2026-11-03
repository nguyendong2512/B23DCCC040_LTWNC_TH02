import { describe, it, expect } from 'vitest';
import { generateExercises } from './exercises';

describe('Hàm sinh dữ liệu bài tập giả lập', () => {
  it('generateExercises(10000) sinh đúng 10000 phần tử', () => {
    const list = generateExercises(10000);
    expect(list).toHaveLength(10000);
  });

  it('tất cả các bài tập có id duy nhất không bị trùng lặp', () => {
    const list = generateExercises(10000);
    const idSet = new Set(list.map((e) => e.id));
    expect(idSet.size).toBe(10000);
  });

  it('mọi bài tập đều có thời lượng nằm trong khoảng từ 30 đến 120 giây', () => {
    const list = generateExercises(10000);
    const allInRange = list.every((e) => e.duration >= 30 && e.duration <= 120);
    expect(allInRange).toBe(true);
  });
});

