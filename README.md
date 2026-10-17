# Username & Password Authentication

Next.js App Router application with email/password registration, GitHub OAuth,
and role-based access to the admin page. SQLite is used for local development.

## Setup

Install dependencies and create the local environment file:

```powershell
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` in `.env` to `file:./dev.db`. Generate an `AUTH_SECRET` with:

```powershell
npx auth secret
```

The command writes the secret to `.env.local`; keep that file private and
untracked.

### GitHub OAuth

GitHub OAuth is optional. To enable it:

1. Open **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set the homepage URL to `http://localhost:3000`.
3. Set the authorization callback URL to
   `http://localhost:3000/api/auth/callback/github`.
4. Create the app, generate a client secret, and add the app's client ID and
   secret to `.env.local`:

   ```dotenv
   AUTH_GITHUB_ID="your-client-id"
   AUTH_GITHUB_SECRET="your-client-secret"
   ```

5. Restart the development server. GitHub sign-in is available at `/login` and
   on the dedicated `/login-github` page.

Keep the client secret private. Do not commit it or share it in chat.

When deploying behind a trusted reverse proxy, set `AUTH_TRUST_HOST=true` in
the production environment.

Apply the database migration:

```powershell
npx prisma migrate dev --name auth_user
npx prisma generate
```

Start the development server:

```powershell
npm run dev
```

## Roles

New email/password and GitHub accounts receive the `USER` role. Only users with
the `ADMIN` role can open `/admin`. To promote an account during local
development, run `npx prisma studio`, edit that user's `role` to `ADMIN`, and
save. Never grant an elevated role from the public sign-up form.

The Admin Dashboard lists email/password accounts and lets an administrator
delete other accounts after confirmation. The signed-in account and the last
administrator cannot be deleted. GitHub OAuth accounts are not stored in the
local `User` table, so they do not appear in this list.
