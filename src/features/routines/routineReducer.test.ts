import { describe, it, expect } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from './routineReducer';

describe('Kiểm thử routineReducer cho giáo án', () => {
  it('tạo giáo án mới thành công với danh sách bài tập rỗng', () => {
    const initialState: Routine[] = [];
    const state = routineReducer(initialState, {
      type: 'create',
      payload: { name: 'Ngày ngực' },
    });

    expect(state).toHaveLength(1);
    expect(state[0].name).toBe('Ngày ngực');
    expect(state[0].exerciseIds).toEqual([]);
    expect(state[0].id).toBeDefined();
  });

  it('addExercise thêm bài tập vào giáo án và không thêm trùng bài', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Giáo án A', exerciseIds: ['e1'] },
    ];

    // Thêm bài e2
    const stateWithE2 = routineReducer(initialState, {
      type: 'addExercise',
      payload: { routineId: 'r1', exerciseId: 'e2' },
    });
    expect(stateWithE2[0].exerciseIds).toEqual(['e1', 'e2']);

    // Thêm lại bài e1 (đã tồn tại) -> không bị trùng
    const stateWithDuplicate = routineReducer(stateWithE2, {
      type: 'addExercise',
      payload: { routineId: 'r1', exerciseId: 'e1' },
    });
    expect(stateWithDuplicate[0].exerciseIds).toEqual(['e1', 'e2']);
  });

  it('removeExercise xóa bài tập khỏi giáo án thành công', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Giáo án A', exerciseIds: ['e1', 'e2'] },
    ];

    const nextState = routineReducer(initialState, {
      type: 'removeExercise',
      payload: { routineId: 'r1', exerciseId: 'e1' },
    });

    expect(nextState[0].exerciseIds).toEqual(['e2']);
  });

  it('xóa giáo án không tồn tại thì state giữ nguyên (toEqual)', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Giáo án A', exerciseIds: ['e1'] },
    ];

    const nextState = routineReducer(initialState, {
      type: 'remove',
      payload: { id: 'non-existing-id' },
    });

    expect(nextState).toEqual(initialState);
  });
});

