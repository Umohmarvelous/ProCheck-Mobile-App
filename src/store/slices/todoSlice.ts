import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

type State = {
  items: Todo[];
};

const initialState: State = { items: [] };

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      state.items.unshift({ id: action.payload.id, title: action.payload.title, completed: false, createdAt: new Date().toISOString() });
    },
    toggleTodo: (state, action: PayloadAction<{ id: string }>) => {
      const t = state.items.find((i) => i.id === action.payload.id);
      if (t) t.completed = !t.completed;
    },
    removeTodo: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, setTodos } = todoSlice.actions;
export default todoSlice.reducer;
