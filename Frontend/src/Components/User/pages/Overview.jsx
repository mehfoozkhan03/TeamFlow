import { ui } from "../utils/ui";
import { TaskCalendar } from '../components/TaskCalendar';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, CalendarDays, Check, ChevronRight, CircleAlert, ClipboardList, Clock3, Folder, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { useResource } from '../hooks/useResource';
import { api, errorText } from '../services/api';
import { useSession } from '../context/Session';
import { Status, Dialog } from '../components/ui';
const states = ['To Do', 'In Progress', 'In Review', 'Completed'];
const colors = ['#b49aff', '#7b25fa', '#e0e3eb', '#1db58e'];
const initials = name => name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
const date = value => new Date(value).toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  timeZone: 'UTC'
});
function Title({
  title,
  subtitle,
  to,
  label = 'View all'
}) {
  return <div className={ui("section-title")}><div><h2>{title}</h2><p>{subtitle}</p></div>{to && <Link to={to.startsWith('/user') ? to : '/user' + to}>{label}<ChevronRight size={16} /></Link>}</div>;
}
export function Overview({
  section = 'Overview'
}) {
  const {
    user,
    notify
  } = useSession();
  const [revision, setRevision] = useState(0);
  const resource = useResource('/workspace', revision);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [filter, setFilter] = useState('All');
  const [filters, setFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const tasks = resource.data?.tasks || [];
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task => task.status !== 'Completed' && task.due.slice(0, 10) < today;
  const counts = states.map(name => ({
    name,
    value: tasks.filter(task => task.status === name).length
  }));
  const filtered = tasks.filter(task => (task.title + task.project).toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || task.status === filter));
  const visible = section === 'Overview' && !query && filter === 'All' ? filtered.slice(0, 4) : filtered;
  async function update(task, status) {
    setBusy(true);
    try {
      await api.patch('/workspace/tasks/' + task._id, {
        status
      });
      setRevision(value => value + 1);
      setSelected(null);
      notify('Task status updated.');
    } catch (error) {
      notify(errorText(error));
    } finally {
      setBusy(false);
    }
  }
  return <div className={ui("team-overview")}><Status loading={resource.loading} error={resource.error}>{resource.data && <>
    {section === 'Calendar' && <TaskCalendar tasks={tasks} onTask={setSelected} />}
    {section === 'Overview' && <>
      <section className={ui("welcome-banner")}><div><p className={ui("workspace-eyebrow")}><span />DEVSQUAD WORKSPACE</p><h1>Welcome back, {user.name.split(' ')[0]}!</h1><p className={ui("welcome-description")}>Here’s an overview of your tasks, projects and team activities.</p><div className={ui("welcome-meta")}><span>Team Member</span><CalendarDays size={17} />{new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</div></div>
      <div className={ui("team-orbit")} aria-hidden="true"><div className={ui("orbit-inner")} /><div className={ui("orbit-avatars")}>{[initials(user.name), 'PP', 'AM'].map((name, i) => <span key={i}>{name}</span>)}</div><span className={ui("orbit-check")}><Check size={20} /></span><span className={ui("orbit-folder")}><Folder size={20} /></span></div></section>
      <div className={ui("task-metrics")}>{[['Assigned to Me', tasks.length, 'Total assigned tasks', ClipboardList, 'purple'], ['In Progress', counts[1].value, 'Currently working on', Clock3, 'blue'], ['Completed', counts[3].value, 'Successfully completed', Check, 'green'], ['Overdue', tasks.filter(overdue).length, 'Require attention', CircleAlert, 'red']].map(([title, value, subtitle, Icon, color]) => <article className={ui("tf-panel task-metric")} key={title}><span className={ui('metric-symbol ' + color)}><Icon size={20} /></span><div><p>{title}</p><div className={ui("task-metric-value")}>{value}<small>{subtitle}</small></div></div></article>)}</div>
    </>}
    {['Overview', 'My Tasks'].includes(section) && <section className={ui("tf-panel tasks-panel")}><Title title="My Tasks" subtitle="Keep track of what needs your attention." to="/tasks" label="View all tasks" />
    <div className={ui("task-tools")}><label className={ui("task-search")}><Search size={17} /><input aria-label="Search tasks" placeholder="Search tasks…" value={query} onChange={e => setQuery(e.target.value)} /></label><button className={ui("button")} aria-expanded={filters} onClick={() => setFilters(!filters)}><SlidersHorizontal size={16} />Filter</button>{filters && <select aria-label="Task status filter" value={filter} onChange={e => setFilter(e.target.value)}>{['All', ...states].map(state => <option key={state}>{state}</option>)}</select>}</div>
    <div className={ui("table-wrap")}><table className={ui("task-table")}><thead><tr>{['Task name', 'Project', 'Priority', 'Due date', 'Status', ''].map((label, i) => <th key={i}>{label}</th>)}</tr></thead><tbody>{visible.map(task => <tr key={task._id}>
      <td><label className={ui("task-name")}><input type="checkbox" aria-label={'Complete ' + task.title} checked={task.status === 'Completed'} disabled={busy} onChange={() => update(task, task.status === 'Completed' ? 'To Do' : 'Completed')} /><button onClick={() => setSelected(task)}>{task.title}</button></label></td><td>{task.project}</td><td><span className={ui('tf-tag priority-' + task.priority.toLowerCase())}>● {task.priority}</span></td><td className={ui(overdue(task) ? 'late' : '')}>{date(task.due)}{overdue(task) && <small>Overdue</small>}</td><td><span className={ui('tf-tag state-' + task.status.toLowerCase().replaceAll(' ', '-'))}>{task.status}</span></td><td><button className={ui("icon")} aria-label={'Edit ' + task.title} onClick={() => setSelected(task)}><MoreHorizontal size={20} /></button></td>
    </tr>)}</tbody></table>{!visible.length && <p className={ui("empty")}>No matching tasks.</p>}</div></section>}
    {['Overview', 'Calendar'].includes(section) && <div className={ui("workload-grid")}><section className={ui("tf-panel")}><Title title="My Workload" subtitle="Your assigned task status." /><div className={ui("workload-body")}><div className={ui("workload-donut")}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={counts} dataKey="value" innerRadius="71%" outerRadius="98%" startAngle={180} endAngle={-180} paddingAngle={3} isAnimationActive={false}>{counts.map((item, i) => <Cell key={item.name} fill={colors[i]} />)}</Pie></PieChart></ResponsiveContainer><div className={ui("donut-center")}><strong>{tasks.length}</strong><small>Total tasks</small></div></div><div className={ui("workload-legend")}>{counts.map((item, i) => <div key={item.name}><span style={{
                    background: colors[i]
                  }} />{item.name}<strong>{item.value}</strong></div>)}</div></div><p className={ui("motivation")}><Activity size={20} /><span><strong>Keep going!</strong> You’re making progress on your assigned tasks.</span></p></section>
    <section className={ui("tf-panel")}><Title title="Upcoming Deadlines" subtitle="Plan ahead and stay on track." to="/calendar" label="View calendar" />{tasks.filter(task => task.status !== 'Completed').slice(0, section === 'Calendar' ? 12 : 3).map((task, i) => <button className={ui("deadline-row")} key={task._id} onClick={() => setSelected(task)}><span className={ui('date-tile ' + ['red', 'orange', 'blue'][i % 3])}><strong>{new Date(task.due).getUTCDate().toString().padStart(2, '0')}</strong><small>{new Date(task.due).toLocaleDateString('en-US', {
                    month: 'short',
                    timeZone: 'UTC'
                  }).toUpperCase()}</small></span><span className={ui("deadline-name")}>{task.title}<small>{task.project}</small></span><span className={ui('tf-tag priority-' + task.priority.toLowerCase())}>● {task.priority}</span></button>)}</section></div>}
    {['Overview', 'Projects'].includes(section) && <section className={ui("tf-panel projects-panel")}><Title title="My Projects" subtitle="Projects you’re contributing to." to="/projects" />{[...new Set(tasks.map(task => task.project))].map(project => {
            const assigned = tasks.filter(task => task.project === project);
            const done = assigned.filter(task => task.status === 'Completed').length;
            const progress = Math.round(done / assigned.length * 100);
            return <button key={project} className={ui("project-row")} onClick={() => setSelected({
              title: project,
              projectTasks: assigned
            })}><span className={ui("project-folder")}><Folder size={20} /></span><span className={ui("project-summary")}><strong>{project}</strong><small>Overall project progress</small><span className={ui("progress-line")}><span><i style={{
                      width: progress + '%'
                    }} /></span><b>{progress}%</b></span></span><span className={ui("project-completed")}><small>My completed tasks</small><strong>{done} of {assigned.length}</strong></span><span className={ui("project-deadline")}><small>Deadline</small><strong>{date(assigned.at(-1).due)}, 2026</strong></span><span className={ui("mini-avatars")}><i>PP</i><i>AM</i><i>{initials(user.name)}</i></span><ChevronRight size={20} /></button>;
          })}</section>}
    {['Overview', 'Activity'].includes(section) && <section className={ui("tf-panel")}><Title title="Recent Team Activity" subtitle="Latest updates from DevSquad." to="/activity" />{[...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, section === 'Activity' ? 12 : 5).map(task => <div className={ui("activity-row")} key={task._id}><span className={ui("activity-dot")} /><div><p><strong>{user.name}</strong> {task.status === 'Completed' ? 'completed' : 'was assigned'} <button onClick={() => setSelected(task)}>{task.title}</button></p><small>{task.project}</small></div><time>{date(task.updatedAt)}</time></div>)}</section>}
    {section === 'Team Members' && <section className={ui("tf-panel")}><Title title="Team Members" subtitle="People in your workspace." /><div className={ui("team-person")}><span className={ui("avatar")}>{initials(user.name)}</span><div><strong>{user.name}</strong><p>{user.email}</p><small>{user.role}</small></div></div></section>}
  </>}</Status>{selected && <Dialog title={selected.title} close={() => setSelected(null)}>{selected.projectTasks ? selected.projectTasks.map(task => <p className={ui("project-task-detail")} key={task._id}>{task.title}<span className={ui("tf-tag")}>{task.status}</span></p>) : <div className={ui("form")}><p>{selected.project} · {selected.priority} priority · Due {date(selected.due)}</p><label className={ui("field")}>Status<select disabled={busy} value={selected.status} onChange={e => update(selected, e.target.value)}>{states.map(state => <option key={state}>{state}</option>)}</select></label></div>}</Dialog>}</div>;
}
