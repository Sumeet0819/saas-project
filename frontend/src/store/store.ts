import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { injectStore } from '../services/api';

import organizationsReducer from './slices/organizationsSlice';
import usersReducer from './slices/usersSlice';
import projectsReducer from './slices/projectsSlice';
import workersReducer from './slices/workersSlice';
import materialMasterReducer from './slices/materialMasterSlice';
import materialInventoryReducer from './slices/materialInventorySlice';
import materialRequestsReducer from './slices/materialRequestsSlice';
import dailyLogsReducer from './slices/dailyLogsSlice';
import siteActivitiesReducer from './slices/siteActivitiesSlice';
import siteIssuesReducer from './slices/siteIssuesSlice';
import sitePhotosReducer from './slices/sitePhotosSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
    organizations: organizationsReducer,
    users: usersReducer,
    projects: projectsReducer,
    workers: workersReducer,
    materialMaster: materialMasterReducer,
    materialInventory: materialInventoryReducer,
    materialRequests: materialRequestsReducer,
    dailyLogs: dailyLogsReducer,
    siteActivities: siteActivitiesReducer,
    siteIssues: siteIssuesReducer,
    sitePhotos: sitePhotosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
