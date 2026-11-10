import { ui } from "../utils/ui";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from '../context/Session';
export function TaskCalendar({
  tasks,
  onTask
}) {
  const {
    user
  } = useSession();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const monday = user.workspacePreferences?.startWeekMonday !== false;
  const days = monday ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const offset = (month.getDay() + (monday ? 6 : 0)) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({
    length: Math.ceil((count + offset) / 7) * 7
  }, (_, index) => index - offset + 1);
  return <section className={ui("tf-panel task-calendar")}><div className={ui("calendar-heading")}><h2>{month.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })}</h2><div className={ui("actions")}><button className={ui("icon")} aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={20} /></button><button className={ui("button")} onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Today</button><button className={ui("icon")} aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={20} /></button></div></div>
    <div className={ui("calendar-grid")}>{days.map(day => <div className={ui("calendar-weekday")} key={day}>{day}</div>)}{cells.map((day, index) => {
        if (day < 1 || day > count) return <div className={ui("calendar-day outside")} key={index} />;
        const key = [month.getFullYear(), String(month.getMonth() + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
        const due = tasks.filter(task => task.due.slice(0, 10) === key);
        return <div className={ui("calendar-day")} key={index}><span>{day}</span>{due.map(task => <button key={task._id} onClick={() => onTask(task)} title={task.title}>{task.title}</button>)}</div>;
      })}</div>
  </section>;
}
