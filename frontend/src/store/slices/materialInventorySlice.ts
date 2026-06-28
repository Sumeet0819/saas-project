import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../apiClient';
import { MaterialInventory } from '../../types';

interface MaterialInventoryState {
  inventory: MaterialInventory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MaterialInventoryState = {
  inventory: [],
  status: 'idle',
  error: null,
};

export const fetchMaterialInventory = createAsyncThunk('materialInventory/fetchAll', async () => {
  const response = await apiClient.get('/material-inventory');
  return response.data;
});

export const fetchInventoryByProject = createAsyncThunk('materialInventory/fetchByProject', async (projectId: string) => {
  const response = await apiClient.get(`/material-inventory?project_id=${projectId}`);
  return response.data;
});

export const updateInventoryStock = createAsyncThunk('materialInventory/updateStock', async ({ id, data }: { id: string; data: Partial<MaterialInventory> }) => {
  const response = await apiClient.put(`/material-inventory/${id}`, data);
  return response.data;
});

export const createMaterialInventory = createAsyncThunk('materialInventory/create', async (data: Partial<MaterialInventory>) => {
  const response = await apiClient.post('/material-inventory', data);
  return response.data;
});

const materialInventorySlice = createSlice({
  name: 'materialInventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterialInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.inventory = action.payload;
      })
      .addCase(fetchMaterialInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch inventory';
      })
      .addCase(fetchInventoryByProject.fulfilled, (state, action) => {
        // Replace or merge? For simplicity, we just merge/update what we have
        const newItems = action.payload as MaterialInventory[];
        const itemIds = new Set(newItems.map(i => i.id));
        state.inventory = [...state.inventory.filter(i => !itemIds.has(i.id)), ...newItems];
      })
      .addCase(updateInventoryStock.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
      })
      .addCase(createMaterialInventory.fulfilled, (state, action) => {
        state.inventory.push(action.payload);
      });
  },
});

export default materialInventorySlice.reducer;
