import { ui } from "../utils/ui";
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, ClipboardList, Columns2, Folder, List, MoreHorizontal, Search } from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { useSession } from '../context/Session';
import { api, errorText } from '../services/api';
import { Dialog, Status } from '../components/ui';
const statuses = ['To Do', 'In Progress', 'In Review', 'Completed'];
const slug = value => value.toLowerCase().replaceAll(' ', '-');
const dayLabel = value => new Date(value).toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  timeZone: 'UTC'
});
export function MyTasks() {
  const [params, setParams] = useSearchParams();
  const {
    notify
  } = useSession();
  const [revision, setRevision] = useState(0);
  const resource = useResource('/workspace', revision);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [deadlineDraft, setDeadlineDraft] = useState({
    from: params.get('from') || '',
    to: params.get('to') || ''
  });
  const tasks = resource.data?.tasks || [];
  const query = params.get('q') || '';
  const status = params.get('status') || '';
  const priority = params.get('priority') || '';
  const project = params.get('project') || '';
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const view = params.get('view') === 'list' ? 'list' : 'board';
  function filter(values) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    setParams(next, {
      replace: true
    });
  }
  const filtered = tasks.filter(task => {
    const due = task.due.slice(0, 10);
    return (task.title + ' ' + task.project).toLowerCase().includes(query.toLowerCase()) && (!status || task.status === status) && (!priority || task.priority === priority) && (!project || task.project === project) && (!from || due >= from) && (!to || due <= to);
  });
  const today = new Date().toISOString().slice(0, 10);
  const isLate = task => task.status !== 'Completed' && task.due.slice(0, 10) < today;
  function openTask(task) {
    setSaveError('');
    setSelected(task);
  }
  async function save(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setSaveError('');
    try {
      await api.patch('/workspace/tasks/' + selected._id, {
        status: fields.status
      });
      setSelected(null);
      setRevision(value => value + 1);
      notify('Task status updated.');
    } catch (error) {
      setSaveError(errorText(error));
    } finally {
      setSaving(false);
    }
  }
  function Assigner({
    task
  }) {
    return <span className={ui("task-assigner")}><span className={ui("assigner-avatar")}>{task.assignedBy?.split(' ').map(part => part[0]).slice(0, 2).join('') || 'DS'}</span><span>By {task.assignedBy?.split(' ')[0] || 'DevSquad'}</span></span>;
  }
  return <div className={ui("my-tasks-page")}>
    <div className={ui("my-tasks-heading")}><div><h1>My Tasks</h1><p>View and manage the work assigned to you.</p></div><div className={ui("task-view-switch")} role="group" aria-label="Task view">
      <button aria-pressed={view === 'board'} className={ui(view === 'board' ? 'selected' : '')} onClick={() => filter({
          view: ''
        })}><Columns2 size={19} />Board</button>
      <button aria-pressed={view === 'list'} className={ui(view === 'list' ? 'selected' : '')} onClick={() => filter({
          view: 'list'
        })}><List size={20} />List</button>
    </div></div>
    <section className={ui("task-board-panel")}>
      <div className={ui("board-filters")}>
        <label className={ui("board-search")}><Search size={20} /><input aria-label="Search your tasks" placeholder="Search your tasks…" value={query} onChange={event => filter({
            q: event.target.value
          })} /></label>
        <select aria-label="Filter by status" value={status} onChange={event => filter({
          status: event.target.value
        })}><option value="">All statuses</option>{statuses.map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Filter by priority" value={priority} onChange={event => filter({
          priority: event.target.value
        })}><option value="">All priorities</option>{['High', 'Medium', 'Low'].map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Filter by project" value={project} onChange={event => filter({
          project: event.target.value
        })}><option value="">All projects</option>{[...new Set(tasks.map(task => task.project))].map(value => <option key={value}>{value}</option>)}</select>
        <button className={ui('button deadline-filter' + (from || to ? ' active' : ''))} onClick={() => {
          setDeadlineDraft({
            from,
            to
          });
          setDeadlineOpen(true);
        }}><CalendarDays size={20} />Deadline{(from || to) && <span className={ui("filter-indicator")} />}</button>
        {(query || status || priority || project || from || to) && <button className={ui("clear-task-filters")} onClick={() => filter({
          q: '',
          status: '',
          priority: '',
          project: '',
          from: '',
          to: ''
        })}>Clear filters</button>}
      </div>
      <Status loading={resource.loading} error={resource.error}>{resource.data && <>
        <div className={ui("board-meta")}><span><strong>{filtered.length}</strong> tasks assigned to you</span><span>Last updated {revision ? 'just now' : 'on page load'}</span></div>
        {view === 'board' ? <div className={ui("kanban-board")}>{statuses.map(column => {
              const items = filtered.filter(task => task.status === column);
              return <section className={ui('kanban-column column-' + slug(column))} key={column} aria-label={column + ' tasks'}>
            <div className={ui("kanban-heading")}><span className={ui("column-dot")} /><h2>{column}</h2><span className={ui("column-count")}>{items.length}</span></div>
            {items.map(task => <article className={ui("kanban-card")} key={task._id}>
              <div className={ui("kanban-card-top")}><span className={ui('tf-tag priority-' + task.priority.toLowerCase())}>● {task.priority}</span><button className={ui("icon")} aria-label={'Edit ' + task.title} onClick={() => openTask(task)}><MoreHorizontal size={19} /></button></div>
              <button className={ui("kanban-task-title")} onClick={() => openTask(task)}>{task.title}</button>
              <p className={ui("kanban-project")}><Folder size={15} />{task.project}</p>
              <div className={ui("kanban-card-footer")}><span className={ui('kanban-date' + (isLate(task) ? ' late' : ''))}><CalendarDays size={15} />{dayLabel(task.due)}</span><Assigner task={task} /></div>
            </article>)}
            {!items.length && <div className={ui("kanban-empty")}><ClipboardList size={21} /><p>No tasks here</p></div>}
          </section>;
            })}</div> : <div className={ui("table-wrap task-list-view")}><table className={ui("task-table")}><thead><tr>{['Task name', 'Project', 'Priority', 'Due date', 'Status', 'Assigned by', ''].map((label, index) => <th key={index}>{label}</th>)}</tr></thead><tbody>{filtered.map(task => <tr key={task._id}><td><button className={ui("kanban-task-title")} onClick={() => openTask(task)}>{task.title}</button></td><td>{task.project}</td><td><span className={ui('tf-tag priority-' + task.priority.toLowerCase())}>● {task.priority}</span></td><td className={ui(isLate(task) ? 'late' : '')}>{dayLabel(task.due)}</td><td><span className={ui('tf-tag state-' + slug(task.status))}>{task.status}</span></td><td><Assigner task={task} /></td><td><button className={ui("icon")} aria-label={'Edit ' + task.title} onClick={() => openTask(task)}><MoreHorizontal size={19} /></button></td></tr>)}</tbody></table>{!filtered.length && <p className={ui("empty")}>No matching tasks. Try changing your filters.</p>}</div>}
      </>}</Status>
    </section>
    {selected && <Dialog title={selected.title} close={() => !saving && setSelected(null)}><form className={ui("form")} onSubmit={save}><p className={ui("muted")}>{selected.project} · {selected.priority} priority · Due {dayLabel(selected.due)}</p><label className={ui("field")}>Status<select aria-label="Status" name="status" defaultValue={selected.status}>{statuses.map(value => <option key={value}>{value}</option>)}</select></label>{saveError && <p role="alert" className={ui("error")}>{saveError}</p>}<button className={ui("button primary")} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></form></Dialog>}
    {deadlineOpen && <Dialog title="Filter by deadline" close={() => setDeadlineOpen(false)}><form className={ui("form")} onSubmit={event => {
        event.preventDefault();
        filter(deadlineDraft);
        setDeadlineOpen(false);
      }}><label className={ui("field")}>From<input type="date" value={deadlineDraft.from} max={deadlineDraft.to || undefined} onChange={event => setDeadlineDraft({
            ...deadlineDraft,
            from: event.target.value
          })} /></label><label className={ui("field")}>Through<input type="date" value={deadlineDraft.to} min={deadlineDraft.from || undefined} onChange={event => setDeadlineDraft({
            ...deadlineDraft,
            to: event.target.value
          })} /></label><div className={ui("actions")}><button className={ui("button primary")}>Apply deadline</button><button className={ui("button")} type="button" onClick={() => {
            filter({
              from: '',
              to: ''
            });
            setDeadlineOpen(false);
          }}>Clear deadline</button></div></form></Dialog>}
  </div>;
}
