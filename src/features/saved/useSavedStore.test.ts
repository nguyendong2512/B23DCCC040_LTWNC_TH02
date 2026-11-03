import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('Kiểm thử useSavedStore cho bài tập đã lưu', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] });
  });

  it('toggle thêm id bài tập vào danh sách nếu chưa có', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);
  });

  it('toggle xóa id bài tập khỏi danh sách nếu đã tồn tại', () => {
    useSavedStore.setState({ ids: ['e1', 'e2'] });
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e2']);
  });
});

