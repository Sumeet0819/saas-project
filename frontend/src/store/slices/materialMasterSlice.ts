import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../apiClient';
import { MaterialMaster } from '../../types';

interface MaterialMasterState {
  materials: MaterialMaster[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MaterialMasterState = {
  materials: [],
  status: 'idle',
  error: null,
};

export const fetchMaterialMaster = createAsyncThunk('materialMaster/fetchAll', async () => {
  const response = await apiClient.get('/material-master');
  return response.data;
});

export const createMaterialMaster = createAsyncThunk('materialMaster/create', async (material: Partial<MaterialMaster>) => {
  const response = await apiClient.post('/material-master', material);
  return response.data;
});

export const updateMaterialMaster = createAsyncThunk('materialMaster/update', async ({ id, data }: { id: string; data: Partial<MaterialMaster> }) => {
  const response = await apiClient.put(`/material-master/${id}`, data);
  return response.data;
});

export const deleteMaterialMaster = createAsyncThunk('materialMaster/delete', async (id: string) => {
  await apiClient.delete(`/material-master/${id}`);
  return id;
});

const materialMasterSlice = createSlice({
  name: 'materialMaster',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialMaster.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterialMaster.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = action.payload;
      })
      .addCase(fetchMaterialMaster.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch material master';
      })
      .addCase(createMaterialMaster.fulfilled, (state, action) => {
        state.materials.push(action.payload);
      })
      .addCase(updateMaterialMaster.fulfilled, (state, action) => {
        const index = state.materials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
      })
      .addCase(deleteMaterialMaster.fulfilled, (state, action) => {
        state.materials = state.materials.filter(m => m.id !== action.payload);
      });
  },
});

export default materialMasterSlice.reducer;
