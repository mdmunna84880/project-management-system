import { api } from '@/lib/api';

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({ projectId, ...filters }) => ({
        url: `/projects/${projectId}/tasks`,
        params: filters, 
      }),
      providesTags: (result, error, { projectId }) => 
        result?.data?.tasks
          ? [
              ...result.data.tasks.map(({ _id }) => ({ type: 'Task', id: _id })),
              { type: 'Task', id: `LIST-${projectId}` },
            ]
          : [{ type: 'Task', id: `LIST-${projectId}` }],
    }),
    getMyTasks: builder.query({
      query: (filters = {}) => ({
        url: '/tasks/my',
        params: filters,
      }),
      providesTags: [{ type: 'Task', id: 'MY-LIST' }],
    }),
    getTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...taskData }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Task', id: `LIST-${projectId}` },
        'Dashboard'
      ],
    }),
    updateTask: builder.mutation({
      query: ({ id, projectId, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id, projectId }) => [
        { type: 'Task', id },
        { type: 'Task', id: `LIST-${projectId}` },
        'Dashboard'
      ],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, projectId, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted({ id, projectId, status }, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const patchResults = [];

        patchResults.push(
          dispatch(
            tasksApi.util.updateQueryData('getTaskById', id, (draft) => {
              if (draft?.data?.task) {
                draft.data.task.status = status;
              }
            })
          )
        );

        const queries = state.api.queries;
        for (const [key, queryData] of Object.entries(queries)) {
          if (key.startsWith('getTasks') && queryData?.originalArgs?.projectId === projectId) {
            patchResults.push(
              dispatch(
                tasksApi.util.updateQueryData('getTasks', queryData.originalArgs, (draft) => {
                  if (draft?.data?.tasks) {
                    const task = draft.data.tasks.find((t) => t._id === id);
                    if (task) {
                      task.status = status;
                    }
                  }
                })
              )
            );
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
      invalidatesTags: (result, error, { id, projectId }) => [
        { type: 'Task', id },
        { type: 'Task', id: `LIST-${projectId}` },
        'Dashboard'
      ],
    }),
    deleteTask: builder.mutation({
      query: ({ id, projectId }) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, projectId }) => [
        { type: 'Task', id },
        { type: 'Task', id: `LIST-${projectId}` },
        'Dashboard'
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
