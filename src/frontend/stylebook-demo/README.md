# Isolated Stylebook Portfolio Demo

The interface is copied from Stylebook2. Only this copy may be changed here.
The production app and its source repository are not modified by this project.

- The data adapter uses fictional fixtures and names only.
- Data changes use namespaced sessionStorage in the visitor's tab.
- No actor, authentication, backend ID, environment file, or ICP dependency is included.
- A content security policy blocks all network connections, form submissions, and embedded objects.
- Do not import backups, client exports, production environment files, or production records.

Build from src/frontend with:

    pnpm exec vite build --config stylebook-demo/vite.config.ts

Output is the standalone /stylebook/demo/ sample. Rebuild it when changing the source.
The outer project route provides the portfolio explanation and return navigation.
