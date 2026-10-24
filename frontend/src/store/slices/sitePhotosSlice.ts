import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SitePhoto } from '../../types';
import api from '../../services/api';

interface SitePhotosState {
  photos: SitePhoto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SitePhotosState = {
  photos: [],
  status: 'idle',
  error: null,
};

export const fetchSitePhotosByProject = createAsyncThunk(
  'sitePhotos/fetchByProject',
  async (projectId: string) => {
    const response = await api.get(`/site-photos?project_id=${projectId}`);
    return response.data as SitePhoto[];
  }
);

export const createSitePhoto = createAsyncThunk(
  'sitePhotos/create',
  async (body: Partial<SitePhoto>) => {
    const response = await api.post('/site-photos', body);
    return response.data as SitePhoto;
  }
);

export const deleteSitePhoto = createAsyncThunk(
  'sitePhotos/delete',
  async (id: string) => {
    await api.delete(`/site-photos/${id}`);
    return id;
  }
);

const sitePhotosSlice = createSlice({
  name: 'sitePhotos',
  initialState,
  reducers: {
    clearPhotos: (state) => {
      state.photos = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSitePhotosByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSitePhotosByProject.fulfilled, (state, action: PayloadAction<SitePhoto[]>) => {
        state.status = 'succeeded';
        state.photos = action.payload;
      })
      .addCase(fetchSitePhotosByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch site photos';
      })
      .addCase(createSitePhoto.fulfilled, (state, action: PayloadAction<SitePhoto>) => {
        state.photos.unshift(action.payload);
      })
      .addCase(deleteSitePhoto.fulfilled, (state, action: PayloadAction<string>) => {
        state.photos = state.photos.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearPhotos } = sitePhotosSlice.actions;
export default sitePhotosSlice.reducer;
