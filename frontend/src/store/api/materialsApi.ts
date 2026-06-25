import { apiSlice } from './apiSlice';
import { MaterialInventory, MaterialRequest, Supplier } from '../../types';

export const materialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<MaterialInventory[], { projectId?: string }>({
      query: (params) => {
        let url = '/material-inventory';
        if (params.projectId) {
          url += `?project_id=${params.projectId}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'MaterialInventory' as const, id })),
              { type: 'MaterialInventory', id: 'LIST' },
            ]
          : [{ type: 'MaterialInventory', id: 'LIST' }],
    }),
    
    getRequests: builder.query<MaterialRequest[], { projectId?: string }>({
      query: (params) => {
        let url = '/material-requests';
        if (params.projectId) {
          url += `?project_id=${params.projectId}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'MaterialRequest' as const, id })),
              { type: 'MaterialRequest', id: 'LIST' },
            ]
          : [{ type: 'MaterialRequest', id: 'LIST' }],
    }),

    createRequest: builder.mutation<MaterialRequest, Partial<MaterialRequest>>({
      query: (body) => ({
        url: '/material-requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'MaterialRequest', id: 'LIST' }],
    }),

    getSuppliers: builder.query<Supplier[], void>({
      query: () => '/suppliers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Supplier' as const, id })),
              { type: 'Supplier', id: 'LIST' },
            ]
          : [{ type: 'Supplier', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetRequestsQuery,
  useCreateRequestMutation,
  useGetSuppliersQuery,
} = materialsApi;
