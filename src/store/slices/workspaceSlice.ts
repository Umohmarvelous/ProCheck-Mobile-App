import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WorkspaceItem = {
  id: string;
  title: string;
  createdAt: string;
  owner: string;
  description?: string;
  tags?: string[];
};

export type WorkspaceList = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  owner: string;
  items: WorkspaceItem[];
};

type State = {
  lists: WorkspaceList[];
};

const initialState: State = { lists: [] };

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<WorkspaceList>) => {
      state.lists.unshift(action.payload);
    },
    updateList: (state, action: PayloadAction<{ id: string; data: Partial<WorkspaceList> }>) => {
      const idx = state.lists.findIndex((l) => l.id === action.payload.id);
      if (idx >= 0) state.lists[idx] = { ...state.lists[idx], ...action.payload.data };
    },
    deleteList: (state, action: PayloadAction<{ id: string }>) => {
      state.lists = state.lists.filter((l) => l.id !== action.payload.id);
    },
    importTextAsList: (state, action: PayloadAction<{ id: string; name: string; content: string; owner: string }>) => {
      const createdAt = new Date().toISOString();
      const list = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.content.slice(0, 200),
        createdAt,
        owner: action.payload.owner,
        items: [
          {
            id: `${action.payload.id}-item-1`,
            title: action.payload.content.slice(0, 140),
            createdAt,
            owner: action.payload.owner,
          },
        ],
      } as WorkspaceList;
      state.lists.unshift(list);
    },
    addMediaToList: (state, action: PayloadAction<{ listId?: string; item: WorkspaceItem }>) => {
      if (action.payload.listId) {
        const list = state.lists.find((l) => l.id === action.payload.listId);
        if (list) list.items.unshift(action.payload.item);
      } else {
        // create a default list for media
        state.lists.unshift({
          id: action.payload.item.id + '-list',
          name: 'Media',
          description: 'Imported media',
          createdAt: new Date().toISOString(),
          owner: action.payload.item.owner,
          items: [action.payload.item],
        });
      }
    },
  },
});

export const { addList, updateList, deleteList, importTextAsList, addMediaToList } = workspaceSlice.actions;
export default workspaceSlice.reducer;
