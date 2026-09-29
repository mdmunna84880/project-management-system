import { api } from '@/lib/api';

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/projects',
      // Extract array from ApiResponse envelope
      providesTags: (result) => 
        result?.data?.projects 
          ? [
              ...result.data.projects.map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (newProject) => ({
        url: '/projects',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' }
      ],
    }),
    archiveProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' }
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useArchiveProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
