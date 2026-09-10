# FF Galy

Next.js application for FF Galy.

## Local development

```bash
npm install
npm run dev
```

## Railway deployment

Railway can deploy this repository with the default Node/Nixpacks builder. The project uses:

- Build command: `npm run build`
- Start command: `npm run start`
- Required Node.js version: 20 or newer

Add these variables in the Railway service settings:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
BREVO_SMTP_USER
BREVO_SMTP_PASSWORD
EMAIL_FROM
```

Do not commit `.env` files or secret values. Railway provides the `PORT` variable used by the application.
