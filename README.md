# ARCaptcha Angular demo

A small Angular app demonstrating ARCaptcha on common authentication screens:

- **Home** — overview and links to the demo flows.
- **Login** — enter a phone number, then verify an OTP with ARCaptcha.
- **Signup** — a simple frontend-only signup form.
- **Header login** — open **Login** in the header for a username/password form protected by ARCaptcha.

## Requirements

- Node.js 20.19+ (or a version supported by Angular 20)
- npm
- An ARCaptcha **public site key**

## Run locally

```sh
npm install
npm start
```

Open the local URL printed by Angular CLI (usually `http://localhost:4200`). To make a production build, run `npm run build`.

## Configure ARCaptcha

The current public site key is set in `src/environments/environment.ts`:

```ts
arcaptchaSiteKey: 'd6ggpvy684',
```

Replace it with your own public site key if needed. The ARCaptcha script is loaded once in `src/index.html`. `src/app/services/arcaptcha.service.ts` waits for the script API and calls `arcaptcha.render()` when a captcha form is displayed. The header form and OTP step each render their own widget and receive the solved token through ARCaptcha's callback.

## Try the demo

1. Choose **Login** in the header to open the username/password form and captcha.
2. Open the **Login** route, enter any phone number with at least 8 characters, and continue.
3. Enter the demo OTP `123456`, solve ARCaptcha, and submit.
4. Use **Sign up** to view the signup route.

## Important: frontend demo only

There is no backend in this project. The app does not send an SMS, authenticate a user, create an account, or verify captcha tokens. The OTP value `123456` is only for demonstrating the UI.

For a real application, send the ARCaptcha token (commonly submitted as `arcaptcha-token`) to your backend. Have the backend verify it with `https://api.arcaptcha.co/arcaptcha/api/verify`, using the token as `challenge_id`, your site key, and your ARCaptcha **secret key**. Keep the secret key on the server; never put it in Angular or any browser code. Your backend should also send and validate real OTPs and handle authentication/signup.

See the [ARCaptcha installation guide](https://docs.arcaptcha.co/installation/) for the full integration details.
