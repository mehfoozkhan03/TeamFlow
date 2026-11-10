import { createContext, useContext, useState } from 'react';
import { useResource } from '../hooks/useResource';
import { api } from '../services/api';
const Context = createContext(null);
export const useNotifications = () => useContext(Context);
export function NotificationsProvider({
  children
}) {
  const [revision, setRevision] = useState(0);
  const summary = useResource('/notifications', revision);
  async function markRead(id) {
    await api.patch('/notifications/' + id + '/read');
    setRevision(value => value + 1);
  }
  async function markAllRead() {
    await api.patch('/notifications/read-all');
    setRevision(value => value + 1);
  }
  return <Context.Provider value={{
    summary,
    revision,
    markRead,
    markAllRead
  }}>{children}</Context.Provider>;
}
