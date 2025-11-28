import reducer, { addList, importTextAsList } from '../src/store/slices/workspaceSlice';

describe('workspace slice', () => {
  it('adds list', () => {
    const initial = { lists: [] };
    const list = { id: '1', name: 'L', description: 'd', createdAt: new Date().toISOString(), owner: 'me', items: [] };
    const next = reducer(initial as any, addList(list as any));
    expect(next.lists.length).toBe(1);
    expect(next.lists[0].name).toBe('L');
  });

  it('imports text as list', () => {
    const initial = { lists: [] };
    const next = reducer(initial as any, importTextAsList({ id: '2', name: 'Imp', content: 'hello world', owner: 'me' } as any));
    expect(next.lists.length).toBe(1);
    expect(next.lists[0].items.length).toBe(1);
  });
});
