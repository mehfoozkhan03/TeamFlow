import { ui } from "../utils/ui";
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Field } from '../components/ui';
import { useSession } from '../context/Session';
import { errorText } from '../services/api';
export function Auth({
  mode
}) {
  const {
    user,
    authenticate
  } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const register = mode === 'register';
  async function submit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError('');
    try {
      await authenticate(mode, payload);
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  if (user) return <Navigate to="/" replace />;
  return <main className={ui("auth")}><section className={ui("card")}><h1>{register ? 'Create account' : 'Welcome back'}</h1>
    <p className={ui("muted")}>Insight Studio · Reports & Analytics</p><form className={ui("form")} onSubmit={submit}>
    {register && <Field label="Name"><input name="name" required minLength={2} maxLength={80} autoComplete="name" /></Field>}
    <Field label="Email"><input type="email" name="email" required maxLength={254} autoComplete="email" /></Field>
    <Field label="Password"><input type="password" name="password" required minLength={register ? 8 : undefined} maxLength={72} autoComplete={register ? 'new-password' : 'current-password'} /></Field>
    {error && <p className={ui("error")} role="alert">{error}</p>}<button className={ui("button primary")} disabled={busy}>{busy ? 'Please wait…' : register ? 'Register' : 'Sign in'}</button></form>
    <Link to={register ? '/login' : '/register'}>{register ? 'Already registered? Sign in' : 'Create an account'}</Link>
  </section></main>;
}
