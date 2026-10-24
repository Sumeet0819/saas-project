import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SiteIssue } from '../../types';
import api from '../../services/api';

interface SiteIssuesState {
  issues: SiteIssue[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SiteIssuesState = {
  issues: [],
  status: 'idle',
  error: null,
};

export const fetchSiteIssuesByProject = createAsyncThunk(
  'siteIssues/fetchByProject',
  async (projectId: string) => {
    const response = await api.get(`/site-issues?project_id=${projectId}`);
    return response.data as SiteIssue[];
  }
);

export const createSiteIssue = createAsyncThunk(
  'siteIssues/create',
  async (body: Partial<SiteIssue>) => {
    const response = await api.post('/site-issues', body);
    return response.data as SiteIssue;
  }
);

export const updateSiteIssue = createAsyncThunk(
  'siteIssues/update',
  async ({ id, body }: { id: string; body: Partial<SiteIssue> }) => {
    const response = await api.patch(`/site-issues/${id}`, body);
    return response.data as SiteIssue;
  }
);

export const deleteSiteIssue = createAsyncThunk(
  'siteIssues/delete',
  async (id: string) => {
    await api.delete(`/site-issues/${id}`);
    return id;
  }
);

const siteIssuesSlice = createSlice({
  name: 'siteIssues',
  initialState,
  reducers: {
    clearIssues: (state) => {
      state.issues = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteIssuesByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSiteIssuesByProject.fulfilled, (state, action: PayloadAction<SiteIssue[]>) => {
        state.status = 'succeeded';
        state.issues = action.payload;
      })
      .addCase(fetchSiteIssuesByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch site issues';
      })
      .addCase(createSiteIssue.fulfilled, (state, action: PayloadAction<SiteIssue>) => {
        state.issues.unshift(action.payload);
      })
      .addCase(updateSiteIssue.fulfilled, (state, action: PayloadAction<SiteIssue>) => {
        const index = state.issues.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.issues[index] = action.payload;
        }
      })
      .addCase(deleteSiteIssue.fulfilled, (state, action: PayloadAction<string>) => {
        state.issues = state.issues.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearIssues } = siteIssuesSlice.actions;
export default siteIssuesSlice.reducer;
