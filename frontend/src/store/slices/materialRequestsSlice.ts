import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../apiClient';
import { MaterialRequest } from '../../types';

interface MaterialRequestsState {
  requests: MaterialRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MaterialRequestsState = {
  requests: [],
  status: 'idle',
  error: null,
};

export const fetchMaterialRequests = createAsyncThunk('materialRequests/fetchAll', async () => {
  const response = await apiClient.get('/material-requests');
  return response.data;
});

export const createMaterialRequest = createAsyncThunk('materialRequests/create', async (data: Partial<MaterialRequest>) => {
  const response = await apiClient.post('/material-requests', data);
  return response.data;
});

export const updateMaterialRequest = createAsyncThunk('materialRequests/update', async ({ id, data }: { id: string; data: Partial<MaterialRequest> }) => {
  const response = await apiClient.put(`/material-requests/${id}`, data);
  return response.data;
});

export const deleteMaterialRequest = createAsyncThunk('materialRequests/delete', async (id: string) => {
  await apiClient.delete(`/material-requests/${id}`);
  return id;
});

const materialRequestsSlice = createSlice({
  name: 'materialRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterialRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchMaterialRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch material requests';
      })
      .addCase(createMaterialRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(updateMaterialRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(deleteMaterialRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(r => r.id !== action.payload);
      });
  },
});

export default materialRequestsSlice.reducer;
