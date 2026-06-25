import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  colorTheme: string;
  activeProjectId: string | null;
  preferencesOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light', 
  colorTheme: 'blue',
  activeProjectId: null,
  preferencesOpen: false,
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
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setColorTheme: (state, action: PayloadAction<string>) => {
      state.colorTheme = action.payload;
    },
    togglePreferences: (state) => {
      state.preferencesOpen = !state.preferencesOpen;
    },
    setPreferencesOpen: (state, action: PayloadAction<boolean>) => {
      state.preferencesOpen = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const { 
  toggleSidebar, 
  setSidebarOpen, 
  toggleTheme, 
  setTheme, 
  setColorTheme,
  togglePreferences,
  setPreferencesOpen,
  setActiveProject 
} = uiSlice.actions;

export default uiSlice.reducer;
