# Audiobook App v1.0 (MVP)

A Laravel app that converts PDF books into audiobooks. Upload a PDF, and the app extracts the text, splits it into chunks, and stitches them into an audio file using FFmpeg — all processed in the background via a queue worker.

This is V1.0 — an MVP focused on validating the full pipeline end to end. The UI is intentionally minimal at this stage. Authentication, real TTS audio, EPUB support, and a polished interface are planned for later versions.

## Tech Stack
- Laravel 13 + Inertia.js + React + Vite
- PHP 8.4
- FFmpeg for audio stitching
- Laravel database queue for background processing
- smalot/pdfparser for PDF text extraction

## Requirements
- PHP >= 8.4
- Composer
- Node 18+ / npm
- FFmpeg installed globally and available in PATH
- Herd or similar local dev server configured for `audiobook-app.test`

## Local Setup

1. Install PHP dependencies:
```bash
composer install
```

2. Install Node dependencies:
```bash
npm install
```

3. Copy env and generate app key:
```bash
cp .env.example .env
php artisan key:generate
```

4. Set these values in your `.env`:
<!-- APP_URL=http://audiobook-app.test
QUEUE_CONNECTION=database -->

5. Run migrations:
```bash
php artisan migrate
```

6. Create the storage symlink so uploaded files are publicly accessible:
```bash
php artisan storage:link
```

## Running the App

Start the Vite dev server:
```bash
npm run switch:dev
```

In a separate terminal, start the queue worker — this is required for PDFs to be processed:
```bash
php artisan queue:work
```

Open the app at `http://audiobook-app.test`.

## How It Works

1. Upload a PDF with a title and author
2. The app extracts and cleans the text
3. A background job splits the text into chunks and generates placeholder audio
4. FFmpeg stitches the chunks into a final audio file
5. The book status updates to completed and an audio player appears

## Helper Scripts
- `npm run switch:dev` — start the Vite dev server with HMR
- `npm run switch:prod` — build optimised assets for production
- `npm run build` — standard Vite production build

## Useful Artisan Commands
- `php artisan queue:work` — start processing queued jobs
- `php artisan migrate:fresh --seed` — wipe and reseed the database
- `php artisan storage:link` — create the public storage symlink
- `php artisan schedule:run` — manually trigger scheduled tasks (cleanup runs daily)

## Troubleshooting
- **Books stuck on pending** — make sure the queue worker is running in a separate terminal
- **Audio player not showing** — check the chapter status in the database; it should be `completed`
- **Missing Vite manifest** — ensure the Vite dev server is running or run `npm run build`
- **Storage files not accessible** — run `php artisan storage:link` if you haven't already

## Roadmap

### V2.0 — Core Gaps
- User authentication and book ownership
- Replace placeholder audio with a real TTS provider
- EPUB support
- Error handling and retry logic for failed jobs
- Book deletion — let users remove books and associated files
- Email notification when audiobook is ready
- Real-time status updates via WebSockets
- Upload progress indicator for large PDFs
- Scheduled cleanup of old audio files and records
- Migrate file storage to Cloudflare R2 for scalable, cost-effective object storage

### V3.0 — Experience and Polish
- Polished UI and user dashboard
- Personal audiobook library with management tools
- Playback controls (play, pause, seek, speed)
- Progress tracking per book — remember where you left off
- Chapter navigation when multi-chapter support is added
- Search and filter books in your library
- Dark mode
- Mobile-friendly design

### V4.0 — Advanced Features
- Multiple TTS voice options — let users pick a voice
- Language support for non-English PDFs
- Sharing — share an audiobook with someone else
- Listening analytics — track how much of a book was listened to
- Progressive Web App (PWA) support
- Mobile app
