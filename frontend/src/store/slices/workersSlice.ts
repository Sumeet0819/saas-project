import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Worker } from '../../types';
import { apiClient } from '../apiClient';

interface WorkersState {
  workers: Worker[];
  currentWorker: Worker | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WorkersState = {
  workers: [],
  currentWorker: null,
  status: 'idle',
  error: null,
};

export const fetchWorkers = createAsyncThunk('workers/fetchWorkers', async () => {
  const response = await apiClient.get('/workers');
  return response.data;
});

export const fetchWorkerById = createAsyncThunk('workers/fetchWorkerById', async (id: string) => {
  const response = await apiClient.get(`/workers/${id}`);
  return response.data;
});

export const createWorker = createAsyncThunk('workers/createWorker', async (body: Partial<Worker>) => {
  const response = await apiClient.post('/workers', body);
  return response.data;
});

export const updateWorker = createAsyncThunk('workers/updateWorker', async ({ id, body }: { id: string; body: Partial<Worker> }) => {
  const response = await apiClient.put(`/workers/${id}`, body);
  return response.data;
});

export const deleteWorker = createAsyncThunk('workers/deleteWorker', async (id: string) => {
  await apiClient.delete(`/workers/${id}`);
  return id;
});

const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    clearCurrentWorker: (state) => {
      state.currentWorker = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchWorkers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkers.fulfilled, (state, action: PayloadAction<Worker[]>) => {
        state.status = 'succeeded';
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch workers';
      })
      // Fetch one
      .addCase(fetchWorkerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkerById.fulfilled, (state, action: PayloadAction<Worker>) => {
        state.status = 'succeeded';
        state.currentWorker = action.payload;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch worker details';
      })
      // Create
      .addCase(createWorker.fulfilled, (state, action: PayloadAction<Worker>) => {
        state.workers.push(action.payload);
      })
      // Update
      .addCase(updateWorker.fulfilled, (state, action: PayloadAction<Worker>) => {
        const index = state.workers.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workers[index] = action.payload;
        }
        if (state.currentWorker?.id === action.payload.id) {
          state.currentWorker = action.payload;
        }
      })
      // Delete
      .addCase(deleteWorker.fulfilled, (state, action: PayloadAction<string>) => {
        state.workers = state.workers.filter(w => w.id !== action.payload);
      });
  },
});

export const { clearCurrentWorker } = workersSlice.actions;
export default workersSlice.reducer;
