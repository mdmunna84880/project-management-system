import { api } from '../../lib/api';
import { clearCredentials } from './authSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // CRITICAL: clear auth slice first so ProtectedRoute redirects to /login
          dispatch(clearCredentials());
          // Then clear entire RTK Query cache for security
          dispatch(api.util.resetApiState());
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;