import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { CreateProjectRequest, Project } from '@/types';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/api/projects');
      return data;
    },
    staleTime: 60_000,
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await api.get<Project>(`/api/projects/${id}`);
      return data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useCreateProject(onSuccess?: (project: Project) => void) {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectRequest>({
    mutationFn: async (payload) => {
      const { data } = await api.post<Project>('/api/projects', payload);
      return data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess?.(project);
    },
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Project,
    Error,
    { name?: string; description?: string; color?: string; icon?: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await api.patch<Project>(
        `/api/projects/${projectId}`,
        payload
      );
      return data;
    },
    onSuccess: (project) => {
      queryClient.setQueryData(['projects', projectId], project);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (projectId) => {
      await api.delete(`/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess?.();
    },
  });
}
