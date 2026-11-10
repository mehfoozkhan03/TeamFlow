import { ui } from "../utils/ui";
import { useState } from 'react';
import { DollarSign, ShoppingBag, Users, ShoppingCart, TrendingUp, Percent } from 'lucide-react';
import { Heading, Field, Status } from '../components/ui';
import { DashboardCharts } from '../components/Charts';
import { useResource } from '../hooks/useResource';
import { initialRange, money, number } from '../utils/format';
const percent = value => value.toFixed(1) + '%';
const metrics = [['revenue', 'Total Revenue', DollarSign, money], ['sales', 'Total Sales', ShoppingBag, number], ['users', 'Total Users', Users, number], ['orders', 'Total Orders', ShoppingCart, number], ['growth', 'Growth Percentage', TrendingUp, percent], ['conversion', 'Conversion Rate', Percent, percent]];
const headings = {
  overview: ['Reports & Analytics', 'Track business performance and spot trends across your workspace.'],
  analytics: ['Analytics', 'Explore revenue, acquisition and engagement over time.'],
  sales: ['Sales Reports', 'Review revenue, sales volume and category performance.'],
  users: ['User Reports', 'Track user acquisition and where your traffic comes from.']
};
export function Dashboard({
  mode = 'overview'
}) {
  const [range, setRange] = useState(initialRange);
  const [draft, setDraft] = useState(range);
  const update = event => setDraft({
    ...draft,
    [event.target.name]: event.target.value
  });
  const {
    data,
    loading,
    error
  } = useResource('/analytics/overview?' + new URLSearchParams(range));
  const [title, description] = headings[mode];
  return <>
    <Heading title={title} description={description}>
      <form className={ui("toolbar")} onSubmit={event => {
        event.preventDefault();
        setRange(draft);
      }}>
        <Field label="From"><input type="date" name="start" required max={draft.end} value={draft.start} onChange={update} /></Field>
        <Field label="Through"><input type="date" name="end" required min={draft.start} value={draft.end} onChange={update} /></Field>
        <Field label="Group by"><select name="period" value={draft.period} onChange={update}><option value="week">Week</option><option value="month">Month</option><option value="year">Year</option></select></Field>
        <button className={ui("button primary")}>Apply</button>
      </form>
    </Heading>
    <Status loading={loading} error={error}>{data && <>
      {mode === 'overview' && <section className={ui("metrics")} aria-label="Key metrics">{metrics.map(([key, label, Icon, format]) => {
            const {
              value,
              change
            } = data.metrics[key];
            const suffix = key === 'growth' || key === 'conversion' ? ' pp' : '%';
            return <article key={key} className={ui("card")}>
          <div className={ui("metric-top")}>{label}<span className={ui("badge-icon")}><Icon size={18} /></span></div>
          <p className={ui("metric-value")}>{value === null ? '—' : format(value)}</p>
          <small>{change === null ? 'No comparable baseline' : <><strong className={ui(change < 0 ? 'negative' : 'positive')}>{change > 0 ? '+' : ''}{change.toFixed(1)}{suffix}</strong> vs previous period</>}</small>
        </article>;
          })}</section>}
      <DashboardCharts data={data} mode={mode} />
    </>}</Status>
  </>;
}
