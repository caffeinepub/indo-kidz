# Specification

## Summary
**Goal:** Fix the Customize tab in the Navbar so it appears immediately and reliably for admin users after logging in via Internet Identity, without requiring a page refresh.

**Planned changes:**
- Fix the `Navbar.tsx` to correctly read admin status from the `useIsAdmin` hook/query.
- Ensure the admin status query is invalidated and refetched automatically after a successful Internet Identity login.
- Ensure the Customize tab renders reactively as soon as the admin flag resolves to true.
- Ensure the Customize tab is hidden immediately upon logout or for non-admin/unauthenticated users.

**User-visible outcome:** After logging in as an admin, the Customize tab appears in the navigation bar immediately without needing to refresh the page. Logging out hides it right away.
