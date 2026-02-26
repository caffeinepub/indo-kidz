# Specification

## Summary
**Goal:** Fix owner-only access enforcement so the "Customize Site" button and Admin Panel customization tabs are never visible or accessible to non-owner users.

**Planned changes:**
- Audit and correct the Navbar logic so the "Customize Site" button is only rendered for the authenticated owner, never for any other user.
- Enforce owner-only access at the Admin Panel route/component level so non-owner users who navigate directly to `/admin` see the `AccessDeniedScreen` and cannot access the Fees, Fee Category, or Payment customization tabs.

**User-visible outcome:** Non-owner users no longer see the "Customize Site" button in the Navbar and are shown an access denied screen if they attempt to visit the admin route directly. The owner retains full access to all existing admin functionality.
