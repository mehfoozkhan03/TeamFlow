import { ui } from "../utils/ui";
import { useRef, useState } from 'react';
import { CalendarDays, Mail, Pencil, Save } from 'lucide-react';
import { useSession } from '../context/Session';
import { api, errorText } from '../services/api';
const preferences = [['assignments', 'Task assignments', 'When a new task is assigned to me'], ['deadlines', 'Deadline reminders', 'Before one of my tasks is due'], ['replies', 'Comments and replies', 'When someone replies or mentions me'], ['projects', 'Project announcements', 'Updates from projects I belong to'], ['weekly', 'Weekly summary', 'A weekly overview of my tasks and team activity']];
const zones = [['Asia/Kolkata', 'India Standard Time (UTC+5:30)'], ['UTC', 'Coordinated Universal Time (UTC)'], ['America/New_York', 'Eastern Time (New York)'], ['America/Los_Angeles', 'Pacific Time (Los Angeles)'], ['Europe/London', 'United Kingdom (London)'], ['Europe/Berlin', 'Central European Time (Berlin)'], ['Asia/Dubai', 'Gulf Standard Time (Dubai)'], ['Asia/Singapore', 'Singapore Standard Time'], ['Australia/Sydney', 'Australian Eastern Time (Sydney)']];
function draftFrom(user) {
  const [firstName, ...rest] = user.name.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
    jobTitle: user.jobTitle || '',
    timeZone: user.timeZone || 'Asia/Kolkata',
    preferences: Object.fromEntries(preferences.map(([key]) => [key, user.preferences?.[key] ?? key !== 'weekly']))
  };
}
export function Profile() {
  const {
    user,
    updateUser,
    notify
  } = useSession();
  const [draft, setDraft] = useState(() => draftFrom(user));
  const [saved, setSaved] = useState(() => draftFrom(user));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const firstNameInput = useRef(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const role = user.role === 'admin' ? 'Team Leader' : 'Team Member';
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data } = await api.patch('/user/profile', { name: [draft.firstName, draft.lastName].filter(Boolean).join(' '), jobTitle: draft.jobTitle, timeZone: draft.timeZone, preferences: draft.preferences });
      updateUser(data);
      const value = draftFrom(data);
      setDraft(value);
      setSaved(value);
      notify('Profile updated.');
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  function change(event) {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value
    });
  }
  const initials = user.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return <div className={ui("profile-page")}>
    <header className={ui("profile-page-heading")}><h1>My Profile</h1><p>Manage your personal details and notification preferences.</p></header>
    <div className={ui("profile-columns")}>
      <aside className={ui("profile-summary-card")}><div className={ui("profile-cover")} /><div className={ui("profile-summary-content")}>
        <div className={ui("profile-avatar-wrap")}><span className={ui("large-profile-avatar")}>{initials}</span><button aria-label="Edit profile details" title="Edit profile details" onClick={() => firstNameInput.current?.focus()}><Pencil size={16} /></button></div>
        <h2>{user.name}</h2><p className={ui("profile-email")}>{user.email}</p><span className={ui("profile-role")}>{role}</span>
        <div className={ui("profile-team-info")}><span className={ui("profile-team-icon")}>D</span><div><small>Team</small><strong>DevSquad</strong></div></div>
        <div className={ui("profile-member-since")}><CalendarDays size={22} /><div><small>Member since</small><strong>{new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</strong></div></div>
      </div></aside>
      <form className={ui("profile-edit-form")} onSubmit={save}>
        <section className={ui("profile-section")}><div className={ui("profile-section-heading")}><div><h2>Personal information</h2><p>Update your permitted profile details.</p></div><button className={ui("button profile-save")} disabled={!dirty || busy}><Save size={15} />{busy ? 'Saving...' : 'Save changes'}</button></div>
          <fieldset disabled={busy} className={ui("profile-fields")}>
            <label>First name<input ref={firstNameInput} autoComplete="given-name" name="firstName" value={draft.firstName} required maxLength={80} onChange={change} /></label>
            <label>Last name<input autoComplete="family-name" name="lastName" value={draft.lastName} maxLength={80} onChange={change} /></label>
            <label className={ui("profile-email-field")}>Email address<span className={ui("profile-email-input")}><Mail size={17} /><input aria-label="Email address" autoComplete="email" value={user.email} readOnly type="email" /></span><small>Contact your Team Leader to change your account email.</small></label>
            <label>Job title<input name="jobTitle" value={draft.jobTitle} maxLength={120} placeholder="e.g. Frontend Developer" onChange={change} /></label>
            <label>Time zone<select name="timeZone" value={draft.timeZone} onChange={change}>{!zones.some(([value]) => value === draft.timeZone) && <option value={draft.timeZone}>{draft.timeZone}</option>}{zones.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </fieldset>
        </section>
        <section className={ui("profile-section")}><div className={ui("profile-section-heading")}><div><h2>Notification preferences</h2><p>Choose the updates you want to receive.</p></div></div>
          <div className={ui("profile-preferences")}>{preferences.map(([key, title, description]) => <label className={ui("preference-row")} key={key}><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" role="switch" aria-label={title} checked={draft.preferences[key]} disabled={busy} onChange={event => setDraft({
                ...draft,
                preferences: {
                  ...draft.preferences,
                  [key]: event.target.checked
                }
              })} /></label>)}</div>
          <div className={ui("profile-form-actions")}>{error && <p className={ui("error")} role="alert">{error}</p>}<button className={ui("button")} type="button" disabled={!dirty || busy} onClick={() => {
              setDraft(saved);
              setError('');
            }}>Cancel changes</button><button className={ui("button primary")} disabled={!dirty || busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
        </section>
      </form>
    </div>
  </div>;
}
