import { ui } from "../utils/ui";
import { useRef, useState } from 'react';
import { MessageSquare, MoreHorizontal, Search, Shield, Send } from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { useSession } from '../context/Session';
import { api, errorText } from '../services/api';
import { Dialog, Status } from '../components/ui';
function Conversation({
  member,
  close
}) {
  const {
    notify
  } = useSession();
  const [revision, setRevision] = useState(0);
  const resource = useResource('/workspace/members/' + member._id + '/messages', revision);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(null);
  const history = useRef(null);
  async function send(event) {
    event.preventDefault();
    const text = body.trim();
    if (!text) {
      setError('Write a message first.');
      return;
    }
    if (request.current?.body !== text) request.current = {
      body: text,
      clientId: crypto.randomUUID()
    };
    setSaving(true);
    setError('');
    try {
      await api.post('/workspace/members/' + member._id + '/messages', request.current);
      setBody('');
      request.current = null;
      setRevision(value => value + 1);
      notify('Message saved in this workspace.');
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setSaving(false);
    }
  }
  return <Dialog title={'Message ' + member.name} close={() => !saving && close()}>
    <p className={ui("conversation-caption")}>Local workspace conversation · Latest 50 messages</p>
    <div className={ui("conversation-history")} ref={history}><Status loading={resource.loading} error={resource.error} empty={resource.data?.messages.length === 0 && 'Start a conversation with ' + member.name + '.'}>
      {resource.data?.messages.map(message => <article className={ui("conversation-message")} key={message._id}><p>{message.body}</p><time>{new Date(message.createdAt).toLocaleString()}</time></article>)}
    </Status></div>
    <form className={ui("form")} onSubmit={send}><label className={ui("field")}>Your message<textarea autoFocus required maxLength={2000} value={body} onChange={event => setBody(event.target.value)} placeholder="Write a message..." /></label>
      {error && <p className={ui("error")} role="alert">{error}</p>}<button className={ui("button primary")} disabled={saving || !body.trim()}><Send size={16} />{saving ? 'Saving...' : 'Save message'}</button>
    </form>
  </Dialog>;
}
export function TeamMembers() {
  const resource = useResource('/workspace/members');
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState(null);
  const [profile, setProfile] = useState(null);
  const members = (resource.data?.members || []).filter(member => (member.name + ' ' + member.role + ' ' + member.responsibility).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className={ui("members-page")}>
    <header className={ui("members-heading")}><h1>Team Members</h1><p>Meet the people you collaborate with in DevSquad.</p></header>
    <div className={ui("members-toolbar")}><label className={ui("members-search")}><Search size={20} /><input aria-label="Search teammates" placeholder="Search teammates..." value={query} onChange={event => setQuery(event.target.value)} /></label>
      {resource.data && <span className={ui("members-online")}><i />{resource.data.online} members online</span>}
    </div>
    <Status loading={resource.loading} error={resource.error} empty={resource.data && members.length === 0 && 'No teammates match your search.'}>
      <div className={ui("members-grid")}>{members.map(member => <article className={ui("member-card")} key={member._id}>
        <div className={ui("member-card-top")}>
          <span className={ui('member-presence ' + (member.online ? 'online' : 'offline'))} role="img" aria-label={member.online ? 'Online' : 'Offline'} title={member.online ? 'Online' : 'Offline'} />
          {member.role === 'Team Leader' ? <span className={ui("leader-badge")}><Shield size={13} />Team Leader</span> : <button className={ui("icon member-options")} aria-label={'View profile ' + member.name} onClick={() => setProfile(member)}><MoreHorizontal size={21} /></button>}
        </div>
        <div className={ui("member-identity")}><h2>{member.name}{member.isSelf && <span className={ui("member-you")}>You</span>}</h2><p>{member.role}</p></div>
        <div className={ui("member-responsibility")}><small>Current responsibility</small><strong>{member.responsibility}</strong></div>
        <button className={ui("member-message-button")} aria-label={'Message ' + member.name} onClick={() => setConversation(member)}><MessageSquare size={20} />Message</button>
      </article>)}</div>
    </Status>
    {conversation && <Conversation member={conversation} close={() => setConversation(null)} />}
    {profile && <Dialog title={profile.name} close={() => setProfile(null)}><div className={ui("form")}><p>{profile.role}{profile.isSelf ? ' · Your profile' : ''}</p><p className={ui("muted")}>{profile.responsibility}</p><p className={ui("muted")}>Workspace status · {profile.online ? 'Online' : 'Offline'}</p><button className={ui("button primary")} onClick={() => {
          setConversation(profile);
          setProfile(null);
        }}><MessageSquare size={17} />Message</button></div></Dialog>}
  </div>;
}
