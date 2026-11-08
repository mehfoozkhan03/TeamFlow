import { useEffect, useState } from 'react';
import { api, errorText, loadMemberWorkspace } from '../services/api';
import { useSession } from '../context/Session';
export function useResource(path, revision = 0) {
  const { user } = useSession();
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    const request = path?.startsWith('/workspace')
      ? loadMemberWorkspace(user).then(data => ({ data: path === '/workspace/members' ? { members: data.members, online: data.members.filter(member => member.online).length } : path === '/workspace/projects' ? { projects: data.projects, tasks: data.tasks } : data }))
      : api.get(path, {
      signal: controller.signal
    });
    request.then(({
      data
    }) => {
      if (!controller.signal.aborted) setResult({
        path,
        revision,
        data
      });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({
        path,
        revision,
        error: errorText(error)
      });
    });
    return () => controller.abort();
  }, [path, revision, user]);
  if (!path) return {
    loading: false
  };
  if (result?.path !== path || result.revision !== revision) return {
    loading: true
  };
  return {
    data: result.data,
    error: result.error,
    loading: false
  };
}
