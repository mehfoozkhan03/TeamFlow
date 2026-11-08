import axios from 'axios';

// Uses the same API base URL and Bearer token as the existing TeamFlow login.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

api.interceptors.request.use((config) => {
  const cookieToken = document.cookie.split('; ').find((item) => item.startsWith('token='))?.split('=').slice(1).join('=');
  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || cookieToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorText = error => error.response?.data?.message || error.response?.data?.msg || error.message || 'Something went wrong.';

const listFrom = (data, keys) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
  return [];
};
const taskStatus = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', blocked: 'In Review', done: 'Completed' };
const titleCase = value => value ? value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase()) : 'Medium';
const unwrap = response => response?.data?.data || response?.data;

export async function loadMemberWorkspace(user = {}) {
  let organizationId = user.organizationId || user.organization?._id || user.organization || sessionStorage.getItem('organizationId') || localStorage.getItem('organizationId');
  let organization = user.organization && typeof user.organization === 'object' ? user.organization : null;
  if (!organizationId) {
    const response = await api.get('/organizations');
    const organizations = listFrom(unwrap(response), ['organizations', 'items']);
    organization = organizations[0] || null;
    organizationId = organization?._id || organization?.id;
    if (organizationId) localStorage.setItem('organizationId', organizationId);
  }
  if (!organizationId) return { organization: null, projects: [], tasks: [], members: [] };

  const [projectResponse, memberResponse] = await Promise.all([
    api.get(`/organizations/${organizationId}/projects`),
    api.get(`/organizations/${organizationId}/members`).catch(() => ({ data: { members: [] } })),
  ]);
  const projects = listFrom(unwrap(projectResponse), ['projects', 'items']);
  const members = listFrom(unwrap(memberResponse), ['members', 'items']).map(row => {
    const person = row.user || row.member || row;
    const name = person.name || person.fullName || person.email || 'Team member';
    return { ...person, _id: person._id || row._id, name, role: row.role === 'owner' || row.role === 'admin' ? 'Team Leader' : 'Team Member', responsibility: person.jobTitle || 'Team member', online: false, isSelf: String(person._id || row.user?._id) === String(user._id || user.id), color: 'purple' };
  });
  const taskResponses = await Promise.all(projects.map(project => api.get(`/organizations/${organizationId}/projects/${project._id}/tasks`).catch(() => ({ data: { tasks: [] } }))));
  const tasks = taskResponses.flatMap((response, index) => listFrom(unwrap(response), ['tasks', 'items']).map(task => {
    const assignedIds = (task.assignees || []).map(person => String(person?._id || person));
    const currentId = String(user._id || user.id || '');
    if (assignedIds.length && currentId && !assignedIds.includes(currentId)) return null;
    const project = projects[index];
    const assignedBy = task.createdBy?.name || task.createdBy?.email || 'TeamFlow';
    return { ...task, project: task.project?.name || project?.name || 'Project', due: task.dueDate || task.due || task.updatedAt || new Date().toISOString(), status: taskStatus[task.status] || titleCase(task.status), priority: titleCase(task.priority), assignedBy, updatedAt: task.updatedAt || task.createdAt || new Date().toISOString() };
  }).filter(Boolean));
  const normalizedProjects = projects.map(project => {
    const projectTasks = tasks.filter(task => task.project === project.name);
    const completed = projectTasks.filter(task => task.status === 'Completed').length;
    const people = (project.members || []).map(person => ({ name: person.name || person.email || 'Member', color: 'purple' }));
    return { ...project, name: project.name || project.title || 'Project', description: project.description || '', status: titleCase(project.status), progress: projectTasks.length ? Math.round(completed / projectTasks.length * 100) : 0, deadline: project.dueDate || project.updatedAt || new Date().toISOString(), members: people };
  });
  return { organization: organization || { _id: organizationId, name: 'Workspace' }, projects: normalizedProjects, tasks, members };
}

export const memberApi = {
  listTasks: (organizationId, projectId) => api.get(`/organizations/${organizationId}/projects/${projectId}/tasks`),
  listProjects: (organizationId) => api.get(`/organizations/${organizationId}/projects`),
  listTeam: (organizationId) => api.get(`/organizations/${organizationId}/members`),
  listActivity: (organizationId) => api.get(`/organizations/${organizationId}/activities`),
  listNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all'),
  updateTask: (organizationId, taskId, changes) => api.patch(`/organizations/${organizationId}/tasks/${taskId}`, changes),
};
