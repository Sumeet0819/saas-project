import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Project', 
    'User', 
    'DailyLog', 
    'Worker', 
    'Attendance', 
    'MaterialMaster', 
    'MaterialInventory',
    'MaterialRequest',
    'Supplier',
    'Delivery',
    'Equipment',
    'SiteIssue',
    'SiteActivity'
  ],
  endpoints: (builder) => ({
    // Empty endpoints here, to be injected in specific module files
  }),
});
