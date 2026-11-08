import { ui } from "../utils/ui";
import { useEffect, useRef } from 'react';
export function Heading({
  title,
  description,
  children
}) {
  return <div className={ui("heading")}><div><h1>{title}</h1><p>{description}</p></div>{children}</div>;
}
export function Status({
  loading,
  error,
  empty,
  children
}) {
  if (loading) return <p className={ui("card empty")} role="status">Loading…</p>;
  if (error) return <p className={ui("card empty error")} role="alert">{error}</p>;
  return empty ? <p className={ui("empty")}>{empty}</p> : children;
}
export function Field({
  label,
  children
}) {
  return <label className={ui("field")}>{label}{children}</label>;
}
export function Dialog({
  title,
  close,
  children
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className={ui("modal")} aria-label={title} onCancel={event => {
    event.preventDefault();
    close();
  }}>
    <div className={ui("heading")}><h2>{title}</h2><button type="button" className={ui("button")} onClick={close}>Close</button></div>{children}
  </dialog>;
}
