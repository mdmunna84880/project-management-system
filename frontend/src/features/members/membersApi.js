import { api } from '@/lib/api';

export const membersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: (projectId) => `/projects/${projectId}/members`,
      providesTags: (result, error, projectId) => 
        result?.data?.members 
          ? [
              ...result.data.members.map(({ _id }) => ({ type: 'Member', id: _id })),
              { type: 'Member', id: `LIST-${projectId}` },
            ]
          : [{ type: 'Member', id: `LIST-${projectId}` }],
    }),
    addMember: builder.mutation({
      query: ({ projectId, email }) => ({
        url: `/projects/${projectId}/members`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Member', id: `LIST-${projectId}` }],
    }),
    removeMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Member', id: `LIST-${projectId}` }],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = membersApi;
