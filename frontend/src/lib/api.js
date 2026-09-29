import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.DEV ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_PROD_URL,
        credentials: 'include',
    }),
    tagTypes: ['User', 'Project', 'Task', 'Notification', 'Member', 'Dashboard'],
    endpoints: () => ({}),
});