# TeamFlow member dashboard

This is the Tailwind member dashboard module. It is mounted at `/user` and includes Overview, My Tasks, Projects, Team Members, Activity, Notifications, My Profile, and Settings.

## Existing app integration

`AllRoutes.jsx` mounts this module inside the existing authenticated route. The dashboard reads the Redux `user` state and the existing `VITE_API` configuration. It sends the current JWT as a Bearer token when it is available in session storage, local storage, or the `token` cookie.

## Current API compatibility

`services/api.js` documents the organization scoped endpoints already present in this repository. The dashboard mock API that powered the original visual reference (`/workspace`) is not part of this backend. Before using live task data, the organization selector needs to persist the active `organizationId`, and the dashboard's per-page queries need to use `memberApi` to load each project and its tasks. Backend response fields also differ: this server uses statuses `todo`, `in_progress`, `in_review`, `blocked`, `done` and priorities `low`, `medium`, `high`, `urgent`.

The current backend does not expose profile preference, inbox summary, direct messages, or unread filtering endpoints used by the detailed reference screens. Those controls need the corresponding API work from the integration owner. Do not use the demo `/workspace` service as production data.

## Dependencies

Tailwind CSS, lucide-react, React Router, Axios, and Redux already exist in the frontend. This module uses Recharts; install it in `Frontend` with `npm install recharts` if it is not present.
