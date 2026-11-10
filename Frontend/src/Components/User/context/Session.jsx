import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ui } from '../utils/ui';

const Context = createContext(null);
export const useSession = () => useContext(Context);

export function Session({ children }) {
  const { user: authUser } = useSelector((state) => state.user);
  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || document.cookie.split('; ').find((item) => item.startsWith('token='))?.split('=').slice(1).join('=');
  const [toast, setToast] = useState('');
  const user = useMemo(() => {
    const source = authUser?.user || authUser?.userValue || authUser || {};
    const name = source.name || [source.firstName, source.lastName].filter(Boolean).join(' ') || (source.email || 'Team Member').split('@')[0];
    return {
      ...source,
      name,
      email: source.email || '',
      role: source.role || 'member',
      createdAt: source.createdAt || new Date().toISOString(),
      workspace: source.organization || source.workspace || null,
      workspacePreferences: source.workspacePreferences || {},
      preferences: source.preferences || {},
    };
  }, [authUser]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  function logout() {
    window.location.assign('/login');
  }

  return <Context.Provider value={{ user, updateUser: () => {}, logout, notify, token }}>
    {children}{toast && <div className={ui('toast')} role="status">{toast}</div>}
  </Context.Provider>;
}
