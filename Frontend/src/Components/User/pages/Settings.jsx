import { ui } from "../utils/ui";
import { useState } from 'react';
import { useSession } from '../context/Session';
import { api, errorText } from '../services/api';
const options = [['compactTasks', 'Compact task cards', 'Show more tasks on screen at once.', false], ['reduceMotion', 'Reduce motion', 'Minimize interface animations.', false], ['startWeekMonday', 'Start week on Monday', 'Use Monday as the first day in calendars.', true]];
export function Settings() {
  const {
    user,
    updateUser,
    notify
  } = useSession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function change(key, value) {
    if (saving) return;
    const previous = user.workspacePreferences?.[key] ?? options.find(option => option[0] === key)[3];
    setSaving(true);
    setError('');
    updateUser(current => ({
      ...current,
      workspacePreferences: {
        ...current.workspacePreferences,
        [key]: value
      }
    }));
    try {
      const { data } = await api.patch('/user/settings', { [key]: value });
      updateUser(current => ({
        ...current,
        workspacePreferences: data.workspacePreferences
      }));
      notify('Preferences saved.');
    } catch (failure) {
      updateUser(current => ({
        ...current,
        workspacePreferences: {
          ...current.workspacePreferences,
          [key]: previous
        }
      }));
      setError(errorText(failure));
    } finally {
      setSaving(false);
    }
  }
  return <div className={ui("settings-page")}>
    <header className={ui("settings-page-heading")}><h1>Settings</h1><p>Personalize how TeamFlow works for you.</p></header>
    <section className={ui("workspace-settings-panel")} aria-busy={saving}>
      <h2>Workspace preferences</h2>
      {options.map(([key, title, description, fallback]) => <label className={ui("workspace-preference")} key={key}><span><strong>{title}</strong><small>{description}</small></span><input role="switch" type="checkbox" aria-label={title} checked={user.workspacePreferences?.[key] ?? fallback} disabled={saving} onChange={event => change(key, event.target.checked)} /></label>)}
      {error && <p className={ui("settings-save-error")} role="alert">{error}</p>}
    </section>
  </div>;
}
