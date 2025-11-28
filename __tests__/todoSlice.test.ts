import reducer, { addTodo, toggleTodo, removeTodo } from '../src/store/slices/todoSlice';

describe('todo slice', () => {
  it('should add a todo', () => {
    const initialState = { items: [] };
    const next = reducer(initialState as any, addTodo({ id: '1', title: 'Test' }));
    expect(next.items.length).toBe(1);
    expect(next.items[0].title).toBe('Test');
  });

  it('should toggle a todo', () => {
    const initialState = { items: [{ id: '1', title: 'T', completed: false, createdAt: new Date().toISOString() }] };
    const next = reducer(initialState as any, toggleTodo({ id: '1' }));
    expect(next.items[0].completed).toBe(true);
  });

  it('should remove a todo', () => {
    const initialState = { items: [{ id: '1', title: 'T', completed: false, createdAt: new Date().toISOString() }] };
    const next = reducer(initialState as any, removeTodo({ id: '1' }));
    expect(next.items.length).toBe(0);
  });
});
