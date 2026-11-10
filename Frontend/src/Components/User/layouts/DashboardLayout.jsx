import { ui } from "../utils/ui";
import { useNotifications } from '../context/Notifications';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ClipboardList, Folder, UserRound, Activity, BarChart3, Bell, FileChartColumn, Files, LayoutGrid, LogOut, Menu, Search, Settings, ShoppingCart, SlidersHorizontal, Users, X } from 'lucide-react';
import { useSession } from '../context/Session';
const groups = [['WORKSPACE', [['/user', 'Overview', LayoutGrid], ['/user/tasks', 'My Tasks', ClipboardList], ['/user/projects', 'Projects', Folder], ['/user/team', 'Team Members', Users]]], ['COMMUNICATION', [['/user/activity', 'Activity', Activity]]], ['PERSONAL', [['/user/profile', 'My Profile', UserRound], ['/user/settings', 'Settings', Settings]]]];
export function DashboardLayout() {
  const {
    user,
    logout,
    notify
  } = useSession();
  const {
    summary
  } = useNotifications();
  const unread = summary.data?.unread || 0;
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname === "/user" ? "Overview" : {
    tasks: "My Tasks",
    projects: "Projects",
    team: "Team Members",
    activity: "Activity",
    calendar: "Calendar",
    notifications: "Notifications",
    profile: "My Profile"
  }[location.pathname.split("/")[2]] || "Settings";
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState('');
  const [query, setQuery] = useState('');
  return <div className={ui('shell' + (user.workspacePreferences?.compactTasks ? ' compact-tasks' : '') + (user.workspacePreferences?.reduceMotion ? ' reduce-motion' : ''))}>
    {menu && <button className={ui("scrim")} aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <aside className={ui('sidebar' + (menu ? ' open' : ''))}>
      <Link to="/user" className={ui("brand")} onClick={() => setMenu(false)}>
        <span className={ui("teamflow-mark")}>
          <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true" focusable="false">
            <circle cx="12" cy="7.2" r="3.2" fill="currentColor" />
            <circle cx="5.3" cy="9" r="2.35" fill="currentColor" />
            <circle cx="18.7" cy="9" r="2.35" fill="currentColor" />
            <path d="M6.1 18.3c0-3.05 2.55-5.4 5.9-5.4s5.9 2.35 5.9 5.4c0 .95-.75 1.7-1.7 1.7H7.8c-.95 0-1.7-.75-1.7-1.7Z" fill="currentColor" />
            <path d="M1.1 17.3c0-2.2 1.5-4.15 3.7-4.65.65-.15 1.45.1 2.1.5-1.35 1.15-2.15 2.9-2.15 4.75v.8H2.6c-.85 0-1.5-.6-1.5-1.4ZM22.9 17.3c0-2.2-1.5-4.15-3.7-4.65-.65-.15-1.45.1-2.1.5 1.35 1.15 2.15 2.9 2.15 4.75v.8h2.15c.85 0 1.5-.6 1.5-1.4Z" fill="currentColor" />
          </svg>
        </span>
        <div className={ui("brand-copy")}>
          <strong>Team<span>Flow</span></strong>
          <small>WORK BETTER, TOGETHER</small>
        </div>
      </Link>
      <div className={ui("team-switch")}><span>D</span><div><small>Current team</small><strong>DevSquad</strong></div><ChevronDown size={15} /></div>
      {groups.map(([group, items]) => <div key={group}><p className={ui("nav-label")}>{group}</p><nav aria-label={group}>{items.map(([path, label, Icon]) => <NavLink key={label} to={path} end onClick={() => {
        setMenu(false);
        setPanel('');
      }}><Icon size={20} />{label}</NavLink>)}
        {group === 'COMMUNICATION' && <NavLink className={ui("nav-notifications")} to="/user/notifications" onClick={() => {
          setMenu(false);
          setPanel('');
        }}><Bell size={20} />Notifications{unread > 0 && <b>{unread}</b>}</NavLink>}
      </nav></div>)}
      <button className={ui("sidebar-footer")} onClick={() => setPanel(panel === 'profile' ? '' : 'profile')}><span className={ui("avatar")}>{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span><strong>{user.name}</strong><small>Team Member</small></span><ChevronDown size={15} /></button>
    </aside>
    <div className={ui("workspace")}>
      <header className={ui("topbar")}>
        <button className={ui("icon mobile-menu")} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        <div className={ui("breadcrumbs")}><span>Workspace</span><ChevronRight size={15} /><span>DevSquad</span><ChevronRight size={15} /><strong>{pageName}</strong></div>
        <form className={ui("search")} role="search" onSubmit={event => {
          event.preventDefault();
          setPanel('');
          navigate('/user/tasks?q=' + encodeURIComponent(query.trim()));
        }}>
          <Search size={18} /><input aria-label="Search tasks and projects" placeholder="Search tasks and projects..." value={query} onChange={event => setQuery(event.target.value)} />
        </form>
        <div className={ui("header-actions")}>
          <Link to="/user/notifications" className={ui("header-notification-link")} aria-label="Notifications" onClick={() => setPanel('')}><Bell size={20} />{unread > 0 && <i />}</Link>
          <button className={ui("profile")} aria-label="Profile menu" aria-expanded={panel === 'profile'} onClick={() => setPanel(panel === 'profile' ? '' : 'profile')}><span className={ui("avatar")}>{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span className={ui("profile-name")}>{user.name}<small>Member</small></span></button>
          {panel === 'profile' && <div className={ui("popover")}><Link to="/user/profile" onClick={() => setPanel('')}>My Profile</Link><button onClick={logout}><LogOut size={16} /> Sign out</button></div>}

        </div>
      </header>
      <main className={ui("content")}><Outlet /></main>
    </div>
  </div>;
}
