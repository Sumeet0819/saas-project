import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SiteActivity } from '../../types';
import api from '../../services/api';

interface SiteActivitiesState {
  activities: SiteActivity[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SiteActivitiesState = {
  activities: [],
  status: 'idle',
  error: null,
};

export const fetchSiteActivitiesByProject = createAsyncThunk(
  'siteActivities/fetchByProject',
  async (projectId: string) => {
    const response = await api.get(`/site-activities?project_id=${projectId}`);
    return response.data as SiteActivity[];
  }
);

export const createSiteActivity = createAsyncThunk(
  'siteActivities/create',
  async (body: Partial<SiteActivity>) => {
    const response = await api.post('/site-activities', body);
    return response.data as SiteActivity;
  }
);

export const updateSiteActivity = createAsyncThunk(
  'siteActivities/update',
  async ({ id, body }: { id: string; body: Partial<SiteActivity> }) => {
    const response = await api.patch(`/site-activities/${id}`, body);
    return response.data as SiteActivity;
  }
);

export const deleteSiteActivity = createAsyncThunk(
  'siteActivities/delete',
  async (id: string) => {
    await api.delete(`/site-activities/${id}`);
    return id;
  }
);

const siteActivitiesSlice = createSlice({
  name: 'siteActivities',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteActivitiesByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSiteActivitiesByProject.fulfilled, (state, action: PayloadAction<SiteActivity[]>) => {
        state.status = 'succeeded';
        state.activities = action.payload;
      })
      .addCase(fetchSiteActivitiesByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch site activities';
      })
      .addCase(createSiteActivity.fulfilled, (state, action: PayloadAction<SiteActivity>) => {
        state.activities.unshift(action.payload);
      })
      .addCase(updateSiteActivity.fulfilled, (state, action: PayloadAction<SiteActivity>) => {
        const index = state.activities.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      .addCase(deleteSiteActivity.fulfilled, (state, action: PayloadAction<string>) => {
        state.activities = state.activities.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearActivities } = siteActivitiesSlice.actions;
export default siteActivitiesSlice.reducer;
