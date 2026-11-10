import { ui } from "../utils/ui";
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bell, Check, ClipboardList, Clock3, Megaphone, MessageSquare } from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { useNotifications } from '../context/Notifications';
import { Dialog, Status } from '../components/ui';
import { errorText } from '../services/api';
const icons = {
  task: ClipboardList,
  deadline: Clock3,
  reply: MessageSquare,
  status: Check,
  project: Megaphone,
  general: Bell
};
function relativeTime(value) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - date) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return minutes + ' min ago';
  if (minutes < 24 * 60) return Math.floor(minutes / 60) + ' hr' + (minutes >= 120 ? 's' : '') + ' ago';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}
export function Notifications() {
  const {
    summary,
    revision,
    markRead,
    markAllRead
  } = useNotifications();
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') === 'unread' ? 'unread' : 'all';
  const page = Number(params.get('page') || 1);
  const resource = useResource('/notifications?' + new URLSearchParams({ filter, page }), revision);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  function change(values) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => next.set(key, String(value)));
    setParams(next);
  }
  async function open(item) {
    if (busy) return;
    setError('');
    if (!item.read) {
      setBusy(true);
      try {
        await markRead(item._id);
      } catch (failure) {
        setError(errorText(failure));
        return;
      } finally {
        setBusy(false);
      }
    }
    setSelected({
      ...item,
      read: true
    });
  }
  async function readAll() {
    setBusy(true);
    setError('');
    try {
      await markAllRead();
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  return <div className={ui("notifications-page")}>
    <header className={ui("notifications-heading")}><div><h1>Notifications</h1><p>Stay up to date with your assignments and team.</p></div><button className={ui("button mark-all-button")} disabled={busy || !summary.data?.unread} onClick={readAll}><Check size={19} />{busy ? 'Updating...' : 'Mark all as read'}</button></header>
    {error && <p className={ui("notification-error")} role="alert">{error}</p>}
    <section className={ui("notifications-panel")}>
      <div className={ui("notification-tabs")} role="tablist" aria-label="Notification filter">{[['all', 'All', 'total'], ['unread', 'Unread', 'unread']].map(([key, label, count]) => <button key={key} role="tab" aria-selected={filter === key} onClick={() => change({
          filter: key,
          page: 1
        })}>{label}<span>{summary.data?.[count] ?? '...'}</span></button>)}</div>
      <Status loading={resource.loading} error={resource.error} empty={(resource.data?.items || resource.data?.notifications || []).length === 0 && (filter === 'unread' ? 'You are all caught up. No unread notifications.' : 'No notifications yet.')}>
        <div className={ui("notification-list")} role="tabpanel" aria-label={filter === 'unread' ? 'Unread notifications' : 'All notifications'}>{(resource.data?.items || resource.data?.notifications || []).filter(item => filter === 'all' || !item.read).map(item => {
            const kind = item.kind || 'general';
            const Icon = icons[kind] || Bell;
            return <button key={item._id} className={ui('notification-row' + (!item.read ? ' is-unread' : ''))} disabled={busy} aria-label={(item.title || 'Notification') + ' — ' + item.message + (!item.read ? ' — Unread' : '')} onClick={() => open(item)}>
            <span className={ui('notification-icon notification-' + kind)}><Icon size={21} strokeWidth={1.8} /></span>
            <span className={ui("notification-copy")}><strong>{item.title || 'Notification'}</strong><span>{item.message}</span><time dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString()}>{relativeTime(item.createdAt)}</time></span>
            {!item.read && <i className={ui("notification-unread-dot")} aria-label="Unread" />}
          </button>;
          })}</div>
        {resource.data?.pages > 1 && <div className={ui("notification-pagination")}><button className={ui("button")} disabled={resource.data.page <= 1} onClick={() => change({
            page: resource.data.page - 1
          })}>Previous</button><span>Page {resource.data.page} of {resource.data.pages}</span><button className={ui("button")} disabled={resource.data.page >= resource.data.pages} onClick={() => change({
            page: resource.data.page + 1
          })}>Next</button></div>}
      </Status>
    </section>
    {selected && <Dialog title={selected.title || 'Notification'} close={() => setSelected(null)}><div className={ui("form")}><p>{selected.message}</p><small>{new Date(selected.createdAt).toLocaleString()}</small>{selected.project ? <Link className={ui("button primary")} to={'/user/tasks?project=' + encodeURIComponent(selected.project)}>View project tasks</Link> : <Link className={ui("button primary")} to="/user/activity">View activity</Link>}</div></Dialog>}
  </div>;
}
