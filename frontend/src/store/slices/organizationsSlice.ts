import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Organization } from '../../types';
import { apiClient } from '../apiClient';

interface OrganizationsState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  currentOrganization: null,
  status: 'idle',
  error: null,
};

export const fetchOrganizations = createAsyncThunk('organizations/fetchOrganizations', async () => {
  const response = await apiClient.get('/organizations');
  return response.data;
});

export const fetchOrganizationById = createAsyncThunk('organizations/fetchOrganizationById', async (id: string) => {
  const response = await apiClient.get(`/organizations/${id}`);
  return response.data;
});

export const createOrganization = createAsyncThunk('organizations/createOrganization', async (body: Partial<Organization>) => {
  const response = await apiClient.post('/organizations', body);
  return response.data;
});

export const updateOrganization = createAsyncThunk('organizations/updateOrganization', async ({ id, body }: { id: string; body: Partial<Organization> }) => {
  const response = await apiClient.put(`/organizations/${id}`, body);
  return response.data;
});

export const deleteOrganization = createAsyncThunk('organizations/deleteOrganization', async (id: string) => {
  await apiClient.delete(`/organizations/${id}`);
  return id;
});

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearCurrentOrganization: (state) => {
      state.currentOrganization = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizations.fulfilled, (state, action: PayloadAction<Organization[]>) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch organizations';
      })
      // Fetch one
      .addCase(fetchOrganizationById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action: PayloadAction<Organization>) => {
        state.status = 'succeeded';
        state.currentOrganization = action.payload;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch organization details';
      })
      // Create
      .addCase(createOrganization.fulfilled, (state, action: PayloadAction<Organization>) => {
        state.organizations.push(action.payload);
      })
      // Update
      .addCase(updateOrganization.fulfilled, (state, action: PayloadAction<Organization>) => {
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
      })
      // Delete
      .addCase(deleteOrganization.fulfilled, (state, action: PayloadAction<string>) => {
        state.organizations = state.organizations.filter(org => org.id !== action.payload);
      });
  },
});

export const { clearCurrentOrganization } = organizationsSlice.actions;
export default organizationsSlice.reducer;
