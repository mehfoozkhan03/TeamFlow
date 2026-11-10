import { ui } from "../utils/ui";
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, errorText } from '../services/api';
import { Dialog } from '../components/ui';
const tabs = [['all', 'All activity'], ['tasks', 'Tasks'], ['projects', 'Projects'], ['comments', 'Comments']];
function dayKey(value) {
  const date = new Date(value);
  return [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
}
function dayHeading(value) {
  const date = new Date(value);
  const now = new Date();
  if (dayKey(date) === dayKey(now)) return 'TODAY';
  now.setDate(now.getDate() - 1);
  if (dayKey(date) === dayKey(now)) return 'YESTERDAY';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();
}
function timeLabel(value) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (dayKey(date) === dayKey(new Date())) {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return minutes + ' min ago';
    return Math.floor(minutes / 60) + ' hr' + (minutes >= 120 ? 's' : '') + ' ago';
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  return dayKey(date) === dayKey(yesterday) ? 'Yesterday, ' + time : date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + ', ' + time;
}
export function Activity() {
  const [params, setParams] = useSearchParams();
  const kind = tabs.some(([key]) => key === params.get('kind')) ? params.get('kind') : 'all';
  const days = ['7', '30', '90', 'all'].includes(params.get('days')) ? params.get('days') : '7';
  const query = new URLSearchParams({
    kind,
    days
  }).toString();
  const [feed, setFeed] = useState({
    key: '',
    items: [],
    loading: true
  });
  const [selected, setSelected] = useState(null);
  const request = useRef(null);
  const pending = useRef(false);
  const currentKey = useRef(query);
  currentKey.current = query;
  useEffect(() => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    pending.current = true;
    setFeed({
      key: query,
      items: [],
      loading: true
    });
    api.get('/workspace/activity?' + query, {
      signal: controller.signal
    }).then(({
      data
    }) => {
      if (!controller.signal.aborted) setFeed({
        key: query,
        ...data,
        loading: false
      });
    }).catch(error => {
      if (!controller.signal.aborted) setFeed({
        key: query,
        items: [],
        error: errorText(error),
        loading: false
      });
    }).finally(() => {
      if (!controller.signal.aborted) pending.current = false;
    });
    return () => {
      controller.abort();
      request.current?.abort();
    };
  }, [query]);
  function change(values) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => next.set(key, value));
    setParams(next);
  }
  async function more() {
    if (pending.current || !feed.nextCursor) return;
    pending.current = true;
    const key = query;
    const cursor = feed.nextCursor;
    const controller = new AbortController();
    request.current = controller;
    setFeed(current => ({
      ...current,
      loadingMore: true,
      moreError: ''
    }));
    try {
      const {
        data
      } = await api.get('/workspace/activity?' + query + '&cursor=' + encodeURIComponent(cursor), {
        signal: controller.signal
      });
      if (!controller.signal.aborted && currentKey.current === key) setFeed(current => {
        const ids = new Set(current.items.map(item => item._id));
        return {
          ...current,
          items: [...current.items, ...data.items.filter(item => !ids.has(item._id))],
          nextCursor: data.nextCursor,
          loadingMore: false
        };
      });
    } catch (error) {
      if (!controller.signal.aborted && currentKey.current === key) setFeed(current => ({
        ...current,
        loadingMore: false,
        moreError: errorText(error)
      }));
    } finally {
      if (!controller.signal.aborted) pending.current = false;
    }
  }
  const ready = feed.key === query;
  const groups = [];
  if (ready) for (const item of feed.items) {
    const key = dayKey(item.createdAt);
    if (groups.at(-1)?.key !== key) groups.push({
      key,
      title: dayHeading(item.createdAt),
      items: []
    });
    groups.at(-1).items.push(item);
  }
  return <div className={ui("activity-page")}>
    <header className={ui("activity-heading")}><h1>Activity</h1><p>Team updates and work activity you have access to.</p></header>
    <section className={ui("activity-feed-panel")}>
      <div className={ui("activity-filters")}><div className={ui("activity-tabs")} role="tablist" aria-label="Activity category">{tabs.map(([key, label]) => <button key={key} role="tab" aria-selected={kind === key} onClick={() => change({
            kind: key
          })}>{label}</button>)}</div>
        <select aria-label="Activity date range" value={days} onChange={event => change({
          days: event.target.value
        })}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All time</option></select>
      </div>
      {!ready || feed.loading ? <p className={ui("activity-state")} role="status">Loading activity...</p> : feed.error ? <p className={ui("activity-state error")} role="alert">{feed.error}</p> : !feed.items.length ? <p className={ui("activity-state")}>No activity in this category and date range.</p> : <div className={ui("activity-timeline")} role="tabpanel" aria-label={tabs.find(([key]) => key === kind)?.[1]}>
        {groups.map(group => <section className={ui("activity-day")} key={group.key}><h2>{group.title}</h2>{group.items.map(item => <article className={ui("timeline-entry")} key={item._id}>
          <div className={ui("timeline-entry-copy")}><p><strong>{item.actor}</strong> {item.action} <button onClick={() => setSelected(item)}>{item.title}</button></p>{item.detail && <small className={ui(item.kind === 'comments' ? 'activity-quote' : '')}>{item.kind === 'comments' ? '“' + item.detail + '”' : item.detail}</small>}</div>
          <time dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString()}>{timeLabel(item.createdAt)}</time>
        </article>)}</section>)}
        {feed.moreError && <p className={ui("activity-state error")} role="alert">{feed.moreError}</p>}
        {feed.nextCursor && <div className={ui("load-activity")}><button className={ui("button")} disabled={feed.loadingMore} onClick={more}>{feed.loadingMore ? 'Loading...' : 'Load more activity'}</button></div>}
      </div>}
    </section>
    {selected && <Dialog title={selected.title} close={() => setSelected(null)}><div className={ui("form")}><p><strong>{selected.actor}</strong> {selected.action} {selected.title}</p><p className={ui("muted")}>{selected.detail}</p><small>{new Date(selected.createdAt).toLocaleString()}</small>{selected.project && <Link className={ui("button primary")} to={'/tasks?project=' + encodeURIComponent(selected.project)}>View project tasks</Link>}</div></Dialog>}
  </div>;
}
