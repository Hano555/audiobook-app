# Audiobook App

This repository contains `audiobook-app` — a Laravel 13 application using Inertia + React and Vite for the frontend.

## Quick overview
- Laravel backend (PHP 8.4)
- Inertia.js with React (`@inertiajs/react`)
- Vite for assets with `laravel-vite-plugin` and `@inertiajs/vite` for dev SSR/HMR
- Local dev domain: `http://audiobook-app.test` (Herd/local host)

## Requirements
- PHP >= 8.4
- Composer
- Node 18+ / npm
- Herd or similar local dev server configured for `audiobook-app.test`

## Local setup
1. Install PHP dependencies:

```bash
composer install
```

2. Install Node dependencies:

```bash
cd D:\Projects\Laravel\audiobook-app
npm install
```

3. Copy env and set app URL:

```bash
cp .env.example .env
php artisan key:generate
# set APP_URL=http://audiobook-app.test in .env
```

4. Run migrations (if needed):

```bash
php artisan migrate
```

## Development
- Start the Vite dev server (HMR and dev SSR):

```bash
npm run switch:dev
```

- Open the app at: `http://audiobook-app.test`
- For direct Vite checks: open the Vite dashboard at the reported port (e.g. `http://localhost:5173`) but use `audiobook-app.test` for the full Laravel+Inertia experience.

## Production build
- Build optimized assets and remove dev-hmr linkage:

```bash
npm run switch:prod
```

- Alternatively run:

```bash
npm run build
```

- Ensure `public/build/manifest.json` exists and `public/hot` is absent so Laravel serves the built assets.

## Helper scripts
- `npm run switch:dev` — remove production manifest (if present) and start the Vite dev server.
- `npm run switch:prod` — remove `public/hot` (if present) and run a production build.

## Useful commands
- Start dev server: `npm run switch:dev`
- Build for prod: `npm run switch:prod` or `npm run build`
- Clear Laravel views: `php artisan view:clear`

## GitHub / Deployment
- Repository pushed to GitHub. Use CI/CD to run `npm run build` during deploy, then deploy the Laravel app files and `public/build`.

## Troubleshooting
- If Laravel complains about missing Vite manifest in dev, ensure the Vite dev server is running or run a build to produce `public/build/manifest.json`.
- If the site keeps referencing `localhost:5173`, remove `public/hot` to force Laravel to use the build files.

If you want a CI workflow or README improvements (badges, usage examples), tell me what to add.

