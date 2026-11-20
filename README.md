# Leave Management System – frontend (React + Vite)

    npm install
    npm run dev   # opens on http://localhost:4000

## Demo accounts (created automatically on first run)
| Role      | Email                  | Password      |
|-----------|------------------------|---------------|
| HR admin  | admin@northstar.pk     | Admin@123     |
| Manager   | manager@northstar.pk   | Manager@123   |
| Employee  | iqra@northstar.pk      | Employee@123  |

HR admins can add users (People directory), assign roles, disable accounts and reset passwords.
New users sign in with the email and temporary password the admin sets.
To reset all demo data, clear the site data in the browser (or run `localStorage.clear()` in the console).

`CODE_GUIDE.md` explains every file and its important lines.

## Where things live
| Topic                         | Files                                           |
|-------------------------------|-------------------------------------------------|
| Colors, light/dark theme      | `src/styles/tokens.css`, `src/theme/`           |
| Who can sign in, roles        | `src/data/users.js`, `src/auth/`                |
| Sidebar menus per portal      | `src/data/nav.js`                               |
| URL → screen map              | `src/App.jsx`                                   |
| Sidebar + top bar             | `src/layout/AppShell.jsx`                       |
| Screens                       | `src/pages/`                                    |
| Shared pieces (modal, toast…) | `src/components/`                               |

## Moving to a real backend
`src/data/users.js` (the user "database") and `src/auth/AuthContext.jsx` are the only files that
pretend to be a server. Replace their functions with API calls; the screens do not change.
