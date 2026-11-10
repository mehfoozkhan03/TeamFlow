import { ui } from "../utils/ui";
import { useState } from 'react';
import { Heading, Field, Status } from '../components/ui';
import { useResource } from '../hooks/useResource';
import { useSession } from '../context/Session';
import { api, errorText } from '../services/api';
import { categories, initialRange, number } from '../utils/format';
export function Custom() {
  const [initial] = useState(initialRange);
  const [query, setQuery] = useState(null);
  const [exporting, setExporting] = useState(false);
  const {
    notify
  } = useSession();
  const state = useResource(query && '/custom?' + query);
  async function download(format) {
    setExporting(true);
    try {
      const {
        data
      } = await api.get('/custom/export?' + query + '&format=' + format, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'analytics-report.' + format;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      const body = error.response?.data;
      const message = body instanceof Blob ? await body.text().then(JSON.parse).then(data => data.message).catch(() => null) : null;
      notify(message || errorText(error));
    } finally {
      setExporting(false);
    }
  }
  return <><Heading title="Custom Reports" description="Build a report from live analytics and export the results." />
    <section className={ui("card")}><form className={ui("toolbar")} onSubmit={event => {
        event.preventDefault();
        setQuery(String(new URLSearchParams(new FormData(event.currentTarget))));
      }}>
      <Field label="Category"><select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></Field>
      <Field label="From"><input name="start" type="date" defaultValue={initial.start} required /></Field>
      <Field label="Through"><input name="end" type="date" defaultValue={initial.end} required /></Field>
      <Field label="Group by"><select name="period" defaultValue="month"><option value="week">Week</option><option value="month">Month</option><option value="year">Year</option></select></Field>
      <button className={ui("button primary")}>Generate preview</button>
    </form>
    <Status loading={state.loading} error={state.error} empty={!query && 'Choose filters to generate your first preview.'}>
      {state.data && <><div className={ui("table-wrap")}><table><thead><tr>{state.data.columns.map(col => <th key={col} scope="col">{col}</th>)}</tr></thead>
        <tbody>{state.data.rows.map(row => <tr key={row[0]}>{row.map((value, i) => <td key={state.data.columns[i]}>{typeof value === 'number' ? number(value) : value}</td>)}</tr>)}</tbody></table>
        {!state.data.rows.length && <p className={ui("empty")}>No activity in this range.</p>}</div>
        <div className={ui("actions")}>{['pdf', 'csv'].map(format => <button className={ui("button")} key={format} disabled={exporting} onClick={() => download(format)}>Export {format.toUpperCase()}</button>)}</div></>}
    </Status></section>
  </>;
}
