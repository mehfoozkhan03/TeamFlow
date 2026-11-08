import { ui } from "../utils/ui";
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, Field, Heading, Status } from '../components/ui';
import { useSession } from '../context/Session';
import { useResource } from '../hooks/useResource';
import { api, errorText } from '../services/api';
import { categories, dateLabel, inputDate, reportTypes, statuses } from '../utils/format';
function Options({
  values
}) {
  return values.map(value => <option key={value}>{value}</option>);
}
const reportFields = [['title', 'Report title', 'text', 120], ['description', 'Description', 'textarea', 2000], ['category', 'Category', categories], ['type', 'Report type', reportTypes], ['generatedAt', 'Generated date', 'date'], ['status', 'Status', statuses]];
const userFields = [['name', 'Name', 'text', 80], ['email', 'Email', 'email', 254], ['role', 'Role', ['user', 'admin']], ['password', 'Password', 'password', 72]];
function Editor({
  item,
  users,
  close,
  save
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fields = users ? userFields : reportFields;
  async function submit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    if (users && !payload.password) delete payload.password;
    setBusy(true);
    try {
      await save(payload);
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  return <Dialog title={(item._id ? 'Edit ' : 'Create ') + (users ? 'user' : 'report')} close={close}>
    <form className={ui("form")} onSubmit={submit}>{fields.map(([name, label, type, max]) => {
        const value = type === 'date' ? dateLabel(item[name] || inputDate(new Date())) : item[name] || '';
        return <Field key={name} label={name === 'password' && item._id ? 'New password (optional)' : label}>
        {Array.isArray(type) ? <select name={name} defaultValue={value || type[0]}><Options values={type} /></select> : type === 'textarea' ? <textarea required name={name} maxLength={max} defaultValue={value} /> : <input name={name} type={type} required={name !== 'password' || !item._id} maxLength={max} minLength={name === 'password' ? 8 : ['title', 'name'].includes(name) ? 2 : undefined} defaultValue={value} />}
      </Field>;
      })}{error && <p className={ui("error")} role="alert">{error}</p>}<button className={ui("button primary")} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></form>
  </Dialog>;
}
function Details({
  id,
  close
}) {
  const state = useResource('/reports/' + id);
  const item = state.data;
  return <Dialog title="Report details" close={close}><Status {...state}>{item && <>
    <h2>{item.title}</h2><p className={ui("description")}>{item.description}</p>
    <dl>{[['Category', item.category], ['Type', item.type], ['Status', item.status], ['Generated', dateLabel(item.generatedAt)], ['Created by', item.createdBy?.name || 'Deleted user']].map(([label, value]) => <div key={label}><dt><strong>{label}</strong></dt><dd>{value}</dd></div>)}</dl>
  </>}</Status></Dialog>;
}
export function Records({
  users = false
}) {
  const {
    user,
    notify
  } = useSession();
  const [query, setQuery] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null);
  const [detail, setDetail] = useState(null);
  const [deletion, setDeletion] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const root = users ? '/users' : '/reports';
  const state = useResource(root + '?' + query, revision);
  const page = state.data?.page || 1;
  const pages = state.data?.pages || 1;
  function change(values) {
    const params = new URLSearchParams(query);
    if (!('page' in values)) params.delete('page');
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);else params.delete(key);
    }
    setQuery(params);
  }
  function refresh(message) {
    setRevision(current => current + 1);
    notify(message);
  }
  async function save(payload) {
    if (editor._id) await api.put(root + '/' + editor._id, payload);else await api.post(root, payload);
    setEditor(null);
    refresh(editor._id ? 'Changes saved.' : 'Record created.');
  }
  async function remove() {
    setBusy(true);
    setDeleteError('');
    try {
      await api.delete(root + '/' + deletion._id);
      setDeletion(null);
      if (page > 1 && state.data.items.length === 1) change({
        page: page - 1
      });
      refresh('Record deleted.');
    } catch (failure) {
      setDeleteError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  return <>
    <Heading title={users ? 'User Management' : 'Reports'} description={users ? 'Manage workspace accounts and access.' : 'Browse and manage generated reports.'}>
      <button className={ui("button primary")} onClick={() => setEditor({})}>{users ? 'Add user' : 'New report'}</button>
    </Heading>
    <section className={ui("card")}>
      <form key={String(query)} className={ui("toolbar")} onSubmit={event => {
        event.preventDefault();
        change(Object.fromEntries(new FormData(event.currentTarget)));
      }}>
        <Field label="Search"><input name="q" maxLength={100} defaultValue={query.get('q') || ''} /></Field>
        <Field label={users ? 'Role' : 'Category'}><select name={users ? 'role' : 'category'} defaultValue={query.get(users ? 'role' : 'category') || ''}><option value="">All</option><Options values={users ? ['admin', 'user'] : categories} /></select></Field>
        {!users && <>
          <Field label="From"><input type="date" name="start" defaultValue={query.get('start') || ''} /></Field>
          <Field label="Through"><input type="date" name="end" defaultValue={query.get('end') || ''} /></Field>
        </>}
        <Field label="Sort"><select name="sort" defaultValue={query.get('sort') || 'newest'}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Alphabetical</option></select></Field>
        <button className={ui("button")}>Apply filters</button>
      </form>
      <Status loading={state.loading} error={state.error} empty={state.data?.items.length === 0 && 'No matching records.'}>
        {state.data && <><div className={ui("table-wrap")}><table>
          <thead><tr>{(users ? ['Name', 'Email', 'Role', 'Actions'] : ['Title', 'Category', 'Type', 'Generated', 'Status', 'Created by', 'Actions']).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{state.data.items.map(item => <tr key={item._id}>
            {users ? <><td>{item.name}</td><td>{item.email}</td><td><span className={ui("pill")}>{item.role}</span></td></> : <><td><button className={ui("button")} onClick={() => setDetail(item._id)}>{item.title}</button></td><td>{item.category}</td><td>{item.type}</td><td>{dateLabel(item.generatedAt)}</td><td><span className={ui("pill")}>{item.status}</span></td><td>{item.createdBy?.name || 'Deleted user'}</td></>}
            <td><div className={ui("actions")}>{(users || user.role === 'admin' || item.createdBy?._id === user._id) && <>
              <button className={ui("button")} onClick={() => setEditor(item)}>Edit</button>
              {(!users || item._id !== user._id) && <button className={ui("button danger")} onClick={() => {
                          setDeleteError('');
                          setDeletion(item);
                        }}>Delete</button>}
            </>}</div></td>
          </tr>)}</tbody>
        </table></div><div className={ui("actions")}>
          <button className={ui("button")} disabled={page <= 1} onClick={() => change({
              page: page - 1
            })}>Previous</button>
          <span>Page {page} of {pages}</span>
          <button className={ui("button")} disabled={page >= pages} onClick={() => change({
              page: page + 1
            })}>Next</button>
        </div></>}
      </Status>
    </section>
    {editor && <Editor item={editor} users={users} close={() => setEditor(null)} save={save} />}
    {detail && <Details id={detail} close={() => setDetail(null)} />}
    {deletion && <Dialog title="Confirm deletion" close={() => !busy && setDeletion(null)}><div className={ui("form")}>
      <p>Delete <strong>{deletion.title || deletion.name}</strong>?</p>
      {deleteError && <p className={ui("error")} role="alert">{deleteError}</p>}
      <button className={ui("button danger")} disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete permanently'}</button>
    </div></Dialog>}
  </>;
}
