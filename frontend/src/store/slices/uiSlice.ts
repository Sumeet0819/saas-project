import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeProjectId: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'dark', // default to dark as per requirements
  activeProjectId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Side effect for document is better handled in a hook or listener, 
      // but we store the state here.
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme, setActiveProject } = uiSlice.actions;

export default uiSlice.reducer;
