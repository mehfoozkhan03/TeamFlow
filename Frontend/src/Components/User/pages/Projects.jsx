import { ui } from "../utils/ui";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CalendarDays, Check, ChevronRight, ClipboardList, Folder, Grid2X2 } from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { Dialog, Status } from '../components/ui';
const icons = {
  purple: Folder,
  blue: Activity,
  orange: Grid2X2
};
const date = value => new Date(value).toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});
const initials = name => name.split(' ').map(part => part[0]).slice(0, 2).join('');
export function Projects() {
  const resource = useResource('/workspace/projects');
  const [selected, setSelected] = useState(null);
  const projects = resource.data?.projects || [];
  const tasks = resource.data?.tasks || [];
  const assigned = name => tasks.filter(task => task.project === name);
  const completed = name => assigned(name).filter(task => task.status === 'Completed').length;
  return <div className={ui("projects-page")}>
    <header className={ui("projects-heading")}><h1>Projects</h1><p>Projects you’re part of in the DevSquad team.</p></header>
    <Status loading={resource.loading} error={resource.error}>{resource.data && <>
      <section className={ui("project-stats")} aria-label="Project statistics">{[[Folder, projects.filter(project => project.status !== 'Completed').length, 'Active projects'], [ClipboardList, tasks.length, 'My tasks across projects'], [Check, tasks.filter(task => task.status === 'Completed').length, 'Tasks completed by me']].map(([Icon, value, label]) => <article key={label}><Icon size={20} /><div><strong>{value}</strong><small>{label}</small></div></article>)}</section>
      {!projects.length ? <p className={ui("tf-panel empty")}>No projects yet.</p> : <div className={ui("project-card-grid")}>{projects.map(project => {
            const Icon = icons[project.theme] || Folder;
            return <article className={ui('project-card project-theme-' + project.theme)} key={project._id}>
          <div className={ui("project-card-banner")}><span className={ui("project-app-icon")}><Icon size={31} strokeWidth={1.8} /></span><span className={ui("project-status")}>{project.status}</span></div>
          <div className={ui("project-card-content")}><h2>{project.name}</h2><p className={ui("project-description")}>{project.description}</p>
            <div className={ui("team-progress")}><div><span>Overall project progress</span><strong>{project.progress}%</strong></div><progress aria-label={project.name + ' overall progress'} max="100" value={project.progress} /><small>This is team-wide progress</small></div>
            <div className={ui("project-task-stats")}><div><small>My assigned tasks</small><strong>{assigned(project.name).length}</strong></div><div><small>Completed by me</small><strong>{completed(project.name)}</strong></div></div>
            <div className={ui("project-card-meta")}><span className={ui("project-due")}><CalendarDays size={15} />{date(project.deadline)}</span><div className={ui("project-member-stack")} aria-label="Project members">{project.members.map((member, index) => <span key={index} title={member.name} className={ui('member-' + member.color)}>{initials(member.name)}</span>)}</div></div>
            <button className={ui("view-project-button")} onClick={() => setSelected(project)}>View project<ChevronRight size={18} /><span className={ui("sr-only")}> {project.name}</span></button>
          </div>
        </article>;
          })}</div>}
    </>}</Status>
    {selected && <Dialog title={selected.name} close={() => setSelected(null)}>
      <div className={ui("project-detail")}><p className={ui("muted")}>{selected.description}</p><div className={ui("actions")}><span className={ui("tf-tag state-in-progress")}>{selected.status}</span><span className={ui("muted")}>Due {date(selected.deadline)}</span></div>
      <div><h3>Team members</h3><p>{selected.members.map(member => member.name).join(', ')}</p></div>
      <div><h3>My assigned tasks</h3>{assigned(selected.name).length ? assigned(selected.name).map(task => <div key={task._id} className={ui("project-detail-task")}><span>{task.title}</span><span className={ui('tf-tag state-' + task.status.toLowerCase().replaceAll(' ', '-'))}>{task.status}</span></div>) : <p className={ui("muted")}>No tasks assigned to you in this project.</p>}</div>
      <Link className={ui("button primary")} to={'/tasks?project=' + encodeURIComponent(selected.name)}>Open project tasks<ChevronRight size={17} /></Link></div>
    </Dialog>}
  </div>;
}
