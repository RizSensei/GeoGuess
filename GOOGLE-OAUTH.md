# Google OAuth setup

GeoStreak uses [NextAuth](https://next-auth.js.org/) with Google's OAuth 2.0 provider. This guide explains how to create Google credentials, configure the application locally, and prepare OAuth for a deployed environment.

## How authentication works

1. A visitor selects **Sign in with Google** on the home page.
2. NextAuth redirects the visitor to Google for consent.
3. Google sends the visitor back to NextAuth's callback endpoint.
4. NextAuth creates a session and makes it available through the `SessionProvider`.
5. The middleware uses that session to protect the game routes.

The Google OAuth callback is handled by:

```text
/api/auth/callback/google
```

For local development, the complete callback URL is:

```text
http://localhost:3000/api/auth/callback/google
```

## Prerequisites

- Access to a Google account that can create or manage a Google Cloud project
- Node.js 20 or newer
- The project dependencies installed with `npm install`

## 1. Create or select a Google Cloud project

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Use the project picker in the top navigation.
3. Select an existing project or choose **New project**.
4. Give the project a recognizable name, such as `GeoStreak Development`.

Keep development and production credentials in separate Google Cloud projects, or at least in separate OAuth clients. This reduces the risk of a local configuration being used against the production application.

## 2. Configure the OAuth consent screen

1. In Google Cloud Console, open **Google Auth Platform** (or **APIs & Services > OAuth consent screen**, depending on the console layout).
2. Choose **External** unless the application is restricted to users in a Google Workspace organization.
3. Enter the application name, support email, and developer contact email.
4. Add the application homepage and privacy-policy URLs when Google requests them.
5. Save the configuration.

GeoStreak only needs basic identity information from Google. Do not add additional scopes unless the application code is changed to use them. The default OpenID Connect scopes (`openid`, `email`, and `profile`) are sufficient for sign-in.

### Add test users when the app is in testing mode

An external OAuth app in **Testing** status is limited to the test users listed in the consent-screen settings. Add every Google account that needs to sign in during development. Otherwise, Google may show an `Access blocked` or `Error 403: access_denied` message.

## 3. Create a Web application OAuth client

1. Open **Google Auth Platform > Clients** (or **APIs & Services > Credentials**).
2. Select **Create client**.
3. Choose **Web application** as the application type.
4. Give the client a descriptive name, such as `GeoStreak localhost`.
5. Under **Authorized JavaScript origins**, add:

   ```text
   http://localhost:3000
   ```

6. Under **Authorized redirect URIs**, add the exact callback URL:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

7. Create the client.
8. Copy the generated **Client ID** and **Client secret**. The secret is shown only in the credential details and must not be committed to the repository.

OAuth URLs must match exactly. Differences in protocol (`http` vs `https`), hostname, port, path, or trailing slash can cause `redirect_uri_mismatch`.

## 4. Configure the local environment

Create `.env` from the checked-in template:

```bash
copy .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

Set the values in `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_secret
```

Generate a secret instead of using the placeholder. For example, with OpenSSL:

```bash
openssl rand -base64 32
```

`NEXTAUTH_SECRET` signs and encrypts NextAuth session data. Use a different secret for each environment, and keep it stable for the lifetime of that environment. Changing it invalidates existing sessions.

The variable names must match `.env.example` and the provider configuration in [`app/api/auth/[...nextauth]/route.ts`](./app/api/auth/[...nextauth]/route.ts).

## 5. Run and verify locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), select **Sign in with Google**, and complete the consent flow.

If sign-in succeeds:

- Google redirects to the application rather than displaying an error.
- The home page shows the signed-in state.
- Protected routes such as `/start-journey` can be opened.
- The browser can sign out and sign in again.

Restart the development server after changing `.env`; Next.js reads environment variables when the server starts.

## 6. Configure a deployed environment

Create a separate OAuth client for each deployed origin, such as staging and production. For a production domain, register:

```text
https://your-domain.example
https://your-domain.example/api/auth/callback/google
```

Set the deployment environment variables to match the production origin:

```env
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
NEXTAUTH_URL=https://your-domain.example
NEXTAUTH_SECRET=a_different_production_secret
```

Use the hosting provider's secret/environment-variable manager rather than committing these values or placing them in client-side configuration. If the application is hosted behind a proxy, make sure the public HTTPS URL is the value used for `NEXTAUTH_URL` and the registered callback.

Before making an external OAuth app available to general users, complete Google's verification requirements if the app requests scopes or presents branding that requires verification. For GeoStreak's basic sign-in flow, avoid requesting extra Google APIs or scopes unnecessarily.

## Troubleshooting

### `Error 400: redirect_uri_mismatch`

- Confirm that `NEXTAUTH_URL` is the same origin users are visiting.
- Confirm that the callback URI is registered under the same Google OAuth client used by `GOOGLE_CLIENT_ID`.
- Check protocol, hostname, port, path, and trailing slash character-for-character.
- Restart the app after changing environment variables.

### `Access blocked: This app's request is invalid` or `403: access_denied`

- Confirm the OAuth consent screen is configured.
- If the app is in testing mode, add the signing-in account as a test user.
- Check that the Google account is permitted by the app's user type and Workspace policies.

### `[next-auth][error][NO_SECRET]`

Set `NEXTAUTH_SECRET` to a non-empty, randomly generated value and restart the server.

### `[next-auth][error][OAUTH_CALLBACK_ERROR]`

Check the server logs and verify that the client ID and secret belong to the same Google OAuth client. Also confirm the callback URL and consent-screen test-user configuration.

### Environment variables appear to be ignored

- Confirm the file is named `.env` and is in the repository root.
- Do not use `NEXT_PUBLIC_` for these values; client IDs and secrets are server configuration in this application.
- Restart `npm run dev` after editing `.env`.
- Never print the client secret in logs or commit `.env`.

## Security checklist

- Keep `.env` out of version control.
- Never expose `GOOGLE_CLIENT_SECRET` or `NEXTAUTH_SECRET` to browser code.
- Use HTTPS and a unique `NEXTAUTH_SECRET` in production.
- Use separate credentials for local, staging, and production environments.
- Register only the callback URLs that the application actually uses.
- Rotate a credential if it is exposed, then update the deployment environment variables.
- Remove old OAuth clients and test users when they are no longer needed.

