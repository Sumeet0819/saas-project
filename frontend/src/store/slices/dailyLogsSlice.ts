import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DailyLog } from '../../types';
import api from '../../services/api';

interface DailyLogsState {
  logs: DailyLog[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DailyLogsState = {
  logs: [],
  status: 'idle',
  error: null,
};

export const fetchDailyLogsByProject = createAsyncThunk(
  'dailyLogs/fetchByProject',
  async (projectId: string) => {
    const response = await api.get(`/daily-logs?project_id=${projectId}`);
    return response.data as DailyLog[];
  }
);

export const createDailyLog = createAsyncThunk(
  'dailyLogs/create',
  async (body: Partial<DailyLog>) => {
    const response = await api.post('/daily-logs', body);
    return response.data as DailyLog;
  }
);

export const updateDailyLog = createAsyncThunk(
  'dailyLogs/update',
  async ({ id, body }: { id: string; body: Partial<DailyLog> }) => {
    const response = await api.patch(`/daily-logs/${id}`, body);
    return response.data as DailyLog;
  }
);

export const deleteDailyLog = createAsyncThunk(
  'dailyLogs/delete',
  async (id: string) => {
    await api.delete(`/daily-logs/${id}`);
    return id;
  }
);

const dailyLogsSlice = createSlice({
  name: 'dailyLogs',
  initialState,
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyLogsByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyLogsByProject.fulfilled, (state, action: PayloadAction<DailyLog[]>) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchDailyLogsByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch daily logs';
      })
      .addCase(createDailyLog.fulfilled, (state, action: PayloadAction<DailyLog>) => {
        state.logs.unshift(action.payload);
      })
      .addCase(updateDailyLog.fulfilled, (state, action: PayloadAction<DailyLog>) => {
        const index = state.logs.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.logs[index] = action.payload;
        }
      })
      .addCase(deleteDailyLog.fulfilled, (state, action: PayloadAction<string>) => {
        state.logs = state.logs.filter((l) => l.id !== action.payload);
      });
  },
});

export const { clearLogs } = dailyLogsSlice.actions;
export default dailyLogsSlice.reducer;
